// Client-safe: gallery/floor-plan image URLs are fetched directly by the
// browser (<img src>), so unlike crm-client.ts this has no "server-only"
// guard and reads a NEXT_PUBLIC_ var, not the private CRM_API_URL used for
// server-to-server data fetching.
const CRM_MEDIA_URL = process.env.NEXT_PUBLIC_CRM_MEDIA_URL ?? "http://localhost:4000";

export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${CRM_MEDIA_URL}${path}`;
}
