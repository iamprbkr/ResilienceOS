# Real Implementation Notes

## Current Implementation Boundary

This build implements the platform as a real modular MVP with repository interfaces, an in-memory preview repository, and a PostgreSQL repository adapter. The repository boundary is intentionally narrow so Redis, Neo4j, and vector database adapters can be added without rewriting product logic.

## Backend Function Map

### Auth and RBAC

- `optionalAuth(jwtSecret)`: Reads a bearer token when present and attaches a default demo user for local MVP use.
- `can(role, permission)`: Returns whether a role can perform a permission.
- `assertPermission(role, permission)`: Throws a forbidden error when a role is not authorized.

### Repository

The active repository is selected with `REPOSITORY_DRIVER`:

- `memory`: fast local preview and self-test mode.
- `postgres`: PostgreSQL-backed scenario/session/audit/analytics persistence.

- `repository.tenants.findById`
- `repository.scenarios.listByTenant`
- `repository.scenarios.findById`
- `repository.scenarios.create`
- `repository.scenarios.update`
- `repository.injects.listByScenario`
- `repository.injects.create`
- `repository.sessions.findById`
- `repository.sessions.listByTenant`
- `repository.sessions.create`
- `repository.sessions.update`
- `repository.audit.listByTenant`
- `repository.audit.append`
- `repository.analytics.scorecards`
- `repository.analytics.mappings`
- `repository.standards.graph`

### Scenario Service

- `listScenarios(user)`: Tenant-scoped scenario listing with RBAC.
- `getScenarioForTenant(user, scenarioId)`: Safe tenant-scoped scenario lookup.
- `createScenario(user, input)`: Validates tenant boundary, infers threat actors, creates a draft scenario, and records audit.
- `inferThreatActors(module)`: Maps platform module to realistic adversary/failure profiles.

### Simulation Service

- `startSimulation(user, scenarioId)`: Creates a live session, initializes participants and risk state, marks the scenario live, records audit.
- `advanceSimulation(user, sessionId, minutes)`: Advances exercise clock, delivers due injects, updates risk state, records audit.
- `logDecision(user, sessionId, input)`: Records participant decision, improves containment confidence, records audit.
- `getSimulationSummary(user, sessionId)`: Returns session state, delivered injects, and calculated score.

### AI Orchestration Service

- `runSafetyReview(text)`: Blocks unsafe generated content patterns before creating injects.
- `generateAdaptiveInject(user, scenarioId, input)`: Generates a pressure-specific inject, runs safety review, persists inject, records audit.

### Scoring Service

- `calculateAverageResponseSeconds(decisions)`: Computes response-time KPI.
- `calculateRiskAdjustedScore(session, deliveredInjects)`: Produces a resilience score from severity, decisions, confidence, and impact.
- `calculateDomainScore(domain, score, target)`: Adds gap/status metadata to a domain score.

### Mapping Service

- `getStandardsGraph()`: Returns the standards and control relationship graph.
- `getCoverageByFramework()`: Adds coverage percentage and gap count to framework mappings.
- `findRelatedControls(nodeId)`: Traverses graph relationships around a node.

### Report Service

- `generateAfterActionReport(user, scenarioId)`: Produces executive summary, score, strengths, gaps, recommendations, mapped standards, and decision metrics.

### Audit Service

- `recordAuditEvent(user, action, resource, metadata)`: Appends tenant-scoped audit events for traceability.

## API Routes

- `GET /health`
- `POST /auth/demo-token`
- `GET /tenants/:tenantId/overview`
- `GET /tenants/:tenantId/audit-events`
- `GET /scenarios`
- `POST /scenarios`
- `GET /scenarios/:scenarioId/injects`
- `POST /simulations/:scenarioId/start`
- `GET /simulations/:sessionId`
- `POST /simulations/:sessionId/advance`
- `POST /simulations/:sessionId/decisions`
- `POST /simulations/:scenarioId/generate-inject`
- `GET /standards/graph`
- `GET /standards/coverage`
- `GET /standards/nodes/:nodeId/related`
- `GET /reports/:scenarioId/after-action`

## Frontend Integration

- `platformApi.overview`: Fetches tenant command-center data.
- `platformApi.simulation`: Fetches live simulation state.
- `platformApi.auditEvents`: Fetches audit trail.
- `platformApi.generateInject`: Calls adaptive inject generation.
- `usePlatformData`: Polls API data every 15 seconds and falls back gracefully.

## Verification

- `npm run selftest`: Exercises core backend functions.
- `npm run build`: Builds frontend and API TypeScript.
- `npm audit --omit=dev`: Checks production dependency risk.

## Next Production Step

Replace `inMemoryRepository.ts` with adapters:

- `postgresScenarioRepository`
- `postgresSessionRepository`
- `redisSimulationClockRepository`
- `neo4jStandardsRepository`
- `vectorScenarioMemoryRepository`

The service functions should remain stable while persistence changes underneath.
