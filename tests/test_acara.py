"""Tests for Australian curriculum helpers."""

from src.acara import (
    CROSS_CURRICULUM_PRIORITIES,
    DEFAULT_SUBJECT,
    GENERAL_CAPABILITIES,
    KLA_OPTIONS,
    descriptors_for_ids,
    list_descriptors_for_kla,
    list_kla_options,
    year_band_guidance,
)


def test_list_kla_options_sorted_and_includes_humanities():
    options = list_kla_options()
    assert options == sorted(options, key=str.casefold)
    assert DEFAULT_SUBJECT in options
    assert "Science" in options
    assert "Mathematics" in options
    assert options == list(KLA_OPTIONS)


def test_kla_options_cover_acara_f10_learning_areas_and_languages():
    options = set(list_kla_options())
    required = {
        "English",
        "Mathematics",
        "Science",
        "Health and Physical Education",
        "Humanities and Social Sciences",
        "Civics and Citizenship",
        "Economics and Business",
        "Geography",
        "History",
        "The Arts",
        "Dance",
        "Drama",
        "Media Arts",
        "Music",
        "Visual Arts",
        "Technologies",
        "Design and Technologies",
        "Digital Technologies",
        "Languages",
        "Arabic",
        "Auslan",
        "Chinese",
        "French",
        "German",
        "Hindi",
        "Indonesian",
        "Italian",
        "Japanese",
        "Korean",
        "Modern Greek",
        "Spanish",
        "Turkish",
        "Vietnamese",
        "Aboriginal Languages and Torres Strait Islander Languages",
        "Classical Greek",
        "Latin",
        "Work Studies",
    }
    missing = sorted(required - options)
    assert not missing, f"Missing subjects: {missing}"
    # ACARA F–10 only — no state senior electives
    assert "Mathematical Methods" not in options
    assert "Business Studies" not in options


def test_descriptors_for_humanities_default():
    items = list_descriptors_for_kla(DEFAULT_SUBJECT)
    assert items
    assert all(item["kla"] == DEFAULT_SUBJECT for item in items)
    labels = [item["label"] for item in items]
    assert labels == sorted(labels, key=str.casefold)


def test_descriptors_for_science():
    items = list_descriptors_for_kla("Science")
    assert items
    assert all(item["kla"] == "Science" for item in items)


def test_descriptors_for_ids():
    items = descriptors_for_ids(["sci-investigation", "missing-id"])
    assert len(items) == 1
    assert items[0]["id"] == "sci-investigation"


def test_unknown_subject_gets_generic_fallback():
    items = list_descriptors_for_kla("Invented Subject XYZ")
    assert len(items) >= 2
    assert all(item["kla"] == "Invented Subject XYZ" for item in items)


def test_cross_curriculum_and_general_capabilities_constants():
    assert len(CROSS_CURRICULUM_PRIORITIES) == 3
    assert "Sustainability" in CROSS_CURRICULUM_PRIORITIES
    assert "Literacy" in GENERAL_CAPABILITIES
    assert "Digital Literacy" in GENERAL_CAPABILITIES


def test_year_band_guidance_primary_and_middle():
    primary = year_band_guidance("Year 5")
    assert "Primary" in primary
    assert "40–60" in primary or "40-60" in primary
    early = year_band_guidance("Foundation")
    assert "Early years" in early
    middle = year_band_guidance("Year 8")
    assert "Middle years" in middle
