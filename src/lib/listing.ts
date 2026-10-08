import type { Listing, ListingSearch, ListingSort } from "./types";
import { formatIndianPrice } from "./format";
import { mediaUrl } from "./media";

export const PAGE_SIZE = 18;

export const SORTS: { value: ListingSort; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "area_desc", label: "Largest first" },
];

export function listingHref(id: string): string {
  return `/properties/${id}`;
}

/** The cover photo as a full URL, or null when the listing has none. */
export function coverOf(listing: Listing): string | null {
  return mediaUrl(listing.photos[0]);
}

/**
 * A price says whether it is the whole amount or a rate. "Per Sq. Ft." on a
 * ₹9,500 price is a rate; printed as "₹9,500" it reads like a mistake.
 */
export function isRate(listing: Pick<Listing, "priceBasis">): boolean {
  return /\bper\b/i.test(listing.priceBasis ?? "");
}

export function priceText(listing: Pick<Listing, "price" | "priceBasis" | "rent">): string {
  if (listing.price) {
    if (isRate(listing)) {
      const unit = (listing.priceBasis ?? "").replace(/^\s*per\s*/i, "").trim();
      return `${formatIndianPrice(listing.price)} / ${unit || "unit"}`;
    }
    return formatIndianPrice(listing.price);
  }
  if (listing.rent) return `${formatIndianPrice(listing.rent)} / month`;
  return "Price on request";
}

export function areaText(listing: Pick<Listing, "area" | "areaUnit">): string | null {
  if (!listing.area) return null;
  return `${listing.area.toLocaleString("en-IN")} ${listing.areaUnit ?? "sq ft"}`;
}

/** ₹ per square foot, only when the price is a total and the area is in sq ft. */
export function ratePerSqft(listing: Pick<Listing, "price" | "priceBasis" | "area" | "areaUnit">): string | null {
  if (!listing.price || !listing.area || isRate(listing)) return null;
  if (listing.areaUnit && !/sq\.?\s*f/i.test(listing.areaUnit)) return null;
  return `₹${Math.round(listing.price / listing.area).toLocaleString("en-IN")} / sq ft`;
}

export function listedAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "Listed today";
  if (days === 1) return "Listed yesterday";
  if (days < 30) return `Listed ${days} days ago`;
  const months = Math.floor(days / 30);
  return `Listed ${months} month${months === 1 ? "" : "s"} ago`;
}

/** A fact's value as words a buyer reads; money in lakh and crore. */
export function factText(value: unknown, type?: string): string {
  if (type === "currency" && typeof value === "number") return formatIndianPrice(value);
  if (value === true) return "Yes";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "number") return value.toLocaleString("en-IN");
  return String(value);
}

type RawParams = Record<string, string | string[] | undefined>;

function many(value: string | string[] | undefined): string[] | undefined {
  const list = (Array.isArray(value) ? value : value ? value.split(",") : []).map((v) => v.trim()).filter(Boolean);
  return list.length ? list : undefined;
}

function one(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** The page's search parameters, read the one way every page reads them. */
export function searchFromParams(sp: RawParams): ListingSearch {
  const sort = one(sp.sort);
  return {
    q: one(sp.q)?.slice(0, 80) || undefined,
    city: many(sp.city),
    locality: many(sp.locality),
    bedrooms: many(sp.bedrooms),
    category: many(sp.category),
    minPrice: Number(one(sp.minPrice)) || undefined,
    maxPrice: Number(one(sp.maxPrice)) || undefined,
    sort: SORTS.some((s) => s.value === sort) ? (sort as ListingSort) : undefined,
    page: Number(one(sp.page)) || undefined,
  };
}
