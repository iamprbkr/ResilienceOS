# User Guide

## Main URL

Local production preview:

```text
http://localhost:8790
```

## Admin URL

```text
http://localhost:8790/admin
```

On Vercel, the admin page is:

```text
https://your-vercel-app.vercel.app/admin
```

## Workspaces

- Command: live exercise command center, timeline, score, risk, audit trail.
- Live Ops: enterprise production gates, tenant operations readiness, runbooks, monitoring, plans, and onboarding status.
- Onboarding: customer launch wizard for tenant setup, users, frameworks, training, tabletop scheduling, and production checklist.
- Board: executive board portal with risk metrics, board pack sections, and report exports.
- SOC Ops: incident queue, containment actions, timeline, and evidence vault.
- Integrations: Slack/Teams, email, SIEM, ITSM, Jira, and SSO configuration readiness.
- Support: customer success tickets and advanced audit center.
- Settings: organization, security, notifications, retention, export settings, production checklist, and demo data controls.
- Tabletop: executive tabletop exercise room for CEO, board, CISO, CIO, legal, communications, privacy, and AI governance roles.
- Scenarios: reusable scenario blueprints and scenario-generation actions.
- Threat AI: AI facilitator controls and adaptive inject generation.
- Training: cybersecurity training for employees, CEO, board, managers, and technical teams with annual progress and growth matrix.
- Standards: standards coverage and mapping graph.
- Reports: after-action report generation.
- Admin: user roles, deployment state, repository mode, live session metadata.

## Core Actions

- Login: choose Admin, CEO, CISO, Board, AI Governance Officer, or Privacy Officer role.
- Advance: moves the live simulation clock and updates risk state.
- Inject: generates an AI facilitator inject with safety review.
- Decision: logs an executive or incident-response decision.
- Report: generates an after-action report summary.
- Export PDF/DOCX: downloads after-action reports from the Reports workspace.
- Scenario CRUD: create, edit status, and delete scenarios from the Scenarios workspace.
- Training tracking: review yearly completion, phishing failure rate, reporting maturity, and role-based training targets.
- Audit search/export: search audit events and export CSV from Admin.
- Board pack export: download board-ready PDF/DOCX reports from Board or Reports.
- Demo data controls: review reset and sample-tenant load controls from Settings.
- Theme: switches light and dark mode and remembers the preference.
- Notifications: opens the live notification drawer.
- Sidebar: switches workspaces on desktop.
- Mobile sidebar: tap the menu button or "Open sidebar" control to open the slide-out workspace drawer.

## Demo Users

- CISO: simulation control and reports.
- AI Governance Officer: scenario and AI control.
- Privacy Officer: privacy evidence.
- Board: reports and decision evidence.

## Executive Tabletop Module

Use the Tabletop workspace for company leadership exercises. It includes:

- CEO decision checkpoints.
- Board oversight phase.
- Legal/regulator disclosure phase.
- Public trust and communications phase.
- CIO/CISO recovery phase.
- Privacy and AI governance coordination.

## Live Updates

The app connects to `/ws` for live simulation events. The top signed-in status bar shows the WebSocket connection state.

## Notes

Memory mode works immediately for demos. PostgreSQL mode should be used for persistent production data.
