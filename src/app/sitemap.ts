import type { MetadataRoute } from "next";
import { listProjects, listProperties } from "@/lib/crm-client";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, properties] = await Promise.all([
    listProjects({ limit: 48 }),
    listProperties({ limit: 48 }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = ["", "/projects", "/properties", "/compare"].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "hourly",
    priority: path === "" ? 1 : 0.8,
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

  return [...staticRoutes, ...projectRoutes, ...propertyRoutes];
}
