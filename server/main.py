"""FastAPI backend for ACARA Unit Planner."""

from __future__ import annotations

import os
import sys
from pathlib import Path
from typing import Any, Literal

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field, field_validator
from starlette.middleware.base import BaseHTTPMiddleware

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
FRONTEND_DIST = ROOT / "client" / "dist"

load_dotenv(ROOT / ".env")

from server import billing  # noqa: E402
from server import email_verification  # noqa: E402
from server import google_auth  # noqa: E402
from server.edstack_auth_routes import (  # noqa: E402
    billing_health_fields,
    ensure_billing_db,
    register_auth_session_middleware,
    register_edstack_auth_routes,
)

from src.acara import list_descriptors_for_kla, list_kla_options  # noqa: E402
from src.app_assistant import chat_with_assistant  # noqa: E402
from src.config import (  # noqa: E402
    MAX_ASSISTANT_MESSAGE_CHARS,
    MAX_ASSISTANT_MESSAGES,
    MAX_REQUEST_BYTES,
    is_google_api_key_configured,
)
from src.llm_config import (  # noqa: E402
    get_llm_model,
    get_llm_provider,
    is_anthropic_configured,
    is_llm_configured,
)
from src.document_export import build_export_zip, build_unit_docx, build_unit_txt  # noqa: E402
from src.unit_generator import generate_unit_pack  # noqa: E402
from src.unit_guardrails import validate_unit_output  # noqa: E402
from src.unit_refine import refine_unit_section  # noqa: E402
from server.rate_limit import enforce_rate_limit  # noqa: E402
from server.billing_gate import attach_credits_fields, charge_or_skip, refund, require_signed_in  # noqa: E402
from server.sentry_setup import init_sentry  # noqa: E402
from src.credits import credits_for_term_generate, credits_for_term_refine  # noqa: E402

init_sentry(service_name="acara-unit-planner")

UNIT_GENERATE_USER_ERROR = (
    "Unit generation failed. Try adjusting your topic, lesson count, or descriptors."
)
UNIT_REFINE_USER_ERROR = "Refinement could not complete. Try a shorter or clearer instruction."
ASSISTANT_USER_ERROR = "The Assistant could not respond. Try again in a moment."

app = FastAPI(title="ACARA Unit Planner API")


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        if billing.cookie_secure():
            response.headers["Strict-Transport-Security"] = (
                "max-age=31536000; includeSubDomains"
            )
        return response


app.add_middleware(SecurityHeadersMiddleware)


@app.middleware("http")
async def _limit_request_body(request: Request, call_next):
    content_length = request.headers.get("content-length")
    if content_length:
        try:
            if int(content_length) > MAX_REQUEST_BYTES:
                return Response(status_code=413, content="Request body too large")
        except ValueError:
            pass
    return await call_next(request)


@app.on_event("startup")
def _edstack_billing_startup() -> None:
    ensure_billing_db()


register_auth_session_middleware(app)
register_edstack_auth_routes(app, default_public_url="http://127.0.0.1:5202")

SERVE_FRONTEND = (FRONTEND_DIST / "index.html").is_file()

_NO_CACHE_FILES = frozenset({"sw.js"})

def _pwa_file_response(path: Path) -> FileResponse:
    headers: dict[str, str] = {}
    if path.name in _NO_CACHE_FILES:
        headers["Cache-Control"] = "no-cache"
    return FileResponse(path, headers=headers)


if not SERVE_FRONTEND:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:5202",
            "http://127.0.0.1:5202",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


class GenerateUnitRequest(BaseModel):
    topic: str = Field(min_length=2, max_length=200)
    year_level: str = Field(default="Year 8", max_length=40)
    subject: str = Field(default="Science", max_length=80)
    lesson_count: int = Field(default=8, ge=6, le=10)
    school_name: str = Field(default="", max_length=120)
    pedagogy_focus: str = Field(default="", max_length=120)
    class_context: str = Field(default="", max_length=400)
    descriptor_ids: list[str] = Field(default_factory=list)

    @field_validator("descriptor_ids")
    @classmethod
    def clamp_descriptor_ids(cls, value: list[str]) -> list[str]:
        return [item.strip() for item in value if item.strip()][:6]


