"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { GitCompareArrows, Menu, MessageCircle, X } from "lucide-react";
import { useSiteStore } from "@/lib/store";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "@/components/ThemeToggle";
import { whatsappLink } from "@/lib/contact";

const NAV = [
  { href: "/projects", label: "Projects" },
  { href: "/properties", label: "Properties" },
  { href: "/cities", label: "Cities" },
  { href: "/compare", label: "Compare" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const compareCount = useSiteStore((s) => s.compare.length);

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="inline-flex min-h-11 items-center font-display text-xl tracking-tight text-ink">
          IPROPY
          <span className="ml-1.5 align-middle text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-ink-faint">
            Bespoke Living
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative text-sm font-medium text-ink-soft transition-colors hover:text-ink",
                pathname.startsWith(item.href) && "text-ink",
              )}
            >
              {item.label}
              {item.href === "/compare" && compareCount > 0 && (
                <span className="ml-1.5 inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-paper">
                  {compareCount}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1 md:flex">
          <ThemeToggle />
          <Link
            href="/compare"
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-paper-dim hover:text-ink"
            aria-label="Compare"
          >
            <GitCompareArrows size={16} />
          </Link>
          <a
            href={whatsappLink("Hi, I am looking for a builder floor in Faridabad.")}
            target="_blank"
            rel="noopener noreferrer"
            className="font-data ml-2 inline-flex min-h-11 items-center gap-2 rounded-[2px] border border-rule-hard px-4 text-xs uppercase tracking-[0.1em] text-ink transition-colors hover:border-open hover:text-open"
          >
            <MessageCircle size={14} /> WhatsApp
          </a>
          <Link
            href="#enquire"
            className="font-data ml-1 inline-flex min-h-11 items-center rounded-[2px] bg-ink px-5 text-xs uppercase tracking-[0.12em] text-chalk transition-colors hover:bg-open"
          >
            Enquire
          </Link>
        </div>

        {/* On a phone the only visible controls used to be a theme switch and a
            hamburger. A dark-mode toggle outranking the conversion action on the
            breakpoint where shared links land is the wrong priority, so WhatsApp
            takes that slot and the toggle moves into the menu. */}
        <div className="flex items-center gap-1 md:hidden">
          <a
            href={whatsappLink("Hi, I am looking for a builder floor in Faridabad.")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Message us on WhatsApp"
            className="flex h-11 w-11 items-center justify-center rounded-[2px] text-ink"
          >
            <MessageCircle size={20} />
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="flex h-11 w-11 items-center justify-center"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" className="border-t border-rule bg-chalk px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="text-sm font-medium text-ink-soft">
                {item.label} {item.href === "/compare" && compareCount > 0 && `(${compareCount})`}
              </Link>
            ))}
            <Link
              href="#enquire"
              onClick={() => setOpen(false)}
              className="mt-2 w-fit rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper"
            >
              Enquire
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
