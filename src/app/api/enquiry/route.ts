import { NextResponse } from "next/server";

const CRM_API_URL = process.env.CRM_API_URL ?? "http://localhost:4000";
const ENQUIRY_FORM_KEY = process.env.ENQUIRY_FORM_KEY ?? "website-enquiry";

// Forwards to the CRM's own POST /api/webhooks/forms/:publicKey (see
// packages/server/src/api/routes/webhooks.ts in iPropy-crm) — this route only
// exists so the form key stays server-side and the browser never talks to the
// CRM directly. The CRM does all the real work: dedupe, lead creation,
// assignment, SLA start.
export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(`${CRM_API_URL}/api/webhooks/forms/${ENQUIRY_FORM_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      first_name: body.name ?? "",
      mobile: body.phone ?? "",
      email: body.email ?? "",
      message: body.message ?? "",
      project: body.project ?? "",
      page_url: body.pageUrl ?? "",
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ ok: false, message: "Something went wrong — please try again." }, { status: 502 });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
