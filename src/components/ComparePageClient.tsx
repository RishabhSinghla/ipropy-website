"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GitCompareArrows, Share2 } from "lucide-react";
import { useSiteStore, COMPARE_LIMIT } from "@/lib/store";
import { useHasMounted } from "@/lib/useHasMounted";
import { CompareTable } from "@/components/CompareTable";
import type { Project, Property } from "@/lib/types";

export function ComparePageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mounted = useHasMounted();
  const compare = useSiteStore((s) => s.compare);
  const [items, setItems] = useState<(Project | Property)[] | null>(null);
  const [copied, setCopied] = useState(false);

  const kind = compare.length > 0 ? compare[0].kind : (searchParams.get("kind") as "project" | "property" | null);
  const ids = compare.length > 0 ? compare.map((c) => c.id) : (searchParams.get("items") ?? "").split(",").filter(Boolean);
  const hasSelection = mounted && !!kind && ids.length > 0;
  const idsKey = ids.join(",");

  // Reflect the current comparison in the URL so it's shareable, without
  // fighting the store: store is the source of truth whenever it has items.
  useEffect(() => {
    if (!mounted || compare.length === 0) return;
    const params = new URLSearchParams();
    params.set("kind", compare[0].kind);
    params.set("items", compare.map((c) => c.id).join(","));
    router.replace(`/compare?${params.toString()}`, { scroll: false });
  }, [mounted, compare, router]);

  useEffect(() => {
    if (!hasSelection) return;
    let cancelled = false;
    fetch(`/api/compare?kind=${kind}&ids=${idsKey}`)
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setItems(data.items); });
    return () => { cancelled = true; };
  }, [hasSelection, kind, idsKey]);

  function share() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">Deep Comparison</span>
          <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">Compare</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {items && items.length > 0
              ? `Comparing ${items.length} ${kind === "project" ? "project" : "unit"}${items.length === 1 ? "" : "s"} — up to ${COMPARE_LIMIT}.`
              : "Add projects or units from any listing to compare them side by side."}
          </p>
        </div>
        {items && items.length > 0 && (
          <button
            type="button"
            onClick={share}
            className="flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink-soft hover:text-ink"
          >
            <Share2 size={14} />
            {copied ? "Link copied!" : "Share comparison"}
          </button>
        )}
      </div>

      <div className="mt-10">
        {!mounted || (hasSelection && items === null) ? (
          <div className="py-20 text-center text-sm text-ink-faint">Loading comparison…</div>
        ) : !hasSelection || items === null || items.length === 0 ? (
          <EmptyState />
        ) : (
          <CompareTable kind={kind!} items={items} />
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-paper-dim py-24 text-center">
      <GitCompareArrows size={32} className="text-ink-faint" />
      <p className="font-display text-xl text-ink">Nothing to compare yet</p>
      <p className="max-w-sm text-sm text-ink-soft">
        Browse projects or properties and click the compare icon on any card to add it here — up to {COMPARE_LIMIT} at a time.
      </p>
      <div className="mt-2 flex gap-3">
        <Link href="/projects" className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper">Browse Projects</Link>
        <Link href="/properties" className="rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink-soft">Browse Properties</Link>
      </div>
    </div>
  );
}
