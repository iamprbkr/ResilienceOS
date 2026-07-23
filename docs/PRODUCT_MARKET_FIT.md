# ResilienceOS — Product-Market Fit

**Status: Pre-revenue / MVP.** Working product deployed, security-audited, CI-ready. Zero paying customers. This document identifies the market opportunity and path to first revenue.

## What We Built

ResilienceOS is an open-source simulation platform that measures and proves organizational readiness. Not another compliance checkbox. A tool that generates evidence, maps it to any framework, and tracks improvement over time.

Four exercise categories cover the full market. Each solves a specific buying problem.

---

## Exercise Categories

### 1. Dynamic Tabletop Exercises

Traditional tabletops are static PDFs. You read a scenario, discuss what you'd do, file the notes. No two participants remember the same outcome. No one knows if you improved.

ResilienceOS injects adapt to decisions made during the exercise. Choose to contain a ransomware outbreak instead of paying? The next inject assumes you preserved forensic evidence. Choose to pay? The next inject tests your recovery supply chain. Every run produces a different path and a different score.

**Who buys this:** CISOs who have run the same ISO 27001 tabletop for five years and know their team can recite the answers.

**Price anchor:**
- Annual tabletops from consultancies: $25k-$50k per exercise
- ResilienceOS: included in subscription, unlimited runs

### 2. Sector-Specific Exercises

Regulatory requirements differ by sector, but off-the-shelf scenarios treat every organization the same.

| Sector | Regulation | Scenario Focus |
|--------|-----------|----------------|
| Healthcare | HIPAA, HITRUST, GDPR | Patient data breach, AI diagnostic failure, ransomware in hospital networks |
| Financial Services | SOX, PCI DSS, DORA, MAS TRM | Trading disruption, payment system compromise, AI model manipulation in wealth management |
| Energy & Critical Infrastructure | NERC CIP, TSA SD, NIST IR | OT/ICS compromise, grid control injection, supply chain attacks on SCADA |
| Government & Defense | FedRAMP, NIST 800-53, ITAR | Nation-state intrusion, classified data spill, insider threat in cleared environments |
| Technology & SaaS | SOC 2, ISO 27001, EU AI Act | AI training data poisoning, service supply chain breach, customer data exposure |
| Insurance | NAIC, NYDFS, Solvency II | Claims system ransomware, actuarial model manipulation, reinsurance data integrity |
| Retail & E-commerce | PCI DSS, GDPR, CCPA | Payment breach, loyalty program compromise, AI recommendation manipulation |
| Manufacturing & Supply Chain | ISO 27001, NIST CSF 2.0, CMMC | Supplier compromise, production line OT infiltration, IP theft via LLM |

**Who buys this:** GRC managers in regulated industries who cannot use generic scenarios. Their auditors expect sector-specific control testing.

### 3. Threat and Risk Specific Exercises

Organizations do not buy "a resilience platform." They buy a solution to a specific threat they lost sleep over last night.

| Threat Category | Exercise Types |
|----------------|----------------|
| Ransomware | Encryption event, double extortion, supply chain propagation, backup compromise |
| AI Model Abuse | RAG poisoning, prompt injection, model inversion, training data extraction |
| Nation-State | Advanced persistent threat, zero-day exploitation, critical infrastructure targeting |
| Insider Threat | Data exfiltration by departing employee, sabotage by privileged user, unintentional exposure |
| Supply Chain | Vendor compromise, software supply chain attack, third-party AI model backdoor |
| Cloud Breach | CSP misconfiguration, credential theft, cross-tenant data access |
| Third-Party Risk | Vendor data breach, sub-processor compromise, fourth-party cascading failure |
| Business Continuity | Data center outage, cloud provider failure, telecommunications disruption |
| Fraud | AI-generated deepfake executive fraud, payment diversion, identity takeover |
| Privacy & Regulatory | GDPR data subject request mishandling, CCPA opt-out failure, AI bias complaint |

**Who buys this:** Risk managers who present to the board quarterly and need to show they tested the specific risks in the latest risk register.

