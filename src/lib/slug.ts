export function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/** Cities/localities come from the CRM's picklist values (e.g. "Navi Mumbai") — match a URL slug back to the exact stored value. */
export function findBySlug(options: { value: string }[], slug: string): string | undefined {
  return options.find((o) => slugify(o.value) === slug)?.value;
}
