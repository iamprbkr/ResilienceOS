export const scorecards = [
  { domain: "AI Governance", score: 74, target: 88, trend: 6 },
  { domain: "Cyber Defense", score: 82, target: 90, trend: 4 },
  { domain: "Crisis Comms", score: 69, target: 84, trend: -2 },
  { domain: "Recovery", score: 77, target: 92, trend: 8 },
  { domain: "Privacy", score: 71, target: 86, trend: 3 },
  { domain: "Board Decisions", score: 63, target: 80, trend: 5 }
];

export const timeline = [
  { minute: "00", label: "Clinical AI anomaly", lane: "AI Governance", severity: "High" },
  { minute: "18", label: "Poisoned vector documents found", lane: "SOC", severity: "Critical" },
  { minute: "41", label: "Regulator evidence request", lane: "Regulator", severity: "Critical" },
  { minute: "75", label: "Media leak and trust shock", lane: "Media", severity: "High" },
  { minute: "96", label: "Board decision checkpoint", lane: "Executive", severity: "Medium" }
];

export const coverage = [
  { framework: "ATLAS", covered: 24, total: 31 },
  { framework: "LLM Top 10", covered: 9, total: 10 },
  { framework: "AI RMF", covered: 18, total: 22 },
  { framework: "ATT&CK", covered: 66, total: 112 },
  { framework: "CSF 2.0", covered: 33, total: 42 },
  { framework: "ISO 42001", covered: 21, total: 28 },
  { framework: "DORA", covered: 15, total: 19 }
];

export const decisions = [
  "Suspend affected RAG connector and preserve vector evidence",
  "Notify regulator with preliminary AI-impact assessment",
  "Activate executive misinformation response cell",
  "Trigger clinical fallback workflow and model-risk review",
  "CEO approval for customer, investor, and regulator statement"
];

export const modules = [
  "Executive Tabletop Exercise",
  "Simulation Engine",
  "AI Threat Simulation",
  "Cyber Resilience",
  "Cybersecurity Training",
  "GRC & Compliance",
  "Business Continuity",
  "Crisis Management",
  "Data Protection",
  "Analytics"
];

export const trainingPrograms = [
  {
    audience: "All Employees",
    track: "Cyber Hygiene & Phishing Defense",
    owner: "Security Awareness",
    enrolled: 1240,
    completed: 1086,
    completion: 88,
    target: 95,
    cadence: "Annual + quarterly refreshers",
    modules: ["Phishing", "Passwordless MFA", "Data handling", "Incident reporting"]
  },
  {
    audience: "CEO & Executive Committee",
    track: "Cyber Crisis Leadership",
    owner: "CISO Office",
    enrolled: 12,
    completed: 10,
    completion: 83,
    target: 100,
    cadence: "Twice per year",
    modules: ["Board disclosure", "Regulator response", "Public trust", "Ransom decisioning"]
  },
  {
    audience: "Board Members",
    track: "Cyber Oversight & AI Governance",
    owner: "General Counsel",
    enrolled: 9,
    completed: 8,
    completion: 89,
    target: 100,
    cadence: "Annual tabletop",
    modules: ["Fiduciary oversight", "AI risk", "Audit evidence", "Risk acceptance"]
  },
  {
    audience: "Managers",
    track: "Operational Resilience Leadership",
    owner: "Business Continuity",
    enrolled: 180,
    completed: 141,
    completion: 78,
    target: 92,
    cadence: "Annual",
    modules: ["Team continuity", "Escalation", "Vendor outage", "Recovery communications"]
  },
  {
    audience: "Technical Teams",
    track: "Secure Engineering & Incident Response",
    owner: "Security Engineering",
    enrolled: 260,
    completed: 221,
    completion: 85,
    target: 94,
    cadence: "Semiannual labs",
    modules: ["Secure SDLC", "Cloud defense", "Threat modeling", "Evidence preservation"]
  }
];

