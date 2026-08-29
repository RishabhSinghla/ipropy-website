import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-32 text-center">
      {/* The copy says the listing was probably booked, so it wears the colour
          that means booked. */}
      <span className="font-display text-6xl text-taken">404</span>
      <h1 className="mt-4 font-display text-2xl text-ink">This listing has moved on</h1>
      <p className="mt-3 text-sm text-ink-soft">
        Either it&apos;s been booked, the link is out of date, or it never existed — either way, let&apos;s get you back
        to something that&apos;s actually available.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper">
          <Home size={14} />
          Back to Home
        </Link>
        <Link href="/projects" className="rounded-full border border-line px-6 py-3 text-sm font-medium text-ink-soft">
          Browse Projects
        </Link>
      </div>
    </div>
  );
}
