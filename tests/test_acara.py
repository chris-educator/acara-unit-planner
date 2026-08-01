"""Tests for Australian curriculum helpers."""

from src.acara import (
    DEFAULT_SUBJECT,
    KLA_OPTIONS,
    CURRICULUM_FRAMEWORKS,
    descriptors_for_ids,
    list_curriculum_frameworks,
    list_descriptors_for_kla,
    list_kla_options,
)


def test_list_kla_options_sorted_and_includes_humanities():
    options = list_kla_options()
    assert options == sorted(options, key=str.casefold)
    assert DEFAULT_SUBJECT in options
    assert "Science" in options
    assert "Mathematics" in options
    assert options == list(KLA_OPTIONS)


def test_curriculum_frameworks_sorted_and_include_acara_and_ib():
    frameworks = list_curriculum_frameworks()
    assert frameworks == sorted(frameworks, key=str.casefold)
    assert "Australian Curriculum (ACARA)" in frameworks
    assert "International Baccalaureate (IB DP)" in frameworks
    assert "Queensland Curriculum and Assessment Authority (QCAA)" in frameworks
    assert frameworks == list(CURRICULUM_FRAMEWORKS)


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
