"""Generate micro-unit packs via primary LLM (Anthropic or Gemini)."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from src.acara import descriptors_for_ids
from src.config import GEMINI_MAX_OUTPUT_TOKENS_UNIT, MAX_GENERATION_ATTEMPTS
from src.gemini_usage import GeminiUsage
from src.llm_chat import generate_json_text, parse_json_object
from src.llm_usage import LlmUsage
from src.unit_guardrails import validate_unit_output
from src.unit_prompts import UNIT_PACK_SYSTEM


@dataclass
class UnitPackResult:
    unit: dict[str, Any] = field(default_factory=dict)
    error: str | None = None
    usage: GeminiUsage | None = None


def _accumulate_usage(totals: dict[str, int], usage: LlmUsage | None) -> None:
    if not usage:
        return
    totals["prompt_tokens"] += usage.prompt_tokens
    totals["candidates_tokens"] += usage.candidates_tokens
    totals["total_tokens"] += usage.total_tokens


def generate_unit_pack(
    *,
    topic: str,
    year_level: str,
    subject: str,
    lesson_count: int,
    descriptor_ids: list[str],
    school_name: str = "",
    pedagogy_focus: str = "",
    class_context: str = "",
    model: str | None = None,
) -> UnitPackResult:
    del model

    client_descriptors = descriptors_for_ids(descriptor_ids)

    descriptor_lines = [
        f"- {item['label']}: {item['summary']}" for item in client_descriptors
    ] or ["- None selected — infer sensible Australian curriculum alignment from subject."]

    context_parts = [
        f"Topic: {topic.strip()}",
        f"Year level: {year_level.strip()}",
        f"Subject / KLA: {subject.strip()}",
        f"Lesson count: {lesson_count}",
        f"School name (optional header): {school_name.strip() or 'School name'}",
    ]
    if pedagogy_focus.strip():
        context_parts.append(f"Pedagogy focus: {pedagogy_focus.strip()}")
    if class_context.strip():
        context_parts.append(f"Class context: {class_context.strip()}")
    context_parts.extend(
        [
            "Selected curriculum descriptors:",
            *descriptor_lines,
            "",
            f"Generate exactly {lesson_count} weekly plans (weeks) with objectives, materials, starter, main activity, exit ticket, and differentiation each.",
            "Include unit success criteria and an end-of-unit assessment with a marking rubric.",
        ]
    )

    user_prompt = "\n".join(context_parts)
    last_error: str | None = None
    usage_totals = {"prompt_tokens": 0, "candidates_tokens": 0, "total_tokens": 0}

    for attempt in range(MAX_GENERATION_ATTEMPTS):
        prompt = user_prompt
        if attempt > 0 and last_error:
            prompt += (
                f"\n\nPrevious attempt failed validation: {last_error}. "
                "Fix lesson_count, lesson_number sequence, and field lengths. Return JSON only."
            )

        raw_text, llm_usage = generate_json_text(
            system_instruction=UNIT_PACK_SYSTEM,
            user_content=prompt,
            max_output_tokens=GEMINI_MAX_OUTPUT_TOKENS_UNIT,
            operation="unit_pack",
            temperature=0.4,
        )
        _accumulate_usage(usage_totals, llm_usage)

        try:
            raw: dict[str, Any] = parse_json_object(raw_text)
        except ValueError:
            last_error = "Model did not return valid JSON"
            continue

        if client_descriptors and not raw.get("suggested_descriptors"):
            raw["suggested_descriptors"] = client_descriptors

        validated, error = validate_unit_output(
            raw,
            expected_lesson_count=lesson_count,
        )
        if validated:
            total_usage = (
                GeminiUsage(operation="unit_pack", **usage_totals)
                if usage_totals["total_tokens"]
                else None
            )
            return UnitPackResult(unit=validated, usage=total_usage)
        last_error = error

    total_usage = (
        GeminiUsage(operation="unit_pack", **usage_totals)
        if usage_totals["total_tokens"]
        else None
    )
    return UnitPackResult(
        error=last_error or "Could not generate a valid term plan",
        usage=total_usage,
    )
