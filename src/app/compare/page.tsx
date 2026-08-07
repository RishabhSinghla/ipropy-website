import type { Metadata } from "next";
import { Suspense } from "react";
import { ComparePageClient } from "@/components/ComparePageClient";

export const metadata: Metadata = { title: "Compare" };

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="py-32 text-center text-sm text-ink-faint">Loading comparison…</div>}>
      <ComparePageClient />
    </Suspense>
  );
}
