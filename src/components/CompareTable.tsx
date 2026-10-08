import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/lib/types";
import { areaText, coverOf, factText, listingHref, priceText, ratePerSqft } from "@/lib/listing";

/**
 * Side by side, one row per fact any of them has. The rows are the facts the
 * CRM publishes rather than a list written here, so a fact the team starts
 * filling in appears in the comparison by itself.
 */
export function CompareTable({ items }: { items: Listing[] }) {
  const rows = new Map<string, string>();
  for (const l of items) for (const f of l.facts) if (f.name !== "description") rows.set(f.name, f.label);

  const value = (l: Listing, name: string) => {
    const fact = l.facts.find((f) => f.name === name);
    return fact ? factText(fact.value, fact.type) : "—";
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-line">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr>
            <th className="w-40 bg-paper-dim p-4 text-left text-[11px] font-medium uppercase tracking-wide text-ink-faint" />
            {items.map((l) => {
              const cover = coverOf(l);
              return (
                <th key={l.id} className="bg-paper-dim p-4 text-left align-top font-normal">
                  <Link href={listingHref(l.id)} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-paper">
                      {cover && <Image src={cover} alt={l.title} fill sizes="240px" className="object-cover" />}
                    </div>
                    <div className="mt-2 font-medium text-ink group-hover:text-accent">{l.title}</div>
                  </Link>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          <Row label="Price" cells={items.map((l) => priceText(l))} strong />
          <Row label="Per sq ft" cells={items.map((l) => ratePerSqft(l) ?? "—")} />
          <Row label="Size" cells={items.map((l) => areaText(l) ?? "—")} />
          <Row label="Locality" cells={items.map((l) => l.locality ?? "—")} />
          {[...rows].map(([name, label]) => (
            <Row key={name} label={label} cells={items.map((l) => value(l, name))} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Row({ label, cells, strong = false }: { label: string; cells: string[]; strong?: boolean }) {
  const differ = new Set(cells).size > 1;
  return (
    <tr className="border-t border-line">
      <th className="p-4 text-left text-xs font-medium text-ink-faint">{label}</th>
      {cells.map((c, i) => (
        <td key={i} className={`p-4 ${strong ? "font-display text-lg text-ink" : "text-ink-soft"} ${differ ? "" : "opacity-70"}`}>
          {c}
        </td>
      ))}
    </tr>
  );
}
