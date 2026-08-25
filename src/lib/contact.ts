/**
 * How to reach a human, in one place.
 *
 * The site had no `tel:` link and no `wa.me` link anywhere — on a page reps
 * share over WhatsApp mid-conversation, where a started WhatsApp chat is one of
 * the two definitions of success. The only channel was a form four thousand
 * pixels down. In this market the first thing a family checks is whether there
 * is a number, and its absence is the first reason to close the tab.
 */

/** The business WhatsApp, digits only, country code included. */
export const WHATSAPP_NUMBER = "919711533633";

/** The same number, dialable. */
export const PHONE_DISPLAY = "+91 97115 33633";
export const PHONE_HREF = "tel:+919711533633";

/**
 * A WhatsApp link that opens with the message already written.
 *
 * Prefilling matters more than it looks: a buyer who has to compose the first
 * message often does not, and a rep who receives "Hi" has to ask which floor.
 * Naming the unit means the conversation starts with the answer already in it.
 */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** "Ask about this floor" — the message a specific unit should open with. */
export function askAboutUnit(parts: {
  unit?: string | null;
  configuration?: string | null;
  project?: string | null;
  floor?: number | null;
}): string {
  const where = [
    parts.configuration,
    parts.floor != null ? (parts.floor === 1 ? "ground floor" : `floor ${parts.floor}`) : null,
    parts.project,
  ]
    .filter(Boolean)
    .join(", ");

  return where
    ? `Hi, I saw the ${where} on your site. Is it still available?`
    : "Hi, I saw a floor on your site. Is it still available?";
}
