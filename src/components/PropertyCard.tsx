"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, GitCompareArrows, MapPin, BedDouble, Ruler } from "lucide-react";
import type { Property } from "@/lib/types";
import { formatIndianPrice, formatArea } from "@/lib/format";
import { mediaUrl } from "@/lib/media";
import { useSiteStore } from "@/lib/store";
import { cn } from "@/lib/cn";

export function PropertyCard({ property, priority = false }: { property: Property; priority?: boolean }) {
  const image = mediaUrl(property.gallery[0]);
  const shortlisted = useSiteStore((s) => s.isShortlisted(property.id));
  const comparing = useSiteStore((s) => s.isComparing(property.id));
  const toggleShortlist = useSiteStore((s) => s.toggleShortlist);
  const addToCompare = useSiteStore((s) => s.addToCompare);

  const area = property.carpet_area ?? property.super_built_up_area;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-paper transition-shadow hover:shadow-[0_20px_50px_-20px_rgba(25,21,16,0.25)]">
      <Link href={`/properties/${property.id}`} className="relative block aspect-[4/3] overflow-hidden bg-paper-dim">
        {image ? (
          <Image
            src={image}
            alt={property.name}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 380px, 90vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-3xl text-ink-2/40">
            {property.configuration ?? property.name.slice(0, 1)}
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/60 to-transparent" />
        {property.configuration && (
          <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-3 py-1 text-[11px] font-medium text-ink backdrop-blur-sm">
            {property.configuration}
          </span>
        )}
        {property.is_resale && (
          <span className="absolute bottom-3 left-3 text-xs font-medium text-paper">Resale</span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <Link href={`/properties/${property.id}`}>
            <h3 className="font-display text-lg text-ink transition-colors group-hover:underline">
              {property.project_name ?? property.name}
            </h3>
          </Link>
          {/* Only drawn when there is somewhere to name. Both locality and city
              are optional fields an admin may have removed, and a pin icon
              followed by nothing reads as a rendering fault. */}
          {[property.locality, property.city].filter(Boolean).length > 0 && (
            <p className="mt-1 flex items-center gap-1 text-xs text-ink-2">
              <MapPin size={12} />
              {[property.locality, property.city].filter(Boolean).join(", ")}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs text-ink-soft">
          {Boolean(property.bedrooms) && (
            <span className="flex items-center gap-1">
              <BedDouble size={13} /> {property.bedrooms} Bed
            </span>
          )}
          {area && (
            <span className="flex items-center gap-1">
              <Ruler size={13} /> {formatArea(area, property.area_unit)}
            </span>
          )}
          {property.floor !== null && <span>Floor {property.floor}</span>}
        </div>

        <div className="mt-auto border-t border-line pt-3">
          <div className="text-[11px] uppercase tracking-wide text-ink-2">All-inclusive price</div>
          <div className="font-display text-lg text-ink">{formatIndianPrice(property.total_price ?? property.base_price)}</div>
        </div>
      </div>

      <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={() =>
            toggleShortlist({ id: property.id, kind: "property", name: property.name, subtitle: property.project_name ?? undefined, image })
          }
          aria-label="Shortlist"
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full bg-paper/90 backdrop-blur-sm transition-colors",
            shortlisted ? "text-danger" : "text-ink-soft hover:text-danger",
          )}
        >
          <Heart size={15} fill={shortlisted ? "currentColor" : "none"} />
        </button>
        <button
          type="button"
          onClick={() =>
            addToCompare({ id: property.id, kind: "property", name: property.name, subtitle: property.project_name ?? undefined, image })
          }
          aria-label="Add to compare"
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full bg-paper/90 backdrop-blur-sm transition-colors",
            comparing ? "text-accent" : "text-ink-soft hover:text-accent",
          )}
        >
          <GitCompareArrows size={15} />
        </button>
      </div>
    </div>
  );
}
