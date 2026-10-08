"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CompareRef {
  id: string;
  // Denormalised at add-time so the floating tray never has to re-fetch.
  name: string;
  subtitle?: string;
  image?: string | null;
}

const MAX_COMPARE = 4;
const MAX_RECENTLY_VIEWED = 12;

interface SiteState {
  compare: CompareRef[];
  shortlist: CompareRef[];
  recentlyViewed: CompareRef[];
  addToCompare: (ref: CompareRef) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  toggleShortlist: (ref: CompareRef) => void;
  trackView: (ref: CompareRef) => void;
  isComparing: (id: string) => boolean;
  isShortlisted: (id: string) => boolean;
}

export const useSiteStore = create<SiteState>()(
  persist(
    (set, get) => ({
      compare: [],
      shortlist: [],
      recentlyViewed: [],
      addToCompare: (ref) =>
        set((s) => {
          if (s.compare.some((c) => c.id === ref.id)) return s;
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
      trackView: (ref) =>
        set((s) => ({
          recentlyViewed: [ref, ...s.recentlyViewed.filter((r) => r.id !== ref.id)].slice(0, MAX_RECENTLY_VIEWED),
        })),
      isComparing: (id) => get().compare.some((c) => c.id === id),
      isShortlisted: (id) => get().shortlist.some((c) => c.id === id),
    }),
    {
      name: "ipropy-site",
      // Version 1 held projects and units from the old catalogue, whose ids
      // no longer open anything. Starting empty beats a tray of dead links.
      version: 2,
      migrate: () => ({ compare: [], shortlist: [], recentlyViewed: [] }),
    },
  ),
);

export const COMPARE_LIMIT = MAX_COMPARE;