export const trainingYearlyTracking = [
  { year: "2023", completion: 61, phishingFailRate: 18, incidentReporting: 42, executiveReadiness: 54 },
  { year: "2024", completion: 74, phishingFailRate: 12, incidentReporting: 58, executiveReadiness: 68 },
  { year: "2025", completion: 84, phishingFailRate: 7, incidentReporting: 73, executiveReadiness: 81 },
  { year: "2026", completion: 89, phishingFailRate: 4, incidentReporting: 86, executiveReadiness: 92 }
];

export const trainingGrowthMatrix = [
  { capability: "Awareness", current: "Managed", next: "Optimized", growth: 18, evidence: "Annual completion, phishing simulations, policy attestations" },
  { capability: "Executive Readiness", current: "Practiced", next: "Board assured", growth: 24, evidence: "CEO tabletop decisions, disclosure drills, regulator evidence" },
  { capability: "Incident Reporting", current: "Measured", next: "Automated", growth: 31, evidence: "Report latency, escalation quality, notification routing" },
  { capability: "Secure Engineering", current: "Defined", next: "Embedded", growth: 22, evidence: "Secure SDLC labs, threat model reviews, cloud control drills" },
  { capability: "Recovery Behavior", current: "Repeatable", next: "Resilient", growth: 27, evidence: "BCP exercises, fallback rehearsals, crisis communications" }
];

export const scenarioBlueprints = [
  {
    title: "CEO and Board AI-Cyber Crisis Tabletop",
    module: "Executive Tabletop Exercise",
    roles: ["CEO", "Board Chair", "CISO", "CIO", "General Counsel", "Comms Lead", "Privacy Officer"],
    standards: ["NIST CSF 2.0", "NIST AI RMF", "ISO 27001", "ISO 42001", "DORA"],
    objective: "Exercise CEO, board, legal, cyber, communications, privacy, and AI governance decisions during a high-trust operational crisis."
  },
  {
    title: "RAG Poisoning Clinical AI Crisis",
    module: "AI Threat Simulation",
    roles: ["CISO", "Board", "AI Governance Officer", "Privacy Officer"],
    standards: ["MITRE ATLAS", "OWASP LLM Top 10", "NIST AI RMF", "ISO 42001"],
    objective: "Contain poisoned retrieval source while preserving AI evidence and clinical trust."
  },
  {
    title: "Cross-Cloud Ransomware Recovery",
    module: "Business Continuity",
    roles: ["SOC Analyst", "Incident Responder", "BCM Manager", "CIO"],
    standards: ["MITRE ATT&CK", "NIST CSF 2.0", "ISO 22301", "DORA"],
    objective: "Prioritize restoration, validate RTO/RPO, and coordinate public service continuity."
  },
  {
    title: "Deepfake Executive Fraud",
    module: "Crisis Management",
    roles: ["Board", "Risk Manager", "Compliance Officer", "CISO"],
    standards: ["ISO 27001", "GDPR", "DPDP", "WEF Digital Trust"],
    objective: "Defend trust boundaries during identity fraud, media acceleration, and investor pressure."
  }
];

export const tabletopPhases = [
  { phase: "Brief", owner: "Facilitator", decision: "Confirm crisis scope, executive roles, and rules of engagement.", minute: 0 },
  { phase: "Impact", owner: "CEO", decision: "Set operating posture and customer safety priority.", minute: 15 },
  { phase: "Disclosure", owner: "General Counsel", decision: "Approve regulator notification and evidence preservation.", minute: 35 },
  { phase: "Trust", owner: "Comms Lead", decision: "Approve public statement and misinformation response.", minute: 55 },
  { phase: "Recovery", owner: "CIO / CISO", decision: "Authorize failover, model suspension, and service restoration order.", minute: 75 },
  { phase: "Board", owner: "Board Chair", decision: "Record risk acceptance, follow-up actions, and governance changes.", minute: 95 }
];

export const executiveRoles = [
  { role: "CEO", focus: "Enterprise posture, customer trust, public accountability" },
  { role: "Board Chair", focus: "Oversight, risk acceptance, governance record" },
  { role: "CISO", focus: "Containment, evidence, cyber resilience" },
  { role: "CIO", focus: "Technology restoration and business continuity" },
  { role: "General Counsel", focus: "Disclosure, litigation, regulator strategy" },
  { role: "Comms Lead", focus: "Media, customers, investors, employee communications" },
  { role: "Privacy Officer", focus: "Data protection, breach analysis, cross-border obligations" }
];