### 4. GRC-Specific Exercises

Traditional GRC tools track controls. They do not test them. ResilienceOS bridges audit preparation and live exercises.

| GRC Domain | How ResilienceOS Covers It |
|------------|---------------------------|
| Control Testing | Run an exercise targeting specific controls. Evidence shows whether the control held under pressure. |
| Standards Mapping | Every exercise maps to NIST CSF 2.0, ISO 27001, SOC 2, MITRE ATT&CK, MITRE ATLAS, AI RMF, ISO 42001, DORA. Coverage report shows gaps. |
| Audit Evidence | After-action reports serve as auditor evidence. Export PDF, DOCX, or CSV. |
| Risk Assessment | Risk state tracked across four dimensions: trust, operational, regulatory, containment. |
| Vendor Risk | Third-party scenarios test vendor management controls and escalation procedures. |
| Board Reporting | Executive dashboard with trend scores, coverage heatmaps, and improvement metrics. |

**Who buys this:** Audit and compliance teams preparing for annual audits who want evidence, not promises.

---

## Market Gap and Why Now

Three shifts make this product timely:

1. **Regulatory density is compounding.** Eight major frameworks now cover AI alone. Organizations cannot map controls manually.
2. **AI governance is mandatory.** DORA, EU AI Act, and ISO 42001 all require AI-specific testing. Most GRC tools have nothing for this.
3. **Budgets are under pressure.** CFOs are asking security teams to prove ROI. A platform that generates evidence and tracks readiness scores gives CISOs a metric to defend their budget.

**Why no YC startup has built this yet.** Of 108 YC security startups (2025-2026), all cluster around technical security: AI pentesting, agent auth, runtime protection, cloud security. None build organizational resilience simulation. The reasons: GRC sales cycles are long, the moat is content not code, and the regulatory tailwinds (DORA, EU AI Act) are only now creating urgency. This gives an 18-24 month window to establish category leadership before YC entrants or incumbent pivots arrive.

---

## Y Combinator Startup Landscape (2025-2026)

YC funded 108 security startups as of mid-2026. None compete head-to-head with ResilienceOS. The entire cohort clusters around AI-powered technical security — pentesting automation, agent authentication, runtime protection. **No YC startup builds adaptive organizational resilience training.**

This is both evidence of blue ocean and a signal the market is unproven at startup scale. The table below maps every relevant YC company.

### AI-Native Pentesting & Offensive Security

These companies automate what penetration testers do: find vulnerabilities in code, APIs, and infrastructure. They serve the same buyer (CISO) but solve a different problem — technical vuln detection versus organizational readiness.

| Startup | Batch | What They Build | Why It Is Not ResilienceOS |
|---------|-------|----------------|---------------------------|
| **Hex Security** | W26 | AI agents for continuous pentesting. Found vulns in dozens of YC companies. $3B+ estimated damages prevented. | Technical vuln scanning. No tabletop, no board reports, no organizational readiness score. |
| **MindFort** | P25 | Autonomous AI agents that find, exploit, and patch web app vulns. Raised $3.2M. | Remediation-focused. Tests code, not people or processes. |
| **Nebula Security** | S26 | AI-native security auditing. Founders are world-class CTF hackers, DEF CON winners, $400K in bug bounties. | Code-level review. No simulation, no frameworks mapping, no exercise format. |
| **Veria Labs** | F25 | AI agents that hack better than humans. Found critical bugs in AI tools, OS, crypto exchanges. | Vuln research tooling. Different buyer (dev team vs GRC/CISO). |
| **Casco** | P25 | Autonomous security testing for web apps, APIs, AI systems. 100+ customers including Gusto, CrewAI. | Continuous scanning, not simulation. Output is vuln reports, not readiness scores. |
| **Fabraix** | S26 | AI red-teaming agent (Nyx). 78% attack success vs 67% for GPT-5.6 on AgentHarm. Library of 10K+ jailbreaks. | AI-specific red-teaming. Tests AI agents, not organizational processes. |

### Agentic Security Platforms

