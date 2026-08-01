# Deploy — ACARA Unit Planner

**Host:** https://acara.appstax.ai

| Variable | Value |
|----------|-------|
| `EDSTACK_APP_ID` | `acara-unit-planner` |
| `APP_PUBLIC_URL` | `https://acara.appstax.ai` |
| `VITE_SITE_URL` | `https://acara.appstax.ai` |

Health: `curl -fsS https://acara.appstax.ai/api/health`

Local dev:

```bash
uvicorn server.main:app --port 8028 --reload
cd client && npm run dev   # :5202
```
