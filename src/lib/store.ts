"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CompareKind = "project" | "property";
export interface CompareRef {
  id: string;
  kind: CompareKind;
  // Denormalised at add-time so the floating tray never has to re-fetch.
  name: string;
  subtitle?: string;
  image?: string | null;
}

const MAX_COMPARE = 4;

interface SiteState {
  compare: CompareRef[];
  shortlist: CompareRef[];
  addToCompare: (ref: CompareRef) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  toggleShortlist: (ref: CompareRef) => void;
  isComparing: (id: string) => boolean;
  isShortlisted: (id: string) => boolean;
}

export const useSiteStore = create<SiteState>()(
  persist(
    (set, get) => ({
      compare: [],
      shortlist: [],
      addToCompare: (ref) =>
        set((s) => {
          if (s.compare.some((c) => c.id === ref.id)) return s;
          if (s.compare.length > 0 && s.compare[0].kind !== ref.kind) {
            // Comparing across kinds (a project vs. a unit) isn't meaningful —
            // starting a fresh comparison in the new kind reads better than an error.
            return { compare: [ref] };
          }
          if (s.compare.length >= MAX_COMPARE) return s;
          return { compare: [...s.compare, ref] };
        }),
      removeFromCompare: (id) => set((s) => ({ compare: s.compare.filter((c) => c.id !== id) })),
      clearCompare: () => set({ compare: [] }),
      toggleShortlist: (ref) =>
        set((s) => {
          const exists = s.shortlist.some((c) => c.id === ref.id);
          return { shortlist: exists ? s.shortlist.filter((c) => c.id !== ref.id) : [...s.shortlist, ref] };
        }),
      isComparing: (id) => get().compare.some((c) => c.id === id),
      isShortlisted: (id) => get().shortlist.some((c) => c.id === id),
    }),
    { name: "ipropy-site" },
  ),
);

export const COMPARE_LIMIT = MAX_COMPARE;
