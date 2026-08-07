export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <div className="h-4 w-24 animate-pulse rounded bg-paper-dim" />
      <div className="mt-3 h-9 w-64 animate-pulse rounded bg-paper-dim" />
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-line">
            <div className="aspect-[4/3] animate-pulse bg-paper-dim" />
            <div className="space-y-3 p-5">
              <div className="h-5 w-3/4 animate-pulse rounded bg-paper-dim" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-paper-dim" />
              <div className="h-6 w-2/3 animate-pulse rounded bg-paper-dim" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
