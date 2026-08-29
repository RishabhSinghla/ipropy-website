"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-32 text-center">
      <AlertTriangle size={40} className="text-alert" />
      <h1 className="mt-4 font-display text-2xl text-ink">Something went wrong</h1>
      <p className="mt-3 text-sm text-ink-soft">
        Our sales desk connection hiccuped for a moment. Try again, or head back and pick up where you left off.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper"
        >
          <RotateCw size={14} />
          Try Again
        </button>
        <Link href="/" className="rounded-full border border-line px-6 py-3 text-sm font-medium text-ink-soft">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
