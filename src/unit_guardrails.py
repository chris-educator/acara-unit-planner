"""Validate generated micro-unit JSON before returning to teachers."""

from __future__ import annotations

import re
from typing import Any, Literal

from pydantic import BaseModel, Field, field_validator, model_validator

RESOURCE_KINDS = frozenset({"video", "website", "text", "interactive", "book"})

RESOURCE_PORTALS = frozenset(
    {
        "",
        "ABC Education",
        "eSafety",
        "ACARA",
        "Scootle",
        "National Museum of Australia",
        "Geoscience Australia",
        "Australian War Memorial",
        "Museum of Australian Democracy",
        "CSIRO",
        "Bureau of Meteorology",
        "National Library of Australia",
    }
)

_URL_PATTERN = re.compile(r"https?://|www\.|youtube\.com|youtu\.be", re.IGNORECASE)


def _reject_urls(text: str, field_name: str) -> str:
    cleaned = text.strip()
    if _URL_PATTERN.search(cleaned):
        raise ValueError(
            f"{field_name} must not include web or YouTube URLs — use search_query / portal only"
        )
    return cleaned


class DescriptorRef(BaseModel):
    id: str = Field(min_length=2)
    label: str = Field(min_length=3)
    summary: str = Field(min_length=8)


class VocabularyItem(BaseModel):
    term: str = Field(min_length=1, max_length=80)
    gloss: str = Field(min_length=3, max_length=300)

    @field_validator("term", "gloss")
    @classmethod
    def strip_vocab(cls, value: str) -> str:
        return _reject_urls(value, "vocabulary")


class MisconceptionItem(BaseModel):
    misconception: str = Field(min_length=8, max_length=400)
    address: str = Field(min_length=8, max_length=500)

    @field_validator("misconception", "address")
    @classmethod
    def strip_misconception(cls, value: str) -> str:
        return _reject_urls(value, "misconception")


class SuggestedResource(BaseModel):
    title: str = Field(min_length=3, max_length=160)
    kind: Literal["video", "website", "text", "interactive", "book"]
    why: str = Field(min_length=8, max_length=300)
    search_query: str = Field(min_length=3, max_length=200)
    portal: str = Field(default="", max_length=80)

    @field_validator("title", "why", "search_query")
    @classmethod
    def strip_resource_text(cls, value: str) -> str:
        return _reject_urls(value, "suggested_resources")

    @field_validator("portal")
    @classmethod
    def validate_portal(cls, value: str) -> str:
        cleaned = value.strip()
        if cleaned not in RESOURCE_PORTALS:
            raise ValueError(
                f"portal must be empty or one of: {', '.join(sorted(p for p in RESOURCE_PORTALS if p))}"
            )
        return cleaned


class UnitLesson(BaseModel):
    lesson_number: int = Field(ge=1, le=10)
    title: str = Field(min_length=4, max_length=200)
    learning_objectives: list[str] = Field(min_length=2, max_length=6)
    materials_needed: list[str] = Field(min_length=1, max_length=12)
    teacher_prep: list[str] = Field(default_factory=list, max_length=6)
    suggested_resources: list[SuggestedResource] = Field(default_factory=list, max_length=4)
    starter: str = Field(min_length=20)
    main_activity: str = Field(min_length=25)
    exit_ticket: str = Field(min_length=15)
    differentiation_support: str = Field(min_length=15)
    differentiation_extension: str = Field(min_length=15)
    differentiation_eald: str = Field(default="", max_length=1200)
    differentiation_adjustments: str = Field(default="", max_length=1200)
    timing_notes: str = Field(default="", max_length=120)

    @field_validator("learning_objectives", "materials_needed")
    @classmethod
    def strip_core_lists(cls, value: list[str]) -> list[str]:
        cleaned = [_reject_urls(item, "lesson list") for item in value if item.strip()]
        if not cleaned:
            raise ValueError("List fields must contain at least one item")
        return cleaned

    @field_validator("teacher_prep")
    @classmethod
    def strip_teacher_prep(cls, value: list[str]) -> list[str]:
        return [_reject_urls(item, "teacher_prep") for item in value if item.strip()]

    @field_validator(
        "starter",
        "main_activity",
        "exit_ticket",
        "title",
        "differentiation_support",
        "differentiation_extension",
        "differentiation_eald",
        "differentiation_adjustments",
        "timing_notes",
    )
    @classmethod
    def strip_text(cls, value: str) -> str:
        return value.strip()


