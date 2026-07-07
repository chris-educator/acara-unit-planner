"""Tests for ACARA descriptor helpers."""

from src.acara import descriptors_for_ids, list_descriptors_for_kla, list_kla_options


def test_list_kla_options():
    options = list_kla_options()
    assert "Science" in options
    assert "Mathematics" in options


def test_descriptors_for_science():
    items = list_descriptors_for_kla("Science")
    assert items
    assert all(item["kla"] == "Science" for item in items)


def test_descriptors_for_ids():
    items = descriptors_for_ids(["sci-investigation", "missing-id"])
    assert len(items) == 1
    assert items[0]["id"] == "sci-investigation"
