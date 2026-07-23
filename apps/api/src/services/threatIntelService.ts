import { repository } from "../repositories/index.js";
import { recordAuditEvent } from "./auditService.js";
import { generateText, isAvailable } from "./aiProviderService.js";
import type { ThreatIntelItem, ThreatIntelSource, ThreatIntelCollection, UserContext } from "../types.js";

const NVD_API = "https://services.nvd.nist.gov/rest/json/cves/2.0";
const OTX_API = "https://otx.alienvault.com/api/v1/indicators";
const MITRE_ATTACK = "https://raw.githubusercontent.com/mitre/cti/master/enterprise-attack/enterprise-attack.json";

// ponytail: security RSS feeds curated list; add when user configures custom feeds
const RSS_FEEDS: Array<{ name: string; url: string }> = [
  { name: "The Record", url: "https://therecord.media/feed" },
  { name: "BleepingComputer", url: "https://www.bleepingcomputer.com/feed/" },
  { name: "KrebsOnSecurity", url: "https://krebsonsecurity.com/feed/" }
];

function now(): string {
  return new Date().toISOString();
}

function severityFromCvss(score: number | null): ThreatIntelItem["severity"] {
  if (score === null) return "None";
  if (score >= 9.0) return "Critical";
  if (score >= 7.0) return "High";
  if (score >= 4.0) return "Medium";
  if (score >= 0.1) return "Low";
  return "None";
}

async function collectCVE(user: UserContext): Promise<ThreatIntelCollection> {
  const start = now();
  const collection: ThreatIntelCollection = { id: `col-cve-${Date.now()}`, startedAt: start, completedAt: null, source: "cve", itemsCollected: 0, itemsNew: 0, status: "running", error: null };
  try {
    const since = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const url = `${NVD_API}?pubStartDate=${since}T00:00:00.000&pubEndDate=${now()}&resultsPerPage=50`;
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`NVD error: ${res.status}`);
    const body = (await res.json()) as { vulnerabilities?: Array<{ cve: { id: string; descriptions?: Array<{ lang: string; value: string }>; metrics?: Record<string, unknown>; published?: string } }> };
    const vulns = body.vulnerabilities ?? [];
    collection.itemsCollected = vulns.length;
    for (const v of vulns) {
      const cve = v.cve;
      const existing = await repository.threatIntel.findByExternalId(user.tenantId, cve.id);
      if (existing) continue;
      const desc = cve.descriptions?.find((d) => d.lang === "en")?.value ?? "";
      const cvssScore = extractCvssScore(cve.metrics);
      const item: ThreatIntelItem = {
        id: `intel-cve-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
        tenantId: user.tenantId,
        source: "cve",
        externalId: cve.id,
        title: cve.id,
        description: desc.slice(0, 2000),
        publishedAt: cve.published ?? start,
        collectedAt: now(),
        severity: severityFromCvss(cvssScore),
        ttpMappings: [],
        affectedSectors: [],
        relatedFrameworks: [],
        rawData: { cvssScore } as Record<string, unknown>,
        processed: false
      };
      await repository.threatIntel.create(item);
      collection.itemsNew++;
    }
    collection.status = "completed";
  } catch (error) {
    collection.status = "failed";
    collection.error = error instanceof Error ? error.message : "Unknown error";
  }
  collection.completedAt = now();
  await repository.threatIntel.recordCollection(collection);
  await recordAuditEvent(user, "threat-intel.collected", collection.id, { source: "cve", items: collection.itemsCollected, new: collection.itemsNew, status: collection.status });
  return collection;
}

function extractCvssScore(metrics: Record<string, unknown> | undefined): number | null {
  if (!metrics) return null;
  for (const key of ["cvssMetricV31", "cvssMetricV30", "cvssMetricV2"]) {
    const group = metrics[key] as Array<{ cvssData?: { baseScore?: number } }> | undefined;
    if (group?.[0]?.cvssData?.baseScore != null) return group[0].cvssData.baseScore;
  }
  return null;
}

async function collectRSS(user: UserContext): Promise<ThreatIntelCollection> {
  const start = now();
  const collection: ThreatIntelCollection = { id: `col-rss-${Date.now()}`, startedAt: start, completedAt: null, source: "rss", itemsCollected: 0, itemsNew: 0, status: "running", error: null };
  try {
    for (const feed of RSS_FEEDS) {
      const res = await fetch(feed.url, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) continue;
      const text = await res.text();
      const items = parseRSS(text, feed.name);
      for (const item of items) {
        const existing = await repository.threatIntel.findByExternalId(user.tenantId, item.externalId);
        if (existing) continue;
        await repository.threatIntel.create(item);
        collection.itemsNew++;
      }
      collection.itemsCollected += items.length;
    }
    collection.status = "completed";
  } catch (error) {
    collection.status = "failed";
    collection.error = error instanceof Error ? error.message : "Unknown error";
  }
  collection.completedAt = now();
  await repository.threatIntel.recordCollection(collection);
  await recordAuditEvent(user, "threat-intel.collected", collection.id, { source: "rss", items: collection.itemsCollected, new: collection.itemsNew, status: collection.status });
  return collection;
}

function parseRSS(xml: string, sourceName: string): ThreatIntelItem[] {
  const items: ThreatIntelItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;
  while ((match = itemRegex.exec(xml)) !== null) {
    const content = match[1];
    const title = extractXmlTag(content, "title");
    const link = extractXmlTag(content, "link");
    const pubDate = extractXmlTag(content, "pubDate");
    const description = extractXmlTag(content, "description").replace(/<[^>]*>/g, "").slice(0, 1000);
    if (!title) continue;
    items.push({
      id: `intel-rss-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
      tenantId: "ten-sovereign-health",
      source: "rss",
      externalId: link || title,
      title: title.slice(0, 300),
      description,
      publishedAt: pubDate ? new Date(pubDate).toISOString() : now(),
      collectedAt: now(),
      severity: "None",
      ttpMappings: [],
      affectedSectors: [],
      relatedFrameworks: [],
      rawData: { feed: sourceName },
      processed: false
    });
  }
  return items;
}

