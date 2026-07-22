# Implementation Phases

## Phase 0: Scaffold

Current build:

- React command center.
- Express API with modular services.
- Tenant-scoped in-memory repository.
- RBAC, auth context, validation schemas, and error handling.
- Scenario service, simulation service, AI orchestration service, scoring service, mapping service, report service, audit service.
- Seeded tenant, scenarios, injects, live session, standards graph, audit trail.
- Frontend API client and polling hook with fallback mode.
- Architecture, security, data model, API, product, DevOps, and UI documentation.
- Docker Compose dependency stack.

## Phase 1: Persisted MVP

- Add PostgreSQL ORM and migrations.
- Add authentication middleware and route-level RBAC.
- Persist scenarios, injects, sessions, decisions, scorecards, and audit events.
- Add websocket live simulation channel.
- Export after-action reports as PDF and DOCX.

## Phase 2: AI-Native Simulation

- Add vector retrieval for scenario context.
- Add AI facilitator with approval workflow.
- Add scenario mutation engine.
- Add generated media, regulator, and executive inject templates.
- Add prompt/output safety and provenance records.

## Phase 3: Standards Graph

- Import ATT&CK, ATLAS, D3FEND, OWASP, NIST, ISO, DORA, GDPR, DPDP, CSA mappings.
- Store graph relationships in Neo4j.
- Add coverage scoring and evidence trails.
- Add ATT&CK Navigator-style matrix.

## Phase 4: Enterprise SaaS

- SSO/SAML/OIDC.
- Tenant billing, usage metering, limits, and entitlement checks.
- Private model endpoints.
- Customer-managed keys.
- SIEM, GRC, ITSM, and cloud provider integrations.

## Phase 5: Government/Sovereign

- Region-pinned deployments.
- Offline exercise packs.
- Isolated model gateway.
- Advanced legal hold and evidence chain of custody.
- Sector-specific resilience benchmarks.
