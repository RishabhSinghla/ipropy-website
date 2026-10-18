import "server-only";
import type {
  BlogPost, BlogPostSummary, Brand, Listing, ListingFacets, ListingPage, ListingSearch,
} from "./types";

// Server-only: the CRM's origin never reaches client JS. Every page/route
// handler that needs live data calls these from a Server Component or a
// route handler, never from the browser (see the plan's CORS discussion —
// this is why there's no CORS setup here at all: it's server-to-server).
const CRM_API_URL = process.env.CRM_API_URL ?? "http://localhost:4000";

// ~1 minute freshness — effectively "live" for a listings site, while still
// getting the speed and cacheability of static rendering.
const REVALIDATE_SECONDS = 60;

type Params = Record<string, string | number | string[] | undefined>;

async function get<T>(path: string, params?: Params): Promise<T> {
  const url = new URL(`${CRM_API_URL}/api/public${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (Array.isArray(value)) {
        if (value.length) url.searchParams.set(key, value.join(","));
      } else if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
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
  params?: Params,
): Promise<T> {
  try {
    return await get<T>(path, params);
  } catch (error) {
    console.error(`[crm-client] ${path} unavailable, serving empty result`, error);
    return fallback;
  }
}

// --- The property portal ----------------------------------------------------

export function listListings(search: ListingSearch = {}): Promise<ListingPage> {
  return safeGet<ListingPage>("/listings", { items: [], total: 0, page: 1, pages: 0 }, { ...search });
}

/** Throws NotFoundError for a listing that is unticked, sold or never existed. */
export function getListing(id: string): Promise<Listing> {
  return get<Listing>(`/listings/${encodeURIComponent(id)}`);
}

export function getListingFacets(): Promise<ListingFacets> {
  // Every list present and an array: the filters map over them directly.
  return safeGet<ListingFacets>("/listings/filters", {
    city: [], locality: [], bedrooms: [], category: [], price: { min: null, max: null }, total: 0,
  });
}

export function getBrand(): Promise<Brand> {
  return safeGet<Brand>("/brand", { orgName: "iPropy", tagline: null, socialLinks: [] });
}

// --- Blog --------------------------------------------------------------------

/**
 * Posts are written in the CRM and read here, so there is one system of record
 * and no second CMS. Listing calls use `safeGet` for the same reason the
 * property listings do: a sleeping CRM must not fail the whole Vercel build.
 */
export function listBlogPosts(
  params: { limit?: number; offset?: number; category?: string } = {},
): Promise<{ items: BlogPostSummary[]; total: number }> {
  return safeGet<{ items: BlogPostSummary[]; total: number }>(
    "/blog",
    { items: [], total: 0 },
    params,
  );
}

export function getBlogCategories(): Promise<{ items: { category: string; count: number }[] }> {
  return safeGet<{ items: { category: string; count: number }[] }>("/blog/categories", { items: [] });
}

/** Throws NotFoundError for an unknown or unpublished slug, so the page 404s. */
export function getBlogPost(slug: string): Promise<BlogPost> {
  return get<BlogPost>(`/blog/${encodeURIComponent(slug)}`);
}
