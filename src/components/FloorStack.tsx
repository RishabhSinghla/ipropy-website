import Link from "next/link";
import { MessageCircle } from "lucide-react";
import type { Property } from "@/lib/types";
import { formatIndianPrice } from "@/lib/format";
import { askAboutUnit, whatsappLink } from "@/lib/contact";
import { toneOf, labelOf, TONE_TEXT, type Tone } from "@/lib/status";

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

type FloorRow = { floor: number | null; unit: Property | null };

/** A row with no unit is not "booked" — it was never on the market. */
function statusOf(unit: Property | null): Tone | null {
  return unit ? toneOf(unit.status) : null;
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

  /*
    A floor number is optional in the CRM, and on the live site today not one
    unit has one.

    The old code fell back to a four-storey building and then looked for units on
    floors 4, 3, 2 and 1. A unit whose floor is null matches none of those, so
    every row drew as "Not on the market" and the caption read **Fully booked** —
    directly under a line saying "2 floors free today", for two properties that
    are both available. The most prominent element on the site was contradicting
    the sentence beside it and turning buyers away from stock that exists.

    So the height of the building is only invented when at least one unit has
    told us where it sits. Otherwise the stack is exactly as tall as what we
    hold, one row per unit, with the floor number left blank rather than guessed.
  */
  const known = floors.length > 0;
  const top = known ? Math.max(...floors) : 0;

  // Top floor first, because that is how you look at a building.
  const rows: FloorRow[] = known
    ? Array.from({ length: top }, (_, i) => {
        const floor = top - i;
        return { floor, unit: units.find((u) => u.floor === floor) ?? null };
      })
    : units.map((unit) => ({ floor: null, unit }));

  // Count against the floors iPropy actually holds, not against the height of
  // the building. Ashoka has one floor for sale and two that were never listed;
  // "1 of 3 floors free" reads as two-thirds sold and is simply untrue.
  const listed = rows.filter((r) => r.unit).length;
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
              // The floor number is the natural key and is null on a record that
              // never recorded one, which would make every key identical.
              key={row.floor ?? `unit-${row.unit?.id ?? i}`}
              className="floor-in flex items-stretch border-b border-rule last:border-b-0"
              style={{ "--i": rows.length - i } as React.CSSProperties}
            >
              {/* Floor number: the spine of the drawing. */}
              {/* Blank rather than guessed when the record has no floor number.
                  A dash says "we did not record this"; a number would say
                  something we do not know. */}
              <div className="flex w-[4.25rem] shrink-0 flex-col items-center justify-center border-r border-rule bg-chalk py-6">
                <span className="font-data text-2xl font-medium leading-none text-ink">
                  {row.floor ?? <span aria-hidden className="text-ink-3">–</span>}
                </span>
                <span className="label mt-1.5">{row.floor === null ? "UNIT" : "FLOOR"}</span>
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
                    {state && <StatusPip state={state} />}
                  </span>
                </Link>
              ) : (
                <div className="hatch flex flex-1 items-center px-5 py-6">
                  <span className="font-data bg-chalk-2 px-2 py-0.5 text-[11px] text-ink-3">
                    Not on the market
                  </span>
                </div>
              )}

              {unit && state === "open" && (
                <a
                  href={whatsappLink(
                    askAboutUnit({
                      unit: unit.name,
                      configuration: unit.configuration,
                      project,
                      floor: row.floor,
                    }),
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={
                    row.floor === null
                      ? `Ask about the ${unit.configuration ?? unit.name} at ${project} on WhatsApp`
                      : `Ask about the ${unit.configuration ?? unit.name} on floor ${row.floor} on WhatsApp`
                  }
                  className="flex w-12 shrink-0 items-center justify-center border-l border-rule text-ink-2 transition-colors hover:bg-open-wash hover:text-open"
                >
                  <MessageCircle size={16} />
                </a>
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
              <b className="font-medium text-open">{openCount}</b> of {listed} we hold {listed === 1 ? "is" : "are"} free
            </>
          ) : listed > 0 ? (
            // Only sayable once we know we hold something. Said with nothing
            // listed, "Fully booked" turns an empty drawing into a claim that
            // the building is sold out.
            "Fully booked"
          ) : (
            "Ask us what is free here"
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
function StatusPip({ state }: { state: Tone }) {
  const copy = labelOf(state);
  const tone = TONE_TEXT[state];

  return (
    <span className={`font-data mt-1 flex items-center justify-end gap-1.5 text-[11px] uppercase tracking-[0.1em] ${tone}`}>
      <span
        aria-hidden
        className={`inline-block h-1.5 w-1.5 rounded-full bg-current ${state === "open" ? "breathe" : ""}`}
      />
      {copy}
    </span>
  );
}
