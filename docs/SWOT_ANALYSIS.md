# SWOT Analysis — AI Resilience Platform v0.2

Date: 2026-07-21
Context: Product-market fit evaluation for next version launch

## Strengths (Internal)

| # | Strength | Why it matters |
|---|----------|----------------|
| 1 | Unified platform: GRC + simulations + AI governance + training in one codebase | No competitor offers this combo |
| 2 | 15 workspace views fully built | Command center, Tabletop, Threat AI, Standards, Reports, Admin |
| 3 | 40+ API endpoints with auth, RBAC, WebSocket, PDF/DOCX export | Production-grade backend |
| 4 | In-memory + PostgreSQL dual repository | Works immediately without external DB |
| 5 | AI inject generation with safety review | Most competitors use static templates |
| 6 | Standards mapping graph | One control maps to multiple frameworks |
| 7 | Docker + Render + Railway + Vercel configs already written | Deploy-ready infrastructure |
| 8 | 21 docs files covering architecture, API, data model, security, deployment | Enterprise buyers expect docs |

## Weaknesses (Internal)

| # | Weakness | Impact |
|---|----------|--------|
| 1 | No React Router — views switch via `useState` in a single 1728-line `App.tsx` | Unmaintainable; breaks URL sharing; no lazy loading |
| 2 | In-memory data only (unless Postgres configured) | No persistence out of the box |
| 3 | No multi-tenant isolation beyond JWT claim | Cannot onboard real customers |
| 4 | No CI/CD for deployment — GitHub Actions only runs tests | Cannot push to production automatically |
| 5 | No payment/billing integration | Cannot collect money |
| 6 | No onboarding flow — user lands on login, no guided setup | High bounce rate for non-technical buyers |
| 7 | Static demo data (1 tenant, healthcare, APAC) | Looks like a demo, not a product |
| 8 | No email/notification system beyond in-app notifications | Cannot alert users outside the app |
| 9 | AI governance module is thin — no model inventory, bias scanning, AI Act readiness | Competitors (Credo AI, Modulos) are deeper |

## Opportunities (External)

| # | Opportunity | Evidence |
|---|-------------|----------|
| 1 | $87B+ TAM (GRC $75B + AI gov $9.8B + BAS $2.1B) growing 15-40% CAGR | Massive expanding market |
| 2 | Regulatory convergence — EU AI Act (Dec 2027), DORA (Jan 2025), NIS2, SEC rules all require documented resilience testing | Demand is regulation-driven, not discretionary |
| 3 | 83% of SMBs do zero formal security training (Techaisle 2025) | Underserved market |
| 4 | No competitor sells unified GRC + simulations + AI governance | Blue ocean — first mover advantage |
| 5 | Mid-market ($50K-$250K/yr) has no options — enterprise GRC is $1M+, SMB tools lack depth | Pricing gap = product gap |
| 6 | Cyber insurance mandates — carriers require annual TTX evidence | Insurance channel = distribution |
| 7 | MSP/MSSP channel — 10-50 SMB clients each, need a multitenant platform | B2B distribution at scale |
| 8 | AI governance is hottest sub-segment — $7.28B in 2025, projected $38.94B by 2030 (39.85% CAGR) | Fastest-growing regulatory category |

## Threats (External)

| # | Threat | Risk |
|---|--------|------|
| 1 | ServiceNow/MetricStream adding simulation features | Platform lock-in with existing enterprise relationships |
| 2 | Simulation vendors adding GRC (Cyberbit, Immersive Labs expanding upstream) | Race to the middle |
| 3 | Hack The Box / TryHackMe going upstream — already adding AI Range | Community + brand advantage |
| 4 | Enterprise sales cycles are 6-12 months | Cash flow pressure |
| 5 | Regulatory complexity varies by region — EU AI Act, DORA, NIS2, SEC | Deep domain knowledge required |
| 6 | Open-source alternatives emerging | Price pressure from below |
| 7 | AI governance standards still forming — ISO 42001 new, EU AI Act evolving | Target moves while you build |
| 8 | Customer churn if onboarding is poor — enterprise GRC has consulting hand-holding | Need product-led onboarding |

## Pain Point Analysis

### Enterprise (1000+ employees)

