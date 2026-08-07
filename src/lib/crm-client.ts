import "server-only";
import type {
  Project, ProjectDetail, ProjectSearchParams, Property, PropertySearchParams, PublicFilters,
} from "./types";

// Server-only: the CRM's origin never reaches client JS. Every page/route
// handler that needs live data calls these from a Server Component or a
// route handler, never from the browser (see the plan's CORS discussion —
// this is why there's no CORS setup here at all: it's server-to-server).
const CRM_API_URL = process.env.CRM_API_URL ?? "http://localhost:4000";

// ~1 minute freshness — effectively "live" for a listings site, while still
// getting the speed and cacheability of static rendering.
const REVALIDATE_SECONDS = 60;

async function get<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const url = new URL(`${CRM_API_URL}/api/public${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
    }
  }
  const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!res.ok) {
    if (res.status === 404) throw new NotFoundError(path);
    throw new Error(`CRM public API ${path} failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export class NotFoundError extends Error {}

export function listProjects(params: ProjectSearchParams = {}): Promise<{ items: Project[]; total: number }> {
  return get<{ items: Project[]; total: number }>("/projects", params as Record<string, string | number | undefined>);
}

export function getProject(id: string): Promise<ProjectDetail> {
  return get<ProjectDetail>(`/projects/${id}`);
}

export function listProperties(params: PropertySearchParams = {}): Promise<{ items: Property[]; total: number }> {
  return get<{ items: Property[]; total: number }>("/properties", params as Record<string, string | number | undefined>);
}

export function getProperty(id: string): Promise<Property> {
  return get<Property>(`/properties/${id}`);
}

export function getFilters(): Promise<PublicFilters> {
  return get<PublicFilters>("/filters");
}
