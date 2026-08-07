import type { NextConfig } from "next";

// Gallery/floor-plan images are served straight from the CRM's public media
// route (see lib/media.ts mediaUrl()) — next/image needs the host allow-listed.
const crmHost = new URL(process.env.NEXT_PUBLIC_CRM_MEDIA_URL ?? "http://localhost:4000");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: crmHost.protocol.replace(":", "") as "http" | "https",
        hostname: crmHost.hostname,
        port: crmHost.port,
        pathname: "/api/public/media/**",
      },
    ],
  },
};

export default nextConfig;
