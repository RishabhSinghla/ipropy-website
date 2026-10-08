"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useSiteStore } from "@/lib/store";
import { useHasMounted } from "@/lib/useHasMounted";
import { useListings } from "@/lib/useListings";
import { ListingCard } from "@/components/ListingCard";

/** The hearts, kept in this browser — no account needed to keep a shortlist. */
export function SavedClient() {
  const mounted = useHasMounted();
  const saved = useSiteStore((s) => s.shortlist);
  const { items, missing } = useListings(saved.map((s) => s.id), mounted);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">Your shortlist</span>
      <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">Saved properties</h1>
      <p className="mt-1 text-sm text-ink-soft">Kept on this device. Prices and availability are live.</p>
      {missing > 0 && (
        <p className="mt-1 text-xs text-ink-faint">{missing} you saved {missing === 1 ? "has" : "have"} since been sold or taken off the market.</p>
      )}

      <div className="mt-10">
        {!mounted || items === null ? (
          <div className="py-20 text-center text-sm text-ink-faint">Loading…</div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-paper-dim py-24 text-center">
            <Heart size={30} className="text-ink-faint" />
            <p className="font-display text-xl text-ink">No saved properties yet</p>
            <p className="text-sm text-ink-soft">Tap the heart on any property to keep it here.</p>
            <Link href="/properties" className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper">Browse properties</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </div>
    </div>
  );
}
