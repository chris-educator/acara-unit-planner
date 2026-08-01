"""Ask assistant dual-provider readiness."""

from src.app_assistant import is_assistant_configured


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
