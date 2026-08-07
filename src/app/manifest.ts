import type { MetadataRoute } from "next";

/**
 * Served at /manifest.webmanifest. Written as a route rather than a static
 * file so the colours stay in one place conceptually with the rest of the
 * app metadata — Next builds it at compile time either way.
 *
 * `display: "standalone"` is what makes an added-to-home-screen copy open
 * without browser chrome on Android and iOS.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "iPropy — Curated, Title-Verified Properties",
    short_name: "iPropy",
    description:
      "Search, compare and shortlist verified projects and units, synced live from our sales desk.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    // Matches --paper / --accent in globals.css so the splash screen doesn't
    // flash a colour the site never uses.
    background_color: "#faf7f2",
    theme_color: "#191510",
    categories: ["business", "lifestyle", "shopping"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
