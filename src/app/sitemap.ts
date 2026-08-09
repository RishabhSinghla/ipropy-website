import type { MetadataRoute } from "next";
import { listProjects, listProperties, getCities } from "@/lib/crm-client";
import { slugify } from "@/lib/slug";
import { SITE_URL } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, properties, cities] = await Promise.all([
    listProjects({ limit: 48 }),
    listProperties({ limit: 48 }),
    getCities(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = ["", "/projects", "/properties", "/cities", "/compare"].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "hourly",
    priority: path === "" ? 1 : 0.8,
  }));

  const cityRoutes: MetadataRoute.Sitemap = cities.items.map((c) => ({
    url: `${SITE_URL}/cities/${slugify(c.city)}`,
    changeFrequency: "daily",
    priority: 0.75,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.items.map((p) => ({
    url: `${SITE_URL}/projects/${p.id}`,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const propertyRoutes: MetadataRoute.Sitemap = properties.items.map((p) => ({
    url: `${SITE_URL}/properties/${p.id}`,
    changeFrequency: "daily",
    priority: 0.6,
  }));

  // Posts carry a real lastModified: unlike listings, an article's value to a
  // crawler is tied to when it was actually written.
  return [...staticRoutes, ...cityRoutes, ...projectRoutes, ...propertyRoutes];
}
