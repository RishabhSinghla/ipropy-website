"use client";

import Image from "next/image";
import Link from "next/link";
import { BedDouble, GitCompareArrows, Heart, MapPin, Maximize2, Images } from "lucide-react";
import type { Listing } from "@/lib/types";
import { areaText, coverOf, listedAgo, listingHref, priceText, ratePerSqft } from "@/lib/listing";
import { useSiteStore } from "@/lib/store";
import { useHasMounted } from "@/lib/useHasMounted";
import { cn } from "@/lib/cn";

export function ListingCard({ listing, priority = false }: { listing: Listing; priority?: boolean }) {
  const mounted = useHasMounted();
  const cover = coverOf(listing);
  // Both lists live in this browser, so the server always draws "not saved"
  // and the first paint after hydration corrects it.
  const shortlisted = useSiteStore((s) => s.isShortlisted(listing.id)) && mounted;
  const comparing = useSiteStore((s) => s.isComparing(listing.id)) && mounted;
  const toggleShortlist = useSiteStore((s) => s.toggleShortlist);
  const addToCompare = useSiteStore((s) => s.addToCompare);
  const removeFromCompare = useSiteStore((s) => s.removeFromCompare);

  const ref = { id: listing.id, name: listing.title, subtitle: priceText(listing), image: cover };
  const area = areaText(listing);
  const rate = ratePerSqft(listing);
  const place = [listing.locality, listing.city].filter(Boolean).join(", ");

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-paper transition-shadow hover:shadow-[0_20px_50px_-20px_rgba(25,21,16,0.25)]">
      <Link href={listingHref(listing.id)} className="relative block aspect-[4/3] overflow-hidden bg-paper-dim">
        {cover ? (
          <Image
            src={cover}
            alt={listing.title}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 92vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1 text-ink-faint">
            <span className="font-display text-3xl">{listing.bedrooms ?? listing.category ?? "iPropy"}</span>
            <span className="text-xs">Photos on request</span>
          </div>
        )}
        {listing.category && (
          <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-3 py-1 text-[11px] font-medium text-ink backdrop-blur-sm">
            {listing.category}
          </span>
        )}
        {listing.photos.length > 1 && (
          <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-ink/70 px-2 py-0.5 text-[11px] text-paper">
            <Images size={11} /> {listing.photos.length}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <div className="font-display text-xl text-ink">{priceText(listing)}</div>
          {rate && <div className="text-xs text-ink-faint">{rate}</div>}
        </div>
        <Link href={listingHref(listing.id)}>
          <h3 className="text-[15px] font-medium leading-snug text-ink transition-colors group-hover:text-accent">
            {listing.title}
          </h3>
        </Link>
        {place && (
          <p className="flex items-center gap-1 text-xs text-ink-soft">
            <MapPin size={12} className="shrink-0" /> {place}
          </p>
        )}
        <div className="mt-auto flex items-center gap-4 border-t border-line pt-3 text-xs text-ink-soft">
          {listing.bedrooms && (
            <span className="flex items-center gap-1"><BedDouble size={13} /> {listing.bedrooms}</span>
          )}
          {area && <span className="flex items-center gap-1"><Maximize2 size={12} /> {area}</span>}
          <span className="ml-auto text-ink-faint" suppressHydrationWarning>{listedAgo(listing.listedAt)}</span>
        </div>
      </div>

      <div className="absolute right-3 top-3 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => toggleShortlist(ref)}
          aria-label={shortlisted ? "Remove from saved" : "Save"}
          aria-pressed={shortlisted}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full bg-paper/90 backdrop-blur-sm transition-colors",
            shortlisted ? "text-danger" : "text-ink-soft hover:text-danger",
          )}
        >
          <Heart size={15} fill={shortlisted ? "currentColor" : "none"} />
        </button>
        <button
          type="button"
          onClick={() => (comparing ? removeFromCompare(listing.id) : addToCompare(ref))}
          aria-label={comparing ? "Remove from compare" : "Add to compare"}
          aria-pressed={comparing}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full bg-paper/90 backdrop-blur-sm transition-colors",
            comparing ? "text-accent" : "text-ink-soft hover:text-accent",
          )}
        >
          <GitCompareArrows size={15} />
        </button>
      </div>
    </article>
  );
}
