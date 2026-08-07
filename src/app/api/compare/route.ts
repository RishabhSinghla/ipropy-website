import { NextResponse } from "next/server";
import { getProject, getProperty } from "@/lib/crm-client";

// The compare page is client-driven (it reads the zustand-persisted compare
// list from localStorage), so it can't call crm-client.ts directly — that
// module is marked server-only. This tiny proxy is the bridge: still no CRM
// origin or credentials ever reach the browser, just the resolved records.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const kind = url.searchParams.get("kind");
  const ids = (url.searchParams.get("ids") ?? "").split(",").filter(Boolean).slice(0, 4);

  if (ids.length === 0 || (kind !== "project" && kind !== "property")) {
    return NextResponse.json({ items: [] });
  }

  const items = await Promise.all(
    ids.map(async (id) => {
      try {
        return kind === "project" ? (await getProject(id)).project : await getProperty(id);
      } catch {
        return null;
      }
    }),
  );

  return NextResponse.json({ items: items.filter(Boolean) });
}
