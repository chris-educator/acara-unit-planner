# ACARA Unit Planner (B1)

Full-term unit plans with curriculum descriptor links for Australian teachers.

**Host:** https://acara.appstax.ai  
**EdStack app id:** `acara-unit-planner`

## MVP

- 6–10 week term plans with weekly intents and assessment outline
- Curated ACARA-aligned descriptor picker (shared with Micro Unit Starter)
- DOCX / PDF / ZIP / TXT export
- **12 credits per term plan** · **3 credits per refine**

## Local dev

```bash
uvicorn server.main:app --port 8028 --reload
cd client && npm run dev   # :5202
```

See [`docs/PRODUCT-BRIEF.md`](docs/PRODUCT-BRIEF.md).
