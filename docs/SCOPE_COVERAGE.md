# Scope Coverage

This file maps the requested enterprise MVP scope to the implemented product areas, API support, and deployment artifacts.

## Implemented Application Scope

| Requested capability | Status | Where to use it |
| --- | --- | --- |
| Polished website home page before login | Implemented | `/` public landing page with product modules, enterprise outcomes, and connected sign-in |
| Larger enterprise website for product sales | Implemented | Public homepage includes buyer personas, workflow, training, standards, deployment, and launch-package sections |
| Website footer and public theme controls | Implemented | Public homepage includes footer navigation, CTA links, mobile section navigation, and light/dark theme toggle |
| White website theme by default | Implemented | Public homepage opens in light mode first; visitors can switch to dark mode with the theme button |
| Working manuals and docs from footer | Implemented | Footer and manuals section link to live `/docs` routes for user guide, admin manual, API docs, deployment guides, scope coverage, and final test report |
| Real login screen with admin/user roles | Implemented | Landing page role selector, `/auth/login`, local session storage |
| Responsive sidebar and mobile navigation | Implemented | Authenticated app shell, mobile drawer, desktop sidebar |
| Light and dark mode | Implemented | Header theme toggle, persisted in browser storage |
| Notification center backed by API | Implemented | Header notification drawer, `/notifications`, mark-read endpoint |
| Create, edit, delete scenario UI | Implemented | `Scenarios` workspace and `/scenarios` API |
| WebSocket live simulation updates | Implemented | `/ws` backend broadcast and frontend live status updates |
| Executive tabletop facilitator mode | Implemented | `Tabletop` workspace with phases, CEO injects, decisions, and executive role cards |
| Main module for CEOs and company executives | Implemented | Executive Tabletop module and home page enterprise positioning |
| Cybersecurity training for employees, CEO, and executives | Implemented | `Training` workspace with audience tracks for all employees, CEO, board, managers, and technical teams |
| Yearly training tracking and growth matrix | Implemented | `Training` workspace annual metrics, phishing trend, reporting maturity, and capability growth matrix |
| Full ATT&CK/ATLAS matrix view | Implemented | `Standards` workspace matrix and standards graph endpoints |
| PDF after-action report export | Implemented | `Reports` workspace and `/reports/:scenarioId/export.pdf` |
| DOCX after-action report export | Implemented | `Reports` workspace and `/reports/:scenarioId/export.docx` |
| Persistent PostgreSQL user management | Implemented | Repository adapter, migrations, seed data, `/users` endpoints |
| Multi-tenant admin dashboard | Implemented | `Admin` workspace, tenant overview, users, integrations, audit activity |
| Enterprise post-login dashboard hardening | Implemented | Command dashboard includes security posture, launch hardening queue, audit evidence, and executive readiness signals |
| Enterprise Live Ops portal | Implemented | Authenticated `Live Ops` workspace includes production gates, tenant readiness, runbooks, readiness/security/production API links |
| Eight enterprise buildout areas | Implemented | Live Ops includes production database, auth, tenant management, hosting, monitoring, security, data workflows, and commercial polish modules |
| Enterprise operational APIs | Implemented | `/enterprise/status`, `/monitoring/status`, `/billing/plans`, and `/integrations/status` expose deployment, monitoring, plan, and integration readiness |
| Settings workspace | Implemented | Organization, branding, security, notification, retention, exports, production checklist, and demo data controls |
| Onboarding wizard | Implemented | Tenant creation, user invites, framework selection, training assignment, tabletop scheduling, and production checklist |
| Executive board portal | Implemented | Board metrics, executive outcomes, board pack sections, PDF/DOCX export links |
| SOC/security operations view | Implemented | Incident queue, active response SLAs, timeline, and evidence vault |
| Integration config UI | Implemented | Slack/Teams, email, Sentinel, ServiceNow, Jira, and SSO readiness cards with test connection controls |
| Support and customer success center | Implemented | Support tickets, onboarding support, advanced audit filters, and audit CSV export |
| Board pack and demo data APIs | Implemented | `/board/pack`, `/support/tickets`, and `/demo-data/:profile/load` endpoints |
| SSO configuration screen/API | Implemented | Settings, Integrations, and Onboarding link to `/sso/config` with OIDC/SAML/MFA policy readiness |
| Tenant creation workflow/API | Implemented | Onboarding includes tenant provisioning and `/tenants/provision` schema/create endpoints |
| Real user invite flow/API | Implemented | Onboarding includes `/invites` list/create endpoints for pending/accepted invitations |
| Monitoring dashboard APIs | Implemented | Live Ops links to `/monitoring/status` and `/monitoring/metrics` for uptime, errors, WebSocket, and exports |
| Report template builder API | Implemented | Board portal links to `/reports/templates/board-pack` and board pack exports |
| Training assignment manager API | Implemented | Training workspace links to `/training/assignments` for due dates, overdue users, and certificates |
| Scenario marketplace API | Implemented | Scenarios workspace links to `/marketplace/scenarios` for Healthcare, Finance, SaaS, AI Governance, and Ransomware packs |
| Evidence detail API | Implemented | SOC Ops links to `/evidence/:artifactId` for owner, custody, status, regulator-ready index |
| GitHub Actions CI/CD | Implemented | `.github/workflows/ci.yml` runs install, build, selftest, audit, production preview, and smoke tests |
| Deployment assistant API | Implemented | Live Ops and Settings link to `/deployment/assistant` with env checks, commands, and platform steps |
| Admin security control center | Implemented | Admin workspace includes security controls, compliance readiness, audit export, and `/security/status` link |
| API security hardening | Implemented | Helmet headers, explicit security headers, rate limiting, 1mb request body limit, docs allowlist, security status endpoint, and production status endpoint |
| Audit log filters/search/export | Implemented | `Admin` workspace search and `/audit-events/export.csv` |
| Vercel frontend deployment guide | Implemented | `docs/VERCEL_DEPLOYMENT.md`, `vercel.json` |
| Render/Railway backend deployment guide | Implemented | `docs/DEPLOYMENT_READY.md`, `render.yaml`, `railway.json` |
| GitHub readiness | Implemented | `.gitignore`, README, manuals, deployment docs |
| Enterprise packaging and $25k positioning | Implemented | Home page, `docs/ENTERPRISE_PRODUCT_PACKAGE.md`, `docs/PRODUCT_STRATEGY.md` |

## Quality Gates

Run these commands before every GitHub push or production deployment:

```bash
npm run build
npm run selftest
npm audit --omit=dev
$env:SERVE_FRONTEND="true"; $env:REPOSITORY_DRIVER="memory"; npm start
```

In another terminal after the server starts:

```bash
$env:SMOKE_BASE_URL="http://localhost:8791"
npm run smoke
```

## Production Notes

- Use `REPOSITORY_DRIVER=postgres` and set `DATABASE_URL` for persistent production data.
- Use managed PostgreSQL on Render, Railway, Neon, Supabase, or another managed provider.
- Use HTTPS-only deployment for live users.
- Replace demo authentication with enterprise SSO or password-backed auth before selling to regulated customers.
- Keep PDF, DOCX, CSV, audit, scenario, and notification tests in the release checklist.