export const liveRiskState = [
  { label: "Trust Impact", value: 76, color: "bg-ember" },
  { label: "Operational Impact", value: 58, color: "bg-iris" },
  { label: "Regulatory Impact", value: 82, color: "bg-ember" },
  { label: "Containment Confidence", value: 64, color: "bg-signal" }
];

export const graphNodes = [
  { label: "RAG Poisoning", type: "Technique", x: "left-[12%] top-[42%]" },
  { label: "Vector Integrity", type: "Control", x: "left-[42%] top-[18%]" },
  { label: "NIST AI RMF", type: "Standard", x: "right-[14%] top-[32%]" },
  { label: "Clinical AI", type: "Service", x: "left-[44%] bottom-[18%]" },
  { label: "Trust Boundary", type: "Risk", x: "right-[12%] bottom-[20%]" }
];

export const auditTrail = [
  { time: "03:15", actor: "Exercise Director", action: "simulation.started", resource: "ses-live-rag-001" },
  { time: "03:33", actor: "AI Facilitator", action: "inject.generated", resource: "inj-002" },
  { time: "03:56", actor: "Privacy Officer", action: "evidence.attested", resource: "vector-store-export" },
  { time: "04:01", actor: "Board", action: "decision.logged", resource: "regulator-notification" }
];

export const enterpriseKpis = [
  { label: "Annual contract value", value: "$25k", detail: "Launch enterprise tier" },
  { label: "Board exercises", value: "12", detail: "Per year included" },
  { label: "Compliance packs", value: "18", detail: "Framework mappings" },
  { label: "Audit retention", value: "7y", detail: "Sovereign-ready evidence" }
];

export const securityPosture = [
  { control: "API Security Headers", status: "Enabled", maturity: 92, owner: "Platform Security", evidence: "Helmet, frame deny, no-sniff, referrer and permissions policy" },
  { control: "Rate Limiting", status: "Enabled", maturity: 88, owner: "Platform Security", evidence: "Per-route request throttling with 429 protection" },
  { control: "JWT Session Controls", status: "Demo Ready", maturity: 74, owner: "Identity", evidence: "Role claims, tenant claims, production JWT secret required" },
  { control: "Data Persistence", status: "Postgres Ready", maturity: 82, owner: "Data Platform", evidence: "Repository adapter, migrations, seed data, production DATABASE_URL path" },
  { control: "Audit Evidence", status: "Enabled", maturity: 91, owner: "GRC", evidence: "Audit search, CSV export, report generation, document allowlist" },
  { control: "Deployment Boundary", status: "Configured", maturity: 86, owner: "DevOps", evidence: "Docker, Vercel, Render, Railway, readiness endpoint, smoke tests" }
];

export const complianceReadiness = [
  { domain: "Identity & Access", score: 82, gap: "Replace demo auth with SSO or password-backed auth before production sale" },
  { domain: "Application Security", score: 89, gap: "Add external penetration test and dependency monitoring workflow" },
  { domain: "Data Protection", score: 84, gap: "Enable managed PostgreSQL backups, retention, and tenant data export policy" },
  { domain: "Operational Resilience", score: 91, gap: "Connect monitoring alerts and uptime status page" },
  { domain: "Governance Evidence", score: 93, gap: "Map customer-specific controls during onboarding" }
];

export const executiveSecurityQueue = [
  { priority: "P1", item: "Set production JWT_SECRET and rotate quarterly", owner: "Security Engineering", due: "Before launch" },
  { priority: "P1", item: "Switch repository driver to PostgreSQL", owner: "Platform", due: "Before launch" },
  { priority: "P2", item: "Connect SSO and tenant invite workflow", owner: "Identity", due: "Pilot" },
  { priority: "P2", item: "Add hosting WAF and managed TLS policy", owner: "DevOps", due: "Pilot" },
  { priority: "P3", item: "Schedule external security review", owner: "CISO", due: "Enterprise sale" }
];

