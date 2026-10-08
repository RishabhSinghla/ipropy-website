"use client";

import { MessageCircle, PhoneCall, Share2 } from "lucide-react";
import { useSiteStore } from "@/lib/store";
import { useHasMounted } from "@/lib/useHasMounted";

/**
 * On a phone the enquiry form is a long scroll away, so the three things a
 * buyer wants are pinned to the bottom of the screen. It steps aside while the
 * compare tray is showing, which uses the same strip.
 */
export function ListingActionBar({ title, url, whatsapp }: { title: string; url: string; whatsapp: string | null }) {
  const mounted = useHasMounted();
  const comparing = useSiteStore((s) => s.compare.length) > 0;
  if (mounted && comparing) return null;

  const shareText = encodeURIComponent(`${title} — ${url}`);
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur-md lg:hidden" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
      <div className="flex gap-2">
        <a href="#enquire" className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink py-3 text-sm font-medium text-paper">
          <PhoneCall size={15} /> Book a visit
        </a>
        {whatsapp && (
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 text-sm font-medium text-white">
            <MessageCircle size={15} /> WhatsApp
          </a>
        )}
        <a
          href={`https://wa.me/?text=${shareText}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Send this home to someone on WhatsApp"
          className="flex w-12 items-center justify-center rounded-full border border-line text-ink-soft"
        >
          <Share2 size={16} />
        </a>
      </div>
    </div>
  );
}
