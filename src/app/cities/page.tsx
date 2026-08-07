import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { getCities } from "@/lib/crm-client";
import { formatPriceRange } from "@/lib/format";
import { slugify } from "@/lib/slug";

export const metadata: Metadata = {
  title: "Browse by City",
  description: "Explore verified, live property listings city by city.",
};

export default async function CitiesPage() {
  const { items } = await getCities();

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
        {items.length} {items.length === 1 ? "City" : "Cities"}
      </span>
      <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">Browse by City</h1>
      <p className="mt-3 max-w-xl text-sm text-ink-soft">
        Every city below has live, available inventory today — not just a name on a dropdown.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <Link
            key={c.city}
            href={`/cities/${slugify(c.city)}`}
            className="group flex items-center justify-between rounded-2xl border border-line bg-paper p-6 transition-shadow hover:shadow-[0_20px_50px_-25px_rgba(25,21,16,0.3)]"
          >
            <div>
              <div className="flex items-center gap-1.5 font-display text-xl text-ink">
                <MapPin size={16} className="text-accent" />
                {c.city}
              </div>
              <div className="mt-2 text-sm text-ink-soft">
                {c.project_count} project{c.project_count === 1 ? "" : "s"} · {c.unit_count} units available
              </div>
              <div className="mt-1 text-xs text-ink-faint">{formatPriceRange(c.price_min, c.price_max)}</div>
            </div>
            <ArrowRight size={18} className="shrink-0 text-ink-faint transition-transform group-hover:translate-x-1 group-hover:text-accent" />
          </Link>
        ))}
      </div>
    </div>
  );
}
