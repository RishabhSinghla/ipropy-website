"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import type { PublicFilters } from "@/lib/types";
import { BUDGETS } from "@/lib/constants";

/**
 * `cities` is the list we actually hold stock in, passed by the caller.
 *
 * The CRM's global picklist offers 27 cities; every unit is in one of them. A
 * dropdown where 26 of 27 choices lead to an empty page is not a filter, it is
 * 26 dead ends presented as equals — and landing on "no results" reads as a
 * fake catalogue. When only one city has stock the control disappears entirely
 * and the footprint is stated as a fact instead.
 */
export function SearchBar({ filters, cities }: { filters: PublicFilters; cities?: string[] }) {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [configuration, setConfiguration] = useState("");
  const cityOptions = cities?.length ? cities : filters.city.map((c) => c.value);
  const [budget, setBudget] = useState(0);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (configuration) params.set("configuration", configuration);
    const b = BUDGETS[budget];
    if (b.min) params.set("minPrice", b.min);
    if (b.max) params.set("maxPrice", b.max);
    router.push(`/properties?${params.toString()}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full flex-col border border-rule-hard bg-chalk-2 sm:flex-row sm:items-stretch"
    >
      {cityOptions.length === 1 ? (
        <span className="font-data flex min-h-11 flex-1 items-center border-b border-rule px-4 text-xs uppercase tracking-[0.08em] text-ink-2 sm:border-b-0 sm:border-r">
          {cityOptions[0]}
        </span>
      ) : (
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          aria-label="City"
          className="font-data min-h-11 flex-1 border-b border-rule bg-transparent px-4 py-3.5 text-xs uppercase tracking-[0.08em] text-ink outline-none sm:border-b-0 sm:border-r"
        >
          <option value="">Any city</option>
          {cityOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      )}
      <select
        value={configuration}
        onChange={(e) => setConfiguration(e.target.value)}
        aria-label="Configuration"
        className="font-data min-h-11 flex-1 border-b border-rule bg-transparent px-4 py-3.5 text-xs uppercase tracking-[0.08em] text-ink outline-none sm:border-b-0 sm:border-r"
      >
        <option value="">Any Configuration</option>
        {filters.configuration.map((c) => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>
      <select
        value={budget}
        onChange={(e) => setBudget(Number(e.target.value))}
        aria-label="Budget"
        className="font-data min-h-11 flex-1 border-b border-rule bg-transparent px-4 py-3.5 text-xs uppercase tracking-[0.08em] text-ink outline-none sm:border-b-0 sm:border-r"
      >
        {BUDGETS.map((b, i) => (
          <option key={b.label} value={i}>{b.label}</option>
        ))}
      </select>
      <button
        type="submit"
        className="font-data flex min-h-11 items-center justify-center gap-2 bg-ink px-7 text-xs uppercase tracking-[0.12em] text-chalk transition-colors hover:bg-open"
      >
        <Search size={15} />
        Search
      </button>
    </form>
  );
}
