import Link from "next/link";

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { href: "/projects", label: "All Projects" },
      { href: "/properties", label: "All Properties" },
      { href: "/cities", label: "Browse by City" },
      { href: "/compare", label: "Compare" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/#process", label: "How it works" },
      { href: "/#faq", label: "FAQs" },
      { href: "/#enquire", label: "Talk to us" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper-dim">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="font-display text-2xl text-ink">IPROPY</div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft">
              A curated, title-verified property portal — every listing sourced straight
              from our sales desk, so what you see here is what&apos;s actually available today.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-faint">{col.title}</div>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-ink-soft transition-colors hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-line pt-8 text-xs text-ink-faint sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} iPropy. All rights reserved.</span>
          <span>Listings sync live from our CRM — availability may change without notice.</span>
        </div>
      </div>
    </footer>
  );
}
