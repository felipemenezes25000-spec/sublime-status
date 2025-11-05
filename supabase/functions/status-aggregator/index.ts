import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Types
export type Severity = "P1" | "P2" | "P3" | "P4";
export type State = "operational" | "degraded" | "incident" | "maintenance" | "informational";

export interface Provider { id: string; name: string; baseUrl: string }
export interface Component { id: string; providerId: string; name: string; product: string; path?: string; status: State; tags?: string[] }
export interface IncidentUpdate { at: string; text: string; state: State }
export interface Incident { id: string; providerId: string; title: string; severity: Severity; state: "investigating"|"identified"|"monitoring"|"resolved"; components: string[]; startedAt: string; updatedAt: string; resolvedAt?: string; updates: IncidentUpdate[] }
export interface Maintenance { id: string; providerId: string; title: string; status: "scheduled"|"in_progress"|"completed"|"canceled"; windowStart: string; windowEnd: string; expectedImpact?: string; components: string[]; notes?: string }
export interface MetricSample { componentId: string; ts: string; latencyP95Ms?: number; errorRatePct?: number; trafficRps?: number; saturationPct?: number; simulado?: boolean }
export interface KPIs { mttrMinutes: number; mtbfDays: number; slaPct: number; sloPct: number; uptime90dPct: number }

// Environment configuration
const env = {
  sources: JSON.parse(Deno.env.get('STATUS_SOURCES') || '[]'),
  refreshSeconds: 60,
  slaTarget: 99.9,
  tz: "America/Sao_Paulo",
  locale: "pt-BR",
  metricsProvider: "prometheus",
  promBase: Deno.env.get('PROMETHEUS_BASE_URL') || "",
  promToken: Deno.env.get('PROMETHEUS_TOKEN') || "",
  metricsMap: JSON.parse(Deno.env.get('METRICS_MAP') || '{}'),
  demoMode: true,
};

// Cache
const cache = new Map<string, { ts: number; ttl: number; data: any }>();

function memo<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && now - hit.ts < hit.ttl) return Promise.resolve(hit.data as T);
  return fn().then(data => { cache.set(key, { ts: now, ttl: ttlMs, data }); return data; });
}

function hash(s: string): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(s);
  return Array.from(data).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 8);
}

async function httpJson<T>(url: string, timeoutMs = 8000, retry = 2): Promise<T> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { 
      signal: controller.signal,
      headers: { "accept": "application/json" }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json() as T;
  } catch (e) {
    if (retry > 0) {
      await new Promise(r => setTimeout(r, 300 * (3 - retry)));
      return httpJson<T>(url, timeoutMs, retry - 1);
    }
    throw e;
  } finally {
    clearTimeout(t);
  }
}

function mapSpState(s: string): State {
  switch ((s||"").toLowerCase()) {
    case "operational": return "operational";
    case "under_maintenance": return "maintenance";
    case "degraded_performance": return "degraded";
    case "partial_outage": return "incident";
    case "major_outage": return "incident";
    default: return "informational";
  }
}

function mapIncidentState(s: string): Incident["state"] {
  const m = (s||"").toLowerCase();
  if (m === "resolved") return "resolved";
  if (m === "monitoring") return "monitoring";
  if (m === "identified") return "identified";
  return "investigating";
}

function mapMaintenanceState(s: string): Maintenance["status"] {
  const m = (s||"").toLowerCase();
  if (m.includes("in_progress")) return "in_progress";
  if (m.includes("complete")) return "completed";
  if (m.includes("cancel")) return "canceled";
  return "scheduled";
}

function mapSeverity(impact: string): Severity {
  const m = (impact||"").toLowerCase();
  if (m.includes("critical") || m.includes("major")) return "P1";
  if (m.includes("minor")) return "P3";
  if (m.includes("maintenance")) return "P4";
  return "P2";
}

function groupFromName(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("api")) return "API";
  if (n.includes("edge") || n.includes("cdn")) return "Edge/CDN";
  if (n.includes("auth")) return "Auth";
  if (n.includes("db")) return "Database";
  return "Geral";
}