export const livePortalKpis = [
  { label: "Enterprise readiness", value: "86%", detail: "Demo-to-production gate score", status: "Action required" },
  { label: "SLA target", value: "99.9%", detail: "Requires managed hosting monitor", status: "Configured" },
  { label: "Tenant isolation", value: "Ready", detail: "Tenant-scoped APIs and repository model", status: "Enabled" },
  { label: "Production blockers", value: "04", detail: "JWT, Postgres, SSO, WAF", status: "Open" }
];

export const productionGates = [
  { gate: "Managed PostgreSQL", state: "Required", owner: "Platform", detail: "Set REPOSITORY_DRIVER=postgres and DATABASE_URL for persistent multi-tenant data." },
  { gate: "Strong JWT Secret", state: "Required", owner: "Security", detail: "Set JWT_SECRET in Render/Railway/Vercel backend environment." },
  { gate: "Enterprise SSO", state: "Pilot", owner: "Identity", detail: "Connect SAML/OIDC provider before regulated customer onboarding." },
  { gate: "TLS/WAF/Edge Rate Limit", state: "Pilot", owner: "DevOps", detail: "Enable managed HTTPS, WAF, DDoS controls, and hosting edge limits." },
  { gate: "Monitoring & Incident Runbook", state: "Ready to configure", owner: "Operations", detail: "Attach uptime monitor, log retention, alert routing, and escalation policy." },
  { gate: "Security Review", state: "Recommended", owner: "CISO", detail: "Run external assessment before enterprise customer contract signing." }
];

export const tenantOperations = [
  { area: "Tenant Admin", capability: "Users, roles, scenarios, audit, notifications", readiness: 88 },
  { area: "Evidence Operations", capability: "PDF, DOCX, CSV, audit search, docs allowlist", readiness: 91 },
  { area: "Training Operations", capability: "Annual tracking, CEO/board/employee paths, growth matrix", readiness: 89 },
  { area: "Simulation Operations", capability: "Live sessions, WebSocket ticks, injects, decisions", readiness: 87 },
  { area: "Compliance Operations", capability: "ATT&CK, ATLAS, NIST, ISO, DORA mapping", readiness: 90 }
];

export const enterpriseRunbooks = [
  { runbook: "Customer Onboarding", steps: "Create tenant, invite admins, select frameworks, load scenarios, set annual training targets" },
  { runbook: "Production Release", steps: "Build, selftest, audit, smoke, verify /ready, verify /security/status, deploy backend, deploy frontend" },
  { runbook: "Incident Response", steps: "Open Live Ops, review security posture, trigger tabletop, export report, preserve audit CSV" },
  { runbook: "Quarterly Board Review", steps: "Run CEO tabletop, review training growth, export after-action report, update compliance coverage" }
];

export const enterpriseBuildout = [
  { area: "Production Database", capability: "Managed PostgreSQL, migrations, backups, tenant data durability", state: "Code ready, env required" },
  { area: "Real Authentication", capability: "JWT foundation, role claims, SSO readiness, MFA roadmap", state: "Demo login active" },
  { area: "Tenant Management", capability: "Tenant overview, users, scenarios, audit, plan metadata", state: "Portal ready" },
  { area: "Production Hosting", capability: "Vercel, Render, Railway, Docker, readiness APIs", state: "Deployment ready" },
  { area: "Monitoring", capability: "Health, readiness, production status, monitoring endpoint", state: "Endpoint ready" },
  { area: "Security Hardening", capability: "Headers, rate limit, request limit, docs allowlist, security status", state: "App controls enabled" },
  { area: "Real Data Workflows", capability: "Reports, audit CSV, notifications, integration readiness APIs", state: "Workflow ready" },
  { area: "Enterprise Polish", capability: "Live Ops, manuals, footer docs, white theme, training, admin controls", state: "Portal ready" }
];

export const onboardingChecklist = [
  { step: "Create production tenant", owner: "Customer Success", status: "Ready" },
  { step: "Invite admin and executive users", owner: "Tenant Admin", status: "Ready" },
  { step: "Configure SSO provider", owner: "Identity", status: "Requires customer IdP" },
  { step: "Connect PostgreSQL and run migrations", owner: "Platform", status: "Requires production database" },
  { step: "Enable Slack/Teams/email notifications", owner: "Operations", status: "Requires webhook/API keys" },
  { step: "Run first CEO tabletop exercise", owner: "Facilitator", status: "Ready" }
];

