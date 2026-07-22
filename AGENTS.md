# AGENTS — ACARA Unit Planner

Full-term unit plans with curriculum descriptor links for Australian teachers.

## Purpose

Teachers configure topic, year, subject, week count (6–10), optional ACARA descriptor picks → generate term unit plan → preview/edit → export ZIP/DOCX/TXT.

## Stack

- `client/` — Vite, React, Tailwind (FBG teacher chrome)
- `server/` — FastAPI
- `src/` — ACARA picks, Anthropic/Gemini generation, guardrails, DOCX/ZIP export

## Local dev

```bash
npm run dev:api      # :8026 / check package scripts
npm run dev:client   # :5202
```

## Production

- **Host:** https://planner.appstax.ai
- **Health:** `GET /api/health`
- **Deploy:** Dockerfile + `railway.toml`
- **Credits:** 15 per term plan · 3 per refine (`EDSTACK_APP_ID=acara-unit-planner`)

## Product rules

- Run `validate_unit_output` before returning or exporting units
- Lesson/week count must be 6–10
- Primary generation: Anthropic; Ask the Assistant: Gemini

## Tests

```bash
PYTHONPATH=. python3 -m pytest tests/
```

## Agent commands

`/explore` · `/ship-check`
