/**
 * What a status looks like, decided once.
 *
 * The colour of "available" is the loudest thing on this site, and it earns that
 * by meaning exactly one thing. The moment a second file decides for itself what
 * green means, it stops being a signal and becomes decoration — which is how a
 * warning triangle on the error page ended up the same colour as a floor you
 * could buy.
 *
 * So: every status pill, dot and label in the product reads its tone from here.
 */

export type Tone = "open" | "held" | "taken";

/** CRM statuses, mapped to the three states a buyer actually cares about. */
export function toneOf(status: string | null | undefined): Tone {
  const s = (status ?? "").trim().toLowerCase();
  if (s === "available") return "open";
  if (s === "held" || s === "temporarily held" || s === "blocked") return "held";
  return "taken";
}

/** What a visitor should read, which is not always what the CRM stores. */
export function labelOf(tone: Tone): string {
  return { open: "Available", held: "Held", taken: "Booked" }[tone];
}

/** Text-only, for a label beside a dot. */
export const TONE_TEXT: Record<Tone, string> = {
  open: "text-open",
  held: "text-held",
  taken: "text-taken",
};

/** A filled pill, for a status standing on its own. */
export const TONE_PILL: Record<Tone, string> = {
  open: "bg-open-wash text-open",
  held: "bg-held-wash text-held",
  taken: "bg-taken-wash text-taken",
};
