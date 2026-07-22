import { useEffect, useState } from "react";
import { platformApi, type AuditEvent, type PlatformOverview, type SimulationSummary } from "../api/client";

export function usePlatformData() {
  const [overview, setOverview] = useState<PlatformOverview | null>(null);
  const [simulation, setSimulation] = useState<SimulationSummary | null>(null);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [status, setStatus] = useState<"loading" | "live" | "fallback">("loading");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const loadedOverview = await platformApi.overview();
        const activeSessionId = loadedOverview.sessions.find((session) => session.status === "Live")?.id ?? "ses-live-rag-001";
        const [loadedSimulation, loadedAuditEvents] = await Promise.all([
          platformApi.simulation(activeSessionId),
          platformApi.auditEvents()
        ]);

        if (!cancelled) {
          setOverview(loadedOverview);
          setSimulation(loadedSimulation);
          setAuditEvents(loadedAuditEvents);
          setStatus("live");
        }
      } catch {
        if (!cancelled) setStatus("fallback");
      }
    }

    load();
    const interval = window.setInterval(load, 15000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [refreshKey]);

  return { overview, simulation, auditEvents, status, refresh: () => setRefreshKey((key) => key + 1) };
}
