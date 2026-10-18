"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

/** The phone's own share sheet where there is one; otherwise copy the link. */
export function ShareButton({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // Closing the share sheet is not an error worth showing.
        return;
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={() => { void share(); }}
      className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
    >
      {copied ? <Check size={14} /> : <Share2 size={14} />}
      {copied ? "Link copied" : "Share"}
    </button>
  );
}
