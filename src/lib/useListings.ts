"use client";

import { useEffect, useState } from "react";
import type { Listing } from "./types";

/** Fetch these listings through /api/compare; null while loading. */
export function useListings(ids: string[], enabled: boolean): { items: Listing[] | null; missing: number } {
  const [state, setState] = useState<{ key: string; items: Listing[]; missing: number } | null>(null);
  const key = ids.join(",");

  useEffect(() => {
    if (!enabled || !key) return;
    let cancelled = false;
    fetch(`/api/compare?ids=${key}`)
      .then((r) => r.json())
      .then((data: { items: Listing[]; missing: number }) => {
        if (!cancelled) setState({ key, items: data.items, missing: data.missing });
      })
      .catch(() => { if (!cancelled) setState({ key, items: [], missing: 0 }); });
    return () => { cancelled = true; };
  }, [enabled, key]);

  if (!key) return { items: [], missing: 0 };
  return state?.key === key ? { items: state.items, missing: state.missing } : { items: null, missing: 0 };
}
