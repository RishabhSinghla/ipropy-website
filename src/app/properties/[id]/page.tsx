import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, BedDouble, Bath, Compass, Layers, ExternalLink } from "lucide-react";
import { getProperty, listProperties, NotFoundError } from "@/lib/crm-client";
import { amenityIcon } from "@/lib/amenityIcons";
import { formatIndianPrice, formatArea } from "@/lib/format";
import { Gallery } from "@/components/Gallery";
import { PropertyCard } from "@/components/PropertyCard";
import { EnquiryForm } from "@/components/EnquiryForm";
import { EmiCalculator } from "@/components/EmiCalculator";
import { CompareButton } from "@/components/CompareButton";
import { mediaUrl } from "@/lib/media";
import { JsonLd } from "@/components/JsonLd";
import { propertyJsonLd } from "@/lib/jsonld";
import { ViewTracker } from "@/components/ViewTracker";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const property = await getProperty((await params).id);
    return {
      title: `${property.configuration ?? property.name} in ${property.project_name ?? property.locality ?? ""}`,
      description: `${formatArea(property.carpet_area, property.area_unit)} · ${formatIndianPrice(property.total_price)} · ${[property.locality, property.city].filter(Boolean).join(", ")}`,
    };
  } catch {
    return { title: "Property" };
  }
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let property;
  try {
    property = await getProperty(id);
  } catch (err) {
    if (err instanceof NotFoundError) notFound();
    throw err;
  }

  const images = property.gallery.map((g) => mediaUrl(g)).filter((u): u is string => Boolean(u));
  const price = property.total_price ?? property.base_price ?? 0;

  const priceLines = [
    { label: "Base Price", value: property.base_price },
    { label: "Floor Rise Charge", value: property.floor_rise_charge },
    { label: "PLC", value: property.plc_charge },
    { label: "Parking Charge", value: property.parking_charge },
    { label: "Club Membership", value: property.club_membership },
    { label: "Maintenance Deposit", value: property.maintenance_deposit },
    { label: "Other Charges", value: property.other_charges },
  ].filter((l) => l.value);

  const related = property.project_id
    ? (await listProperties({ project: property.project_id, limit: 4 })).items.filter((u) => u.id !== property.id)
    : [];

  const facts = [
    { icon: BedDouble, label: "Bedrooms", value: property.bedrooms ?? "—" },
    { icon: Bath, label: "Bathrooms", value: property.bathrooms ?? "—" },
    { icon: Compass, label: "Facing", value: property.facing ?? "—" },
    { icon: Layers, label: "Floor", value: property.floor ?? "—" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <JsonLd data={propertyJsonLd(property)} />
      <ViewTracker item={{ id: property.id, kind: "property", name: property.name, subtitle: property.project_name ?? undefined, image: images[0] ?? null }} />
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href="/properties" className="hover:text-ink">Properties</Link>
        <span>/</span>
        <span className="text-ink-soft">{property.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <Gallery images={images} alt={property.name} />

          <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              {property.configuration && (
                <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent-ink">{property.configuration}</span>
              )}
              <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
                {property.project_name ?? property.name}
              </h1>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-soft">
                <MapPin size={14} />
                {[property.locality, property.city].filter(Boolean).join(", ")}
                {property.tower && ` · ${property.tower}${property.wing ? ` / ${property.wing}` : ""}`}
              </p>
              {property.project_id && (
                <Link href={`/projects/${property.project_id}`} className="mt-1 inline-block text-xs font-medium text-accent hover:underline">
                  View full project →
                </Link>
              )}
            </div>
            <CompareButton item={{ id: property.id, kind: "property", name: property.name, subtitle: property.project_name ?? undefined, image: images[0] ?? null }} />
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

          <section className="mt-10">
            <h2 className="font-display text-xl text-ink">Area Details</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
              <AreaStat label="Carpet Area" value={property.carpet_area} unit={property.area_unit} />
              <AreaStat label="Built-up Area" value={property.built_up_area} unit={property.area_unit} />
              <AreaStat label="Super Built-up" value={property.super_built_up_area} unit={property.area_unit} />
              <AreaStat label="Balcony Area" value={property.balcony_area} unit={property.area_unit} />
            </div>
          </section>

          {priceLines.length > 1 && (
            <section className="mt-10">
              <h2 className="font-display text-xl text-ink">Price Breakup</h2>
              <div className="mt-4 divide-y divide-line border-y border-line text-sm">
                {priceLines.map((l) => (
                  <div key={l.label} className="flex items-center justify-between py-3">
                    <span className="text-ink-soft">{l.label}</span>
                    <span className="font-medium text-ink">{formatIndianPrice(l.value)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between py-3 font-display text-base">
                  <span className="text-ink">All-Inclusive Price</span>
                  <span className="text-accent">{formatIndianPrice(price)}</span>
                </div>
              </div>
            </section>
          )}

          {property.description && (
            <section className="mt-10">
              <h2 className="font-display text-xl text-ink">Description</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{property.description}</p>
            </section>
          )}

          {property.amenities.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-xl text-ink">Amenities</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {property.amenities.map((a) => {
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

          {property.floor_plan_url && (
            <section className="mt-10">
              <a
                href={property.floor_plan_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-ink-soft transition-colors hover:border-accent hover:text-ink"
              >
                View Floor Plan <ExternalLink size={13} />
              </a>
            </section>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-line bg-paper p-5">
            <div className="text-[11px] uppercase tracking-wide text-ink-faint">All-inclusive price</div>
            <div className="font-display text-2xl text-ink">{formatIndianPrice(price)}</div>
            {property.rate_per_sqft && <div className="mt-1 text-xs text-ink-faint">{formatIndianPrice(property.rate_per_sqft)}/sq.ft</div>}
          </div>
          <EnquiryForm
            project={property.project_name ?? undefined}
            title="Interested in this unit?"
            subtitle="Leave your details and we'll call you to schedule a site visit."
          />
          {price > 0 && <EmiCalculator price={price} />}
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-16 border-t border-line pt-12">
          <h2 className="font-display text-2xl text-ink">More Units in {property.project_name}</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((u) => <PropertyCard key={u.id} property={u} />)}
          </div>
        </section>
      )}
    </div>
  );
}

function AreaStat({ label, value, unit }: { label: string; value: number | null; unit: string }) {
  if (!value) return null;
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-ink-faint">{label}</div>
      <div className="mt-1 font-medium text-ink">{formatArea(value, unit)}</div>
    </div>
  );
}
