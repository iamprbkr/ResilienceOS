# PostgreSQL Implementation

## What Changed

The platform now has a real persistence adapter boundary:

- `PlatformRepository` defines the data-access contract.
- `inMemoryRepository` implements the contract for fast local preview.
- `postgresRepository` implements the same contract using `pg`.
- `REPOSITORY_DRIVER=postgres` switches the API to PostgreSQL.
- SQL migrations live in `apps/api/migrations`.

## Run With PostgreSQL

```bash
docker compose up -d postgres
copy .env.example .env
```

Set:

```env
REPOSITORY_DRIVER=postgres
DATABASE_URL=postgresql://resilience:resilience@localhost:5432/resilience
```

Apply schema and seed data:

```bash
npm run db:migrate
```

Start the app:

```bash
npm run dev
```

## Implemented Tables

- `tenants`
- `scenarios`
- `injects`
- `simulation_sessions`
- `decisions`
- `audit_events`
- `scorecards`
- `framework_mappings`
- `framework_nodes`
- `framework_edges`

## Repository Contract

The application services call:

- `repository.tenants.findById`
- `repository.scenarios.*`
- `repository.injects.*`
- `repository.sessions.*`
- `repository.audit.*`
- `repository.analytics.*`
- `repository.standards.graph`

That means product logic is not coupled to PostgreSQL. Neo4j, Redis, and vector storage can be added behind the same service boundaries.

## Current Persistence Scope

PostgreSQL currently persists:

- tenants
- scenarios
- injects
- live simulation sessions
- delivered inject IDs
- participant decision records
- audit events
- scorecards
- framework coverage
- framework graph nodes and edges

Redis remains the next step for high-frequency live simulation timers and websocket fanout. Neo4j remains the next step for deep graph traversal beyond the current SQL graph tables.
