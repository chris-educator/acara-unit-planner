"""Refine a single micro-unit section with primary LLM (Anthropic or Gemini)."""

from __future__ import annotations

import json
from typing import Any

from src.config import GEMINI_MAX_OUTPUT_TOKENS_REFINE
from src.llm_chat import generate_json_text, parse_json_object

REFINE_SYSTEM = """You are an expert teacher planner helping refine one section of a term unit plan.

Return strict JSON only:
- For text fields: {"value": "..."}
- For list fields (learning_objectives, materials_needed, tasks, success_criteria): {"values": ["...", "..."]}

Rules:
- Match the teacher's instruction and the unit context (year level, subject, topic).
- Keep classroom-ready, practical tone; Australian/international school English as appropriate.
- Do not invent unrelated topics or change the week focus unless asked.
- Preserve approximate length unless the teacher asks to shorten or expand.
"""


def _current_value(unit: dict[str, Any], section_path: str) -> Any:
    parts = section_path.split(".")
    node: Any = unit
    for part in parts:
        if part.isdigit():
            node = node[int(part)]
        else:
            node = node[part]
    return node


def refine_unit_section(
    *,
    unit: dict[str, Any],
    section_path: str,
    instruction: str,
    model: str | None = None,
) -> dict[str, Any]:
    del model

    current = _current_value(unit, section_path)
    is_list = isinstance(current, list)

    context = {
        "unit_title": unit.get("unit_title"),
        "topic": unit.get("topic"),
        "year_level": unit.get("year_level"),
        "subject": unit.get("subject"),
        "section_path": section_path,
        "current_value": current,
    }

    user_prompt = (
        f"Unit context:\n{json.dumps(context, indent=2)}\n\n"
        f"Teacher instruction: {instruction.strip()}\n\n"
        f"Return JSON with {'\"values\" (array of strings)' if is_list else '\"value\" (string)'} only."
    )

    raw_text, _usage = generate_json_text(
        system_instruction=REFINE_SYSTEM,
        user_content=user_prompt,
        max_output_tokens=GEMINI_MAX_OUTPUT_TOKENS_REFINE,
        operation="unit_refine",
        temperature=0.35,
    )
    raw: dict[str, Any] = parse_json_object(raw_text)

    if is_list:
        values = raw.get("values")
        if not isinstance(values, list) or not values:
            raise ValueError("Refinement did not return a valid list")
        cleaned = [str(v).strip() for v in values if str(v).strip()]
        if not cleaned:
            raise ValueError("Refinement returned an empty list")
        return {"values": cleaned}

    value = raw.get("value")
    if not isinstance(value, str) or not value.strip():
        raise ValueError("Refinement did not return valid text")
    return {"value": value.strip()}
