import type { Metadata } from "next";
import Link from "next/link";
import { listBlogPosts, getBlogCategories } from "@/lib/crm-client";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Blog — buying guides, market updates and RERA explainers",
  description:
    "Straight answers on buying a builder floor in Greenfields Colony and around Faridabad — carpet area, total cost, RERA, home loans and Vastu.",
  alternates: { canonical: `${SITE_URL}/blog` },
};

// Posts are edited in the CRM, so the feed has to reflect an edit without a
// redeploy. Revalidating hourly keeps it static and cheap while staying fresh.
export const revalidate = 3600;

export default async function BlogIndex({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [{ items }, { items: categories }] = await Promise.all([
    listBlogPosts({ limit: 24, category }),
    getBlogCategories(),
  ]);

  return (
    <main className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl text-ink">Insights</h1>
        <p className="mt-3 text-ink-soft">
          What we tell buyers across the desk, written down — pricing, paperwork and the
          questions worth asking before you pay a token.
        </p>
      </header>

      {categories.length > 0 && (
        <nav aria-label="Categories" className="mt-8 flex flex-wrap gap-2">
          <Link
            href="/blog"
            className={`rounded-full border px-3 py-1 text-sm ${!category ? "border-ink bg-ink text-paper" : "border-line text-ink-soft hover:text-ink"}`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.category}
              href={`/blog?category=${encodeURIComponent(c.category)}`}
              className={`rounded-full border px-3 py-1 text-sm ${category === c.category ? "border-ink bg-ink text-paper" : "border-line text-ink-soft hover:text-ink"}`}
            >
              {c.category} <span className="text-ink-faint">{c.count}</span>
            </Link>
          ))}
        </nav>
      )}

      {items.length === 0 ? (
        <p className="mt-12 text-ink-soft">No posts yet — check back shortly.</p>
      ) : (
        <ul className="mt-10 grid gap-8 sm:grid-cols-2">
          {items.map((post) => (
            <li key={post.slug} className="border-t border-line pt-6">
              <article>
                {post.category && (
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
                    {post.category}
                  </p>
                )}
                <h2 className="mt-2 text-xl leading-snug text-ink">
                  <Link href={`/blog/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h2>
                {post.excerpt && <p className="mt-2 text-sm leading-relaxed text-ink-soft">{post.excerpt}</p>}
                <p className="mt-3 text-xs text-ink-faint">
                  <time dateTime={post.published_at}>
                    {new Date(post.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </time>
                  {" · "}{post.reading_minutes} min read
                  {post.author ? ` · ${post.author}` : ""}
                </p>
              </article>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
