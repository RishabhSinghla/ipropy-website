import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, MapPin, MessageCircle } from "lucide-react";
import { getListing, listListings, NotFoundError } from "@/lib/crm-client";
import type { Listing } from "@/lib/types";
import {
  areaText, factText, listedAgo, priceText, ratePerSqft, isRate,
} from "@/lib/listing";
import { mediaUrl } from "@/lib/media";
import { amenityIcon } from "@/lib/amenityIcons";
import { Gallery } from "@/components/Gallery";
import { ListingCard } from "@/components/ListingCard";
import { EnquiryForm } from "@/components/EnquiryForm";
import { EmiCalculator } from "@/components/EmiCalculator";
import { CompareButton } from "@/components/CompareButton";
import { ShareButton } from "@/components/ShareButton";
import { ListingActionBar } from "@/components/ListingActionBar";
import { AlertSignup } from "@/components/AlertSignup";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, listingJsonLd } from "@/lib/jsonld";
import { ViewTracker } from "@/components/ViewTracker";
import { SITE_URL } from "@/lib/site-url";
import { WHATSAPP_NUMBER } from "@/lib/constants";

async function load(id: string): Promise<Listing> {
  try {
    return await getListing(id);
  } catch (err) {
    if (err instanceof NotFoundError) notFound();
    throw err;
  }
}

export async function generateMetadata({ params }: PageProps<"/properties/[id]">): Promise<Metadata> {
  try {
    const listing = await getListing((await params).id);
    const bits = [priceText(listing), areaText(listing), [listing.locality, listing.city].filter(Boolean).join(", ")];
    return {
      title: listing.title,
      description: bits.filter(Boolean).join(" · "),
      alternates: { canonical: `/properties/${listing.id}` },
    };
  } catch {
    return { title: "Property" };
  }
}

/** Facts drawn in the headline row; the rest go in the table. */
const HEADLINE = new Set(["description", "amenities"]);

