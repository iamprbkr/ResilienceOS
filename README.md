# ResilienceOS

**Open-source cyber, AI governance, and operational resilience simulation platform.**  
Run adaptive tabletop exercises. Map controls to any framework. Generate board-ready evidence in one click.

[![Build](https://github.com/iamprbkr/ResilienceOS/actions/workflows/ci.yml/badge.svg)](https://github.com/iamprbkr/ResilienceOS/actions/workflows/ci.yml)
[![Security Audit](https://img.shields.io/badge/security-audited-brightgreen)](docs/SECURITY_AUDIT_REPORT.md)
[![License](https://img.shields.io/badge/license-NeevNaav-blue)](LICENSE)

---

## Why This Exists

Cyber and AI governance is measured in binders and slide decks. Annual tabletops cost $25k-$75k per exercise. GRC platforms track controls but never test them. AI regulations (EU AI Act, DORA, ISO 42001) demand new evidence organizations cannot produce.

ResilienceOS replaces the annual cycle with continuous, measured readiness. One platform for tabletop exercises, simulation, standards mapping, and evidence export. Free to self-host. Ready to deploy.

---

## What It Does

**Dynamic tabletop exercises.** Injects adapt to decisions made during the exercise. Choose to contain a breach instead of paying ransom? The next inject tests your containment procedures. No two runs are the same. Every run produces a score that tracks over time.

**Sector-specific scenarios.** Healthcare, financial services, energy, government, technology, insurance, retail, manufacturing. Each sector has pre-built exercises mapped to its regulations.

**Threat and risk specific exercises.** Ransomware, AI model poisoning, nation-state intrusion, insider threat, supply chain compromise, cloud breach, fraud, privacy incidents. Pick the risk keeping you up at night. Run an exercise that tests your response.

**GRC evidence factory.** Every exercise maps to NIST CSF, ISO 27001, SOC 2, MITRE ATT&CK, MITRE ATLAS, AI RMF, ISO 42001, DORA. After-action reports export as PDF, DOCX, or CSV. Auditor-ready evidence from live simulation, not self-assessment.

**15 workspace views.** Command center, tabletop, scenarios, threat AI, training, standards mapping, reports, admin, and more. Light and dark mode. Responsive layout.

---

## Quick Start

```bash
pnpm install
pnpm --filter api dev       # API at http://localhost:8787
pnpm --filter frontend dev   # UI at http://localhost:5173
```

Open the UI. Sign in with `admin@demo.local` (no password in demo mode). Run your first exercise in under a minute.

---

## Security

Audited and hardened. Seven critical and high-severity findings fixed. Zero known vulnerabilities in production dependencies.

Critical fixes applied:
- Auth bypass eliminated — unauthenticated requests get 401
- JWT secret auto-generated — no hardcoded default
- CORS origin validation — unknown origins rejected
- CSP and HSTS headers set on every response
- WebSocket connections require valid JWT token

Full audit report: `docs/SECURITY_AUDIT_REPORT.md`

---

## Who It Serves

| Buyer | Problem | ResilienceOS |
|-------|---------|-------------|
| CISO | Cannot prove readiness improves year over year | Readiness score that trends over time. Unlimited exercises. |
| GRC Manager | Auditors want evidence, but we only have control registers | After-action reports mapped to frameworks. Export in one click. |
| Board Member | Need to fulfill fiduciary duty for cyber/AI oversight | Single resilience score. Gap analysis. Trend data for quarterly reporting. |
| AI Governance Lead | No tool exists for AI RMF or ISO 42001 testing | AI-specific scenarios. Model poisoning, RAG attacks, bias incidents. |
| Head of Third-Party Risk | Cannot verify vendor incident response without a real breach | Third-party scenarios test vendor controls without real incidents. |

---

## Competitive Cost Comparison

| | Traditional | ResilienceOS |
|---|------------|-------------|
| Annual tabletops | $25k-$75k per exercise | Included (unlimited) |
| GRC platform license | $50k-$200k/year | Free (self-host) |
| AI governance tool | $30k-$100k/year | Included |
| Board report prep | 2-4 weeks | One click |

For a 500-person organization: $150k-$400k/year traditional vs **$0-$24k/year** with ResilienceOS.

---

## Roadmap

| Version | Focus |
|---------|-------|
| **V1.0** (live) | Working platform. 15 workspaces. 8 frameworks. Security audited. |
| **V2.0** | Sector-specific packs. Scenario marketplace. Content admin panel. |
| **V2.1** | SSO. Password hashing or IdP integration. Redis-backed rate limiting. |
| **V2.2** | AI-assisted scenario authoring. Cross-tenant analytics. API marketplace. |

Full roadmap: `docs/V2.0_ROADMAP.md`  
Product-market fit analysis: `docs/PRODUCT_MARKET_FIT.md`

---

## Deploy

**Render** (free tier, Docker, one service):  
Connect repo, auto-detects `render.yaml`, click deploy.

**Vercel + Render** (separated frontend + API):  
Frontend on Vercel (Vite, output `apps/frontend/dist`).  
API on Render (Docker, root `Dockerfile`).

**Self-host:**  
```bash
pnpm build
PORT=8787 SERVE_FRONTEND=true pnpm start
```

---

## Architecture

```
apps/
  api/        Express server, domain services, seed data, PostgreSQL
  frontend/   React SPA, TailwindCSS, Framer Motion, Recharts
docs/         Architecture, deployment, user and admin manuals
docker-compose.yml  Postgres, Redis, Neo4j, Qdrant for local dev
.github/workflows/ci.yml  pnpm-based CI pipeline
```

---

## Revenue Model

Open-source core. Paid tiers for cloud hosting, premium scenario packs, and enterprise features.

| Tier | Price | Includes |
|------|-------|----------|
| Community | Free | Self-host. Unlimited exercises. 8 frameworks. 15 workspaces. |
| Team | $199/mo | Cloud. 50 users. Sector packs. Email support. |
| Business | $999/mo | Cloud. 500 users. All packs. SSO. Priority support. |
| Enterprise | Custom | Dedicated. Unlimited. Custom scenarios. Professional services. |

Also: scenario marketplace ($499/pack), professional services ($2.5k/scenario), white-label licensing ($25k/year).

---

## Documentation

- `docs/USER_GUIDE.md` — Platform walkthrough
- `docs/ADMIN_MANUAL.md` — Admin console, users, tenants
- `docs/DEPLOYMENT_READY.md` — Production deployment checklist
- `docs/API.md` — Full API reference
- `docs/SECURITY_AUDIT_REPORT.md` — Audit findings and remediation
- `docs/PRODUCT_MARKET_FIT.md` — Competitive positioning and revenue models

---

*Built for organizations that need to prove readiness, not just check boxes.*
