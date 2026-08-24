import Link from "next/link";
import type { Property } from "@/lib/types";
import { formatIndianPrice } from "@/lib/format";

/**
 * A building, drawn as what it is: floors stacked on floors.
 *
 * iPropy sells builder floors, where the unit and the floor are the same thing.
 * Every other property site would render this as three cards in a row, which
 * throws away the one fact a buyer asks first — which floor, and is it free.
 * So the elevation is the listing: ground at the bottom, a row per floor, and
 * the only saturated colour on the page reserved for the floors you can have.
 *
 * Floors nobody has listed are drawn as an empty band rather than skipped. A
 * gap in a building is information; a missing row is just a shorter list.
 */

type FloorRow = { floor: number; unit: Property | null };

function statusOf(unit: Property | null): "open" | "held" | "taken" {
  if (!unit) return "taken";
  const s = (unit.status ?? "").toLowerCase();
  if (s === "available") return "open";
  if (s === "held" || s === "temporarily held" || s === "blocked") return "held";
  return "taken";
}

export function FloorStack({
  project,
  units,
}: {
  project: string;
  units: Property[];
}) {
  const floors = units
    .map((u) => u.floor)
    .filter((f): f is number => typeof f === "number");
  const top = floors.length ? Math.max(...floors) : 4;

  // Top floor first, because that is how you look at a building.
  const rows: FloorRow[] = Array.from({ length: top }, (_, i) => {
    const floor = top - i;
    return { floor, unit: units.find((u) => u.floor === floor) ?? null };
  });

  const openCount = rows.filter((r) => statusOf(r.unit) === "open").length;

  return (
    <figure className="m-0">
      {/* The roof: a thin cap so the stack reads as a building, not a table. */}
      <div aria-hidden className="mx-auto h-1.5 w-[calc(100%-1.5rem)] rounded-t-[2px] bg-ink" />

      <div className="ground overflow-hidden border border-rule-hard bg-chalk-2">
        {rows.map((row, i) => {
          const state = statusOf(row.unit);
          const unit = row.unit;

          return (
            <div
              key={row.floor}
              className="floor-in flex items-stretch border-b border-rule last:border-b-0"
              style={{ "--i": rows.length - i } as React.CSSProperties}
            >
              {/* Floor number: the spine of the drawing. */}
              <div className="flex w-[4.25rem] shrink-0 flex-col items-center justify-center border-r border-rule bg-chalk py-6">
                <span className="font-data text-2xl font-medium leading-none text-ink">
                  {row.floor}
                </span>
                <span className="label mt-1.5 text-[9px] tracking-[0.12em]">
                  {row.floor === 1 ? "GRND" : "FLOOR"}
                </span>
              </div>

              {unit ? (
                <Link
                  href={`/properties/${unit.id}`}
                  className="group flex flex-1 items-center gap-4 px-5 py-6 transition-colors hover:bg-chalk"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg text-ink group-hover:underline">
                      {unit.configuration ?? unit.name}
                    </span>
                    <span className="font-data mt-0.5 block text-xs text-ink-3">
                      {[
                        unit.carpet_area ? `${unit.carpet_area} ${unit.area_unit ?? "sqft"}` : null,
                        unit.facing ? `${unit.facing} facing` : null,
                      ]
                        .filter(Boolean)
                        .join("  ·  ")}
                    </span>
                  </span>

                  <span className="shrink-0 text-right">
                    <span className="font-data block text-sm font-medium text-ink">
                      {formatIndianPrice(unit.total_price)}
                    </span>
                    <StatusPip state={state} />
                  </span>
                </Link>
              ) : (
                <div className="hatch flex flex-1 items-center px-5 py-6">
                  <span className="font-data bg-chalk-2 px-2 py-0.5 text-[11px] text-ink-3">
                    Not on the market
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-display text-lg text-ink">{project}</span>
        <span className="font-data text-xs text-ink-2">
          {openCount > 0 ? (
            <>
              <b className="font-medium text-open">{openCount}</b> of {rows.length} floors free
            </>
          ) : (
            "Fully booked"
          )}
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * The only place saturated colour is allowed. It means one thing, so it can be
 * read without a legend.
 */
function StatusPip({ state }: { state: "open" | "held" | "taken" }) {
  const copy = { open: "Available", held: "Held", taken: "Booked" }[state];
  const tone = {
    open: "text-open",
    held: "text-held",
    taken: "text-taken",
  }[state];

  return (
    <span className={`font-data mt-1 flex items-center justify-end gap-1.5 text-[10px] uppercase tracking-[0.1em] ${tone}`}>
      <span
        aria-hidden
        className={`inline-block h-1.5 w-1.5 rounded-full bg-current ${state === "open" ? "breathe" : ""}`}
      />
      {copy}
    </span>
  );
}
