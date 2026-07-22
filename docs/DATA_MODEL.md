# Database Schema

## PostgreSQL Tables

```sql
create table tenants (
  id uuid primary key,
  name text not null,
  sector text not null,
  region text not null,
  plan text not null,
  created_at timestamptz not null default now()
);

create table users (
  id uuid primary key,
  tenant_id uuid not null references tenants(id),
  email text not null,
  name text not null,
  role text not null,
  status text not null,
  unique (tenant_id, email)
);

create table scenarios (
  id uuid primary key,
  tenant_id uuid not null references tenants(id),
  title text not null,
  module text not null,
  difficulty text not null,
  status text not null,
  duration_minutes integer not null,
  objectives jsonb not null default '[]',
  created_by uuid references users(id),
  created_at timestamptz not null default now()
);

create table simulation_sessions (
  id uuid primary key,
  tenant_id uuid not null references tenants(id),
  scenario_id uuid not null references scenarios(id),
  status text not null,
  started_at timestamptz,
  ended_at timestamptz,
  current_minute integer not null default 0,
  state jsonb not null default '{}'
);

create table injects (
  id uuid primary key,
  scenario_id uuid not null references scenarios(id),
  minute integer not null,
  title text not null,
  body text not null,
  channel text not null,
  severity text not null,
  decision_required boolean not null default false,
  ai_generated boolean not null default false
);

create table decisions (
  id uuid primary key,
  session_id uuid not null references simulation_sessions(id),
  inject_id uuid references injects(id),
  user_id uuid references users(id),
  decision text not null,
  rationale text,
  response_time_seconds integer,
  created_at timestamptz not null default now()
);

create table standards (
  id uuid primary key,
  name text not null,
  version text,
  domain text not null
);

create table scenario_standard_mappings (
  scenario_id uuid not null references scenarios(id),
  standard_id uuid not null references standards(id),
  control_ref text not null,
  coverage_status text not null,
  primary key (scenario_id, standard_id, control_ref)
);

create table scorecards (
  id uuid primary key,
  session_id uuid not null references simulation_sessions(id),
  domain text not null,
  score numeric(5,2) not null,
  target numeric(5,2) not null,
  evidence jsonb not null default '[]'
);

create table audit_events (
  id uuid primary key,
  tenant_id uuid not null references tenants(id),
  actor_id uuid references users(id),
  action text not null,
  resource_type text not null,
  resource_id text not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);
```

## Neo4j Graph

Nodes: `Technique`, `Control`, `Standard`, `Asset`, `BusinessService`, `Dependency`, `ThreatActor`, `Scenario`.

Relationships: `MITIGATES`, `MAPS_TO`, `AFFECTS`, `DEPENDS_ON`, `USES`, `EXERCISES`, `EVIDENCES`.

## Scenario Object Model

```json
{
  "title": "RAG Poisoning Triggers Clinical AI Governance Crisis",
  "module": "AI Threat Simulation",
  "roles": ["CISO", "Board", "AI Governance Officer"],
  "objectives": ["Contain poisoned retrieval source", "Preserve AI evidence", "Notify regulator"],
  "injects": [
    {
      "minute": 18,
      "channel": "SOC",
      "severity": "Critical",
      "decisionRequired": true,
      "standards": ["OWASP LLM Top 10", "NIST AI RMF"]
    }
  ],
  "branchingRules": [
    {
      "condition": "regulator_notification_delayed_gt_30m",
      "mutation": "increase_media_pressure"
    }
  ]
}
```
