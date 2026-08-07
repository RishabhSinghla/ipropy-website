"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, GitCompareArrows, MapPin } from "lucide-react";
import type { Project } from "@/lib/types";
import { formatPriceRange, formatDate } from "@/lib/format";
import { mediaUrl } from "@/lib/media";
import { useSiteStore } from "@/lib/store";
import { cn } from "@/lib/cn";

export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  const image = mediaUrl(project.gallery[0]);
  const shortlisted = useSiteStore((s) => s.isShortlisted(project.id));
  const comparing = useSiteStore((s) => s.isComparing(project.id));
  const toggleShortlist = useSiteStore((s) => s.toggleShortlist);
  const addToCompare = useSiteStore((s) => s.addToCompare);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-paper transition-shadow hover:shadow-[0_20px_50px_-20px_rgba(25,21,16,0.25)]">
      <Link href={`/projects/${project.id}`} className="relative block aspect-[4/3] overflow-hidden bg-paper-dim">
        {image ? (
          <Image
            src={image}
            alt={project.name}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 380px, 90vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-3xl text-ink-faint/40">
            {project.name.slice(0, 1)}
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/60 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-3 py-1 text-[11px] font-medium text-ink backdrop-blur-sm">
          {project.status}
        </span>
        {project.available_units > 0 && (
          <span className="absolute bottom-3 left-3 text-xs font-medium text-paper">
            {project.available_units} units available
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <Link href={`/projects/${project.id}`}>
            <h3 className="font-display text-lg text-ink transition-colors group-hover:text-accent">{project.name}</h3>
          </Link>
          <p className="mt-1 flex items-center gap-1 text-xs text-ink-faint">
            <MapPin size={12} />
            {[project.locality, project.city].filter(Boolean).join(", ")}
          </p>
        </div>

        {project.configurations.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.configurations.slice(0, 4).map((c) => (
              <span key={c} className="rounded-full bg-paper-dim px-2.5 py-1 text-[11px] text-ink-soft">
                {c}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-end justify-between border-t border-line pt-3">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-ink-faint">Starting from</div>
            <div className="font-display text-lg text-ink">{formatPriceRange(project.price_min, project.price_max)}</div>
          </div>
          {project.possession_date && (
            <div className="text-right">
              <div className="text-[11px] uppercase tracking-wide text-ink-faint">Possession</div>
              <div className="text-sm text-ink-soft">{formatDate(project.possession_date)}</div>
            </div>
          )}
        </div>
      </div>

      <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={() => toggleShortlist({ id: project.id, kind: "project", name: project.name, subtitle: project.locality ?? undefined, image })}
          aria-label="Shortlist"
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full bg-paper/90 backdrop-blur-sm transition-colors",
            shortlisted ? "text-danger" : "text-ink-soft hover:text-danger",
          )}
        >
          <Heart size={15} fill={shortlisted ? "currentColor" : "none"} />
        </button>
        <button
          type="button"
          onClick={() => addToCompare({ id: project.id, kind: "project", name: project.name, subtitle: project.locality ?? undefined, image })}
          aria-label="Add to compare"
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full bg-paper/90 backdrop-blur-sm transition-colors",
            comparing ? "text-accent" : "text-ink-soft hover:text-accent",
          )}
        >
          <GitCompareArrows size={15} />
        </button>
      </div>
    </div>
  );
}
