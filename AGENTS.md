# AGENTS — ACARA Unit Planner

Full-term unit plans with curriculum descriptor links for Australian teachers.

## Purpose

Teachers configure topic, year, subject, week count (6–10), optional ACARA descriptor picks → generate term unit plan → preview/edit → export ZIP/DOCX/PDF/TXT.

## Stack

- `client/` — Vite, React, Tailwind (FBG teacher chrome)
- `server/` — FastAPI
- `src/` — ACARA picks, Anthropic/Gemini generation, guardrails, DOCX/PDF/ZIP export

## Local dev

```bash
npm run dev:api      # :8028
npm run dev:client   # :5202
```

## Production

- **Host:** https://acara.appstax.ai
- **Health:** `GET /api/health`
- **Deploy:** Dockerfile + `railway.toml`
- **Credits:** 12 per term plan · 2 per refine (`EDSTACK_APP_ID=acara-unit-planner`)

## Product rules

- Run `validate_unit_output` before returning or exporting units
- Lesson/week count must be 6–10
- Primary generation: Anthropic; Ask the Assistant: Gemini 3.6 Flash with Anthropic fallback
- Ask is ready when either `GOOGLE_API_KEY` or `ANTHROPIC_API_KEY` is set

## Tests

```bash
PYTHONPATH=. python3 -m pytest tests/
```

## Agent commands

`/explore` · `/ship-check`