export const monitoringSignals = [
  { signal: "API Health", value: "OK", detail: "/health responding" },
  { signal: "Readiness", value: "Warn", detail: "Demo secret and memory database until env is configured" },
  { signal: "Security Status", value: "Enabled", detail: "Security endpoint and headers active" },
  { signal: "Exports", value: "OK", detail: "PDF, DOCX, CSV available" },
  { signal: "Docs", value: "OK", detail: "Footer manuals served from allowlist" }
];

export const subscriptionPlans = [
  { plan: "Pilot", price: "$25k", detail: "1 tenant, 500 training seats, 12 annual tabletop exercises" },
  { plan: "Enterprise", price: "$75k+", detail: "5 tenants, 5,000 seats, priority support, advanced integrations" },
  { plan: "Sovereign", price: "Custom", detail: "Dedicated environment, custom retention, sovereign controls" }
];

export const settingsCatalog = [
  { group: "Organization", setting: "Company profile", value: "Sovereign Health Network", detail: "Tenant display name, sector, region, and plan metadata" },
  { group: "Branding", setting: "Portal theme", value: "White default, dark optional", detail: "Customer-facing portal theme and blue enterprise accent" },
  { group: "Security", setting: "Session policy", value: "8h JWT demo", detail: "Replace with SSO/MFA policy in production" },
  { group: "Notifications", setting: "Channels", value: "Email, Slack, Teams ready", detail: "Requires provider credentials or webhooks" },
  { group: "Data Retention", setting: "Audit retention", value: "7 years", detail: "Configure managed database backup and retention in production" },
  { group: "Exports", setting: "Report formats", value: "PDF, DOCX, CSV", detail: "Board pack and after-action exports enabled" }
];

export const onboardingWizard = [
  { step: 1, title: "Create tenant", status: "Ready", owner: "Customer Success", detail: "Configure company profile, sector, region, and plan." },
  { step: 2, title: "Invite users", status: "Ready", owner: "Tenant Admin", detail: "Add Admin, CEO, CISO, Board, Privacy, GRC, and SOC roles." },
  { step: 3, title: "Choose frameworks", status: "Ready", owner: "GRC", detail: "Select NIST CSF, ISO 27001, SOC 2, ATT&CK, ATLAS, AI RMF, DORA." },
  { step: 4, title: "Assign training", status: "Ready", owner: "Security Awareness", detail: "Assign employee, executive, board, manager, and technical tracks." },
  { step: 5, title: "Schedule tabletop", status: "Ready", owner: "Facilitator", detail: "Schedule first CEO and board AI-cyber tabletop exercise." },
  { step: 6, title: "Production checklist", status: "Requires config", owner: "Platform", detail: "Connect PostgreSQL, SSO, secrets, monitoring, WAF, and backups." }
];

export const boardPortalMetrics = [
  { label: "Quarterly risk score", value: "82", detail: "Improved 7 points from last review" },
  { label: "CEO decisions logged", value: "14", detail: "Across crisis and disclosure exercises" },
  { label: "Training maturity", value: "89%", detail: "Employees, CEO, board, and technical teams" },
  { label: "Audit evidence", value: "126", detail: "Reports, decisions, exports, and mappings" }
];

export const socIncidents = [
  { id: "INC-1001", title: "RAG connector poisoning indicator", severity: "Critical", sla: "18m", owner: "SOC Lead", status: "Containment" },
  { id: "INC-1002", title: "Suspicious executive deepfake request", severity: "High", sla: "42m", owner: "Fraud Response", status: "Investigating" },
  { id: "INC-1003", title: "Cloud recovery evidence gap", severity: "Medium", sla: "2h", owner: "Cloud IR", status: "Evidence needed" },
  { id: "INC-1004", title: "Training phishing failure cluster", severity: "Medium", sla: "1d", owner: "Awareness", status: "Remediation" }
];

