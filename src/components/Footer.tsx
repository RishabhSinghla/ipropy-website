import Link from "next/link";

/** Same rule as the header: only offer a section that has something in it. */
function columns(sections?: { projects: boolean; cities: boolean }) {
  return [
    {
      title: "Explore",
      links: [
        ...(sections?.projects ? [{ href: "/projects", label: "All Projects" }] : []),
        { href: "/properties", label: "All Properties" },
        ...(sections?.cities ? [{ href: "/cities", label: "Browse by City" }] : []),
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
}

export function Footer({ sections }: { sections?: { projects: boolean; cities: boolean } }) {
  const COLUMNS = columns(sections);
  return (
    <footer className="border-t border-rule bg-chalk-2">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="font-display text-2xl text-ink">IPROPY</div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-2">
              A curated, title-verified property portal — every listing sourced straight
              from our sales desk, so what you see here is what&apos;s actually available today.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-2">{col.title}</div>
              <ul className="mt-2 flex flex-col">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="inline-flex min-h-11 items-center text-sm text-ink-2 transition-colors hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-rule pt-8 text-xs text-ink-2 sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} iPropy. All rights reserved.</span>
          <span>Listings sync live from our CRM — availability may change without notice.</span>
        </div>
      </div>
    </footer>
  );
}
