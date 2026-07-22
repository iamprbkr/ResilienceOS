insert into tenants (id, name, sector, region, plan)
values ('ten-sovereign-health', 'Sovereign Health Network', 'Healthcare', 'APAC', 'Sovereign')
on conflict (id) do nothing;

insert into users (id, tenant_id, name, email, role, status)
values
('usr-admin','ten-sovereign-health','Platform Admin','admin@demo.local','Admin','Active'),
('usr-ceo','ten-sovereign-health','Asha Menon','ceo@demo.local','CEO','Active'),
('usr-ciso','ten-sovereign-health','Maya Rao','ciso@demo.local','CISO','Active'),
('usr-board','ten-sovereign-health','Executive Committee','board@demo.local','Board','Active')
on conflict (tenant_id, email) do nothing;

insert into notifications (id, tenant_id, title, detail, severity, read, created_at)
values
('ntf-001','ten-sovereign-health','Regulator inject pending','Evidence response window closes in 24 minutes.','Critical',false,'2026-06-30T04:10:00.000Z'),
('ntf-002','ten-sovereign-health','CEO decision required','Approve public statement and operating posture.','Warning',false,'2026-06-30T04:18:00.000Z'),
('ntf-003','ten-sovereign-health','Tabletop module ready','Executive scenario pack is available for launch.','Info',true,'2026-06-30T04:22:00.000Z')
on conflict (id) do nothing;

insert into scenarios (
  id, tenant_id, title, module, difficulty, duration_minutes, threat_actors, standards, roles, status, resilience_score
)
values
(
  'scn-ai-rag-poisoning',
  'ten-sovereign-health',
  'RAG Poisoning Triggers Clinical AI Governance Crisis',
  'AI Threat Simulation',
  'Executive',
  120,
  '["Synthetic identity cell","Autonomous prompt-injection agent"]',
  '["MITRE ATLAS","OWASP LLM Top 10","NIST AI RMF","ISO 42001","HIPAA"]',
  '["CISO","CIO","Board","AI Governance Officer","Privacy Officer"]',
  'Live',
  78
),
(
  'scn-ransomware-cross-cloud',
  'ten-sovereign-health',
  'Cross-Cloud Ransomware and Recovery Sequencing Exercise',
  'Business Continuity',
  'Operational',
  180,
  '["Ransomware affiliate","Insider access broker"]',
  '["MITRE ATT&CK","NIST CSF 2.0","ISO 22301","DORA"]',
  '["CISO","SOC Analyst","Incident Responder","BCM Manager"]',
  'Scheduled',
  72
)
on conflict (id) do nothing;

insert into injects (id, scenario_id, minute, title, channel, severity, decision_required, ai_generated)
values
('inj-001','scn-ai-rag-poisoning',0,'Clinician reports inconsistent AI discharge guidance across two hospitals.','AI Governance','High',true,true),
('inj-002','scn-ai-rag-poisoning',18,'Threat intel flags poisoned vector documents in a third-party knowledge connector.','SOC','Critical',true,true),
('inj-003','scn-ai-rag-poisoning',41,'Regulator asks whether AI clinical recommendations were used in patient care.','Regulator','Critical',true,false),
('inj-004','scn-ai-rag-poisoning',75,'Local media publishes leaked screenshots alleging unsafe autonomous diagnosis.','Media','High',true,true)
on conflict (id) do nothing;

insert into simulation_sessions (
  id, tenant_id, scenario_id, status, current_minute, started_at, participants, risk_state, delivered_inject_ids
)
values (
  'ses-live-rag-001',
  'ten-sovereign-health',
  'scn-ai-rag-poisoning',
  'Live',
  41,
  '2026-06-30T03:15:00.000Z',
  '[{"role":"CISO","name":"Maya Rao","responseLatencySeconds":188},{"role":"AI Governance Officer","name":"Dr. Ian Cho","responseLatencySeconds":241},{"role":"Privacy Officer","name":"Leena Shah","responseLatencySeconds":312},{"role":"Board","name":"Executive Committee","responseLatencySeconds":498}]',
  '{"trustImpact":76,"operationalImpact":58,"regulatoryImpact":82,"containmentConfidence":64}',
  '["inj-001","inj-002","inj-003"]'
)
on conflict (id) do nothing;

insert into scorecards (id, tenant_id, domain, score, target, trend)
values
('score-ai-governance','ten-sovereign-health','AI Governance',74,88,6),
('score-cyber-defense','ten-sovereign-health','Cyber Defense',82,90,4),
('score-crisis-comms','ten-sovereign-health','Crisis Comms',69,84,-2),
('score-recovery','ten-sovereign-health','Recovery',77,92,8),
('score-privacy','ten-sovereign-health','Privacy',71,86,3),
('score-board','ten-sovereign-health','Board Decisions',63,80,5)
on conflict (id) do nothing;

insert into framework_mappings (id, framework, covered, total, domain)
values
('map-atlas','MITRE ATLAS',24,31,'AI Threats'),
('map-llm','OWASP LLM Top 10',9,10,'AI AppSec'),
('map-ai-rmf','NIST AI RMF',18,22,'AI Governance'),
('map-attack','MITRE ATT&CK',66,112,'Cyber'),
('map-csf','NIST CSF 2.0',33,42,'Resilience'),
('map-iso42001','ISO 42001',21,28,'AI Management'),
('map-dora','DORA',15,19,'Operational Resilience')
on conflict (id) do nothing;

insert into framework_nodes (id, label, type, domain)
values
('atlas','MITRE ATLAS','standard','AI Threats'),
('owasp-llm','OWASP LLM Top 10','standard','AI AppSec'),
('nist-ai-rmf','NIST AI RMF','standard','AI Governance'),
('rag-poisoning','RAG Poisoning','technique','AI Threats'),
('prompt-injection','Prompt Injection','technique','AI Threats'),
('vector-integrity','Vector Store Integrity Control','control','AI Governance'),
('clinical-ai','Clinical AI Decision Support','business-service','Healthcare'),
('trust-collapse','Human-AI Trust Boundary Failure','ai-risk','Operational Resilience'),
('scn-ai-rag-poisoning','RAG Poisoning Clinical Crisis','scenario','Simulation')
on conflict (id) do nothing;

insert into framework_edges (id, source, target, relationship)
values
('edge-rag-atlas','rag-poisoning','atlas','MAPS_TO'),
('edge-prompt-llm','prompt-injection','owasp-llm','MAPS_TO'),
('edge-vector-rag','vector-integrity','rag-poisoning','MITIGATES'),
('edge-clinical-trust','clinical-ai','trust-collapse','AFFECTS'),
('edge-scenario-rmf','scn-ai-rag-poisoning','nist-ai-rmf','EVIDENCES')
on conflict (id) do nothing;

insert into audit_events (id, tenant_id, actor, action, resource, created_at, metadata)
values
('aud-001','ten-sovereign-health','usr-demo','simulation.started','ses-live-rag-001','2026-06-30T03:15:00.000Z','{"scenarioId":"scn-ai-rag-poisoning"}'),
('aud-002','ten-sovereign-health','ai-facilitator','inject.generated','inj-002','2026-06-30T03:33:00.000Z','{"severity":"Critical","standard":"OWASP LLM Top 10"}')
on conflict (id) do nothing;
