"use client";

import { Heart, GitCompareArrows } from "lucide-react";
import { useSiteStore, type CompareRef } from "@/lib/store";
import { cn } from "@/lib/cn";
import { useHasMounted } from "@/lib/useHasMounted";

export function CompareButton({ item }: { item: CompareRef }) {
  // The saved list lives in this browser, so the server draws "not saved"
  // and the first paint after hydration corrects it.
  const mounted = useHasMounted();
  const shortlisted = useSiteStore((s) => s.isShortlisted(item.id)) && mounted;
  const comparing = useSiteStore((s) => s.isComparing(item.id)) && mounted;
  const toggleShortlist = useSiteStore((s) => s.toggleShortlist);
  const addToCompare = useSiteStore((s) => s.addToCompare);
  const removeFromCompare = useSiteStore((s) => s.removeFromCompare);

  return (
    <div className="flex shrink-0 gap-2">
      <button
        type="button"
        onClick={() => toggleShortlist(item)}
        className={cn(
          "flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
          shortlisted ? "border-danger/30 bg-danger/10 text-danger" : "border-line text-ink-soft hover:border-danger/30 hover:text-danger",
        )}
      >
        <Heart size={14} fill={shortlisted ? "currentColor" : "none"} />
        {shortlisted ? "Saved" : "Save"}
      </button>
      <button
        type="button"
        onClick={() => (comparing ? removeFromCompare(item.id) : addToCompare(item))}
        className={cn(
          "flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
          comparing ? "border-accent/30 bg-accent-soft text-accent-ink" : "border-line text-ink-soft hover:border-accent/30 hover:text-accent",
        )}
      >
        <GitCompareArrows size={14} />
        {comparing ? "Added" : "Compare"}
      </button>
    </div>
  );
}