export const integrationConfig = [
  { name: "Slack / Teams", type: "Notifications", status: "Ready", fields: "Webhook URL, channel, escalation group" },
  { name: "Email Provider", type: "Notifications", status: "Ready", fields: "SMTP/API key, sender domain, templates" },
  { name: "Microsoft Sentinel", type: "SIEM", status: "Ready", fields: "Workspace ID, tenant ID, API credentials" },
  { name: "ServiceNow", type: "ITSM", status: "Ready", fields: "Instance URL, assignment group, OAuth credentials" },
  { name: "Jira", type: "Workflow", status: "Configured", fields: "Project key, issue type, API token" },
  { name: "Okta / Azure AD", type: "SSO", status: "Requires config", fields: "Issuer, client ID, client secret, callback URL" }
];

export const supportTickets = [
  { id: "SUP-001", subject: "SSO configuration review", priority: "High", owner: "Implementation", status: "Open" },
  { id: "SUP-002", subject: "Board pack template branding", priority: "Medium", owner: "Customer Success", status: "In progress" },
  { id: "SUP-003", subject: "Training import mapping", priority: "Medium", owner: "Support", status: "Queued" }
];

export const advancedAuditFilters = [
  "Date range",
  "Actor",
  "Action",
  "Resource",
  "Severity",
  "Workspace",
  "Export type",
  "Saved view"
];

export const boardPackSections = [
  "Executive risk summary",
  "Quarterly resilience score",
  "CEO decision history",
  "Training maturity and growth",
  "Audit evidence list",
  "Scenario outcomes and recommendations",
  "Production blockers and investment asks"
];

export const productionChecklist = [
  { check: "PostgreSQL", status: "Required", detail: "Managed database configured and migrations run" },
  { check: "JWT secret", status: "Required", detail: "Strong secret configured in backend environment" },
  { check: "SSO/MFA", status: "Required", detail: "OIDC/SAML provider configured for enterprise rollout" },
  { check: "HTTPS", status: "Required", detail: "Managed TLS and custom domain active" },
  { check: "WAF", status: "Recommended", detail: "Edge WAF and DDoS controls enabled" },
  { check: "Monitoring", status: "Required", detail: "Uptime, logs, traces, alerts configured" },
  { check: "Backups", status: "Required", detail: "Database backup and restore tested" },
  { check: "Audit retention", status: "Required", detail: "Retention and export policy approved" }
];

export const demoDataControls = [
  { action: "Reset demo data", detail: "Restore scenarios, notifications, audit, and sessions to sample defaults" },
  { action: "Load healthcare tenant", detail: "Healthcare-focused AI-cyber tabletop and training records" },
  { action: "Load finance tenant", detail: "Fraud, regulator, ransomware, and board oversight scenarios" },
  { action: "Load SaaS tenant", detail: "Cloud outage, model abuse, data breach, and SOC response scenarios" },
  { action: "Seed training records", detail: "Populate annual completion, phishing, reporting, and growth metrics" }
];

export const integrations = [
  { name: "Microsoft Sentinel", category: "SIEM", status: "Ready" },
  { name: "ServiceNow", category: "ITSM", status: "Ready" },
  { name: "Jira", category: "Workflow", status: "Configured" },
  { name: "Slack / Teams", category: "Comms", status: "Ready" },
  { name: "AWS / Azure / GCP", category: "Cloud", status: "Mapped" },
  { name: "OneTrust / Archer", category: "GRC", status: "Planned" }
];

export const evidenceVault = [
  { artifact: "Vector store integrity snapshot", owner: "AI Governance", status: "Preserved" },
  { artifact: "Regulator notification draft", owner: "Legal", status: "Approved" },
  { artifact: "Board decision log", owner: "Board Chair", status: "Signed" },
  { artifact: "Recovery sequence evidence", owner: "CIO", status: "Validated" }
];

export const enterpriseOutcomes = [
  "Reduce executive decision latency during AI-cyber incidents",
  "Create audit-ready evidence for regulators and board committees",
  "Measure cyber, AI governance, privacy, crisis, and recovery maturity together",
  "Standardize tabletop exercises across business units and geographies"
];
