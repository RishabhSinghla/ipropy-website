
// The property portal's listing, exactly as the CRM's /api/public/listings
// returns it (core/sharing/publicListings.ts in the CRM repo). The CRM decides
// which facts a buyer may read; the seller's name and number are never in it.

export interface ListingFact {
  name: string;
  label: string;
  /** The CRM field's kind — "currency", "area", "integer"… */
  type?: string;
  value: string | number | boolean | string[];
}

export interface Listing {
  id: string;
  title: string;
  /** Rupees. With `priceBasis` saying "Per Sq. Ft." it is a rate, not a total. */
  price: number | null;
  priceBasis: string | null;
  rent: number | null;
  area: number | null;
  areaUnit: string | null;
  bedrooms: string | null;
  category: string | null;
  locality: string | null;
  city: string | null;
  photos: string[];
  facts: ListingFact[];
  listedAt: string;
  updatedAt: string;
}

export interface ListingPage {
  items: Listing[];
  total: number;
  page: number;
  pages: number;
}

export interface FacetOption {
  value: string;
  label: string;
  count: number;
}

export interface ListingFacets {
  city: FacetOption[];
  locality: FacetOption[];
  bedrooms: FacetOption[];
  category: FacetOption[];
  price: { min: number | null; max: number | null };
  total: number;
}

export type ListingSort = "newest" | "price_asc" | "price_desc" | "area_desc";

export interface ListingSearch {
  q?: string;
  city?: string[];
  locality?: string[];
  bedrooms?: string[];
  category?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: ListingSort;
  page?: number;
  limit?: number;
}

export interface Brand {
  orgName: string;
  tagline: string | null;
  socialLinks: { platform: string; label: string; url: string }[];
}

// --- Blog --------------------------------------------------------------------

export interface BlogPostSummary {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  cover_image_url: string | null;
  published_at: string;
  reading_minutes: number;
  key_takeaway: string | null;
  author: string | null;
}

export interface BlogPost extends BlogPostSummary {
  body: string | null;
  word_count: number;
  /** Pairs surfaced as FAQPage schema — what answer engines actually lift. */
  faq: { question: string; answer: string }[];
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  canonical_url: string | null;
  author_avatar: string | null;
  updated_at: string;
  related: BlogPostSummary[];
}
