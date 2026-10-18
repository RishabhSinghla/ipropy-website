// `<` is escaped so a value containing "</script>" cannot close the tag early.
// Same scrub the Next.js JSON-LD guide recommends; JSON parsers read \u003c as "<".
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
