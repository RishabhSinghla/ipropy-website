import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Building2, Handshake, KeyRound, MessageSquareText, Search } from "lucide-react";
import { getBrand, getListingFacets, listListings } from "@/lib/crm-client";
import { coverOf } from "@/lib/listing";
import { SearchBar } from "@/components/SearchBar";
import { ListingCard } from "@/components/ListingCard";
import { FaqAccordion } from "@/components/FaqAccordion";
import { EnquiryForm } from "@/components/EnquiryForm";
import { RecentlyViewedRail } from "@/components/RecentlyViewedRail";

/*
  ipropy.com's front page. Every number on it is read from the CRM at the
  moment it is drawn — how many homes are listed, in which localities. Nothing
  here is a figure somebody typed in to look impressive.
*/

const SERVICES = [
  { icon: Search, title: "Buy", body: "Homes our own team lists, with the facts that matter and real photos. Search them all, compare up to four side by side.", href: "/properties", cta: "Browse properties" },
  { icon: Building2, title: "Sell", body: "Tell us about your property. We list it, show it to buyers we are already talking to, and keep your number private.", href: "/sell", cta: "Sell with iPropy" },
  { icon: MessageSquareText, title: "Ask", body: "Not sure what you want yet? Tell us your budget and where you would like to live, and we will call you with options.", href: "#enquire", cta: "Talk to us" },
];

const PROCESS = [
  { icon: MessageSquareText, title: "Tell us what you need", body: "Budget, size, locality, timeline — on this site, on WhatsApp or on a call." },
  { icon: Search, title: "A shortlist, not a flood", body: "We send the few that fit, from the homes we list ourselves." },
  { icon: KeyRound, title: "Visit with us", body: "We arrange the visits and come along, so you see each home properly." },
  { icon: Handshake, title: "Through to the keys", body: "Price, paperwork and the bank — we stay with you until it is done." },
];

const FAQS = [
  { q: "Are these listings actually available?", a: "They come straight from the system our sales team works in. When a home is sold or taken off the market, it leaves this site on its own within minutes." },
  { q: "Will I be talking to the owner?", a: "You deal with iPropy. We arrange visits, answer questions and handle the negotiation, so you are never chasing a stranger's phone number." },
  { q: "Can I sell or rent out my property through you?", a: "Yes — use the Sell page or call us. We never publish an owner's name or number." },
  { q: "Do you help buyers who are not in the city?", a: "Yes. We can send video walkthroughs and handle much of the paperwork remotely." },
];

export default async function HomePage() {
  const [facets, latest, brand] = await Promise.all([
    getListingFacets(),
    listListings({ sort: "newest", limit: 6 }),
    getBrand(),
  ]);
  const hero = latest.items.map(coverOf).find(Boolean);
  const localities = facets.locality.slice(0, 12);

  return (
    <>
      <section className="relative overflow-hidden bg-paper-dim">
        <div className="absolute inset-0 -z-10">
          {hero && <Image src={hero} alt="" fill priority sizes="100vw" className="object-cover opacity-[0.14]" />}
          <div className="absolute inset-0 bg-gradient-to-b from-paper-dim via-paper-dim/95 to-paper" />
        </div>
        <div className="mx-auto max-w-4xl px-5 pb-16 pt-20 text-center sm:px-8 sm:pb-24 sm:pt-28">
          {facets.total > 0 && (
            <span className="animate-fade-in inline-block rounded-full border border-line bg-paper px-4 py-1.5 text-xs font-medium tracking-wide text-ink-soft">
              {facets.total.toLocaleString("en-IN")} {facets.total === 1 ? "home" : "homes"} listed right now
            </span>
          )}
          <h1 className="animate-fade-up mt-6 font-display text-4xl leading-[1.1] text-ink sm:text-6xl" style={{ animationDelay: "0.1s" }}>
            {brand.tagline ?? <>Find your home. <span className="italic text-accent">Sell yours.</span></>}
          </h1>
          <p className="animate-fade-up mx-auto mt-5 max-w-xl text-base text-ink-soft sm:text-lg" style={{ animationDelay: "0.2s" }}>
            Real homes, listed by our own team and updated the moment anything changes — and real people to call about them.
          </p>
          <div className="animate-fade-up mx-auto mt-10 max-w-2xl" style={{ animationDelay: "0.3s" }}>
            <SearchBar facets={facets} />
          </div>
        </div>
      </section>

      {latest.items.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">Just listed</span>
              <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">New on iPropy</h2>
            </div>
            <Link href="/properties" className="hidden items-center gap-1 text-sm font-medium text-ink-soft hover:text-ink sm:flex">
              All properties <ArrowRight size={14} />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latest.items.map((l, i) => <ListingCard key={l.id} listing={l} priority={i < 3} />)}
          </div>
        </section>
      )}

      {localities.length > 0 && (
        <section className="border-y border-line bg-paper-dim py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <h2 className="font-display text-2xl text-ink sm:text-3xl">Where we have homes</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {localities.map((l) => (
                <Link
                  key={l.value}
                  href={`/properties?locality=${encodeURIComponent(l.value)}`}
                  className="rounded-full border border-line bg-paper px-5 py-2.5 text-sm text-ink-soft transition-colors hover:border-accent hover:text-ink"
                >
                  {l.label} <span className="text-ink-faint">({l.count})</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <RecentlyViewedRail />

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">What we do</span>
        <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">Buy, sell, or just ask</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {SERVICES.map((s) => (
            <Link key={s.title} href={s.href} className="group flex flex-col rounded-2xl border border-line bg-paper p-6 transition-shadow hover:shadow-[0_20px_50px_-25px_rgba(25,21,16,0.3)]">
              <s.icon size={22} className="text-accent" />
              <h3 className="mt-4 font-display text-xl text-ink">{s.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{s.body}</p>
              <span className="mt-5 flex items-center gap-1 text-sm font-medium text-ink group-hover:text-accent">
                {s.cta} <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section id="process" className="border-t border-line bg-paper-dim py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">How it works</span>
          <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">From first call to keys in hand</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((step, i) => (
              <div key={step.title}>
                <div className="flex items-center gap-3">
                  <span className="font-display text-2xl text-accent/60">0{i + 1}</span>
                  <step.icon size={18} className="text-ink-faint" />
                </div>
                <h3 className="mt-3 font-display text-lg text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
        <h2 className="text-center font-display text-3xl text-ink sm:text-4xl">Questions people ask</h2>
        <div className="mt-10"><FaqAccordion items={FAQS} /></div>
      </section>

      <section id="enquire" className="border-t border-line bg-paper-dim py-20">
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
          <EnquiryForm />
        </div>
      </section>
    </>
  );
}
