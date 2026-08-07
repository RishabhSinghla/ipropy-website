"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * True only after client hydration. Needed because the zustand store below
 * is localStorage-backed (compare/shortlist survive a refresh), so the
 * server always renders it empty — rendering client-only UI before
 * hydration would mismatch. useSyncExternalStore (server snapshot: false,
 * client snapshot: true) gets this without a setState-in-effect.
 */
export function useHasMounted(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
