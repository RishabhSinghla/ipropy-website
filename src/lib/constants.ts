export const BUDGETS = [
  { label: "Any Budget", min: "", max: "" },
  { label: "Under ₹50 L", min: "", max: "5000000" },
  { label: "₹50 L – ₹1 Cr", min: "5000000", max: "10000000" },
  { label: "₹1 Cr – ₹2 Cr", min: "10000000", max: "20000000" },
  { label: "₹2 Cr – ₹5 Cr", min: "20000000", max: "50000000" },
  { label: "₹5 Cr+", min: "50000000", max: "" },
];

/**
 * The business WhatsApp number, digits only with the country code
 * (e.g. 919876543210). Set NEXT_PUBLIC_WHATSAPP_NUMBER where the site is
 * hosted; left unset, no WhatsApp button is drawn rather than one that
 * messages a guessed number.
 */
export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
