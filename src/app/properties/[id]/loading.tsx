export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <div className="h-3 w-48 animate-pulse rounded bg-paper-dim" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="aspect-[16/9] animate-pulse rounded-2xl bg-paper-dim" />
          <div className="mt-8 h-8 w-2/3 animate-pulse rounded bg-paper-dim" />
          <div className="mt-3 h-4 w-1/3 animate-pulse rounded bg-paper-dim" />
        </div>
        <div className="h-64 animate-pulse rounded-2xl bg-paper-dim" />
      </div>
    </div>
  );
}
