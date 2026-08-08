/**
 * Minimal Markdown → HTML for blog bodies written in the CRM.
 *
 * Deliberately not a full parser and deliberately not a dependency: the input
 * is written by our own staff in the CRM, the subset below is what they
 * actually use, and every post is server-rendered so the cost of a Markdown
 * library would be paid on every build.
 *
 * Everything is HTML-escaped *first*, so no rule below can emit a tag from the
 * post body, and link targets are restricted to http(s)/mailto — escaping
 * stops `<script>`, but not an `href="javascript:"`.
 */
export function renderMarkdown(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Code is lifted out before the inline rules run, so `**` inside a code span
  // is not turned into bold.
  const code: string[] = [];
  const stash = (html: string): string => ` CODE${code.push(html) - 1} `;

  const lines = escaped.split("\n");
  const out: string[] = [];
  let inList = false;
  let inQuote = false;

  const closeBlocks = (): void => {
    if (inList) { out.push("</ul>"); inList = false; }
    if (inQuote) { out.push("</blockquote>"); inQuote = false; }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (!line.trim()) { closeBlocks(); continue; }

    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      closeBlocks();
      const level = Math.min(6, heading[1].length + 1); // h1 is the page title
      out.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      continue;
    }

    const bullet = /^[-*]\s+(.*)$/.exec(line);
    if (bullet) {
      if (inQuote) { out.push("</blockquote>"); inQuote = false; }
      if (!inList) { out.push("<ul>"); inList = true; }
      out.push(`<li>${inline(bullet[1])}</li>`);
      continue;
    }

    const quote = /^>\s?(.*)$/.exec(line);
    if (quote) {
      if (inList) { out.push("</ul>"); inList = false; }
      if (!inQuote) { out.push("<blockquote>"); inQuote = true; }
      out.push(`<p>${inline(quote[1])}</p>`);
      continue;
    }

    closeBlocks();
    out.push(`<p>${inline(line)}</p>`);
  }
  closeBlocks();

  return out.join("\n").replace(/ CODE(\d+) /g, (_m, i: string) => code[Number(i)]);

  function inline(s: string): string {
    return s
      .replace(/`([^`]+)`/g, (_m, body: string) => stash(`<code>${body}</code>`))
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, "$1<em>$2</em>")
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (match, label: string, href: string) =>
        /^(https?:\/\/|\/|mailto:)/i.test(href)
          ? `<a href="${href}"${href.startsWith("http") ? ' target="_blank" rel="noreferrer noopener"' : ""}>${label}</a>`
          : match);
  }
}
