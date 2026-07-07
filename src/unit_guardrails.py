"""Validate generated micro-unit JSON before returning to teachers."""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field, field_validator, model_validator


class DescriptorRef(BaseModel):
    id: str = Field(min_length=2)
    label: str = Field(min_length=3)
    summary: str = Field(min_length=8)


class UnitLesson(BaseModel):
    lesson_number: int = Field(ge=1, le=10)
    title: str = Field(min_length=4, max_length=200)
    learning_objectives: list[str] = Field(min_length=2, max_length=6)
    materials_needed: list[str] = Field(min_length=1, max_length=12)
    starter: str = Field(min_length=20)
    main_activity: str = Field(min_length=25)
    exit_ticket: str = Field(min_length=15)
    differentiation_support: str = Field(min_length=15)
    differentiation_extension: str = Field(min_length=15)
    timing_notes: str = Field(default="", max_length=120)

    @field_validator("learning_objectives", "materials_needed")
    @classmethod
    def strip_string_lists(cls, value: list[str]) -> list[str]:
        cleaned = [item.strip() for item in value if item.strip()]
        if not cleaned:
            raise ValueError("List fields must contain at least one item")
        return cleaned

    @field_validator(
        "starter",
        "main_activity",
        "exit_ticket",
        "title",
        "differentiation_support",
        "differentiation_extension",
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
    subject: str = Field(min_length=2, max_length=80)
    lesson_count: int = Field(ge=6, le=10)
    overview: str = Field(min_length=20, max_length=3000)
    success_criteria: list[str] = Field(min_length=2, max_length=10)
    suggested_descriptors: list[DescriptorRef] = Field(default_factory=list)
    lessons: list[UnitLesson] = Field(min_length=6, max_length=10)
    unit_assessment: UnitAssessment

    @field_validator("success_criteria")
    @classmethod
    def strip_success_criteria(cls, value: list[str]) -> list[str]:
        cleaned = [item.strip() for item in value if item.strip()]
        if len(cleaned) < 2:
            raise ValueError("At least two success criteria required")
        return cleaned

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