async function fetchStatuspage(baseUrl: string) {
  const api = baseUrl.replace(/\/$/, "");
  const summary = await httpJson<any>(`${api}/summary.json`);
  const provider: Provider = { id: hash(summary.page.url || api), name: summary.page.name, baseUrl: api };

  const components: Component[] = (summary.components || []).map((c: any) => ({
    id: `${provider.id}:${c.id}`,
    providerId: provider.id,
    name: c.name,
    product: groupFromName(c.name),
    status: mapSpState(c.status),
  }));

  const incidentsRaw = await httpJson<any>(`${api}/incidents.json`);
  const maintRaw = await httpJson<any>(`${api}/scheduled-maintenances.json`);

  const incidents: Incident[] = (incidentsRaw?.incidents || []).map((i: any) => ({
    id: `${provider.id}:${i.id}`,
    providerId: provider.id,
    title: i.name,
    severity: mapSeverity(i.impact),
    state: mapIncidentState(i.status),
    components: (i.components || []).map((cid: string) => `${provider.id}:${cid}`).filter(Boolean),
    startedAt: i.started_at || i.created_at,
    updatedAt: i.updated_at || i.created_at,
    resolvedAt: i.resolved_at || undefined,
    updates: (i.incident_updates || []).map((u: any) => ({
      at: u.created_at,
      text: u.body,
      state: mapSpState(u.status || "operational"),
    })),
  }));

  const maintenances: Maintenance[] = (maintRaw?.scheduled_maintenances || []).map((m: any) => ({
    id: `${provider.id}:${m.id}`,
    providerId: provider.id,
    title: m.name,
    status: mapMaintenanceState(m.status),
    windowStart: m.scheduled_for,
    windowEnd: m.scheduled_until,
    expectedImpact: m.impact || m.impact_override || "",
    components: (m.components || []).map((cid: string) => `${provider.id}:${cid}`).filter(Boolean),
    notes: (m.incident_updates?.[0]?.body) || "",
  }));

  const uptime90d = computeUptime90d(incidents, maintenances);

  return { provider, components, incidents, maintenances, uptime90d };
}

function computeUptime90d(incidents: Incident[], maintenances: Maintenance[]) {
  const days: Record<string, State> = {};
  const today = new Date();
  for (let i = 0; i < 90; i++) {
    const d = new Date(today.getTime() - i * 86400000);
    const key = d.toISOString().slice(0,10);
    days[key] = "operational";
  }
  const mark = (iso: string, s: State) => {
    const key = new Date(iso).toISOString().slice(0,10);
    if (days[key]) days[key] = mergeState(days[key], s);
  };
  incidents.forEach(i => {
    mark(i.startedAt, "incident");
    (i.updates || []).forEach(u => mark(u.at, u.state));
    if (i.resolvedAt) mark(i.resolvedAt, "operational");
  });
  maintenances.forEach(m => {
    mark(m.windowStart, "maintenance");
    mark(m.windowEnd, "operational");
  });
  return Object.keys(days).sort().map(day => ({ day, state: days[day] }));
}

function mergeState(a?: State, b?: State): State {
  const order: State[] = ["operational","informational","maintenance","degraded","incident"];
  const ia = order.indexOf(a || "operational");
  const ib = order.indexOf(b || "operational");
  return order[Math.max(ia, ib)];
}

function computeKPIs(incidents: Incident[], uptime90d: Array<{day:string;state:State}>, slaTarget: number): KPIs {
  const avg = (a: number[]) => a.reduce((x,y)=>x+y,0) / a.length;
  const round = (v: number, p=2) => Math.round(v * Math.pow(10,p)) / Math.pow(10,p);
  
  const closed = incidents.filter(i => i.resolvedAt);
  const mttrMin = closed.length
    ? avg(closed.map(i => (Date.parse(i.resolvedAt!) - Date.parse(i.startedAt)) / 60000))
    : 0;

  const serious = incidents.filter(i => ["P1","P2","P3"].includes(i.severity));
  const sorted = serious.map(i => Date.parse(i.startedAt)).sort((a,b)=>a-b);
  const gaps = [];
  for (let i=1;i<sorted.length;i++) gaps.push((sorted[i]-sorted[i-1]) / (86400000));
  const mtbfDays = gaps.length ? avg(gaps) : 0;

  const last30 = uptime90d.slice(-30);
  const upDays = last30.filter(d => d.state === "operational" || d.state === "informational").length;
  const slaPct = last30.length ? (upDays / last30.length) * 100 : 100;

  const up90 = uptime90d.filter(d => d.state === "operational" || d.state === "informational").length;
  const uptime90dPct = uptime90d.length ? (up90 / uptime90d.length) * 100 : 100;

  const sloPct = Math.min(100, (slaPct / slaTarget) * 100);

  return {
    mttrMinutes: round(mttrMin, 1),
    mtbfDays: round(mtbfDays, 2),
    slaPct: round(slaPct, 3),
    sloPct: round(sloPct, 1),
    uptime90dPct: round(uptime90dPct, 3),
  };
}

