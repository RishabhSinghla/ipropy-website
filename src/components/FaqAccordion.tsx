"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, i) => (
        <div key={item.q}>
          <button
            type="button"
            onClick={() => setOpen(open === i ? -1 : i)}
            className="flex w-full items-center justify-between gap-4 py-5 text-left"
          >
            <span className="font-display text-base text-ink sm:text-lg">{item.q}</span>
            <ChevronDown
              size={18}
              className={cn("shrink-0 text-ink-faint transition-transform", open === i && "rotate-180 text-accent")}
            />
          </button>
          <div
            className={cn(
              "grid overflow-hidden transition-all duration-300",
              open === i ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0",
            )}
          >
            <p className="overflow-hidden text-sm leading-relaxed text-ink-soft">{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
