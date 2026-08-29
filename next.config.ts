import type { NextConfig } from "next";

/**
 * Gallery and floor-plan images come straight from the CRM's public media route
 * (see lib/media.ts), so next/image needs that host allow-listed.
 *
 * Two things about this version of Next are worth knowing before touching it:
 *
 * 1. A `search` value must include its leading `?` and matches exactly.
 *    Omitting it implies a `**` wildcard, which lets anyone push arbitrary
 *    query strings through the optimizer, so the sizes the CRM actually emits
 *    are listed instead.
 *
 * 2. Next 16 blocks optimizing images from local IP addresses by default, as
 *    an SSRF guard. On a developer's machine the CRM is http://localhost:4000,
 *    so every image comes back `400 "url" parameter is not allowed` and looks
 *    like a broken allow-list rather than a deliberate security default. It is
 *    switched off only when the CRM host really is local; production points at
 *    a public host and keeps the protection.
 *
 * Both documented in node_modules/next/dist/docs — the image component
 * reference and 02-guides/upgrading/version-16.md.
 */
const crmHost = new URL(process.env.NEXT_PUBLIC_CRM_MEDIA_URL ?? "http://localhost:4000");

const protocol = crmHost.protocol.replace(":", "") as "http" | "https";

const isLocalHost =
  crmHost.hostname === "localhost" ||
  crmHost.hostname === "127.0.0.1" ||
  crmHost.hostname === "0.0.0.0" ||
  crmHost.hostname.endsWith(".local") ||
  /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(crmHost.hostname);

const mediaPattern = (search: string) => ({
  protocol,
  hostname: crmHost.hostname,
  port: crmHost.port,
  pathname: "/api/public/media/**",
  search,
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      mediaPattern("?size=thumb"),
      mediaPattern("?size=medium"),
      mediaPattern("?size=large"),
      mediaPattern(""),
    ],
    ...(isLocalHost ? { dangerouslyAllowLocalIP: true } : {}),
  },
};

export default nextConfig;
