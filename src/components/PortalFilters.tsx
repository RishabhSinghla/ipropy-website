"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { Loader2, Search, SlidersHorizontal, X } from "lucide-react";
import type { FacetOption, ListingFacets } from "@/lib/types";
import { BUDGETS } from "@/lib/constants";
import { SORTS } from "@/lib/listing";
import { cn } from "@/lib/cn";

const MULTI = ["locality", "bedrooms", "category", "city"] as const;
type Multi = (typeof MULTI)[number];

/**
 * Every filter lives in the address bar, so a search can be bookmarked, shared
 * on WhatsApp and opened by the server with nothing to rebuild. Each option
 * carries its count, and only values some live listing has are offered — a
 * locality with nothing behind it is a dead end.
 */
export function PortalFilters({ facets }: { facets: ListingFacets }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState(params.get("q") ?? "");

  function go(next: URLSearchParams) {
    next.delete("page");
    startTransition(() => router.push(`${pathname}?${next.toString()}`, { scroll: false }));
  }

  function setOne(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value); else next.delete(key);
    go(next);
  }

  function toggle(key: Multi, value: string) {
    const next = new URLSearchParams(params.toString());
    const chosen = new Set((next.get(key) ?? "").split(",").filter(Boolean));
    if (chosen.has(value)) chosen.delete(value); else chosen.add(value);
    if (chosen.size) next.set(key, [...chosen].join(",")); else next.delete(key);
    go(next);
  }

  function setBudget(index: number) {
    const next = new URLSearchParams(params.toString());
    const b = BUDGETS[index];
    if (b.min) next.set("minPrice", b.min); else next.delete("minPrice");
    if (b.max) next.set("maxPrice", b.max); else next.delete("maxPrice");
    go(next);
  }

  function onSearch(e: FormEvent) {
    e.preventDefault();
    setOne("q", q.trim());
  }

  const budgetIndex = Math.max(0, BUDGETS.findIndex(
    (b) => b.min === (params.get("minPrice") ?? "") && b.max === (params.get("maxPrice") ?? ""),
  ));
  const chosen = (key: Multi) => new Set((params.get(key) ?? "").split(",").filter(Boolean));
  const active = MULTI.reduce((n, k) => n + chosen(k).size, 0)
    + (budgetIndex > 0 ? 1 : 0) + (params.get("q") ? 1 : 0);

  return (
    <div className="border-b border-line bg-paper-dim">
      <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <form onSubmit={onSearch} className="flex flex-1 items-center gap-2 rounded-full border border-line bg-paper px-4">
            <Search size={15} className="shrink-0 text-ink-faint" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search a locality, a type, anything in the description"
              aria-label="Search listings"
              className="h-11 w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
            />
            {pending && <Loader2 size={15} className="shrink-0 animate-spin text-ink-faint" />}
          </form>
          <div className="flex gap-2">
            <select
              aria-label="Budget"
              value={budgetIndex}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="h-11 min-w-0 flex-1 rounded-full border border-line bg-paper px-3 text-sm text-ink outline-none"
            >
              {BUDGETS.map((b, i) => <option key={b.label} value={i}>{b.label}</option>)}
            </select>
            <select
              aria-label="Sort"
              value={params.get("sort") ?? "newest"}
              onChange={(e) => setOne("sort", e.target.value === "newest" ? "" : e.target.value)}
              className="h-11 min-w-0 flex-1 rounded-full border border-line bg-paper px-3 text-sm text-ink outline-none"
            >
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="flex h-11 items-center gap-2 rounded-full border border-line bg-paper px-4 text-sm text-ink lg:hidden"
            >
              <SlidersHorizontal size={14} /> {active > 0 ? active : ""}
            </button>
          </div>
        </div>

        <div className={cn("mt-4 space-y-3", !open && "hidden lg:block")}>
          <ChipRow label="Locality" options={facets.locality} chosen={chosen("locality")} onToggle={(v) => toggle("locality", v)} />
          <ChipRow label="Size" options={facets.bedrooms} chosen={chosen("bedrooms")} onToggle={(v) => toggle("bedrooms", v)} />
          <ChipRow label="Type" options={facets.category} chosen={chosen("category")} onToggle={(v) => toggle("category", v)} />
          {facets.city.length > 1 && (
            <ChipRow label="City" options={facets.city} chosen={chosen("city")} onToggle={(v) => toggle("city", v)} />
          )}
          {active > 0 && (
            <button
              type="button"
              onClick={() => { setQ(""); go(new URLSearchParams(params.get("sort") ? { sort: params.get("sort")! } : {})); }}
              className="flex items-center gap-1 text-xs font-medium text-ink-soft hover:text-ink"
            >
              <X size={12} /> Clear all filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const SHOWN = 10;

function ChipRow({ label, options, chosen, onToggle }: {
  label: string;
  options: FacetOption[];
  chosen: Set<string>;
  onToggle: (value: string) => void;
}) {
  const [all, setAll] = useState(false);
  if (options.length === 0) return null;
  // A chosen option stays visible even when it is past the fold.
  const visible = all ? options : options.filter((o, i) => i < SHOWN || chosen.has(o.value));

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-16 shrink-0 text-[11px] font-medium uppercase tracking-wide text-ink-faint">{label}</span>
      {visible.map((o) => {
        const on = chosen.has(o.value);
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onToggle(o.value)}
            aria-pressed={on}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs transition-colors",
              on ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink-soft hover:border-accent hover:text-ink",
            )}
          >
            {o.label} <span className={on ? "text-paper/70" : "text-ink-faint"}>{o.count}</span>
          </button>
        );
      })}
      {options.length > SHOWN && (
        <button type="button" onClick={() => setAll((v) => !v)} className="text-xs font-medium text-accent">
          {all ? "Fewer" : `+${options.length - visible.length} more`}
        </button>
      )}
    </div>
  );
}
