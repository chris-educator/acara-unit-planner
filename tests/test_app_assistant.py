"""Ask assistant dual-provider readiness."""

from src.app_assistant import ASSISTANT_SYSTEM, is_assistant_configured
from src.config import GEMINI_MAX_OUTPUT_TOKENS_ASSISTANT


def test_assistant_ready_with_gemini_only(monkeypatch):
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)
    monkeypatch.setenv("GOOGLE_API_KEY", "test-google-key")
    assert is_assistant_configured() is True


def test_assistant_ready_with_anthropic_only(monkeypatch):
    monkeypatch.delenv("GOOGLE_API_KEY", raising=False)
    monkeypatch.setenv("ANTHROPIC_API_KEY", "sk-ant-test")
    assert is_assistant_configured() is True


def test_assistant_not_ready_without_keys(monkeypatch):
    monkeypatch.delenv("GOOGLE_API_KEY", raising=False)
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)
    assert is_assistant_configured() is False


def test_assistant_system_mentions_class_context():
    assert "Class Context" in ASSISTANT_SYSTEM
    assert "Pedagogy Focus" in ASSISTANT_SYSTEM
    assert "Refine" in ASSISTANT_SYSTEM
    assert "Teacher pack" in ASSISTANT_SYSTEM
    assert "YouTube" in ASSISTANT_SYSTEM


def test_assistant_output_token_default_allows_full_howto():
    assert GEMINI_MAX_OUTPUT_TOKENS_ASSISTANT >= 1024
