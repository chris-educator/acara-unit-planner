# Deploy — ACARA Unit Planner

**Host:** https://planner.appstax.ai

| Variable | Value |
|----------|-------|
| `EDSTACK_APP_ID` | `acara-unit-planner` |
| `APP_PUBLIC_URL` | `https://planner.appstax.ai` |
| `VITE_SITE_URL` | `https://planner.appstax.ai` |

Health: `curl -fsS https://planner.appstax.ai/api/health`

Local dev:

```bash
uvicorn server.main:app --port 8028 --reload
cd client && npm run dev   # :5202
```
