"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import type { PublicFilters } from "@/lib/types";
import { BUDGETS } from "@/lib/constants";

export function SearchBar({ filters }: { filters: PublicFilters }) {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [configuration, setConfiguration] = useState("");
  const [budget, setBudget] = useState(0);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (configuration) params.set("configuration", configuration);
    const b = BUDGETS[budget];
    if (b.min) params.set("minPrice", b.min);
    if (b.max) params.set("maxPrice", b.max);
    router.push(`/projects?${params.toString()}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full flex-col border border-rule-hard bg-chalk-2 sm:flex-row sm:items-stretch"
    >
      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="font-data flex-1 border-b border-rule bg-transparent px-4 py-3.5 text-xs uppercase tracking-[0.08em] text-ink outline-none sm:border-b-0 sm:border-r"
      >
        <option value="">Any City</option>
        {filters.city.map((c) => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>
      <select
        value={configuration}
        onChange={(e) => setConfiguration(e.target.value)}
        className="font-data flex-1 border-b border-rule bg-transparent px-4 py-3.5 text-xs uppercase tracking-[0.08em] text-ink outline-none sm:border-b-0 sm:border-r"
      >
        <option value="">Any Configuration</option>
        {filters.configuration.map((c) => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>
      <select
        value={budget}
        onChange={(e) => setBudget(Number(e.target.value))}
        className="font-data flex-1 border-b border-rule bg-transparent px-4 py-3.5 text-xs uppercase tracking-[0.08em] text-ink outline-none sm:border-b-0 sm:border-r"
      >
        {BUDGETS.map((b, i) => (
          <option key={b.label} value={i}>{b.label}</option>
        ))}
      </select>
      <button
        type="submit"
        className="font-data flex items-center justify-center gap-2 bg-ink px-7 py-3.5 text-xs uppercase tracking-[0.12em] text-chalk transition-colors hover:bg-open"
      >
        <Search size={15} />
        Search
      </button>
    </form>
  );
}
