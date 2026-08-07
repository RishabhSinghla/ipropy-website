"use client";

import { useEffect } from "react";
import { useSiteStore, type CompareRef } from "@/lib/store";

/** Invisible — records a detail-page visit into recentlyViewed. Renders nothing. */
export function ViewTracker({ item }: { item: CompareRef }) {
  const trackView = useSiteStore((s) => s.trackView);
  // item identity (id/kind/name/subtitle/image) is fixed per page load, so
  // tracking once on mount is correct — re-running per keystroke elsewhere
  // in the tree would just re-record the same view.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { trackView(item); }, [item.id]);
  return null;
}
