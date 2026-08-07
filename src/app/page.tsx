import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, FileCheck2, Sparkles, Users } from "lucide-react";
import { listProjects, getFilters } from "@/lib/crm-client";
import { mediaUrl } from "@/lib/media";
import { SearchBar } from "@/components/SearchBar";
import { ProjectCard } from "@/components/ProjectCard";
import { StatCounter } from "@/components/StatCounter";
import { FaqAccordion } from "@/components/FaqAccordion";
import { EnquiryForm } from "@/components/EnquiryForm";

const BADGES = [
  { icon: ShieldCheck, label: "Title-Verified Listings" },
  { icon: FileCheck2, label: "RERA Registered Projects" },
  { icon: Sparkles, label: "Live From Our Sales Desk" },
  { icon: Users, label: "Zero-Pressure Guidance" },
];

const PROCESS = [
  { n: "01", title: "Tell Us What You Need", body: "Budget, configuration, city and timeline — a two-minute form or a call, whichever you prefer." },
  { n: "02", title: "A Curated Shortlist", body: "4–6 hand-checked options, never a portal dump. Every RERA number and title verified before it reaches you." },
  { n: "03", title: "Guided Site Visits", body: "Walk each property with us, at your pace, with honest commentary on construction quality and resale value." },
  { n: "04", title: "Negotiation & Paperwork", body: "We negotiate, coordinate the bank and stand beside you at every step through to registration." },
  { n: "05", title: "Keys & Aftercare", body: "Handover support and a standing desk for whenever you need us again — resale, rental or referral." },
];

const FAQS = [
  { q: "Are these listings actually available?", a: "Yes — every project and unit here is pulled live from our CRM, the same system our sales team uses. If a unit gets booked, it disappears from this site automatically, not on a weekly refresh." },
  { q: "Do you charge buyers a fee?", a: "No. Our commission is paid by the developer/seller side, standard across the industry — there's no cost to you for our guidance, shortlisting or negotiation support." },
  { q: "Can I compare properties across projects?", a: "Yes — use the compare tool on any listing to line up units or entire projects side by side: price, area, amenities, possession and more, spec for spec." },
  { q: "I'm buying from outside the city — can you help remotely?", a: "Absolutely. Video walkthroughs, document verification and registry coordination are all things we routinely handle for NRI and out-of-city buyers." },
];

export default async function HomePage() {
  const [filters, featured] = await Promise.all([
    getFilters(),
    listProjects({ limit: 6 }),
  ]);

  const cities = filters.city.slice(0, 10);
  const totalAvailableUnits = featured.items.reduce((sum, p) => sum + p.available_units, 0);
  const heroImage = mediaUrl(featured.items[0]?.gallery[0]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-paper-dim">
        <div className="absolute inset-0 -z-10">
          {heroImage && (
            <Image src={heroImage} alt="" fill priority sizes="100vw" className="object-cover opacity-[0.14]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-paper-dim via-paper-dim/95 to-paper" />
        </div>

        <div className="mx-auto max-w-4xl px-5 pb-16 pt-24 text-center sm:px-8 sm:pb-24 sm:pt-32">
          <span className="animate-fade-in inline-block rounded-full border border-line bg-paper px-4 py-1.5 text-xs font-medium uppercase tracking-[0.15em] text-ink-soft">
            Bespoke Living, Nationwide
          </span>
          <h1 className="animate-fade-up mt-6 font-display text-4xl leading-[1.1] text-ink sm:text-6xl" style={{ animationDelay: "0.1s" }}>
            Property listings that are actually <span className="text-accent italic">live</span>.
          </h1>
          <p className="animate-fade-up mx-auto mt-5 max-w-xl text-base text-ink-soft sm:text-lg" style={{ animationDelay: "0.2s" }}>
            Every project and unit on this page is synced straight from our sales desk — curated,
            title-verified and updated the moment something changes.
          </p>

          <div className="animate-fade-up mx-auto mt-10 max-w-2xl" style={{ animationDelay: "0.3s" }}>
            <SearchBar filters={filters} />
          </div>
        </div>

        <div className="border-t border-line bg-paper">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-5 py-8 sm:grid-cols-4 sm:px-8">
            {BADGES.map((b) => (
              <div key={b.label} className="flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left">
                <b.icon size={18} className="shrink-0 text-accent" />
                <span className="text-xs font-medium text-ink-soft sm:text-sm">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured projects */}
      {featured.items.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">Currently Available</span>
              <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">Featured Projects</h2>
            </div>
            <Link href="/projects" className="hidden text-sm font-medium text-ink-soft hover:text-ink sm:block">
              View all →
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.items.map((p, i) => (
              <ProjectCard key={p.id} project={p} priority={i < 3} />
            ))}
          </div>

          <Link href="/projects" className="mt-8 block text-center text-sm font-medium text-ink-soft hover:text-ink sm:hidden">
            View all projects →
          </Link>
        </section>
      )}

      {/* Explore by city */}
      {cities.length > 0 && (
        <section className="border-y border-line bg-paper-dim py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <h2 className="font-display text-2xl text-ink sm:text-3xl">Explore by City</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {cities.map((c) => (
                <Link
                  key={c.value}
                  href={`/projects?city=${encodeURIComponent(c.value)}`}
                  className="rounded-full border border-line bg-paper px-5 py-2.5 text-sm text-ink-soft transition-colors hover:border-accent hover:text-ink"
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <StatCounter value={featured.items.length > 0 ? featured.items.length * 7 : 40} suffix="+" label="Live Projects" />
          <StatCounter value={totalAvailableUnits || 250} suffix="+" label="Units Available" />
          <StatCounter value={cities.length || 12} label="Cities Covered" />
          <StatCounter value={1100} suffix="+" label="Homes Closed" />
        </div>
      </section>

      {/* Process */}
      <section id="process" className="border-t border-line bg-paper-dim py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">The iPropy Process</span>
          <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">Five steps from first call to keys in hand</h2>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {PROCESS.map((step) => (
              <div key={step.n}>
                <div className="font-display text-3xl text-accent/50">{step.n}</div>
                <h3 className="mt-3 font-display text-lg text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
        <h2 className="text-center font-display text-3xl text-ink sm:text-4xl">Frequently Asked</h2>
        <div className="mt-10">
          <FaqAccordion items={FAQS} />
        </div>
      </section>

      {/* Enquiry */}
      <section id="enquire" className="border-t border-line bg-paper-dim py-20">
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">Get In Touch</span>
            <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">Tell us what home you want</h2>
          </div>
          <div className="mt-8">
            <EnquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}
