/**
 * ₹45,00,000 → "₹45 L"; ₹1,45,00,000 → "₹1.45 Cr".
 *
 * Zero is treated as unpriced, not as free. A property costs money, so a `0` in
 * the CRM means nobody has filled the price in yet, and printing "₹0" on a
 * public listing is the worst possible reading of that. Both properties on the
 * live site are priced 0 today, and the homepage was showing ₹0 beside the word
 * AVAILABLE. `formatPriceRange` below has always treated 0 this way; this one
 * did not, which is how the two disagreed.
 */
export function formatIndianPrice(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value) || value <= 0) {
    return "Price on request";
  }
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