| Pain Point | Willingness to Pay | Platform Fit |
|------------|-------------------|--------------|
| Buying 3 separate platforms (GRC + sim + AI gov) | Very high — currently $500K-$3M/yr | High |
| Board demands quantified resilience evidence | High | High |
| Regulatory fragmentation (EU AI Act + DORA + NIS2 + SEC) | High | High |
| No unified data model across risk domains | High | Medium |
| SIEM integration for live threat data | Moderate | Low |

### Mid-Market (50-999 employees) — Sweet Spot

| Pain Point | Willingness to Pay | Platform Fit |
|------------|-------------------|--------------|
| Enterprise tools cost $1M+ — cannot afford | Very high | Perfect at $25K-$100K/yr (10-40x cheaper) |
| Cyber insurance requires TTX evidence | High | Perfect |
| No dedicated GRC/compliance team | High | High |
| SOC 2 / ISO 27001 compliance burden | High | High |
| AI governance awareness growing | Moderate-growing | Medium |

### SMB (1-49 employees)

| Pain Point | Willingness to Pay | Platform Fit |
|------------|-------------------|--------------|
| Cyber insurance mandates TTX — consultant costs $15K-$50K | Low ($500-$5K/yr) | Low margin |
| 83% do zero formal security training | Very low | Poor direct fit |
| Average breach $120K-$1.24M (fatal) | Low | Channel play via MSPs |

## Competition Landscape

| Tier | Key Players | Price Range | Gap |
|------|-------------|-------------|-----|
| Enterprise GRC | ServiceNow, MetricStream, IBM OpenPages | $500K-$3M/yr | No simulations, no AI governance |
| Simulation | Cyberbit, Immersive Labs, SimSpace | $50K-$200K/yr | No GRC, no compliance automation |
| AI Governance | Credo AI, Modulos, Holistic AI | Enterprise quote | No cyber resilience, no GRC |
| SMB | DrillsForge ($799/yr), Preppr ($3K/yr), Opsbook ($500/yr) | $500-$10K/yr | Too bare-bones for compliance evidence |

## Product-Market Positioning

The sweet spot: **Mid-market (50-999 employees) at $25K-$100K/yr** — unified GRC + simulations + AI governance — serving CISOs and Compliance Officers who need to prove resilience to boards, insurers, and auditors, but cannot afford or operate enterprise GRC tools.

No current competitor owns this intersection. The regulatory convergence (EU AI Act, DORA, NIS2, SEC, cyber insurance) creates a 12-18 month window to establish category leadership.

## Recommended Next-Version Scope (v0.2)

| Priority | Feature | Why | Effort |
|----------|---------|-----|--------|
| P0 | React Router + code split (break 1728-line App.tsx into per-view files) | Current architecture blocks everything | 1-2 days |
| P0 | Multi-tenant provisioning UI | Required for real customers | 2-3 days |
| P0 | Fix dependency resolution for reliable npm install | Cannot ship what does not install | 1 day |
| P1 | Persistent PostgreSQL mode as default | Real data survives restarts | 1 day |
| P1 | Onboarding wizard (company info, sector, team invite, first scenario) | Reduce bounce rate | 2-3 days |
| P1 | Stripe billing integration + 3 plan tiers (Free/Pilot/Enterprise) | Collect money | 2-3 days |
| P2 | Deepen AI governance module (model inventory, EU AI Act checklist, bias scanning) | Capture fastest-growing segment | 3-5 days |
| P2 | Email notification system (invites, results, compliance deadlines) | Re-engage users outside app | 2-3 days |
| P3 | MSP multi-tenant admin dashboard | Unlock channel distribution | 3-5 days |
| P3 | Deploy to production (Railway API + Vercel frontend + custom domain) | Go live | 1-2 days |

Total estimated effort: 18-28 days for a focused team.

## Key Numbers

- GRC tech market: $75B in 2025, projected $149B by 2030 (15% CAGR)
- AI governance market: $9.84B in 2025, projected $34.76B by 2033 (17.1% CAGR)
- Agentic AI governance: $7.28B in 2025, projected $38.94B by 2030 (39.85% CAGR)
- Combined addressable market: ~$87B+ in 2025
