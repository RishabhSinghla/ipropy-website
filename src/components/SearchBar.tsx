"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import type { ListingFacets } from "@/lib/types";
import { BUDGETS } from "@/lib/constants";

/** The home page's search. Offers only what is actually listed today. */
export function SearchBar({ facets }: { facets: ListingFacets }) {
  const router = useRouter();
  const [locality, setLocality] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [budget, setBudget] = useState(0);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (locality) params.set("locality", locality);
    if (bedrooms) params.set("bedrooms", bedrooms);
    const b = BUDGETS[budget];
    if (b.min) params.set("minPrice", b.min);
    if (b.max) params.set("maxPrice", b.max);
    const qs = params.toString();
    router.push(qs ? `/properties?${qs}` : "/properties");
  }

  const select = "flex-1 rounded-xl bg-transparent px-4 py-3 text-sm text-ink outline-none sm:rounded-full";

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full flex-col gap-2 rounded-2xl border border-line bg-paper/95 p-2 shadow-[0_20px_60px_-25px_rgba(25,21,16,0.35)] backdrop-blur-sm sm:flex-row sm:items-stretch sm:rounded-full"
    >
      <select aria-label="Locality" value={locality} onChange={(e) => setLocality(e.target.value)} className={select}>
        <option value="">Any locality</option>
        {facets.locality.map((o) => <option key={o.value} value={o.value}>{o.label} ({o.count})</option>)}
      </select>
      <div className="hidden w-px bg-line sm:block" />
      <select aria-label="Size" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className={select}>
        <option value="">Any size</option>
        {facets.bedrooms.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <div className="hidden w-px bg-line sm:block" />
      <select aria-label="Budget" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className={select}>
        {BUDGETS.map((b, i) => <option key={b.label} value={i}>{b.label}</option>)}
      </select>
      <button type="submit" className="flex items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3 text-sm font-medium text-paper transition-transform hover:scale-[1.02] sm:rounded-full">
        <Search size={15} /> Search
      </button>
    </form>
  );
}
