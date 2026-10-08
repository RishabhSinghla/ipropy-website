import type { NextConfig } from "next";

// Photos are served straight from the CRM's public media route (see
// lib/media.ts mediaUrl()) — next/image needs that host allow-listed.
const crmHost = new URL(process.env.NEXT_PUBLIC_CRM_MEDIA_URL ?? "http://localhost:4000");

// The portal's own address. On it, "/" is the search page; on ipropy.com it
// is the company's front page. One app serves both.
const PORTAL_HOST = process.env.PORTAL_HOST ?? "property.ipropy.com";

const nextConfig: NextConfig = {
  images: {
    // Only on a developer's machine, where the CRM is localhost. The live CRM
    // is a public host, and the optimiser must never fetch private addresses.
    dangerouslyAllowLocalIP: crmHost.hostname === "localhost",
    remotePatterns: [
      {
        protocol: crmHost.protocol.replace(":", "") as "http" | "https",
        hostname: crmHost.hostname,
        port: crmHost.port,
        pathname: "/api/public/media/**",
      },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", has: [{ type: "host", value: PORTAL_HOST }], destination: "/properties" },
      ],
    };
  },
  async redirects() {
    // The old site's project and city pages were built on fields production
    // no longer has. Anything bookmarked or indexed lands on the search.
    return [
      { source: "/projects/:path*", destination: "/properties", permanent: true },
      { source: "/projects", destination: "/properties", permanent: true },
      { source: "/cities/:path*", destination: "/properties", permanent: true },
      { source: "/cities", destination: "/properties", permanent: true },
    ];
  },
};

export default nextConfig;