function extractXmlTag(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = regex.exec(xml);
  return m ? m[1].trim() : "";
}

export async function processWithAI(user: UserContext, intelId: string): Promise<ThreatIntelItem | null> {
  const item = await repository.threatIntel.findById(user.tenantId, intelId);
  if (!item) return null;
  if (item.processed) return item;
  const aiAvail = await isAvailable();
  if (!aiAvail) {
    item.processed = true;
    item.affectedSectors = inferSectors(item.description);
    item.ttpMappings = inferTTPs(item.description);
    item.relatedFrameworks = inferFrameworks(item.affectedSectors);
    await repository.threatIntel.update(item);
    return item;
  }
  const prompt = `Analyze this cyber threat intelligence and extract:
1. MITRE ATT&CK technique IDs (comma-separated)
2. Affected industry sectors (comma-separated)
3. Related regulatory frameworks (comma-separated)

Title: ${item.title}
Description: ${item.description.slice(0, 1500)}
Source: ${item.source}

Return ONLY a JSON object with keys: ttpMappings (string array), affectedSectors (string array), relatedFrameworks (string array).`;
  const system = "You are a threat intelligence analyst. Extract structured data from threat intel. Return ONLY valid JSON.";
  const response = await generateText(prompt, system);
  try {
    const parsed = JSON.parse(response) as { ttpMappings?: string[]; affectedSectors?: string[]; relatedFrameworks?: string[] };
    item.ttpMappings = parsed.ttpMappings ?? [];
    item.affectedSectors = parsed.affectedSectors ?? [];
    item.relatedFrameworks = parsed.relatedFrameworks ?? [];
  } catch {
    item.affectedSectors = inferSectors(item.description);
    item.ttpMappings = inferTTPs(item.description);
    item.relatedFrameworks = inferFrameworks(item.affectedSectors);
  }
  item.processed = true;
  await repository.threatIntel.update(item);
  await recordAuditEvent(user, "threat-intel.processed", intelId, { ttpCount: item.ttpMappings.length, sectorCount: item.affectedSectors.length });
  return item;
}

