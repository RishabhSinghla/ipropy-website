import Link from "next/link";
import Image from "next/image";
import { listProjects, listProperties, getFilters, getCities } from "@/lib/crm-client";
import { mediaUrl } from "@/lib/media";
import { slugify } from "@/lib/slug";
import { formatIndianPrice } from "@/lib/format";
import { SearchBar } from "@/components/SearchBar";
import { ProjectCard } from "@/components/ProjectCard";
import { FaqAccordion } from "@/components/FaqAccordion";
import { EnquiryForm } from "@/components/EnquiryForm";
import { RecentlyViewedRail } from "@/components/RecentlyViewedRail";
import { FloorStack } from "@/components/FloorStack";
import type { Property } from "@/lib/types";

/**
 * The page opens on the thing the business actually is.
 *
 * iPropy sells builder floors. A builder floor is one floor of a low-rise
 * building, so the unit and the floor are the same object, and the first
 * question a buyer asks is which floor is still free. Most property sites open
 * on a photograph of a sunset and a search box. This one opens on a building
 * with its floors lit up by whether you can have them, drawn from the same
 * database the sales desk is looking at right now.
 */

const FAQS = [
  {
    q: "Are these floors actually available?",
    a: "Yes. Every floor on this page is read live from our sales desk. When a floor is booked it changes here within minutes, not on a weekly refresh, which is why you will sometimes see a building with gaps in it.",
  },
  {
    q: "Do you charge buyers a fee?",
    a: "No. Our commission comes from the seller side, as is standard. Shortlisting, site visits and negotiation cost you nothing.",
  },
  {
    q: "What is a builder floor, exactly?",
    a: "One independent floor of a low-rise building, usually four floors to a plot, with its own entrance and no shared lobby. You get the space and privacy of an independent house without the price of the whole plot.",
  },
  {
    q: "I am buying from outside the city. Can you help remotely?",
    a: "Yes. Video walkthroughs, document checks and registry coordination are routine for our out-of-city and NRI buyers.",
  },
];

/** Group the live units into buildings, biggest first, so the hero has a real one to draw. */
function byProject(units: Property[]): { project: string; units: Property[] }[] {
  const map = new Map<string, Property[]>();
  for (const u of units) {
    const key = u.project_name?.trim() || u.name;
    map.set(key, [...(map.get(key) ?? []), u]);
  }
  return [...map.entries()]
    .map(([project, list]) => ({ project, units: list }))
    .sort((a, b) => b.units.length - a.units.length);
}

