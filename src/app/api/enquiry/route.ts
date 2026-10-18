import { NextResponse } from "next/server";

const CRM_API_URL = process.env.CRM_API_URL ?? "http://localhost:4000";
const ENQUIRY_FORM_KEY = process.env.ENQUIRY_FORM_KEY ?? "website-enquiry";

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/**
 * Forwards to the CRM's own POST /api/webhooks/forms/:publicKey. This route
 * exists so the form key stays on the server and the browser never talks to
 * the CRM; the CRM does the real work — duplicate check, lead, assignment.
 *
 * The listing goes into the message, title and link both, because that is
 * what the rep reads on the lead before calling back.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  // The hidden field: a person never fills it, so this is a bot. Answer as
  // if it worked, so it has no reason to try again differently.
  if (text(body.website, 200)) return NextResponse.json({ ok: true });

  const name = text(body.name, 80);
  const phone = text(body.phone, 16);
  if (!name || phone.replace(/\D/g, "").length < 10) {
    return NextResponse.json({ ok: false, message: "A name and a 10-digit mobile number are needed." }, { status: 400 });
  }

  const listing = body.listing as { id?: unknown; title?: unknown; url?: unknown } | undefined;
  const lines = [
    body.intent === "sell" ? "Wants to SELL a property through iPropy." : "",
    body.intent === "alert" ? "Wants a call when a home like this comes in:" : "",
    listing ? `Enquiry about: ${text(listing.title, 160)} — ${text(listing.url, 300)}` : "",
    text(body.message, 1000),
  ].filter(Boolean);

  const res = await fetch(`${CRM_API_URL}/api/webhooks/forms/${ENQUIRY_FORM_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      full_name: name,
      mobile: phone,
      email: text(body.email, 120),
      message: lines.join("\n"),
      page_url: text(body.pageUrl, 300),
    }),
  }).catch(() => null);

  if (!res?.ok) {
    return NextResponse.json({ ok: false, message: "Something went wrong — please try again." }, { status: 502 });
  }
  const data = await res.json();
  return NextResponse.json({ ok: Boolean(data.ok) });
}
