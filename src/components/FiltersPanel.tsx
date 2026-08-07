"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import type { PublicFilters } from "@/lib/types";
import { BUDGETS } from "@/lib/constants";
import { cn } from "@/lib/cn";

export function FiltersPanel({
  filters,
  sortOptions,
}: {
  filters: PublicFilters;
  sortOptions: { value: string; label: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  function set(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("offset");
    router.push(`${pathname}?${params.toString()}`);
  }

  function setBudget(index: number) {
    const params = new URLSearchParams(searchParams.toString());
    const b = BUDGETS[index];
    if (b.min) params.set("minPrice", b.min); else params.delete("minPrice");
    if (b.max) params.set("maxPrice", b.max); else params.delete("maxPrice");
    params.delete("offset");
    router.push(`${pathname}?${params.toString()}`);
  }

  const currentBudgetIndex = BUDGETS.findIndex(
    (b) => b.min === (searchParams.get("minPrice") ?? "") && b.max === (searchParams.get("maxPrice") ?? ""),
  );
  const activeCount = ["city", "configuration", "minPrice", "maxPrice"].filter((k) => searchParams.get(k)).length;

  const fields = (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Field label="City">
        <select value={searchParams.get("city") ?? ""} onChange={(e) => set("city", e.target.value)} className="select">
          <option value="">Any City</option>
          {filters.city.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </Field>
      <Field label="Configuration">
        <select value={searchParams.get("configuration") ?? ""} onChange={(e) => set("configuration", e.target.value)} className="select">
          <option value="">Any Configuration</option>
          {filters.configuration.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </Field>
      <Field label="Budget">
        <select value={currentBudgetIndex >= 0 ? currentBudgetIndex : 0} onChange={(e) => setBudget(Number(e.target.value))} className="select">
          {BUDGETS.map((b, i) => <option key={b.label} value={i}>{b.label}</option>)}
        </select>
      </Field>
      <Field label="Sort by">
        <select value={searchParams.get("sort") ?? sortOptions[0].value} onChange={(e) => set("sort", e.target.value)} className="select">
          {sortOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </Field>
    </div>
  );

  return (
    <div className="border-b border-line bg-paper-dim">
      <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-2 text-sm font-medium text-ink lg:hidden"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal size={15} />
            Filters {activeCount > 0 && `(${activeCount})`}
          </span>
          {mobileOpen ? <X size={16} /> : null}
        </button>

        <div className={cn("mt-4 lg:mt-0", !mobileOpen && "hidden lg:block")}>{fields}</div>
      </div>

      <style jsx>{`
        :global(.select) {
          width: 100%;
          border: 1px solid var(--line);
          background: var(--paper);
          border-radius: 0.75rem;
          padding: 0.6rem 0.9rem;
          font-size: 0.875rem;
          color: var(--ink);
          outline: none;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-ink-faint">{label}</span>
      {children}
    </label>
  );
}