async function aggregateAll() {
  const ttlMs = env.refreshSeconds * 1000;
  return memo<any>("aggregateAll", ttlMs, async () => {
    const results = await Promise.allSettled(env.sources.map(fetchStatuspage));
    const providers: Provider[] = [];
    const components: Component[] = [];
    const incidents: Incident[] = [];
    const maintenances: Maintenance[] = [];
    const daysMap: Record<string, State> = {};

    for (const r of results) {
      if (r.status !== "fulfilled") continue;
      const { provider, components: cs, incidents: is, maintenances: ms, uptime90d } = r.value;
      providers.push(provider);
      components.push(...cs);
      incidents.push(...is);
      maintenances.push(...ms);
      uptime90d.forEach((d: any) => {
        const k = d.day;
        daysMap[k] = mergeState(daysMap[k], d.state);
      });
    }

    const uptime90d = Object.keys(daysMap).sort().map(day => ({ day, state: daysMap[day] }));
    return { providers, components, incidents, maintenances, uptime90d };
  });
}

async function getOverview() {
  const agg = await aggregateAll();
  const kpis = computeKPIs(agg.incidents, agg.uptime90d, env.slaTarget);
  return {
    providers: agg.providers,
    kpis,
    uptime90d: agg.uptime90d,
    now: new Date().toISOString(),
  };
}

async function getIncidents(filter?: any) {
  const { incidents } = await aggregateAll();
  let data = incidents.slice();
  if (filter?.status && filter.status !== "all") {
    if (filter.status === "active") data = data.filter((i: Incident) => i.state !== "resolved");
    else data = data.filter((i: Incident) => i.state === filter.status);
  }
  if (filter?.severity) data = data.filter((i: Incident) => i.severity === filter.severity);
  if (filter?.from) data = data.filter((i: Incident) => i.startedAt >= filter.from);
  if (filter?.to) data = data.filter((i: Incident) => i.startedAt <= filter.to);
  return data.sort((a: Incident, b: Incident)=>b.startedAt.localeCompare(a.startedAt));
}

async function getMaintenances(filter?: any) {
  const { maintenances } = await aggregateAll();
  let data = maintenances.slice();
  if (filter?.status && filter.status !== "all") data = data.filter((m: Maintenance) => m.status === filter.status);
  if (filter?.from) data = data.filter((m: Maintenance) => m.windowStart >= filter.from);
  if (filter?.to) data = data.filter((m: Maintenance) => m.windowEnd <= filter.to);
  return data.sort((a: Maintenance, b: Maintenance)=>b.windowStart.localeCompare(a.windowStart));
}

async function getComponents(query?: any) {
  const { components } = await aggregateAll();
  let data = components.slice();
  if (query?.product) data = data.filter((c: Component) => c.product.toLowerCase() === query.product.toLowerCase());
  return data.sort((a: Component, b: Component)=>a.product.localeCompare(b.product) || a.name.localeCompare(b.name));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'overview';

    let data;
    switch (action) {
      case 'overview':
        data = await getOverview();
        break;
      case 'incidents':
        data = await getIncidents({
          status: searchParams.get('status'),
          severity: searchParams.get('severity'),
          from: searchParams.get('from'),
          to: searchParams.get('to'),
        });
        break;
      case 'maintenances':
        data = await getMaintenances({
          status: searchParams.get('status'),
          from: searchParams.get('from'),
          to: searchParams.get('to'),
        });
        break;
      case 'components':
        data = await getComponents({
          product: searchParams.get('product'),
        });
        break;
      default:
        throw new Error('Invalid action');
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in status-aggregator:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
