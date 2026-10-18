"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GitCompareArrows, Share2 } from "lucide-react";
import { useSiteStore, COMPARE_LIMIT } from "@/lib/store";
import { useHasMounted } from "@/lib/useHasMounted";
import { useListings } from "@/lib/useListings";
import { CompareTable } from "@/components/CompareTable";

export function ComparePageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mounted = useHasMounted();
  const compare = useSiteStore((s) => s.compare);
  const [copied, setCopied] = useState(false);

  // This browser's own list wins; a shared link fills in when it is empty.
  const ids = compare.length > 0
    ? compare.map((c) => c.id)
    : (searchParams.get("items") ?? "").split(",").filter(Boolean).slice(0, COMPARE_LIMIT);
  const { items, missing } = useListings(ids, mounted);

  useEffect(() => {
    if (!mounted || compare.length === 0) return;
    router.replace(`/compare?items=${compare.map((c) => c.id).join(",")}`, { scroll: false });
  }, [mounted, compare, router]);

  function share() {
    void navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">Side by side</span>
          <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">Compare</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {items && items.length > 0
              ? `${items.length} of up to ${COMPARE_LIMIT} properties. Rows that differ are the darker ones.`
              : `Tap the compare icon on any property to line up to ${COMPARE_LIMIT} of them here.`}
          </p>
          {missing > 0 && (
            <p className="mt-1 text-xs text-ink-faint">{missing} you added {missing === 1 ? "is" : "are"} no longer on the market.</p>
          )}
        </div>
        {items && items.length > 0 && (
          <button type="button" onClick={share} className="flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink-soft hover:text-ink">
            <Share2 size={14} /> {copied ? "Link copied" : "Share comparison"}
          </button>
        )}
      </div>

      <div className="mt-10">
        {!mounted || items === null ? (
          <div className="py-20 text-center text-sm text-ink-faint">Loading…</div>
        ) : items.length === 0 ? (
          <Empty />
        ) : (
          <CompareTable items={items} />
        )}
      </div>
    </div>
  );
}

function Empty() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-paper-dim py-24 text-center">
      <GitCompareArrows size={32} className="text-ink-faint" />
      <p className="font-display text-xl text-ink">Nothing to compare yet</p>
      <Link href="/properties" className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper">Browse properties</Link>
    </div>
  );
}
