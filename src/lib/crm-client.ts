import "server-only";
import type {
  CitySummary, Project, ProjectDetail, ProjectSearchParams, Property, PropertySearchParams, PublicFilters,
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

/**
 * Same as `get`, but a CRM that is unreachable or erroring yields `fallback`
 * instead of throwing.
 *
 * This exists because of how these pages render. The listing pages are Server
 * Components using `revalidate: 60`, so Next prerenders them during
 * `next build` — which means the CRM has to be answering at *build* time, not
 * just at request time. It frequently is not: the CRM is on a free tier that
 * sleeps after inactivity and takes ~50s to wake, and a deploy of the website
 * is exactly when nobody has been using the CRM. Letting `get` throw there
 * fails the whole Vercel build over a sleeping backend.
 *
 * Degrading to an empty list keeps the build (and the site) up, and ISR
 * repairs it within `REVALIDATE_SECONDS` of the first real visit. Detail
 * pages deliberately do NOT use this: a unit page with no unit on it is
 * meaningless, so those still throw and hit notFound()/the error boundary.
 */
async function safeGet<T>(
  path: string,
  fallback: T,
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  try {
    return await get<T>(path, params);
  } catch (error) {
    console.error(`[crm-client] ${path} unavailable, serving empty result`, error);
    return fallback;
  }
}

export function listProjects(params: ProjectSearchParams = {}): Promise<{ items: Project[]; total: number }> {
  return safeGet<{ items: Project[]; total: number }>(
    "/projects",
    { items: [], total: 0 },
    params as Record<string, string | number | undefined>,
  );
}

export function getProject(id: string): Promise<ProjectDetail> {
  return get<ProjectDetail>(`/projects/${id}`);
}

export function listProperties(params: PropertySearchParams = {}): Promise<{ items: Property[]; total: number }> {
  return safeGet<{ items: Property[]; total: number }>(
    "/properties",
    { items: [], total: 0 },
    params as Record<string, string | number | undefined>,
  );
}

export function getProperty(id: string): Promise<Property> {
  return get<Property>(`/properties/${id}`);
}

export function getFilters(): Promise<PublicFilters> {
  // Every key must be present and an array: consumers map over these directly
  // (SearchBar does `filters.city.map(...)`), so a missing key would swap one
  // crash for another.
  return safeGet<PublicFilters>("/filters", {
    city: [], locality: [], configuration: [], amenities: [],
  });
}

export function getCities(): Promise<{ items: CitySummary[] }> {
  return safeGet<{ items: CitySummary[] }>("/cities", { items: [] });
}
