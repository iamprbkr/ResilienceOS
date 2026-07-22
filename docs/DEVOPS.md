# DevOps Architecture

## Local Stack

`docker-compose.yml` starts the platform dependencies:

- PostgreSQL for tenant, scenario, decision, scorecard, report, and audit data.
- Redis for live simulation state, timers, websocket fanout, and async job queues.
- Neo4j for ATT&CK, ATLAS, D3FEND, control, asset, and standards relationships.
- Qdrant as the local vector database for scenario retrieval and AI facilitator memory.

## CI Pipeline

Recommended stages:

1. Install with lockfile: `npm ci`
2. Typecheck: `npm run typecheck`
3. Lint: `npm run lint`
4. Unit and API contract tests
5. Frontend build: `npm --workspace apps/frontend run build`
6. Backend build: `npm --workspace apps/api run build`
7. Container build and scan
8. SBOM generation
9. IaC policy checks
10. Deploy to staging

## CD Pipeline

- Preview environments for feature branches.
- Staging with production-like managed dependencies.
- Canary production rollout by tenant segment.
- Automated rollback on error budget burn, failed health checks, or websocket session instability.

## Observability

- OpenTelemetry traces across frontend, API, AI orchestration, workers, Redis, PostgreSQL, Neo4j, and vector store.
- SLOs: API latency, live inject delivery latency, report generation completion, websocket reconnect rate, AI generation failure rate.
- Audit metrics: privileged admin actions, report exports, AI-generated artifacts, failed auth, tenant boundary denials.

## Production Readiness Gates

- Tenant isolation integration tests.
- RBAC matrix tests for every route.
- AI prompt and output logging with sensitive-data redaction.
- Backups and restore drill for PostgreSQL and Neo4j.
- Disaster recovery test for active simulation recovery.
- Security review for generated phishing/media/regulatory content.
- Performance test with 1,000 concurrent participants and 100 active simulations.

## Data Retention

- Audit logs: 7 years for regulated tenants.
- Simulation event telemetry: 24 months by default.
- AI prompts and outputs: configurable retention with customer opt-out for Sovereign plan.
- Evidence packs and reports: customer-defined legal hold policies.
