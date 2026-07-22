# ResilienceOS

Cyber, AI governance, and executive tabletop simulation platform. Run crisis exercises, map controls to standards, generate board-ready reports. Multi-tenant SaaS, ready to deploy.

## Quick Start

```bash
pnpm install
pnpm --filter api dev      # API at http://localhost:8787
pnpm --filter frontend dev  # UI at http://localhost:5173
```

Sign in with `admin@demo.local` (no password in demo mode).

## Security

Audited and hardened. No critical or high severity open items.

| Fix | What changed |
|-----|-------------|
| Auth bypass | Removed demo-user fallback. Unauthenticated requests get 401. |
| JWT secret | Auto-generated 32-byte random secret. No hardcoded default. |
| CORS | Origin validation rejects unknown hosts. |
| CSP + HSTS | Headers set on every response. |
| WebSocket auth | JWT token validated on connection. |
| 401 auto-logout | Frontend clears session when token expires. |

Full report: `docs/SECURITY_AUDIT_REPORT.md`

## What's Inside

- 15 workspace views: Command, Tabletop, Scenarios, Threat AI, Training, Standards, Reports, Admin, and more
- Adaptive AI threat injects (RAG poisoning, model abuse, privacy incidents)
- Standards mapping: NIST CSF, ISO 27001, SOC 2, MITRE ATT&CK, MITRE ATLAS, AI RMF, ISO 42001, DORA
- After-action reports with PDF, DOCX, CSV export
- Simulation engine: advance time, log decisions, track risk state
- RBAC with 15 roles and 5 permissions
- Audit trail with search and filters
- Light/dark mode, responsive layout

## Architecture

```
apps/
  api/        Express server, domain services, seed data, PostgreSQL adapter
  frontend/   React SPA, TailwindCSS, Framer Motion, Recharts
docs/         Architecture, deployment, user and admin manuals
```

API serves the frontend in production (`SERVE_FRONTEND=true`). For separate deployment, Vercel serves the frontend while the API runs on Render or Railway.

## Deploy

**Render** (simplest, free tier):
1. Connect `github.com/iamprbkr/ResilienceOS` to Render
2. Auto-detects `render.yaml` — click Apply
3. Set `JWT_SECRET` in Render dashboard

**Vercel + Render** (separated):
- Frontend: import repo into Vercel, build command `cd apps/frontend && npm install && npm run build`, output `apps/frontend/dist`
- API: create Web Service on Render, select Docker, point at root Dockerfile
- Set `VITE_API_BASE_URL` to your Render URL

## Environment

Key variables documented in `.env.example` and `.env.production.example`:

| Variable | Required for |
|----------|-------------|
| `JWT_SECRET` | Token signing (auto-gen if absent) |
| `DATABASE_URL` | PostgreSQL connection |
| `WEB_ORIGIN` | CORS allowlist |
| `REPOSITORY_DRIVER` | `memory` or `postgres` |

## CI/CD

GitHub Actions workflow at `.github/workflows/ci.yml`. Builds both workspaces, runs self-test, audits dependencies, starts production preview, runs smoke test. Requires pnpm.

## Docs

- `docs/USER_GUIDE.md` — Role-based platform guide
- `docs/ADMIN_MANUAL.md` — Admin console, users, tenants
- `docs/DEPLOYMENT_READY.md` — Production checklist
- `docs/API.md` — Endpoint reference
- `docs/SECURITY_AUDIT_REPORT.md` — Full audit findings and fixes
- `docs/V2.0_ROADMAP.md` — Planned improvements

## License

See LICENSE file.