| Startup | Batch | What They Build | Why It Is Not ResilienceOS |
|---------|-------|----------------|---------------------------|
| **Tolmo** | P26 | Agent-driven security platform. Fleets of AI agents on live production knowledge graph. | Remediation automation for cloud/CI/CD. No exercise simulation. |
| **Cotool** | P25 | AI co-pilot for security teams. No-code agent builder. 70% time reduction on investigations. | SOC efficiency tool. Different workflow (triage vs readiness). |

### AI Agent Security (Auth, Runtime, DLP)

| Startup | Batch | What They Build | Why It Is Not ResilienceOS |
|---------|-------|----------------|---------------------------|
| **Multifactor** | F25 | Zero-trust auth, authorization, auditing for AI agents. Patented AI security. Top YC F25 company. | AuthZ for agents. Not an exercise or simulation platform. |
| **Alter** | S25 | Zero-trust IAM for AI agents. SOC 2/HIPAA/GDPR compliant. | Access control. Complements our use case but does not compete. |
| **Silmaril** | S26 | Runtime security for AI that self-improves. Blocks 96% of prompt injection attacks. | AI-specific firewall. Technical control, not organizational readiness. |
| **Candor** | W25 | Agentic DLP and insider risk management. | Data loss prevention. No exercise simulation. |

### Runtime & Application Security

| Startup | Batch | What They Build | Why It Is Not ResilienceOS |
|---------|-------|----------------|---------------------------|
| **RASPIRE** | S26 | Autonomous runtime security for mobile apps. 20M+ end users protected. | App shielding. Different buyer (app sec vs GRC/CISO). |
| **Crosslayer Labs** | W26 | Internet infrastructure protection (DNS, BGP, TLS). Princeton professors. | Network-layer monitoring. No organizational simulation. |
| **GhostEye** | S25 | Employee attack surface management. Autonomous security loop for people. | Phishing/social engineering testing. Narrower scope. |

### Why No YC Startup Competes Directly

Organizational resilience training is a hard SaaS sale:

1. **Long sales cycle.** GRC and CISO buyers take 3-6 months. YC favors startups with short enterprise sales cycles or PLG motions.
2. **Content moat, not code moat.** The value is in the scenarios and framework mappings, not the software. YC evaluates technology-first pitches.
3. **Incumbent consulting relationships.** Companies already pay $25k-$75k per tabletop to consultancies. Displacing trusted advisors is harder than displacing a tool.
4. **Regulatory timing.** DORA, EU AI Act, and NIST CSF 2.0 are creating urgency now that did not exist 12 months ago. Early YC batches could not have bet on this wave.

This creates an 18-24 month window where ResilienceOS can establish category leadership before YC-backed competitors pivot into this space or new entrants appear.

### Adjacent Non-YC Competitors

| Competitor | Funding | What They Do | Gap |
|-----------|---------|-------------|-----|
| **Scythe** | $35M Series A | Platform for automated adversarial simulation. Technical red/blue team exercises. | Engineering-focused. No board reporting, no GRC mapping, no AI governance. Enterprise-only pricing (custom quote). |
| **AttackIQ** | $67M Series D | Continuous security validation platform. MITRE ATT&CK-based breach and attack simulation. | Technical controls testing. CISO tool, not GRC or board tool. |
| **OneTrust** | $920M total | GRC, privacy, AI governance platform. $30/mo start, $200k+ enterprise. | Control tracking, not simulation. No adaptive exercise capability. |
| **ServiceNow GRC** | Public ($220B cap) | Enterprise GRC module. $50k+/yr. | Policy and risk register. No testing or readiness scoring. |
| **Vanta** | $374M total | Automated SOC 2, ISO 27001 compliance. $7.5k-$30k+/yr. | Compliance automation. Does not test controls under pressure. |
| **Drata** | $324M total | Continuous SOC 2 compliance. $15k+/yr. | Evidence collection from monitoring, not from simulation. |

---

### CISO
"Run unlimited realistic exercises. Get a readiness score that trends over time. Prove to the board we are improving, not just checking boxes."