export default async function ListingPage({ params }: PageProps<"/properties/[id]">) {
  const { id } = await params;
  const listing = await load(id);

  const photos = listing.photos.map((p) => mediaUrl(p)).filter((u): u is string => Boolean(u));
  const description = listing.facts.find((f) => f.name === "description");
  const amenities = listing.facts.find((f) => f.name === "amenities");
  const table = listing.facts.filter((f) => !HEADLINE.has(f.name));
  const rate = ratePerSqft(listing);
  const area = areaText(listing);

  // Nearby first: the same locality, then anything else.
  const nearby = listing.locality
    ? (await listListings({ locality: [listing.locality], limit: 7 })).items
    : [];
  const similar = nearby.filter((l) => l.id !== listing.id).slice(0, 3);

  const pageUrl = `${SITE_URL}/properties/${listing.id}`;
  const whatsapp = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi, I am interested in: ${listing.title} (${pageUrl})`)}`
    : null;

  return (
    <div className="mx-auto max-w-7xl px-5 pb-28 pt-8 sm:px-8 lg:pb-8">
      <JsonLd data={listingJsonLd(listing)} />
      <JsonLd data={breadcrumbJsonLd(listing)} />
      <ViewTracker item={{ id: listing.id, name: listing.title, subtitle: priceText(listing), image: photos[0] ?? null }} />

      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-ink-soft">
        <Link href="/properties" className="hover:text-ink">Properties</Link>
        {listing.locality && (
          <>
            <ChevronRight size={13} className="text-ink-faint" />
            <Link href={`/properties?locality=${encodeURIComponent(listing.locality)}`} className="hover:text-ink">{listing.locality}</Link>
          </>
        )}
        <ChevronRight size={13} className="text-ink-faint" />
        <span className="truncate text-ink-faint" aria-current="page">{listing.title}</span>
      </nav>

      <div className="mt-5 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0">
          <Gallery images={photos} alt={listing.title} />

          <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl leading-tight text-ink sm:text-4xl">{listing.title}</h1>
              {(listing.locality || listing.city) && (
                <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-soft">
                  <MapPin size={14} /> {[listing.locality, listing.city].filter(Boolean).join(", ")}
                </p>
              )}
              <p className="mt-1 text-xs text-ink-faint">{listedAgo(listing.listedAt)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <CompareButton item={{ id: listing.id, name: listing.title, subtitle: priceText(listing), image: photos[0] ?? null }} />
              <ShareButton title={listing.title} url={pageUrl} />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
            <Stat label={isRate(listing) ? "Rate" : "Price"} value={priceText(listing)} />
            <Stat label="Size" value={area ?? "—"} />
            <Stat label="Configuration" value={listing.bedrooms ?? "—"} />
            <Stat label={rate ? "Per sq ft" : "Type"} value={rate ?? listing.category ?? "—"} />
          </div>

          {description && (
            <section className="mt-10">
              <h2 className="font-display text-2xl text-ink">About this property</h2>
              <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-ink-soft">{factText(description.value)}</p>
            </section>
          )}

          {table.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-2xl text-ink">Details</h2>
              <dl className="mt-4 grid gap-x-8 sm:grid-cols-2">
                {table.map((f) => (
                  <div key={f.name} className="flex justify-between gap-4 border-b border-line py-3 text-sm">
                    <dt className="text-ink-faint">{f.label}</dt>
                    <dd className="text-right font-medium text-ink">{factText(f.value, f.type)}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {amenities && Array.isArray(amenities.value) && amenities.value.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-2xl text-ink">Amenities</h2>
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {amenities.value.map((a) => {
                  const Icon = amenityIcon(a);
                  return (
                    <li key={a} className="flex items-center gap-2 text-sm text-ink-soft">
                      <Icon size={15} className="text-accent" /> {a}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {listing.price && !isRate(listing) && (
            <section className="mt-10 max-w-md">
              <EmiCalculator price={listing.price} />
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-line bg-paper-dim p-5">
            <div className="text-[11px] uppercase tracking-wide text-ink-faint">{isRate(listing) ? "Rate" : "Asking price"}</div>
            <div className="mt-1 font-display text-3xl text-ink">{priceText(listing)}</div>
            {rate && <div className="text-xs text-ink-faint">{rate}</div>}
            <p className="mt-3 text-xs leading-relaxed text-ink-soft">
              You deal with iPropy directly. Ask us anything — price, paperwork, a visit — and we will call you back.
            </p>
            {whatsapp && (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[#25D366] py-2.5 text-sm font-medium text-white"
              >
                <MessageCircle size={15} /> Ask on WhatsApp
              </a>
            )}
          </div>
          <div className="mt-4 scroll-mt-24" id="enquire">
            <EnquiryForm
              listing={{ id: listing.id, title: listing.title, url: pageUrl }}
              title="Book a visit or ask a question"
              subtitle="Leave your number — our team calls back the same day."
            />
          </div>
        </aside>
      </div>

      <section className="mt-16 border-t border-line pt-12">
        <AlertSignup criteria={alikeCriteria(listing)} />
      </section>

      {similar.length > 0 && (
        <section className="mt-16 border-t border-line pt-12">
          <h2 className="font-display text-2xl text-ink">More in {listing.locality}</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        </section>
      )}
      <ListingActionBar title={listing.title} url={pageUrl} whatsapp={whatsapp} />
    </div>
  );
}

/** "3 BHK Builder Floor in Greenfields, around ₹1.45 Cr" — the search a buyer of this home would run. */
function alikeCriteria(listing: Listing): string {
  const what = [listing.bedrooms, listing.category].filter(Boolean).join(" ") || "Homes";
  const where = listing.locality ? ` in ${listing.locality}` : "";
  const price = listing.price && !isRate(listing) ? `, around ${priceText(listing)}` : "";
  return `${what}${where}${price}`;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-paper p-4">
      <div className="text-[11px] uppercase tracking-wide text-ink-faint">{label}</div>
      <div className="mt-1 truncate text-sm font-semibold text-ink">{value}</div>
    </div>
  );
}
