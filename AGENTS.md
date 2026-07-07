# AGENTS — Micro-Unit Starter Kit

Teacher micro-unit builder (B2) — 3–5 lesson sequences with export pack.

## Purpose

Teachers configure topic, year, subject, lesson count, optional ACARA descriptor picks → generate micro-unit → preview/edit → export ZIP/DOCX.

## Stack

- `client/` — Vite, React, Tailwind (FBG teacher chrome)
- `server/` — FastAPI
- `src/` — ACARA picks, Gemini generation, guardrails, DOCX/ZIP export

## Local dev

```bash
npm run dev:api      # :8009
npm run dev:client   # :5191
```

## Production

- **Host:** https://micro.appstax.ai
- **Health:** `GET /api/health`
- **Deploy:** Dockerfile + `railway.toml`

## Product rules

- Run `validate_unit_output` before returning or exporting units
- v1: no credits/Stripe; no Playwright PDF (DOCX/ZIP export)

## Tests

```bash
python3 -m pytest tests/
```

## Agent commands

`/explore` · `/ship-check`