class ExportUnitRequest(BaseModel):
    school_name: str = Field(default="", max_length=120)
    unit: dict[str, Any]
    format: Literal["zip", "docx", "txt"] = "zip"


class RefineSectionRequest(BaseModel):
    unit: dict[str, Any]
    section_path: str = Field(min_length=3, max_length=120)
    instruction: str = Field(min_length=3, max_length=500)


class AssistantChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(max_length=MAX_ASSISTANT_MESSAGE_CHARS)


class AssistantChatRequest(BaseModel):
    messages: list[AssistantChatMessage] = Field(
        min_length=1,
        max_length=MAX_ASSISTANT_MESSAGES,
    )


class AssistantChatResponse(BaseModel):
    reply: str


@app.get("/api/health")
def health() -> dict:
    return {
        **billing_health_fields(),
        "status": "ok",
        "service": "acara-unit-planner",
        "product": "ACARA Unit Planner",
        "api_key_configured": is_llm_configured(),
        "llm_provider": get_llm_provider(),
        "llm_model": get_llm_model(),
        "anthropic_configured": is_anthropic_configured(),
        "gemini_configured": is_google_api_key_configured(),
        "model": get_llm_model(),
        "frontend_built": SERVE_FRONTEND,
    }


@app.get("/api/subjects")
def subjects() -> dict:
    return {"subjects": list_kla_options()}


@app.get("/api/descriptors")
def descriptors(subject: str = Query(..., min_length=2, max_length=80)) -> dict:
    items = list_descriptors_for_kla(subject)
    if not items:
        raise HTTPException(status_code=404, detail=f"No descriptors for subject: {subject}")
    return {"subject": subject, "descriptors": items}


@app.post("/api/unit/generate")
def unit_generate(body: GenerateUnitRequest, request: Request) -> dict:
    enforce_rate_limit(request, bucket="generate")

    if not is_llm_configured():
        raise HTTPException(status_code=503, detail="Primary LLM is not configured")

    credit_cost = credits_for_term_generate()
    billing_user, credits_remaining, credits_debited = charge_or_skip(
        request,
        credit_cost,
        reason="unit_generate",
    )

    outcome = generate_unit_pack(
        topic=body.topic,
        year_level=body.year_level,
        subject=body.subject,
        lesson_count=body.lesson_count,
        descriptor_ids=body.descriptor_ids,
        school_name=body.school_name,
        pedagogy_focus=body.pedagogy_focus,
        class_context=body.class_context,
    )

    if outcome.error or not outcome.unit:
        if credits_debited and billing_user:
            refund(
                billing_user.id,
                credit_cost,
                reason="unit_generate_refund",
                remaining=credits_remaining,
            )
        raise HTTPException(
            status_code=502,
            detail=UNIT_GENERATE_USER_ERROR,
        )

    response_body = {
        "unit": outcome.unit,
        "usage": outcome.usage.to_dict() if outcome.usage else None,
    }
    if billing.billing_enabled() and billing_user is not None and credits_remaining is not None:
        attach_credits_fields(
            response_body,
            user=billing_user,
            charged=credit_cost,
            remaining=credits_remaining,
        )
    return response_body


@app.post("/api/unit/validate")
def unit_validate(body: dict[str, Any]) -> dict:
    unit = body.get("unit") or body
    validated, error = validate_unit_output(unit)
    if error:
        raise HTTPException(status_code=400, detail=error)
    return {"unit": validated}