### GRC Manager
"Map every exercise to the frameworks you need. Export auditor-ready evidence in one click. Stop redoing the same work for every audit."

### CEO / Board Member
"See a single number: organizational resilience. Know where gaps exist and what we are doing about them. Fulfill fiduciary duties with verifiable evidence."

### Head of AI Governance
"Run AI-specific scenarios: RAG poisoning, model drift, training data extraction. Map to AI RMF and ISO 42001. Generate compliance evidence for AI regulations."

### Head of Third-Party Risk
"Test vendor incident response without waiting for a real breach. Evaluate whether suppliers can actually contain and communicate."

---

## Competitive Positioning

| Competitor | What They Do | Our Advantage |
|-----------|-------------|---------------|
| **Traditional consultancies** | Run 1-2 tabletops per year. Deliver PDF report. $25k-$75k per engagement. | Unlimited exercises. Live scoring. Continuous improvement tracking. 10x cheaper. |
| **GRC platforms (ServiceNow, OneTrust, Archer)** | Track controls and policies. Do not run exercises. | We generate evidence from actual simulation. Our scores reflect tested readiness, not self-assessments. |
| **Tabletop software (Bsimm, CATA, simple scenario tools)** | Static scenarios. No adaptive injects. No standards mapping. | Adaptive injects. Multi-framework mapping. Export-ready evidence. |
| **Cyber range platforms (Scythe, AttackIQ)** | Technical sandbox for red/blue team exercises. Expensive. Requires infrastructure. | Executive and board focus. No technical setup. SaaS delivery. 1/10 the cost. |
| **YC AI-pentesting startups (Hex, MindFort, Nebula, Veria, Casco, Fabraix)** | AI agents find vulns in code, APIs, AI models. Technical output. | Organizational readiness. Tests people and process, not just code. Board-ready evidence. |
| **YC agent-security startups (Multifactor, Alter, Silmaril, Candor, Tolmo, Cotool)** | Auth, DLP, runtime protection for AI agents. Technical controls. | Complements rather than competes. Their controls need our exercises to verify they work under pressure. |

---

## Cost Effectiveness

### Pricing Philosophy
Open-source core with paid tiers. The platform itself is free to run locally or self-host. Revenue comes from managed cloud, premium content libraries, and enterprise features.

### Total Cost Comparison

| Item | Traditional Approach | ResilienceOS |
|------|---------------------|--------------|
| Annual tabletop exercises | $25k-$75k per exercise (consultancy) | Included in subscription |
| GRC platform license | $50k-$200k/year (ServiceNow, Archer) | Free (self-host) or $0 (open source) |
| AI governance tool | $30k-$100k/year (separate vendor) | Included (built-in AI RMF coverage) |
| Board report preparation | 2-4 weeks of consultant time | One click export |
| Scenario customization | $5k-$15k per custom scenario | Self-service scenario builder |
| Per-exercise cost | $500-$2k per participant | Unlimited participants |

### For a 500-person organization:
- Traditional: $150k-$400k/year across consultancies + GRC tools
- ResilienceOS: $0 (open source) to $24k/year (cloud, 250 exercises)

---

## Last Mile for Every Company Size

### Small Teams (1-50 people, no dedicated security team)
- Pre-built scenarios ready in 30 seconds
- No configuration needed
- Self-host with Docker Compose (free)
- Included: all 15 workspace views, 8 standards frameworks
- Time to value: 5 minutes from `pnpm install`

### Mid-Market (50-500 people, GRC manager or part-time CISO)
- Sector-specific scenario packs
- Standards coverage gap analysis
- Board-ready reporting
- Self-host or cloud
- Time to value: 30 minutes to first exercise

### Enterprise (500-5000 people, dedicated security team)
- Custom scenario authoring
- Multi-tenant administration
- SSO/SAML integration
- SLA-guaranteed cloud
- Professional services for custom content

### Large Enterprise (5000+ people, full GRC + cyber + AI governance teams)
- Dedicated instance
- Custom framework mapping
- Integration with existing GRC tools
- Custom inject library development
- Annual program of exercises across business units

