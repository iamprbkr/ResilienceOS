# Testing Checklist

## Automated Checks

Run:

```bash
npm run build
npm run selftest
npm audit --omit=dev
```

Expected:

- Build succeeds.
- API self-test prints `API self-test passed`.
- Production audit reports `0 vulnerabilities`.

## Production Smoke Test

Start:

```bash
$env:PORT="8790"
$env:SERVE_FRONTEND="true"
$env:REPOSITORY_DRIVER="memory"
npm start
```

Open:

```text
http://localhost:8790
http://localhost:8790/admin
```

Check:

- Sidebar switches all views.
- Command view loads connected API mode.
- Advance button updates simulation state.
- Inject button generates an inject.
- Decision button logs a decision.
- Report button returns a report summary.
- Admin view shows user control and repository state.

## Enterprise Workspace Checklist

After login, verify these sidebar workspaces load:

- Command
- Live Ops
- Onboarding
- Board
- SOC Ops
- Integrations
- Support
- Settings
- Tabletop
- Scenarios
- Threat AI
- Training
- Standards
- Reports
- Admin

Feature checks:

- Settings shows organization, branding, security, notification, retention, export, production checklist, and demo data controls.
- Onboarding shows tenant setup, users, frameworks, training, tabletop scheduling, and production checklist.
- Board shows executive metrics and PDF/DOCX board pack export links.
- SOC Ops shows incident queue, response SLAs, timeline, and evidence vault.
- Integrations shows Slack/Teams, email, SIEM, ITSM, Jira, and SSO configuration cards.
- Support shows tickets, advanced audit filters, and audit CSV export.
- Live Ops shows production gates, tenant operations readiness, monitoring signals, subscription plans, and runbooks.

## API Smoke Tests

- `GET /health`
- `GET /ready`
- `GET /security/status`
- `GET /production/status`
- `GET /enterprise/status`
- `GET /monitoring/status`
- `GET /billing/plans`
- `GET /integrations/status`
- `GET /support/tickets`
- `GET /board/pack`
- `POST /demo-data/healthcare/load`
- `GET /sso/config`
- `GET /tenants/provision`
- `GET /invites`
- `GET /monitoring/metrics`
- `GET /reports/templates/board-pack`
- `GET /training/assignments`
- `GET /marketplace/scenarios`
- `GET /evidence/vector-store-export`
- `GET /deployment/assistant`
- `GET /docs`
- `GET /docs/USER_GUIDE.md`
- `GET /docs/ADMIN_MANUAL.md`
- `GET /docs/API.md`
- `GET /tenants/ten-sovereign-health/overview`
- `GET /simulations/ses-live-rag-001`
- `POST /simulations/ses-live-rag-001/advance`
- `POST /simulations/scn-ai-rag-poisoning/generate-inject`
- `POST /simulations/ses-live-rag-001/decisions`
- `GET /reports/scn-ai-rag-poisoning/after-action`

## Security Header Checks

Verify:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: no-referrer`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
