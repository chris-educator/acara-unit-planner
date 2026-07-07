"""Credit costs for ACARA Unit Planner."""

from __future__ import annotations

CREDITS_PER_TERM = 15
CREDITS_PER_REFINE = 3


def credits_for_term_generate() -> int:
    return CREDITS_PER_TERM


def credits_for_term_refine() -> int:
    return CREDITS_PER_REFINE
