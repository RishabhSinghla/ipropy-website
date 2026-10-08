"use client";

import Link from "next/link";
import Image from "next/image";
import { useSiteStore } from "@/lib/store";
import { useHasMounted } from "@/lib/useHasMounted";

export function RecentlyViewedRail() {
  const mounted = useHasMounted();
  const items = useSiteStore((s) => s.recentlyViewed);

  if (!mounted || items.length === 0) return null;

  return (
    <section className="border-y border-line bg-paper py-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <h2 className="font-display text-2xl text-ink">Recently Viewed</h2>
        <div className="mt-6 flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/properties/${item.id}`}
              className="group w-48 shrink-0"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-paper-dim">
                {item.image && (
                  <Image src={item.image} alt={item.name} fill sizes="192px" className="object-cover transition-transform group-hover:scale-105" />
                )}
              </div>
              <div className="mt-2 truncate text-sm font-medium text-ink group-hover:text-accent">{item.name}</div>
              {item.subtitle && <div className="truncate text-xs text-ink-faint">{item.subtitle}</div>}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