function inferSectors(text: string): string[] {
  const sectors: string[] = [];
  const keywords: Record<string, string[]> = {
    Healthcare: ["health", "hospital", "patient", "clinical", "medical", "hipaa", "pharma"],
    Finance: ["bank", "financ", "payment", "trading", "credit", "swift", "fintech"],
    "Critical Infrastructure": ["grid", "power", "energy", "water", "utility", "scada", "ics", "ot"],
    Government: ["government", "military", "defense", "fedramp", "classified", "agency"],
    Technology: ["cloud", "saas", "software", "api", "kubernetes", "docker", "aws", "azure"],
    Telecom: ["telecom", "5g", "mobile", "network", "isp", "cellular"]
  };
  const lower = text.toLowerCase();
  for (const [sector, words] of Object.entries(keywords)) {
    if (words.some((w) => lower.includes(w))) sectors.push(sector);
  }
  return sectors.length ? sectors : ["Technology"];
}

function inferTTPs(text: string): string[] {
  const ttpRegex = /T\d{4}(?:\.\d{3})?/g;
  const matches = text.match(ttpRegex);
  return matches ?? [];
}

function inferFrameworks(sectors: string[]): string[] {
  const map: Record<string, string[]> = {
    Healthcare: ["HIPAA", "NIST CSF 2.0", "HITRUST"],
    Finance: ["PCI DSS", "SOX", "DORA", "MAS TRM"],
    "Critical Infrastructure": ["NERC CIP", "TSA SD", "NIST CSF 2.0"],
    Government: ["FedRAMP", "NIST 800-53", "ITAR"],
    Technology: ["SOC 2", "ISO 27001", "EU AI Act"],
    Telecom: ["ISO 27001", "NIST CSF 2.0", "GDPR"]
  };
  const frameworks = new Set<string>();
  for (const sector of sectors) {
    for (const fw of map[sector] ?? []) frameworks.add(fw);
  }
  return Array.from(frameworks);
}

export async function collectAll(user: UserContext): Promise<ThreatIntelCollection[]> {
  const results = await Promise.allSettled([
    collectCVE(user),
    collectRSS(user)
  ]);
  return results.map((r) => (r.status === "fulfilled" ? r.value : { id: `col-failed-${Date.now()}`, startedAt: now(), completedAt: now(), source: "unknown" as ThreatIntelSource, itemsCollected: 0, itemsNew: 0, status: "failed" as const, error: r.reason?.message ?? "Unknown" }));
}

export async function collectSource(user: UserContext, source: ThreatIntelSource): Promise<ThreatIntelCollection | null> {
  switch (source) {
    case "cve": return collectCVE(user);
    case "rss": return collectRSS(user);
    default: return null;
  }
}

export async function listIntel(user: UserContext, since?: string, source?: ThreatIntelSource): Promise<ThreatIntelItem[]> {
  return repository.threatIntel.listByTenant(user.tenantId, since, source);
}

export async function getIntelStats(user: UserContext) {
  const all = await repository.threatIntel.listByTenant(user.tenantId);
  const bySource: Record<string, number> = {};
  const bySeverity: Record<string, number> = {};
  let processed = 0;
  for (const item of all) {
    bySource[item.source] = (bySource[item.source] ?? 0) + 1;
    bySeverity[item.severity] = (bySeverity[item.severity] ?? 0) + 1;
    if (item.processed) processed++;
  }
  return { total: all.length, processed, bySource, bySeverity, collections: await repository.threatIntel.listCollections() };
}
