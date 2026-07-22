# Security Model

## Trust Boundaries

- Browser to API: authenticated, rate-limited, CSRF-aware for cookie deployments.
- API to data stores: service identity, network policies, least-privilege credentials.
- API to AI services: redaction gateway, policy filters, provenance logging.
- Tenant to tenant: hard authorization boundary enforced in application and database policy.

## Controls

- HTTP security headers through Helmet plus explicit no-sniff, frame deny, referrer policy, and permissions policy.
- Per-route in-memory API rate limiting for demo and preview deployments.
- JSON request body limit set to 1mb.
- Strict public documentation allowlist for `/docs` routes.
- `/security/status` endpoint for runtime security posture, production warnings, and required launch actions.
- `/production/status` endpoint for live portal deployment gates, blockers, and next actions.
- JWT and OIDC/SAML SSO.
- RBAC and future ABAC for sector, region, classification, exercise role, and data sensitivity.
- Per-tenant encryption keys for Sovereign plan.
- Immutable audit events for all sensitive actions.
- AI safety review for generated phishing, media, deepfake, and regulatory content.
- Secrets from managed secret store; no secrets in images or source.

## Implemented Security Surfaces

- Command dashboard includes an Enterprise Security Posture panel and Launch Hardening Queue.
- Admin dashboard includes Security Control Center, Compliance Readiness, and direct Security API access.
- Live Ops dashboard includes production gates, tenant operations readiness, enterprise runbooks, and readiness/security/production API links.
- Readiness endpoint reports repository mode, frontend serving, WebSocket, exports, and auth configuration.
- Production deployment checklist requires `JWT_SECRET`, `REPOSITORY_DRIVER=postgres`, `DATABASE_URL`, TLS, WAF, and enterprise SSO before regulated customer rollout.

## Threat Model Highlights

- Prompt injection against AI facilitator: mitigated through retrieval isolation, tool allowlists, system prompt hardening, and output review.
- Tenant data crossover: mitigated through tenant-scoped queries, integration tests, row-level security, and vector namespace isolation.
- Malicious exercise content: mitigated through approval workflow, content classification, and restricted export controls.
- Executive impersonation: mitigated through strong identity controls, decision attestation, and signed exercise artifacts.

## Audit Events

Minimum audit coverage:

- Login, logout, token refresh, failed auth.
- Scenario creation, deletion, publication, and mutation.
- Inject generation, approval, delivery, and cancellation.
- Participant decisions and facilitator overrides.
- Report generation, export, and sharing.
- Standards mapping changes.
- Admin, billing, key, and integration changes.
