create table if not exists tenants (
  id text primary key,
  name text not null,
  sector text not null,
  region text not null,
  plan text not null,
  created_at timestamptz not null default now()
);

create table if not exists scenarios (
  id text primary key,
  tenant_id text not null references tenants(id) on delete cascade,
  title text not null,
  module text not null,
  difficulty text not null,
  duration_minutes integer not null,
  threat_actors jsonb not null default '[]',
  standards jsonb not null default '[]',
  roles jsonb not null default '[]',
  status text not null,
  resilience_score integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists users (
  id text primary key,
  tenant_id text not null references tenants(id) on delete cascade,
  name text not null,
  email text not null,
  role text not null,
  status text not null,
  unique (tenant_id, email)
);

create table if not exists notifications (
  id text primary key,
  tenant_id text not null references tenants(id) on delete cascade,
  title text not null,
  detail text not null,
  severity text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists injects (
  id text primary key,
  scenario_id text not null references scenarios(id) on delete cascade,
  minute integer not null,
  title text not null,
  channel text not null,
  severity text not null,
  decision_required boolean not null default false,
  ai_generated boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists simulation_sessions (
  id text primary key,
  tenant_id text not null references tenants(id) on delete cascade,
  scenario_id text not null references scenarios(id) on delete cascade,
  status text not null,
  current_minute integer not null default 0,
  started_at timestamptz,
  participants jsonb not null default '[]',
  risk_state jsonb not null default '{}',
  delivered_inject_ids jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create table if not exists decisions (
  id text primary key,
  session_id text not null references simulation_sessions(id) on delete cascade,
  inject_id text,
  role text not null,
  decision text not null,
  rationale text not null default '',
  response_time_seconds integer not null,
  created_at timestamptz not null default now()
);

create table if not exists audit_events (
  id text primary key,
  tenant_id text not null references tenants(id) on delete cascade,
  actor text not null,
  action text not null,
  resource text not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists scorecards (
  id text primary key,
  tenant_id text not null references tenants(id) on delete cascade,
  domain text not null,
  score integer not null,
  target integer not null,
  trend integer not null default 0
);

create table if not exists framework_mappings (
  id text primary key,
  framework text not null,
  covered integer not null,
  total integer not null,
  domain text not null
);

create table if not exists framework_nodes (
  id text primary key,
  label text not null,
  type text not null,
  domain text not null
);

create table if not exists framework_edges (
  id text primary key,
  source text not null,
  target text not null,
  relationship text not null
);

create index if not exists idx_scenarios_tenant_id on scenarios(tenant_id);
create index if not exists idx_sessions_tenant_id on simulation_sessions(tenant_id);
create index if not exists idx_injects_scenario_id on injects(scenario_id);
create index if not exists idx_decisions_session_id on decisions(session_id);
create index if not exists idx_audit_tenant_id_created_at on audit_events(tenant_id, created_at desc);

create table if not exists threat_intel (
  id text primary key,
  tenant_id text not null references tenants(id) on delete cascade,
  source text not null,
  external_id text not null,
  title text not null,
  description text not null,
  published_at timestamptz not null,
  collected_at timestamptz not null default now(),
  severity text not null default 'None',
  ttp_mappings jsonb not null default '[]',
  affected_sectors jsonb not null default '[]',
  related_frameworks jsonb not null default '[]',
  raw_data jsonb not null default '{}',
  processed boolean not null default false,
  unique (tenant_id, external_id)
);

create table if not exists threat_intel_collections (
  id text primary key,
  started_at timestamptz not null,
  completed_at timestamptz,
  source text not null,
  items_collected integer not null default 0,
  items_new integer not null default 0,
  status text not null default 'running',
  error text
);

create index if not exists idx_threat_intel_tenant_collected on threat_intel(tenant_id, collected_at desc);
