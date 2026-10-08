import { NextResponse } from "next/server";
import { getListing } from "@/lib/crm-client";

// The compare and saved pages are client-driven (they read this browser's own
// lists), so they cannot call the server-only crm-client. This route is the
// bridge: the CRM's address never reaches the browser, only the listings.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const ids = (url.searchParams.get("ids") ?? "").split(",").filter((id) => /^[0-9a-f-]{36}$/i.test(id)).slice(0, 24);
  const items = await Promise.all(ids.map((id) => getListing(id).catch(() => null)));
  // A listing that sold or was taken down simply drops out, and the page says how many.
  return NextResponse.json({ items: items.filter(Boolean), missing: items.filter((i) => !i).length });
}
