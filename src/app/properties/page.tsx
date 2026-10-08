import type { Metadata } from "next";
import Link from "next/link";
import { getListingFacets, listListings } from "@/lib/crm-client";
import { PAGE_SIZE, searchFromParams } from "@/lib/listing";
import { ListingCard } from "@/components/ListingCard";
import { PortalFilters } from "@/components/PortalFilters";
import { Pagination } from "@/components/Pagination";

export const metadata: Metadata = {
  title: "Properties for sale",
  description: "Builder floors, flats, plots and houses — every one listed by our own team, live from our sales desk.",
};

export default async function PropertiesPage({ searchParams }: PageProps<"/properties">) {
  const sp = await searchParams;
  const search = searchFromParams(sp);
  const [facets, result] = await Promise.all([
    getListingFacets(),
    listListings({ ...search, limit: PAGE_SIZE }),
  ]);
  const flat = Object.fromEntries(
    Object.entries(sp).flatMap(([k, v]) => (typeof v === "string" ? [[k, v]] : [])),
  ) as Record<string, string>;
  const narrowed = result.total !== facets.total;

  return (
    <div>
      <div className="mx-auto max-w-7xl px-5 pt-10 sm:px-8">
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
          {result.total.toLocaleString("en-IN")} {result.total === 1 ? "property" : "properties"}
          {narrowed && ` of ${facets.total.toLocaleString("en-IN")}`}
        </span>
        <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
          {search.locality?.length === 1 ? `Properties in ${search.locality[0]}` : "Find your next home"}
        </h1>
      </div>

      <div className="mt-6">
        <PortalFilters facets={facets} />
      </div>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        {result.items.length === 0 ? (
          <EmptyState anyListings={facets.total > 0} />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {result.items.map((listing, i) => (
                <ListingCard key={listing.id} listing={listing} priority={i < 3} />
              ))}
            </div>
            <Pagination basePath="/properties" searchParams={flat} page={result.page} pages={result.pages} />
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState({ anyListings }: { anyListings: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-paper-dim px-6 py-20 text-center">
      <p className="font-display text-xl text-ink">
        {anyListings ? "Nothing matches those filters" : "New listings are on their way"}
      </p>
      <p className="max-w-md text-sm text-ink-soft">
        {anyListings
          ? "Try a wider budget or another locality — or tell us what you want and we will look for you."
          : "Our team adds properties every week. Tell us what you are looking for and we will call you with options."}
      </p>
      <div className="mt-2 flex gap-3">
        {anyListings && (
          <Link href="/properties" className="rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink-soft hover:text-ink">
            Clear filters
          </Link>
        )}
        <Link href="/#enquire" className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper">
          Tell us what you need
        </Link>
      </div>
    </div>
  );
}
