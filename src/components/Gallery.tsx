"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/cn";

// The gallery array can mix photos and a walkthrough video (the CRM's upload
// UI accepts both). There's no separate "is this a video" flag from the API —
// URLs are opaque /api/public/media/:id?size=... — so this detects the same
// way the CRM's own admin gallery field does: try it as an image, and if
// next/image's onError fires, it wasn't one, so fall back to a <video>.
export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [videoIndices, setVideoIndices] = useState<Set<number>>(new Set());

  if (images.length === 0) {
    return (
      <div className="flex aspect-[16/9] items-center justify-center rounded-2xl bg-paper-dim">
        <span className="font-display text-2xl text-ink-faint/40">{alt}</span>
      </div>
    );
  }

  const markVideo = (i: number) => setVideoIndices((s) => (s.has(i) ? s : new Set(s).add(i)));

  return (
    <div>
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-paper-dim">
        {videoIndices.has(active) ? (
          <video key={images[active]} src={images[active]} controls playsInline className="h-full w-full object-cover" />
        ) : (
          <Image
            src={images[active]}
            alt={alt}
            fill
            priority
            sizes="(min-width: 1024px) 900px, 100vw"
            className="object-cover"
            onError={() => markVideo(active)}
          />
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-thin">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg transition-opacity",
                i === active ? "ring-2 ring-accent" : "opacity-60 hover:opacity-100",
              )}
            >
              {videoIndices.has(i) ? (
                <div className="flex h-full w-full items-center justify-center bg-ink text-paper">
                  <Play size={16} fill="currentColor" />
                </div>
              ) : (
                <Image src={img} alt="" fill sizes="96px" className="object-cover" onError={() => markVideo(i)} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
