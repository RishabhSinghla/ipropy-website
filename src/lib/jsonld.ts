import type { Project, Property } from "./types";
import { mediaUrl } from "./media";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function projectJsonLd(project: Project) {
  const images = project.gallery.map((g) => mediaUrl(g)).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: project.name,
    description: project.description ?? undefined,
    url: `${SITE_URL}/projects/${project.id}`,
    ...(images.length > 0 && { image: images }),
    address: {
      "@type": "PostalAddress",
      addressLocality: project.locality ?? undefined,
      addressRegion: project.state ?? undefined,
      addressCountry: "IN",
    },
    ...(project.latitude && project.longitude && {
      geo: { "@type": "GeoCoordinates", latitude: project.latitude, longitude: project.longitude },
    }),
    ...(project.developer_name && {
      broker: { "@type": "Organization", name: project.developer_name },
    }),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: project.price_min ?? undefined,
      highPrice: project.price_max ?? undefined,
      availability: "https://schema.org/InStock",
    },
  };
}

export function propertyJsonLd(property: Property) {
  const images = property.gallery.map((g) => mediaUrl(g)).filter(Boolean);
  const price = property.total_price ?? property.base_price;
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.name,
    description: property.description ?? undefined,
    url: `${SITE_URL}/properties/${property.id}`,
    ...(images.length > 0 && { image: images }),
    address: {
      "@type": "PostalAddress",
      addressLocality: property.locality ?? undefined,
      addressCountry: "IN",
    },
    ...(property.latitude && property.longitude && {
      geo: { "@type": "GeoCoordinates", latitude: property.latitude, longitude: property.longitude },
    }),
    numberOfRooms: property.bedrooms ?? undefined,
    numberOfBathroomsTotal: property.bathrooms ?? undefined,
    floorSize: property.carpet_area
      ? { "@type": "QuantitativeValue", value: property.carpet_area, unitCode: "FTK" }
      : undefined,
    offers: price
      ? { "@type": "Offer", priceCurrency: "INR", price, availability: "https://schema.org/InStock" }
      : undefined,
  };
}
