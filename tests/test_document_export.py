"""Term plan export formats."""

from __future__ import annotations

import zipfile
from io import BytesIO

from src.document_export import build_export_zip, build_unit_pdf, build_unit_txt


def _sample_unit() -> dict:
    return {
        "unit_title": "Local Places — Year 3 HASS",
        "topic": "Local places and mapping",
        "year_level": "Year 3",
        "subject": "Humanities and Social Sciences",
        "lesson_count": 6,
        "overview": "Students explore local places and represent them on simple maps.",
        "success_criteria": ["Locate familiar places on a map", "Describe features of a local place"],
        "suggested_descriptors": [
            {"id": "ACHASSI052", "label": "ACHASSI052", "summary": "Record and represent data"}
        ],
        "lessons": [
            {
                "lesson_number": 1,
                "title": "Our neighbourhood",
                "timing_notes": "60 minutes",
                "learning_objectives": ["Identify familiar places near school"],
                "materials_needed": ["Local map printouts"],
                "starter": "Quick share: favourite place near school.",
                "main_activity": "Label a simple neighbourhood map in pairs.",
                "exit_ticket": "Name one place and one feature.",
                "differentiation_support": "Provide labelled icons.",
                "differentiation_extension": "Add a simple key and route.",
                "differentiation_eald": "Pre-teach map words with picture cards.",
                "differentiation_adjustments": "Allow verbal labels instead of writing.",
            }
        ],
        "cross_curriculum_priorities": ["Sustainability"],
        "general_capabilities": ["Literacy", "Critical and Creative Thinking"],
        "unit_assessment": {
            "title": "Neighbourhood map task",
            "instructions": "Create a labelled map of a familiar local area.",
            "tasks": ["Draw and label at least five places", "Include a simple key"],
            "rubric": [
                {
                    "criterion": "Map clarity",
                    "developing": "Few labels; hard to read",
                    "meeting": "Clear labels for key places",
                    "exceeding": "Clear labels, key, and useful detail",
                }
            ],
        },
    }


def test_unit_pdf_starts_with_pdf_header():
    content = build_unit_pdf(_sample_unit(), school_name="Demo Primary")
    assert content[:4] == b"%PDF"
    assert len(content) > 500


def test_unit_pdf_handles_unicode_punctuation():
    unit = _sample_unit()
    unit["overview"] = "Students explore places — including parks — and “local” shops."
    content = build_unit_pdf(unit)
    assert content[:4] == b"%PDF"


def test_export_zip_includes_pdf_docx_txt():
    raw = build_export_zip(_sample_unit())
    with zipfile.ZipFile(BytesIO(raw)) as archive:
        names = archive.namelist()
    assert any(name.endswith(".pdf") for name in names)
    assert any(name.endswith(".docx") for name in names)
    assert any(name.endswith(".txt") for name in names)


def test_unit_txt_includes_title():
    text = build_unit_txt(_sample_unit()).decode("utf-8")
    assert "Local Places" in text
    assert "Neighbourhood map task" in text
    assert "Differentiation — EAL/D" in text
    assert "Cross-curriculum priorities" in text
    assert "Sustainability" in text
