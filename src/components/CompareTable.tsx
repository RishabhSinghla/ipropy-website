"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Check, Minus } from "lucide-react";
import type { Project, Property } from "@/lib/types";
import { formatIndianPrice, formatPriceRange, formatArea, formatDate } from "@/lib/format";
import { mediaUrl } from "@/lib/media";
import { useSiteStore } from "@/lib/store";
import { cn } from "@/lib/cn";

type Row<T> = {
  label: string;
  render: (item: T) => string;
  sortValue?: (item: T) => number | null;
  betterWhen?: "lower" | "higher";
};

const PROJECT_ROWS: Row<Project>[] = [
  { label: "Price Range", render: (p) => formatPriceRange(p.price_min, p.price_max), sortValue: (p) => p.price_min, betterWhen: "lower" },
  { label: "Rate / sq.ft", render: (p) => (p.rate_per_sqft ? formatIndianPrice(p.rate_per_sqft) : "—"), sortValue: (p) => p.rate_per_sqft, betterWhen: "lower" },
  { label: "Status", render: (p) => p.status },
  { label: "Configurations", render: (p) => p.configurations.join(", ") || "—" },
  { label: "Available Units", render: (p) => String(p.available_units), sortValue: (p) => p.available_units, betterWhen: "higher" },
  { label: "Land Area", render: (p) => (p.total_land_area ? `${p.total_land_area} ${p.land_area_unit}` : "—") },
  { label: "Possession", render: (p) => formatDate(p.possession_date), sortValue: (p) => (p.possession_date ? new Date(p.possession_date).getTime() : null), betterWhen: "lower" },
  { label: "Construction Progress", render: (p) => (p.completion_percent !== null ? `${p.completion_percent}%` : "—"), sortValue: (p) => p.completion_percent, betterWhen: "higher" },
  { label: "RERA Number", render: (p) => p.rera_number ?? "—" },
];

const PROPERTY_ROWS: Row<Property>[] = [
  { label: "All-Inclusive Price", render: (p) => formatIndianPrice(p.total_price ?? p.base_price), sortValue: (p) => p.total_price ?? p.base_price, betterWhen: "lower" },
  { label: "Rate / sq.ft", render: (p) => (p.rate_per_sqft ? formatIndianPrice(p.rate_per_sqft) : "—"), sortValue: (p) => p.rate_per_sqft, betterWhen: "lower" },
  { label: "Configuration", render: (p) => p.configuration ?? "—" },
  { label: "Carpet Area", render: (p) => formatArea(p.carpet_area, p.area_unit), sortValue: (p) => p.carpet_area, betterWhen: "higher" },
  { label: "Bedrooms / Bathrooms", render: (p) => `${p.bedrooms ?? "—"} / ${p.bathrooms ?? "—"}` },
  { label: "Floor", render: (p) => (p.floor !== null ? String(p.floor) : "—") },
  { label: "Facing", render: (p) => p.facing ?? "—" },
  { label: "Furnishing", render: (p) => p.furnishing ?? "—" },
  { label: "Possession", render: (p) => formatDate(p.possession_date), sortValue: (p) => (p.possession_date ? new Date(p.possession_date).getTime() : null), betterWhen: "lower" },
];

export function CompareTable({ kind, items }: { kind: "project" | "property"; items: (Project | Property)[] }) {
  const removeFromCompare = useSiteStore((s) => s.removeFromCompare);
  const rows = kind === "project" ? PROJECT_ROWS : PROPERTY_ROWS;
  const allAmenities = Array.from(new Set(items.flatMap((i) => i.amenities))).sort();

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full min-w-[720px] border-collapse">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 w-40 bg-paper" />
            {items.map((item) => {
              const image = mediaUrl(item.gallery[0]);
              const href = kind === "project" ? `/projects/${item.id}` : `/properties/${item.id}`;
              const title = kind === "project" ? (item as Project).name : (item as Property).project_name ?? (item as Property).name;
              return (
                <th key={item.id} className="min-w-[200px] px-4 pb-4 text-left align-top">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => removeFromCompare(item.id)}
                      aria-label="Remove"
                      className="absolute -right-1 -top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-paper"
                    >
                      <X size={12} />
                    </button>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-paper-dim">
                      {image && <Image src={image} alt={title} fill sizes="200px" className="object-cover" />}
                    </div>
                    <Link href={href} className="mt-2 block font-display text-sm text-ink hover:text-accent">
                      {title}
                    </Link>
                    <div className="text-xs text-ink-faint">{[item.locality, item.city].filter(Boolean).join(", ")}</div>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const values = items.map((i) => row.sortValue?.(i as never) ?? null);
            const best =
              row.betterWhen && values.some((v) => v !== null)
                ? row.betterWhen === "lower"
                  ? Math.min(...(values.filter((v): v is number => v !== null)))
                  : Math.max(...(values.filter((v): v is number => v !== null)))
                : null;

            return (
              <tr key={row.label} className="border-t border-line">
                <td className="sticky left-0 z-10 bg-paper py-3 pr-4 text-xs font-medium uppercase tracking-wide text-ink-faint">
                  {row.label}
                </td>
                {items.map((item, i) => (
                  <td
                    key={item.id}
                    className={cn(
                      "px-4 py-3 text-sm",
                      best !== null && values[i] === best ? "font-semibold text-success" : "text-ink-soft",
                    )}
                  >
                    {row.render(item as never)}
                  </td>
                ))}
              </tr>
            );
          })}

          {allAmenities.length > 0 && (
            <>
              <tr className="border-t border-line">
                <td colSpan={items.length + 1} className="pb-2 pt-6 text-xs font-semibold uppercase tracking-wide text-ink">
                  Amenities
                </td>
              </tr>
              {allAmenities.map((amenity) => (
                <tr key={amenity} className="border-t border-line">
                  <td className="sticky left-0 z-10 bg-paper py-2.5 pr-4 text-sm text-ink-soft">{amenity}</td>
                  {items.map((item) => (
                    <td key={item.id} className="px-4 py-2.5">
                      {item.amenities.includes(amenity) ? (
                        <Check size={16} className="text-success" />
                      ) : (
                        <Minus size={16} className="text-ink-faint/40" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}