@app.post("/api/unit/refine")
def unit_refine(body: RefineSectionRequest, request: Request) -> dict:
    enforce_rate_limit(request, bucket="generate")

    if not is_llm_configured():
        raise HTTPException(status_code=503, detail="Primary LLM is not configured")

    validated, error = validate_unit_output(body.unit)
    if error:
        raise HTTPException(status_code=400, detail=error)

    credit_cost = credits_for_term_refine()
    billing_user, credits_remaining, credits_debited = charge_or_skip(
        request,
        credit_cost,
        reason="unit_refine",
    )

    try:
        result = refine_unit_section(
            unit=validated,
            section_path=body.section_path.strip(),
            instruction=body.instruction,
        )
        if billing.billing_enabled() and billing_user is not None and credits_remaining is not None:
            attach_credits_fields(
                result,
                user=billing_user,
                charged=credit_cost,
                remaining=credits_remaining,
            )
        return result
    except ValueError as exc:
        if credits_debited and billing_user:
            refund(
                billing_user.id,
                credit_cost,
                reason="unit_refine_refund",
                remaining=credits_remaining,
            )
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        if credits_debited and billing_user:
            refund(
                billing_user.id,
                credit_cost,
                reason="unit_refine_refund",
                remaining=credits_remaining,
            )
        raise HTTPException(status_code=502, detail=UNIT_REFINE_USER_ERROR) from exc


@app.post("/api/unit/export")
def unit_export(body: ExportUnitRequest, request: Request) -> Response:
    enforce_rate_limit(request, bucket="export")

    validated, error = validate_unit_output(body.unit)
    if error:
        raise HTTPException(status_code=400, detail=error)

    slug = "".join(
        ch if ch.isalnum() or ch in "-_" else "-"
        for ch in validated.get("unit_title", validated.get("topic", "term-plan"))
    )[:50] or "term-plan"

    if body.format == "zip":
        content = build_export_zip(validated, school_name=body.school_name)
        media_type = "application/zip"
        filename = f"{slug}-term-plan.zip"
    elif body.format == "docx":
        content = build_unit_docx(validated, school_name=body.school_name)
        media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        filename = f"{slug}-term-plan.docx"
    else:
        content = build_unit_txt(validated, school_name=body.school_name)
        media_type = "text/plain; charset=utf-8"
        filename = f"{slug}-term-plan.txt"

    return Response(
        content=content,
        media_type=media_type,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@app.post("/api/assistant/chat", response_model=AssistantChatResponse)
def assistant_chat(body: AssistantChatRequest, request: Request) -> AssistantChatResponse:
    enforce_rate_limit(request, bucket="assistant")
    require_signed_in(request)
    if not is_google_api_key_configured():
        raise HTTPException(status_code=503, detail="GOOGLE_API_KEY is not configured on the server.")
    if not body.messages:
        raise HTTPException(status_code=400, detail="At least one message is required.")
    last = body.messages[-1]
    if last.role != "user" or not last.content.strip():
        raise HTTPException(status_code=400, detail="The latest message must be a non-empty user message.")
    payload = [{"role": m.role, "content": m.content} for m in body.messages]
    try:
        reply = chat_with_assistant(payload)
        return AssistantChatResponse(reply=reply)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception:
        raise HTTPException(status_code=502, detail=ASSISTANT_USER_ERROR) from None


if SERVE_FRONTEND:
    assets_dir = FRONTEND_DIST / "assets"
    if assets_dir.is_dir():
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="Not found")
        candidate = (FRONTEND_DIST / full_path).resolve()
        dist_root = FRONTEND_DIST.resolve()
        if full_path and candidate.is_file() and dist_root in candidate.parents:
            return _pwa_file_response(candidate)
        index = FRONTEND_DIST / "index.html"
        if index.is_file():
            return FileResponse(index)
        raise HTTPException(status_code=404, detail="Frontend build not found")

else:

    @app.get("/")
    def frontend_missing() -> dict[str, str]:
        return {
            "status": "ok",
            "detail": "Run npm run dev in client/ or build and uvicorn on port 8028.",
            "api_health": "/api/health",
        }