---

## Revenue Models

### 1. SaaS Subscription (Core Revenue)

| Tier | Price | Included |
|------|-------|----------|
| **Community** | Free | Self-hosted, unlimited exercises, 8 frameworks, 15 workspace views |
| **Team** | $199/mo | Cloud-hosted, up to 50 users, sector-specific packs, email support |
| **Business** | $999/mo | Cloud-hosted, up to 500 users, all scenario packs, SSO, priority support |
| **Enterprise** | Custom | Dedicated cloud or on-premise, unlimited users, custom scenarios, integration support, SLA |

### 2. Scenario Marketplace (Expansion Revenue)

Premium scenario packs sold individually or as bundles:

| Pack | Price | Contents |
|------|-------|----------|
| Financial Services | $499 | 12 scenarios, 48 injects, SOX/PCI/DORA mapping |
| Healthcare | $499 | 10 scenarios, 40 injects, HIPAA/HITRUST mapping |
| Energy & Critical Infrastructure | $499 | 10 scenarios, 40 injects, NERC CIP mapping |
| AI Governance | $499 | 8 scenarios, 32 injects, AI RMF/ISO 42001 mapping |
| All Sectors Bundle | $1,999 | All packs, all updates for 12 months |

### 3. Professional Services

| Service | Price | Description |
|---------|-------|-------------|
| Custom scenario authoring | $2,500/scenario | Tailored to your specific threat landscape, regulations, and tech stack |
| Annual exercise program | $15k/year | Quarterly exercises with debrief reports, trend analysis, board presentation |
| GRC integration setup | $5k one-time | Connect ResilienceOS to ServiceNow, Archer, or custom GRC tool |
| White-label license | $25k/year | Consultancies and MSPs rebrand and resell to their clients |

### 4. White-Label / MSP Licensing

For consultancies, MSSPs, and cyber insurance companies who want to offer ResilienceOS to their clients under their own brand.

- $25k/year base + $5/client/month
- Includes custom branding, multi-tenant management, client reporting

### 5. Cyber Insurance Integration

Insurance carriers need evidence that policyholders are testing controls. ResilienceOS provides:
- Readiness scores for underwriting decisions
- Exercise completion evidence for premium discounts
- Incident response capability validation

Revenue: per-policyholder fee paid by carrier or broker.

---

## Go-To-Market Channels

| Channel | Why It Works |
|---------|-------------|
| GitHub (open source) | Developers and security engineers discover us organically. Evaluate before buying. |
| Regulatory compliance triggers | DORA deadline, EU AI Act enforcement, new NIST version — each creates a buying event. |
| CISO communities | CISO Network, SAFE, CISOS Connect — word of mouth between security leaders. |
| Partner program | Consultancies resell to their existing audit clients. |
| Content marketing | Scenario examples, compliance guides, tabletop templates as lead magnets. |

---

## Github as Pitchdeck

The GitHub repo is the primary sales page for technical buyers. Every security engineer evaluating a tool starts with GitHub. ResilienceOS signals readiness through:

- **Security audit report** (`docs/SECURITY_AUDIT_REPORT.md`) — shows we take security seriously
- **Working code** — not a landing page, not a demo video, a deployable platform
- **Deployment configs** — Render, Railway, Vercel, Docker — deploy in one click
- **Comprehensive docs** — 21 documents covering every angle
- **Active commits** — signals an active project
- **Open source license** — no vendor lock-in concern

The README is the hero section. The docs are the feature pages. The code is the product demo.

---

## How to Get Started

```bash
git clone https://github.com/iamprbkr/ResilienceOS.git
cd ResilienceOS
pnpm install
pnpm --filter frontend dev
pnpm --filter api dev
```

Open http://localhost:5173. Sign in with `admin@demo.local`. First exercise in under one minute.

Or deploy to production:
- Render: connect repo, auto-detect `render.yaml`, click deploy
- Vercel + Render: frontend on Vercel, API on Render (see `docs/DEPLOYMENT_READY.md`)
