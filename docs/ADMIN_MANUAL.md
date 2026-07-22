# Admin Manual

## Admin Entry

Use `/admin` to open the Admin workspace.

Admin view includes:

- API connection state.
- Scenario count.
- Admin URL signal.
- User-role table.
- Repository mode.
- Current live session ID.
- Audit search.
- Audit CSV export.
- Persistent user schema in PostgreSQL migrations.

## Enterprise Live Ops

Use the `Live Ops` workspace after login to review production gates, tenant operations readiness, monitoring signals, enterprise runbooks, subscription plans, and customer onboarding status.

Live operational API links:

- `/ready`
- `/security/status`
- `/production/status`
- `/enterprise/status`
- `/monitoring/status`
- `/billing/plans`
- `/integrations/status`

Before public production, complete the required blockers shown in Live Ops:

- Configure managed PostgreSQL with `REPOSITORY_DRIVER=postgres` and `DATABASE_URL`.
- Set a strong production `JWT_SECRET`.
- Connect enterprise SSO or password-backed authentication with MFA.
- Enable HTTPS, WAF, external rate limits, logging, monitoring, and alert routing.
- Run an external security review before regulated enterprise rollout.

## Current RBAC Roles

- CISO
- CIO
- Board
- SOC Analyst
- Risk Manager
- Compliance Officer
- Incident Responder
- Privacy Officer
- BCM Manager
- AI Governance Officer

## Current Permission Groups

- `scenario:read`
- `scenario:write`
- `simulation:control`
- `decision:write`
- `report:read`

## Production Hardening Required Before Public Enterprise Launch

- Replace demo auth fallback with mandatory SSO/OIDC.
- Add user-management persistence tables.
- Add invite flow and role assignment UI.
- Add passwordless/SSO login screen.
- Add tenant admin-only guards on Admin workspace.
- Use PostgreSQL mode instead of memory mode.
