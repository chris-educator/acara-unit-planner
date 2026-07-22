"""App configuration."""

from __future__ import annotations

import os

_PLACEHOLDER_KEYS = frozenset({"", "your_google_api_key_here", "your-api-key", "changeme"})


def get_google_api_key() -> str | None:
    raw = os.getenv("GOOGLE_API_KEY", "").strip()
    if not raw or raw.lower() in _PLACEHOLDER_KEYS:
        return None
    return raw


def is_google_api_key_configured() -> bool:
    return get_google_api_key() is not None


GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash").strip()
MAX_GENERATION_ATTEMPTS = 3
DEFAULT_DURATION_MINUTES = 60
DEFAULT_TOTAL_MARKS = 50

# Hard caps on Gemini output — prevents runaway token bills.
GEMINI_MAX_OUTPUT_TOKENS_UNIT = max(
    512, int(os.getenv("GEMINI_MAX_OUTPUT_TOKENS_UNIT", "8192"))
)
GEMINI_MAX_OUTPUT_TOKENS_REFINE = max(
    128, int(os.getenv("GEMINI_MAX_OUTPUT_TOKENS_REFINE", "1024"))
)
GEMINI_MAX_OUTPUT_TOKENS_ASSISTANT = max(
    128, int(os.getenv("GEMINI_MAX_OUTPUT_TOKENS_ASSISTANT", "512"))
)

MAX_ASSISTANT_MESSAGES = max(1, int(os.getenv("MAX_ASSISTANT_MESSAGES", "40")))
MAX_ASSISTANT_MESSAGE_CHARS = max(
    256, int(os.getenv("MAX_ASSISTANT_MESSAGE_CHARS", "4000"))
)

# Hard cap on incoming request body size (bytes) — protects against
# oversized uploads consuming CPU/memory before per-field truncation applies.
MAX_REQUEST_BYTES = max(1_000_000, int(os.getenv("MAX_REQUEST_BYTES", "15000000")))
