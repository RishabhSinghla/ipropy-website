import type { MetadataRoute } from "next";
import { listProjects, listProperties, getCities, listBlogPosts } from "@/lib/crm-client";
import { slugify } from "@/lib/slug";
import { SITE_URL } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, properties, cities, posts] = await Promise.all([
    listProjects({ limit: 48 }),
    listProperties({ limit: 48 }),
    getCities(),
    listBlogPosts({ limit: 200 }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = ["", "/projects", "/properties", "/cities", "/compare", "/blog"].map((path) => ({
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
  const blogRoutes: MetadataRoute.Sitemap = posts.items.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.published_at),
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  return [...staticRoutes, ...cityRoutes, ...projectRoutes, ...propertyRoutes, ...blogRoutes];
}
