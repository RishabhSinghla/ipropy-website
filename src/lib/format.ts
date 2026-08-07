/** ₹45,00,000 → "₹45 L"; ₹1,45,00,000 → "₹1.45 Cr". Mirrors the CRM's own formatIndianPrice. */
export function formatIndianPrice(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "Price on request";
  if (value >= 1_00_00_000) return `₹${trim(value / 1_00_00_000)} Cr`;
  if (value >= 1_00_000) return `₹${trim(value / 1_00_000)} L`;
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

export function formatPriceRange(min: number | null | undefined, max: number | null | undefined): string {
  if (!min && !max) return "Price on request";
  if (min && max && min !== max) return `${formatIndianPrice(min)} – ${formatIndianPrice(max)}`;
  return formatIndianPrice(min ?? max);
}

function trim(n: number): string {
  return (Math.round(n * 100) / 100).toString();
}

export function formatArea(value: number | null | undefined, unit = "sqft"): string {
  if (value === null || value === undefined) return "—";
  return `${value.toLocaleString("en-IN")} ${unit}`;
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

/** Configurations/statuses in "1 BHK" / "New Launch" form are already display-ready. */
export function pluralize(count: number, word: string): string {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}
