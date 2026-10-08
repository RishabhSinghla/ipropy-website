import type { MetadataRoute } from "next";
import { listBlogPosts, listListings } from "@/lib/crm-client";
import { SITE_URL } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // The feed pages at 48; a few pages cover every listing a small desk has.
  const first = await listListings({ limit: 48, sort: "newest" });
  const rest = await Promise.all(
    Array.from({ length: Math.min(first.pages, 20) - 1 }, (_, i) => listListings({ limit: 48, sort: "newest", page: i + 2 })),
  );
  const listings = [first, ...rest].flatMap((p) => p.items);
  const posts = await listBlogPosts({ limit: 200 });

  const staticRoutes: MetadataRoute.Sitemap = ["", "/properties", "/sell"].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "hourly",
    priority: path === "" ? 1 : 0.8,
  }));

  const listingRoutes: MetadataRoute.Sitemap = listings.map((l) => ({
    url: `${SITE_URL}/properties/${l.id}`,
    lastModified: new Date(l.updatedAt),
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const blogRoutes: MetadataRoute.Sitemap = posts.items.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.published_at),
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  return [...staticRoutes, ...listingRoutes, ...blogRoutes];
}
