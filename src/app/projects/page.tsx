import type { Metadata } from "next";
import { listProjects, getFilters } from "@/lib/crm-client";
import type { ProjectSort } from "@/lib/types";
import { ProjectCard } from "@/components/ProjectCard";
import { FiltersPanel } from "@/components/FiltersPanel";
import { Pagination } from "@/components/Pagination";

export const metadata: Metadata = { title: "All Projects" };

const SORTS = [
  { value: "possession", label: "Possession: Soonest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest Launched" },
];

const LIMIT = 12;

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const offset = Number(sp.offset) || 0;

  const [filters, result] = await Promise.all([
    getFilters(),
    listProjects({
      city: sp.city,
      configuration: sp.configuration,
      minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
      maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
      sort: sp.sort as ProjectSort | undefined,
      limit: LIMIT,
      offset,
    }),
  ]);

  return (
    <div>
      <div className="mx-auto max-w-7xl px-5 pt-12 sm:px-8">
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
          {result.total} Project{result.total === 1 ? "" : "s"}
        </span>
        <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">All Projects</h1>
      </div>

      <div className="mt-8">
        <FiltersPanel filters={filters} sortOptions={SORTS} />
      </div>

      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        {result.items.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {result.items.map((p, i) => (
                <ProjectCard key={p.id} project={p} priority={i < 3} />
              ))}
            </div>
            <Pagination
              basePath="/projects"
              searchParams={sp as Record<string, string>}
              total={result.total}
              limit={LIMIT}
              offset={offset}
            />
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-paper-dim py-20 text-center">
      <p className="font-display text-xl text-ink">No projects match those filters</p>
      <p className="text-sm text-ink-soft">Try widening your budget or clearing a filter.</p>
    </div>
  );
}
