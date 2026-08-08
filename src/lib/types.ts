// Mirrors the whitelisted shape returned by the CRM's public API
// (packages/server/src/api/routes/public.ts in the iPropy-crm repo).
// Anything not listed here simply isn't exposed by that API.

export interface Project {
  id: string;
  name: string;
  status: string;
  project_type: string | null;
  developer_name: string | null;
  city: string | null;
  locality: string | null;
  micro_market: string | null;
  state: string | null;
  address: Record<string, unknown>;
  latitude: number | null;
  longitude: number | null;
  rera_number: string | null;
  rera_expiry: string | null;
  total_land_area: number | null;
  land_area_unit: string | null;
  total_towers: number | null;
  total_floors: number | null;
  total_units: number | null;
  available_units: number;
  booked_units: number;
  open_area_percent: number | null;
  price_min: number | null;
  price_max: number | null;
  rate_per_sqft: number | null;
  configurations: string[];
  launch_date: string | null;
  possession_date: string | null;
  completion_percent: number | null;
  amenities: string[];
  usps: string[];
  brochure_url: string | null;
  video_url: string | null;
  virtual_tour_url: string | null;
  master_plan_url: string | null;
  gallery: string[];
  floor_plans: string[];
  connectivity: { place: string; distance: string }[];
  description: string | null;
}

export interface Property {
  id: string;
  name: string;
  project_id: string | null;
  project_name: string | null;
  status: string;
  property_type: string | null;
  configuration: string | null;
  tower: string | null;
  wing: string | null;
  floor: number | null;
  facing: string | null;
  view_description: string | null;
  corner_unit: boolean;
  vastu_compliant: boolean | null;
  carpet_area: number | null;
  built_up_area: number | null;
  super_built_up_area: number | null;
  plot_area: number | null;
  balcony_area: number | null;
  terrace_area: number | null;
  area_unit: string;
  bedrooms: number | null;
  bathrooms: number | null;
  balconies: number | null;
  parking_slots: number | null;
  furnishing: string | null;
  base_price: number | null;
  rate_per_sqft: number | null;
  floor_rise_charge: number | null;
  plc_charge: number | null;
  parking_charge: number | null;
  club_membership: number | null;
  maintenance_deposit: number | null;
  other_charges: number | null;
  gst_percent: number | null;
  total_price: number | null;
  possession_status: string | null;
  possession_date: string | null;
  is_resale: boolean;
  gallery: string[];
  floor_plan_url: string | null;
  video_url: string | null;
  virtual_tour_url: string | null;
  amenities: string[];
  city: string | null;
  locality: string | null;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
}

export interface ProjectDetail {
  project: Project;
  units: Property[];
  similar: Project[];
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface PublicFilters {
  city: FilterOption[];
  locality: FilterOption[];
  configuration: FilterOption[];
  amenities: FilterOption[];
}

export interface CitySummary {
  city: string;
  project_count: number;
  unit_count: number;
  price_min: number | null;
  price_max: number | null;
}

export type ProjectSort = "possession" | "price_asc" | "price_desc" | "newest";
export type PropertySort = "price_asc" | "price_desc" | "area_desc" | "possession";

export interface ProjectSearchParams {
  city?: string;
  locality?: string;
  configuration?: string;
  minPrice?: number;
  maxPrice?: number;
  possessionBy?: string;
  sort?: ProjectSort;
  limit?: number;
  offset?: number;
}

export interface PropertySearchParams {
  project?: string;
  city?: string;
  configuration?: string;
  bedrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  sort?: PropertySort;
  limit?: number;
  offset?: number;
}

/** Either a Project or a Property — the compare tool works across both. */
export type Comparable = ({ kind: "project" } & Project) | ({ kind: "property" } & Property);

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
