import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Building2, Layers } from "lucide-react";
import { getCities, listProjects } from "@/lib/crm-client";
import { formatPriceRange } from "@/lib/format";
import { findBySlug } from "@/lib/slug";
import { ProjectCard } from "@/components/ProjectCard";
import { EnquiryForm } from "@/components/EnquiryForm";

async function resolveCity(slug: string) {
  const { items } = await getCities();
  const city = findBySlug(items.map((c) => ({ value: c.city })), slug);
  const summary = items.find((c) => c.city === city);
  return { city, summary };
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city, summary } = await resolveCity((await params).city);
  if (!city) return { title: "City" };
  return {
    title: `Properties in ${city}`,
    description: `${summary?.project_count ?? 0} live projects in ${city} — ${formatPriceRange(summary?.price_min, summary?.price_max)}. Verified listings, synced from our sales desk.`,
  };
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city, summary } = await resolveCity((await params).city);
  if (!city || !summary) notFound();

  const { items: projects } = await listProjects({ city, limit: 48 });
  const localities = Array.from(new Set(projects.map((p) => p.locality).filter((l): l is string => Boolean(l))));

  return (
    <div>
      <div className="border-b border-line bg-paper-dim">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
          <nav className="mb-4 flex items-center gap-1.5 text-xs text-ink-faint">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span>/</span>
            <Link href="/cities" className="hover:text-ink">Cities</Link>
            <span>/</span>
            <span className="text-ink-soft">{city}</span>
          </nav>
          <h1 className="flex items-center gap-2 font-display text-4xl text-ink">
            <MapPin size={28} className="text-accent" />
            Properties in {city}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft">
            {summary.project_count} live project{summary.project_count === 1 ? "" : "s"} in {city}
            {localities.length > 0 && ` across ${localities.length} ${localities.length === 1 ? "locality" : "localities"} (${localities.join(", ")})`},
            with {summary.unit_count} unit{summary.unit_count === 1 ? "" : "s"} available today, priced from{" "}
            {formatPriceRange(summary.price_min, summary.price_max)}. Every listing below is synced live from our
            sales desk — if it&apos;s shown here, it&apos;s actually available.
          </p>

          <div className="mt-8 flex flex-wrap gap-8">
            <Stat icon={Building2} label="Projects" value={String(summary.project_count)} />
            <Stat icon={Layers} label="Units Available" value={String(summary.unit_count)} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl text-ink">All Projects in {city}</h2>
          <Link href={`/projects?city=${encodeURIComponent(city)}`} className="text-sm font-medium text-ink-soft hover:text-ink">
            Search &amp; filter →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>

      <div className="border-t border-line bg-paper-dim py-16">
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">Get In Touch</span>
            <h2 className="mt-2 font-display text-3xl text-ink">Looking in {city}?</h2>
          </div>
          <div className="mt-8">
            <EnquiryForm
              title={`Tell us what you're looking for in ${city}`}
              subtitle="Share your budget and configuration and we'll shortlist options that actually match."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft">
        <Icon size={18} className="text-accent" />
      </div>
      <div>
        <div className="font-display text-xl text-ink">{value}</div>
        <div className="text-xs uppercase tracking-wide text-ink-faint">{label}</div>
      </div>
    </div>
  );
}