export default async function HomePage() {
  const [filters, featured, citySummaries, liveUnits] = await Promise.all([
    getFilters(),
    listProjects({ limit: 6 }),
    getCities(),
    listProperties({ limit: 40 }),
  ]);

  const cities = citySummaries.items.slice(0, 10);
  const buildings = byProject(liveUnits.items);
  const hero = buildings[0];
  const heroImage = mediaUrl(featured.items[0]?.gallery[0]);

  const openNow = liveUnits.items.filter((u) => (u.status ?? "").toLowerCase() === "available");
  const cheapest = openNow.reduce<number | null>(
    (min, u) => (u.total_price && (min === null || u.total_price < min) ? u.total_price : min),
    null,
  );

  return (
    <>
      {/* ── Hero: a building, not a banner ─────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-rule">
        {heroImage && (
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <Image src={heroImage} alt="" fill priority sizes="100vw" className="object-cover opacity-[0.07]" />
          </div>
        )}

        <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-[1.05fr_minmax(0,26rem)] lg:items-center lg:gap-16 lg:pb-28 lg:pt-24">
          <div>
            <p className="rise label flex items-center gap-2" style={{ "--i": 0 } as React.CSSProperties}>
              <span aria-hidden className="breathe inline-block h-1.5 w-1.5 rounded-full bg-open" />
              Live from our sales desk
            </p>

            <h1
              className="rise font-display mt-5 text-[clamp(2.6rem,7vw,4.75rem)] text-ink"
              style={{ "--i": 1 } as React.CSSProperties}
            >
              {/* The breaks are a desktop composition. On a narrow column they
                  land mid-clause, so there they are dropped and the line wraps
                  where it wants to. */}
              You are not buying{" "}
              <br className="hidden sm:inline" />
              a flat. You are buying{" "}
              <br className="hidden sm:inline" />
              <span className="text-open">a floor.</span>
            </h1>

            <p
              className="rise mt-6 max-w-lg text-lg text-ink-2"
              style={{ "--i": 2 } as React.CSSProperties}
            >
              Builder floors across Faridabad and the NCR, each one an independent floor with its own
              entrance. We list what is genuinely free right now, gaps and all.
            </p>

            <div className="rise mt-9 max-w-xl" style={{ "--i": 3 } as React.CSSProperties}>
              <SearchBar filters={filters} />
            </div>

            {openNow.length > 0 && (
              <p
                className="rise font-data mt-6 text-xs text-ink-3"
                style={{ "--i": 4 } as React.CSSProperties}
              >
                {openNow.length} floor{openNow.length === 1 ? "" : "s"} free today
                {cheapest ? <> · from {formatIndianPrice(cheapest)}</> : null}
              </p>
            )}
          </div>

          {hero ? (
            <div className="lg:justify-self-end lg:pt-4">
              <FloorStack project={hero.project} units={hero.units} />
            </div>
          ) : (
            /* An empty building is an invitation, not an apology. */
            <div className="rounded-[3px] border border-dashed border-rule-hard p-8 text-center">
              <p className="font-display text-lg text-ink">Every floor is spoken for</p>
              <p className="mt-2 text-sm text-ink-2">
                Nothing is free this minute. Tell us what you are looking for and we will call you the
                day one opens.
              </p>
              <Link
                href="#enquire"
                className="font-data mt-5 inline-block border-b border-open pb-0.5 text-xs uppercase tracking-[0.12em] text-open"
              >
                Get first refusal
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── The rest of the buildings ──────────────────────────────────── */}
      {buildings.length > 1 && (
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="label">Every building we hold</span>
              <h2 className="font-display mt-2 text-3xl text-ink sm:text-4xl">
                Floor by floor, as it stands
              </h2>
            </div>
            <Link href="/properties" className="font-data hidden shrink-0 text-xs uppercase tracking-[0.12em] text-ink-2 hover:text-ink sm:block">
              All floors →
            </Link>
          </div>

          <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {buildings.slice(1, 7).map((b) => (
              <FloorStack key={b.project} project={b.project} units={b.units} />
            ))}
          </div>
        </section>
      )}

      {/* ── Projects ───────────────────────────────────────────────────── */}
      {featured.items.length > 0 && (
        <section className="border-t border-rule bg-chalk-2 py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="label">Projects</span>
                <h2 className="font-display mt-2 text-3xl text-ink sm:text-4xl">Where these floors are</h2>
              </div>
              <Link href="/projects" className="font-data hidden shrink-0 text-xs uppercase tracking-[0.12em] text-ink-2 hover:text-ink sm:block">
                All projects →
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.items.map((p, i) => (
                <ProjectCard key={p.id} project={p} priority={i < 3} />
              ))}
            </div>
          </div>
        </section>
      )}

      <RecentlyViewedRail />

      {/* ── Cities ─────────────────────────────────────────────────────── */}
      {cities.length > 0 && (
        <section className="border-y border-rule py-14">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="font-display text-2xl text-ink">Where we work</h2>
              <Link href="/cities" className="font-data text-xs uppercase tracking-[0.12em] text-ink-2 hover:text-ink">
                All cities →
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
              {cities.map((c) => (
                <Link
                  key={c.city}
                  href={`/cities/${slugify(c.city)}`}
                  className="font-data group text-sm text-ink-2 hover:text-ink"
                >
                  {c.city}
                  <span className="ml-1.5 text-ink-3 group-hover:text-open">{c.project_count}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── How this works ─────────────────────────────────────────────── */}
      <section id="process" className="mx-auto max-w-5xl px-5 py-20 sm:px-8">
        <span className="label">How buying with us goes</span>
        <h2 className="font-display mt-2 max-w-2xl text-3xl text-ink sm:text-4xl">
          Nobody will ring you eleven times
        </h2>

        <div className="mt-12 grid gap-10 sm:grid-cols-2">
          <div>
            <h3 className="font-display text-lg text-ink">You tell us the floor you want</h3>
            <p className="mt-2 text-ink-2">
              Budget, configuration, which sector, and whether you mind stairs. Two minutes on the form
              or one call, whichever suits.
            </p>
          </div>
          <div>
            <h3 className="font-display text-lg text-ink">We send four, not forty</h3>
            <p className="mt-2 text-ink-2">
              A shortlist we would show our own family, with the RERA number and title checked before
              it reaches you. If nothing fits, we say so.
            </p>
          </div>
          <div>
            <h3 className="font-display text-lg text-ink">We walk them with you</h3>
            <p className="mt-2 text-ink-2">
              At your pace, with honest commentary on construction quality, water, parking and what the
              floor will fetch on resale.
            </p>
          </div>
          <div>
            <h3 className="font-display text-lg text-ink">We stand beside you to registry</h3>
            <p className="mt-2 text-ink-2">
              Negotiation, the bank, the paperwork and the day itself. Then a desk you can come back to
              for resale, rental or a referral.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      <section id="faq" className="border-t border-rule bg-chalk-2 py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <span className="label">Questions we get</span>
          <h2 className="font-display mt-2 text-3xl text-ink sm:text-4xl">Before you ask</h2>
          <div className="mt-10">
            <FaqAccordion items={FAQS} />
          </div>
        </div>
      </section>

      {/* ── Enquiry ────────────────────────────────────────────────────── */}
      <section id="enquire" className="border-t border-rule py-20">
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
          <span className="label">Tell us what you want</span>
          <h2 className="font-display mt-2 text-3xl text-ink sm:text-4xl">
            Describe the floor and we will find it
          </h2>
          <p className="mt-3 text-ink-2">
            If it is not on this page today, it is probably coming. We will call you when it does.
          </p>
          <div className="mt-8">
            <EnquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}
