import Link from "next/link";

/** Page links that keep every other filter in the address bar as it was. */
export function Pagination({
  basePath,
  searchParams,
  page,
  pages,
}: {
  basePath: string;
  searchParams: Record<string, string>;
  page: number;
  pages: number;
}) {
  if (pages <= 1) return null;

  function pageHref(p: number) {
    const params = new URLSearchParams(searchParams);
    if (p === 1) params.delete("page"); else params.set("page", String(p));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  const shown = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pages || Math.abs(p - page) <= 1,
  );

  return (
    <nav aria-label="Pages" className="mt-12 flex items-center justify-center gap-1.5">
      {page > 1 && (
        <Link href={pageHref(page - 1)} className="rounded-full border border-line px-4 py-2 text-sm text-ink-soft hover:text-ink">
          Prev
        </Link>
      )}
      {shown.map((p, i) => (
        <span key={p} className="flex items-center gap-1.5">
          {i > 0 && shown[i - 1] !== p - 1 && <span className="px-1 text-ink-faint">…</span>}
          <Link
            href={pageHref(p)}
            aria-current={p === page ? "page" : undefined}
            className={
              p === page
                ? "flex h-9 w-9 items-center justify-center rounded-full bg-ink text-sm font-medium text-paper"
                : "flex h-9 w-9 items-center justify-center rounded-full text-sm text-ink-soft hover:bg-paper-dim"
            }
          >
            {p}
          </Link>
        </span>
      ))}
      {page < pages && (
        <Link href={pageHref(page + 1)} className="rounded-full border border-line px-4 py-2 text-sm text-ink-soft hover:text-ink">
          Next
        </Link>
      )}
    </nav>
  );
}
