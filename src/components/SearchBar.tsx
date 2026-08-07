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
      className="flex w-full flex-col gap-2 rounded-2xl border border-line bg-paper/95 p-2 shadow-[0_20px_60px_-25px_rgba(25,21,16,0.35)] backdrop-blur-sm sm:flex-row sm:items-stretch sm:rounded-full"
    >
      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="flex-1 rounded-xl bg-transparent px-4 py-3 text-sm text-ink outline-none sm:rounded-full"
      >
        <option value="">Any City</option>
        {filters.city.map((c) => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>
      <div className="hidden w-px bg-line sm:block" />
      <select
        value={configuration}
        onChange={(e) => setConfiguration(e.target.value)}
        className="flex-1 rounded-xl bg-transparent px-4 py-3 text-sm text-ink outline-none sm:rounded-full"
      >
        <option value="">Any Configuration</option>
        {filters.configuration.map((c) => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>
      <div className="hidden w-px bg-line sm:block" />
      <select
        value={budget}
        onChange={(e) => setBudget(Number(e.target.value))}
        className="flex-1 rounded-xl bg-transparent px-4 py-3 text-sm text-ink outline-none sm:rounded-full"
      >
        {BUDGETS.map((b, i) => (
          <option key={b.label} value={i}>{b.label}</option>
        ))}
      </select>
      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3 text-sm font-medium text-paper transition-transform hover:scale-[1.02] sm:rounded-full"
      >
        <Search size={15} />
        Search
      </button>
    </form>
  );
}
