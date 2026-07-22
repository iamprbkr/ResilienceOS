# AI-Native Cyber Resilience & Governance Simulation Platform

Production-ready MVP for an enterprise SaaS platform that runs cyber, AI governance, crisis, GRC, privacy, and operational resilience simulations.

## What Is Included

- React, TypeScript, TailwindCSS, Framer Motion, Recharts frontend
- Node.js, Express, TypeScript backend API
- Tenant-aware data model examples
- Scenario, inject, live session, scoring, standards mapping, audit, and report endpoints
- PostgreSQL repository adapter with migrations and seed data
- Functional sidebar workspaces: Command, Tabletop, Scenarios, Threat AI, Training, Standards, Reports, Admin
- Working notifications, light/dark mode, and responsive navigation
- Enterprise KPI strip, Evidence Vault, integrations, and $25k launch-tier positioning
- Admin URL at `/admin`
- Root Dockerfile, Render config, Railway config, Vercel frontend config
- Docker Compose dependencies for PostgreSQL, Redis, Neo4j, and Qdrant
- Product, architecture, security, database, API, deployment, and roadmap documentation

## Run Locally

```bash
npm install
npm run dev
```

Frontend: `http://localhost:5173`

API: `http://localhost:8787`

## Run Production Preview

```bash
npm install
npm run build
$env:PORT="8790"
$env:SERVE_FRONTEND="true"
$env:REPOSITORY_DRIVER="memory"
npm start
```

App: `http://localhost:8790`

Admin: `http://localhost:8790/admin`

Local infrastructure:

```bash
docker compose up -d
npm run db:migrate
```

## Workspace

```text
apps/
  api/        Express API, domain models, seed data
  frontend/   Enterprise command center UI
docs/         Architecture and startup deliverables
```

## MVP Scope

The MVP includes a polished command-center experience, scenario library, simulation timeline, AI threat injects, cybersecurity training tracking, standards coverage, resilience analytics, executive decision intelligence, after-action report generation, admin controls, and deployment-ready configuration.

## Key Manuals

- `docs/USER_GUIDE.md`
- `docs/ADMIN_MANUAL.md`
- `docs/GITHUB_SETUP.md`
- `docs/VERCEL_DEPLOYMENT.md`
- `docs/DEPLOYMENT_READY.md`
- `docs/TESTING_CHECKLIST.md`
- `docs/FINAL_READINESS.md`
- `docs/SCOPE_COVERAGE.md`
- `docs/ENTERPRISE_PRODUCT_PACKAGE.md`
- `docs/SUCCESS_RUNBOOK.md`
