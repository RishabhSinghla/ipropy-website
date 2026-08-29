import Link from "next/link";

export function Pagination({
  basePath,
  searchParams,
  total,
  limit,
  offset,
}: {
  basePath: string;
  searchParams: Record<string, string>;
  total: number;
  limit: number;
  offset: number;
}) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.floor(offset / limit) + 1;
  if (totalPages <= 1) return null;

  function pageHref(page: number) {
    const params = new URLSearchParams(searchParams);
    params.set("offset", String((page - 1) * limit));
    return `${basePath}?${params.toString()}`;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1,
  );

  return (
    <nav className="mt-12 flex items-center justify-center gap-1.5">
      {currentPage > 1 && (
        <Link href={pageHref(currentPage - 1)} className="rounded-full border border-line px-4 py-2 text-sm text-ink-soft hover:text-ink">
          Prev
        </Link>
      )}
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-1.5">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="px-1 text-ink-faint">…</span>}
          <Link
            href={pageHref(p)}
            className={
              p === currentPage
                ? "flex h-11 w-11 items-center justify-center rounded-full bg-ink text-sm font-medium text-paper"
                : "flex h-11 w-11 items-center justify-center rounded-full text-sm text-ink-soft hover:bg-paper-dim"
            }
          >
            {p}
          </Link>
        </span>
      ))}
      {currentPage < totalPages && (
        <Link href={pageHref(currentPage + 1)} className="rounded-full border border-line px-4 py-2 text-sm text-ink-soft hover:text-ink">
          Next
        </Link>
      )}
    </nav>
  );
}
