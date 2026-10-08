"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, Play, X } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * A listing's photos: one large picture, a strip of thumbnails, and a full
 * screen viewer you can swipe, arrow-key or tap through.
 *
 * The photos list can hold a walkthrough video too (the CRM's upload accepts
 * both, and the URL does not say which). So each one is tried as an image, and
 * if the image fails it is drawn as a video instead.
 */
export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [videoIndices, setVideoIndices] = useState<Set<number>>(new Set());
  const markVideo = (i: number) => setVideoIndices((s) => (s.has(i) ? s : new Set(s).add(i)));

  if (images.length === 0) {
    return (
      <div className="flex aspect-[16/9] flex-col items-center justify-center gap-1 rounded-2xl bg-paper-dim px-6 text-center">
        <span className="font-display text-2xl text-ink-faint">{alt}</span>
        <span className="text-sm text-ink-faint">Photos on request — ask us and we will send them on WhatsApp.</span>
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-paper-dim">
        {videoIndices.has(active) ? (
          <video key={images[active]} src={images[active]} controls playsInline className="h-full w-full object-cover" />
        ) : (
          <button type="button" onClick={() => setOpen(true)} className="group block h-full w-full" aria-label="Open the photos full screen">
            <Image
              src={images[active]}
              alt={`${alt} — photo ${active + 1} of ${images.length}`}
              fill
              priority
              sizes="(min-width: 1024px) 900px, 100vw"
              className="object-cover"
              onError={() => markVideo(active)}
            />
            <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-ink/70 px-3 py-1.5 text-xs font-medium text-paper backdrop-blur-sm">
              <Expand size={13} /> {active + 1} / {images.length}
            </span>
          </button>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg transition-opacity",
                i === active ? "ring-2 ring-accent" : "opacity-60 hover:opacity-100",
              )}
            >
              {videoIndices.has(i) ? (
                <span className="flex h-full w-full items-center justify-center bg-ink text-paper">
                  <Play size={16} fill="currentColor" />
                </span>
              ) : (
                <Image src={img} alt="" fill sizes="96px" className="object-cover" onError={() => markVideo(i)} />
              )}
            </button>
          ))}
        </div>
      )}
      {open && (
        <Lightbox
          images={images}
          alt={alt}
          start={active}
          videos={videoIndices}
          onClose={(last) => { setActive(last); setOpen(false); }}
        />
      )}
    </div>
  );
}

/** The full-screen viewer. Esc closes; arrows and a swipe move; the page behind cannot scroll. */
function Lightbox({ images, alt, start, videos, onClose }: {
  images: string[];
  alt: string;
  start: number;
  videos: Set<number>;
  onClose: (last: number) => void;
}) {
  const [index, setIndex] = useState(start);
  const touchX = useRef<number | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const go = useCallback((step: number) => setIndex((i) => (i + step + images.length) % images.length), [images.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose(index);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index, onClose]);

  useEffect(() => {
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    return () => { document.body.style.overflow = before; };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photos of ${alt}`}
      className="fixed inset-0 z-[60] flex flex-col bg-black/95"
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const moved = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(moved) > 40) go(moved < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 text-sm text-white/80">
        <span>{index + 1} / {images.length}</span>
        <button ref={closeButton} type="button" onClick={() => onClose(index)} aria-label="Close the photos" className="rounded-full p-2 hover:bg-white/10">
          <X size={22} />
        </button>
      </div>
      <div className="relative flex-1">
        {videos.has(index) ? (
          <video key={images[index]} src={images[index]} controls playsInline className="absolute inset-0 m-auto max-h-full max-w-full" />
        ) : (
          <Image src={images[index]} alt={`${alt} — photo ${index + 1}`} fill sizes="100vw" className="object-contain" />
        )}
        {images.length > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20">
              <ChevronLeft size={22} />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next photo" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20">
              <ChevronRight size={22} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
