import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, ShieldCheck, Building2, Ruler, CalendarDays, ExternalLink } from "lucide-react";
import { getProject, NotFoundError } from "@/lib/crm-client";
import { amenityIcon } from "@/lib/amenityIcons";
import { formatIndianPrice, formatPriceRange, formatArea, formatDate } from "@/lib/format";
import { Gallery } from "@/components/Gallery";
import { ProjectCard } from "@/components/ProjectCard";
import { EnquiryForm } from "@/components/EnquiryForm";
import { mediaUrl } from "@/lib/media";
import { CompareButton } from "@/components/CompareButton";
import { JsonLd } from "@/components/JsonLd";
import { projectJsonLd } from "@/lib/jsonld";
import { ViewTracker } from "@/components/ViewTracker";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const { project } = await getProject((await params).id);
    return {
      title: project.name,
      description: `${project.name} — ${[project.locality, project.city].filter(Boolean).join(", ")}. ${formatPriceRange(project.price_min, project.price_max)}. ${project.configurations.join(", ")}.`,
    };
  } catch {
    return { title: "Project" };
  }
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let data;
  try {
    data = await getProject(id);
  } catch (err) {
    if (err instanceof NotFoundError) notFound();
    throw err;
  }

  const { project, units, similar } = data;
  const images = project.gallery.map((g) => mediaUrl(g)).filter((u): u is string => Boolean(u));

  const facts = [
    { icon: Building2, label: "Configurations", value: project.configurations.join(", ") || "—" },
    { icon: Ruler, label: "Land Area", value: project.total_land_area ? `${project.total_land_area} ${project.land_area_unit}` : "—" },
    { icon: CalendarDays, label: "Possession", value: formatDate(project.possession_date) },
    { icon: ShieldCheck, label: "RERA", value: project.rera_number ?? "—" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <JsonLd data={projectJsonLd(project)} />
      <ViewTracker item={{ id: project.id, kind: "project", name: project.name, subtitle: project.locality ?? undefined, image: images[0] ?? null }} />
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href="/projects" className="hover:text-ink">Projects</Link>
        <span>/</span>
        <span className="text-ink-soft">{project.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <Gallery images={images} alt={project.name} />

          <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent-ink">{project.status}</span>
              <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">{project.name}</h1>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-soft">
                <MapPin size={14} />
                {[project.locality, project.city, project.state].filter(Boolean).join(", ")}
              </p>
              {project.developer_name && <p className="mt-1 text-xs text-ink-faint">by {project.developer_name}</p>}
            </div>
            <CompareButton item={{ id: project.id, kind: "project", name: project.name, subtitle: project.locality ?? undefined, image: images[0] ?? null }} />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-line bg-paper-dim p-5 sm:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label}>
                <f.icon size={16} className="text-accent" />
                <div className="mt-2 text-[11px] uppercase tracking-wide text-ink-faint">{f.label}</div>
                <div className="mt-0.5 text-sm font-medium text-ink">{f.value}</div>
              </div>
            ))}
          </div>

          {project.description && (
            <section className="mt-10">
              <h2 className="font-display text-xl text-ink">About This Project</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{project.description}</p>
            </section>
          )}

          {project.amenities.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-xl text-ink">Amenities</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {project.amenities.map((a) => {
                  const Icon = amenityIcon(a);
                  return (
                    <div key={a} className="flex items-center gap-2 text-sm text-ink-soft">
                      <Icon size={15} className="shrink-0 text-accent" />
                      {a}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {project.connectivity.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-xl text-ink">Connectivity</h2>
              <div className="mt-4 divide-y divide-line border-y border-line">
                {project.connectivity.map((c) => (
                  <div key={c.place} className="flex items-center justify-between py-3 text-sm">
                    <span className="text-ink-soft">{c.place}</span>
                    <span className="font-medium text-ink">{c.distance}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(project.brochure_url || project.master_plan_url || project.virtual_tour_url) && (
            <section className="mt-10 flex flex-wrap gap-3">
              {project.brochure_url && <ResourceLink href={project.brochure_url} label="Download Brochure" />}
              {project.master_plan_url && <ResourceLink href={project.master_plan_url} label="Master Plan" />}
              {project.virtual_tour_url && <ResourceLink href={project.virtual_tour_url} label="Virtual Tour" />}
            </section>
          )}

          {units.length > 0 && (
            <section className="mt-12">
              <h2 className="font-display text-xl text-ink">Available Units ({units.length})</h2>
              <div className="mt-4 overflow-x-auto rounded-2xl border border-line scrollbar-thin">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="border-b border-line bg-paper-dim text-left text-xs uppercase tracking-wide text-ink-faint">
                      <th className="px-4 py-3 font-medium">Unit</th>
                      <th className="px-4 py-3 font-medium">Configuration</th>
                      <th className="px-4 py-3 font-medium">Carpet Area</th>
                      <th className="px-4 py-3 font-medium">Floor</th>
                      <th className="px-4 py-3 font-medium">Price</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {units.map((u) => (
                      <tr key={u.id} className="border-b border-line last:border-0 hover:bg-paper-dim/60">
                        <td className="px-4 py-3 text-ink-soft">{u.tower ? `${u.tower}${u.wing ? ` / ${u.wing}` : ""}` : u.name}</td>
                        <td className="px-4 py-3 text-ink-soft">{u.configuration ?? "—"}</td>
                        <td className="px-4 py-3 text-ink-soft">{formatArea(u.carpet_area, u.area_unit)}</td>
                        <td className="px-4 py-3 text-ink-soft">{u.floor ?? "—"}</td>
                        <td className="px-4 py-3 font-medium text-ink">{formatIndianPrice(u.total_price ?? u.base_price)}</td>
                        <td className="px-4 py-3 text-right">
                          <Link href={`/properties/${u.id}`} className="text-xs font-medium text-accent hover:underline">View →</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-line bg-paper p-5">
            <div className="text-[11px] uppercase tracking-wide text-ink-faint">Starting from</div>
            <div className="font-display text-2xl text-ink">{formatPriceRange(project.price_min, project.price_max)}</div>
            {project.rate_per_sqft && <div className="mt-1 text-xs text-ink-faint">{formatIndianPrice(project.rate_per_sqft)}/sq.ft onwards</div>}
            <div className="mt-3 text-sm text-ink-soft">{project.available_units} units currently available</div>
          </div>
          <div className="mt-4">
            <EnquiryForm project={project.name} title="Interested in this project?" subtitle="Leave your details and we'll call you with the current price list." />
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-16 border-t border-line pt-12">
          <h2 className="font-display text-2xl text-ink">Similar Projects Nearby</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}

function ResourceLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-ink-soft transition-colors hover:border-accent hover:text-ink"
    >
      {label} <ExternalLink size={13} />
    </a>
  );
}
