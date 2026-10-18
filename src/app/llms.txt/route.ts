import { listBlogPosts, listListings } from "@/lib/crm-client";
import { priceText } from "@/lib/listing";
import { SITE_URL } from "@/lib/site-url";

export const revalidate = 3600;

/**
 * llms.txt — a plain-text map of the site for AI assistants.
 *
 * The emerging convention (llmstxt.org) for telling a model what a site is and
 * which pages are worth reading, rather than making it infer that from
 * navigation chrome. Costs nothing, and when someone asks an assistant what a
 * builder floor in Greenfields costs, this is the file that decides whether our
 * answer is the one it finds.
 */
export async function GET(): Promise<Response> {
  const [{ items: posts }, { items: listings }] = await Promise.all([
    listBlogPosts({ limit: 50 }),
    listListings({ limit: 30, sort: "newest" }),
  ]);

  const lines = [
    "# iPropy",
    "",
    "> Builder floors, plots and independent houses in Greenfields Colony, Faridabad (Delhi NCR).",
    "> Every listing is sourced from our own sales desk, so availability reflects what is actually",
    "> on the market today rather than a stale portal feed.",
    "",
    "## Guides",
    ...posts.map((p) => {
      const note = p.key_takeaway ?? p.excerpt ?? "";
      return `- [${p.title}](${SITE_URL}/blog/${p.slug})${note ? `: ${note}` : ""}`;
    }),
    "",
    "## Newest listings",
    ...listings.map((l) => `- [${l.title}](${SITE_URL}/properties/${l.id}): ${priceText(l)}`),
    "",
    "## Pages",
    `- [All properties](${SITE_URL}/properties)`,
    `- [Sell your property](${SITE_URL}/sell)`,
    `- [Insights](${SITE_URL}/blog)`,
  ];

  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
