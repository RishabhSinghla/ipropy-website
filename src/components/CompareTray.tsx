"use client";

import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { useSiteStore, COMPARE_LIMIT } from "@/lib/store";
import { useHasMounted } from "@/lib/useHasMounted";

export function CompareTray() {
  const mounted = useHasMounted();
  const compare = useSiteStore((s) => s.compare);
  const remove = useSiteStore((s) => s.removeFromCompare);
  const clear = useSiteStore((s) => s.clearCompare);

  if (!mounted || compare.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 animate-fade-up border-t border-line bg-ink text-paper shadow-[0_-8px_30px_rgba(0,0,0,0.15)]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-5 py-3 sm:px-8">
        <span className="text-xs font-medium uppercase tracking-wider text-paper/60">
          Comparing {compare.length}/{COMPARE_LIMIT}
        </span>

        <div className="flex flex-1 flex-wrap items-center gap-2">
          {compare.map((item) => (
            <div key={item.id} className="flex items-center gap-2 rounded-full bg-paper/10 py-1 pl-1 pr-3">
              <div className="relative h-7 w-7 overflow-hidden rounded-full bg-paper/20">
                {item.image && (
                  <Image src={item.image} alt="" fill sizes="28px" className="object-cover" />
                )}
              </div>
              <span className="max-w-32 truncate text-xs">{item.name}</span>
              <button type="button" onClick={() => remove(item.id)} aria-label={`Remove ${item.name}`}>
                <X size={12} className="text-paper/60 hover:text-paper" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button type="button" onClick={clear} className="text-xs text-paper/60 hover:text-paper">
            Clear
          </button>
          <Link
            href="/compare"
            className="rounded-full bg-accent px-5 py-2 text-xs font-semibold text-paper transition-transform hover:scale-105"
          >
            Compare Now
          </Link>
        </div>
      </div>
    </div>
  );
}
