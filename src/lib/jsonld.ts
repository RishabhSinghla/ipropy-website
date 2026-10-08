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
