import type { Listing } from "./types";
import { mediaUrl } from "./media";
import { isRate } from "./listing";
import { SITE_URL } from "./site-url";

/** schema.org for one listing — what search engines and AI answers read. */
export function listingJsonLd(listing: Listing) {
  const images = listing.photos.map((p) => mediaUrl(p)).filter(Boolean);
  const description = listing.facts.find((f) => f.name === "description")?.value;
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: listing.title,
    description: typeof description === "string" ? description : undefined,
    url: `${SITE_URL}/properties/${listing.id}`,
    datePosted: listing.listedAt,
    ...(images.length > 0 && { image: images }),
    address: {
      "@type": "PostalAddress",
      addressLocality: listing.locality ?? undefined,
      addressRegion: listing.city ?? undefined,
      addressCountry: "IN",
    },
    ...(listing.area && /sq\.?\s*f/i.test(listing.areaUnit ?? "sq ft") && {
      floorSize: { "@type": "QuantitativeValue", value: listing.area, unitCode: "FTK" },
    }),
    ...(listing.price && !isRate(listing) && {
      offers: { "@type": "Offer", priceCurrency: "INR", price: listing.price, availability: "https://schema.org/InStock" },
    }),
  };
}

/** Properties › Locality › this home — what search results show as the page's path. */
export function breadcrumbJsonLd(listing: Listing) {
  const crumbs = [{ name: "Properties", url: `${SITE_URL}/properties` }];
  if (listing.locality) crumbs.push({ name: listing.locality, url: `${SITE_URL}/properties?locality=${encodeURIComponent(listing.locality)}` });
  crumbs.push({ name: listing.title, url: `${SITE_URL}/properties/${listing.id}` });
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.url })),
  };
}
