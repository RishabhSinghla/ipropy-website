import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPost, NotFoundError } from "@/lib/crm-client";
import { SITE_URL } from "@/lib/site-url";
import { renderMarkdown } from "@/lib/markdown";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const post = await getBlogPost((await params).slug);
    const title = post.seo_title || post.title;
    // The excerpt is the fallback so a post can never ship with an empty
    // description — the single most common on-page SEO fault.
    const description = post.seo_description || post.excerpt || post.key_takeaway || undefined;

    return {
      title,
      description,
      keywords: post.seo_keywords ? post.seo_keywords.split(",").map((k) => k.trim()) : undefined,
      alternates: { canonical: post.canonical_url || `${SITE_URL}/blog/${post.slug}` },
      openGraph: {
        type: "article",
        title,
        description,
        url: `${SITE_URL}/blog/${post.slug}`,
        publishedTime: post.published_at,
        modifiedTime: post.updated_at,
        authors: post.author ? [post.author] : undefined,
        images: post.cover_image_url ? [post.cover_image_url] : undefined,
      },
      twitter: { card: "summary_large_image", title, description },
    };
  } catch {
    return { title: "Post" };
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let post;
  try {
    post = await getBlogPost(slug);
  } catch (err) {
    if (err instanceof NotFoundError) notFound();
    throw err;
  }

  /*
   * Article + FAQPage JSON-LD.
   *
   * This is the half that answer engines and rich results read: `Article` for
   * attribution and dates, `FAQPage` for the question/answer pairs. The
   * `speakable` block marks the one sentence worth quoting aloud, which is
   * what a voice or AI assistant lifts when it summarises the page.
   */
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seo_description || post.excerpt || undefined,
    image: post.cover_image_url || undefined,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: post.author ? { "@type": "Person", name: post.author } : undefined,
    publisher: { "@type": "Organization", name: "iPropy", url: SITE_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.slug}` },
    wordCount: post.word_count || undefined,
    articleSection: post.category || undefined,
    ...(post.key_takeaway
      ? { speakable: { "@type": "SpeakableSpecification", cssSelector: [".key-takeaway"] } }
      : {}),
  };

  const faqSchema = post.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  return (
    <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      <nav className="text-sm text-ink-faint">
        <Link href="/blog" className="hover:text-ink">← All insights</Link>
      </nav>

      <article className="mt-6">
        <header>
          {post.category && (
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">{post.category}</p>
          )}
          <h1 className="mt-2 font-display text-4xl leading-tight text-ink">{post.title}</h1>
          <p className="mt-4 text-sm text-ink-faint">
            <time dateTime={post.published_at}>
              {new Date(post.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </time>
            {" · "}{post.reading_minutes} min read
            {post.author ? ` · ${post.author}` : ""}
          </p>
        </header>

        {post.key_takeaway && (
          // Marked up for `speakable` above and placed before the body: both
          // readers in a hurry and machines summarising the page want this first.
          <p className="key-takeaway mt-8 border-l-2 border-ink bg-paper-dim p-5 text-lg leading-relaxed text-ink">
            {post.key_takeaway}
          </p>
        )}

        {post.body && (
          <div
            className="prose-post mt-8"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }}
          />
        )}

        {post.faq?.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-2xl text-ink">Common questions</h2>
            <dl className="mt-6 space-y-6">
              {post.faq.map((f) => (
                <div key={f.question} className="border-t border-line pt-4">
                  <dt className="font-medium text-ink">{f.question}</dt>
                  <dd className="mt-2 leading-relaxed text-ink-soft">{f.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </article>

      {post.related.length > 0 && (
        <aside className="mt-16 border-t border-line pt-8">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">Keep reading</h2>
          <ul className="mt-4 space-y-4">
            {post.related.map((r) => (
              <li key={r.slug}>
                <Link href={`/blog/${r.slug}`} className="text-ink hover:underline">{r.title}</Link>
                <p className="mt-1 text-sm text-ink-soft">{r.excerpt}</p>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </main>
  );
}