class RubricCriterion(BaseModel):
    criterion: str = Field(min_length=3, max_length=120)
    developing: str = Field(min_length=8)
    meeting: str = Field(min_length=8)
    exceeding: str = Field(min_length=8)

    @field_validator("criterion", "developing", "meeting", "exceeding")
    @classmethod
    def strip_rubric(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("Empty rubric field")
        return cleaned


class UnitAssessment(BaseModel):
    title: str = Field(min_length=4, max_length=200)
    instructions: str = Field(min_length=10)
    tasks: list[str] = Field(min_length=2, max_length=6)
    rubric: list[RubricCriterion] = Field(min_length=2, max_length=6)

    @field_validator("tasks")
    @classmethod
    def strip_tasks(cls, value: list[str]) -> list[str]:
        cleaned = [item.strip() for item in value if item.strip()]
        if len(cleaned) < 2:
            raise ValueError("At least two assessment tasks required")
        return cleaned


class UnitOutput(BaseModel):
    unit_title: str = Field(min_length=4, max_length=200)
    topic: str = Field(min_length=2, max_length=200)
    year_level: str = Field(min_length=2, max_length=40)
    subject: str = Field(min_length=2, max_length=120)
    lesson_count: int = Field(ge=6, le=10)
    overview: str = Field(min_length=20, max_length=3000)
    success_criteria: list[str] = Field(min_length=2, max_length=10)
    key_vocabulary: list[VocabularyItem] = Field(min_length=8, max_length=15)
    common_misconceptions: list[MisconceptionItem] = Field(min_length=3, max_length=5)
    term_materials_checklist: list[str] = Field(min_length=4, max_length=20)
    parent_carer_blurb: str = Field(min_length=40, max_length=800)
    sequence_at_a_glance: list[str] = Field(min_length=6, max_length=10)
    cross_curriculum_priorities: list[str] = Field(default_factory=list, max_length=3)
    general_capabilities: list[str] = Field(default_factory=list, max_length=7)
    suggested_descriptors: list[DescriptorRef] = Field(default_factory=list)
    lessons: list[UnitLesson] = Field(min_length=6, max_length=10)
    unit_assessment: UnitAssessment

    @field_validator("success_criteria", "term_materials_checklist", "sequence_at_a_glance")
    @classmethod
    def strip_success_criteria(cls, value: list[str]) -> list[str]:
        cleaned = [_reject_urls(item, "unit list") for item in value if item.strip()]
        if len(cleaned) < 2:
            raise ValueError("List must contain enough items")
        return cleaned

    @field_validator("parent_carer_blurb")
    @classmethod
    def strip_parent_blurb(cls, value: str) -> str:
        return _reject_urls(value, "parent_carer_blurb")

    @field_validator("cross_curriculum_priorities", "general_capabilities")
    @classmethod
    def strip_optional_string_lists(cls, value: list[str]) -> list[str]:
        return [item.strip() for item in value if item.strip()]

    @model_validator(mode="after")
    def validate_lesson_shape(self) -> "UnitOutput":
        if len(self.lessons) != self.lesson_count:
            raise ValueError(
                f"Expected {self.lesson_count} lessons, got {len(self.lessons)}"
            )
        numbers = sorted(lesson.lesson_number for lesson in self.lessons)
        expected = list(range(1, self.lesson_count + 1))
        if numbers != expected:
            raise ValueError("lesson_number must run 1..lesson_count without gaps")
        if len(self.sequence_at_a_glance) != self.lesson_count:
            raise ValueError(
                f"sequence_at_a_glance must have {self.lesson_count} lines (one per week)"
            )
        if len(self.term_materials_checklist) < 4:
            raise ValueError("term_materials_checklist needs at least 4 items")
        for lesson in self.lessons:
            if len(lesson.differentiation_eald) < 15:
                raise ValueError("Each week needs differentiation_eald (min 15 characters)")
            if len(lesson.differentiation_adjustments) < 15:
                raise ValueError(
                    "Each week needs differentiation_adjustments (min 15 characters)"
                )
            if len(lesson.teacher_prep) < 2:
                raise ValueError("Each week needs at least 2 teacher_prep bullets")
            if len(lesson.suggested_resources) < 2:
                raise ValueError("Each week needs at least 2 suggested_resources")
        return self


def validate_unit_output(
    raw: dict[str, Any],
    *,
    expected_lesson_count: int | None = None,
    expected_topic: str | None = None,
) -> tuple[dict[str, Any] | None, str | None]:
    try:
        output = UnitOutput.model_validate(raw)
    except Exception as exc:
        return None, f"Invalid unit JSON: {exc}"

    if expected_lesson_count is not None and output.lesson_count != expected_lesson_count:
        return None, f"lesson_count must be {expected_lesson_count}"

    if expected_topic and output.topic.strip().lower() != expected_topic.strip().lower():
        return None, "topic mismatch in generated unit"

    titles = [lesson.title for lesson in output.lessons]
    if len(titles) != len(set(titles)):
        return None, "Duplicate lesson titles detected"

    return output.model_dump(), None
