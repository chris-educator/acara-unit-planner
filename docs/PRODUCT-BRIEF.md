# B1 — ACARA Unit Planner Pro

**Full-term unit plans aligned to curriculum descriptors**  
**ID:** B1 · **Repo:** `/Users/c.magill/AppDev/acara-unit-planner`  
**Status:** MVP · July 2026  
**Host:** `planner.appstax.ai`

## One-liner

Teachers enter topic, year level, and ACARA-aligned descriptors → get a **6–10 week term plan** with weekly intents, formative checks, assessment outline, and accreditation-ready export.

## Revenue

| Action | Credits |
|--------|---------|
| Generate term plan | **15** |
| Refine one section | **3** |

## vs Micro Unit Starter (B2)

| | B2 | B1 |
|--|-----|-----|
| **Scope** | 3–5 lesson micro-unit | **6–10 week term** |
| **Buyer** | Quick planning | Accreditation / faculty planning |
| **Credits** | 10 generate | **15 generate** |

## Technical

Reuses curated descriptor DB from `micro-unit-starter/src/acara.py`. Differentiate on **term sequencing + export**, not another lesson list.

---

*See `studio-backlog/PRODUCT-LIBRARY.md`.*
