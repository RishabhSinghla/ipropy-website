import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CompareTray } from "@/components/CompareTray";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site-url";

// Runs before paint (blocking, in <head>) so the correct theme applies on
// first frame — a client-side effect would flash light-then-dark. No access
// to React state here by design; it only ever touches the class + storage.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var dark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

// Three faces, three jobs. The grotesque states, the serif explains, the mono
// reports. A property page is a human decision made on operational facts, and
// mixing the voices rather than flattening them is the point.
// All three are variable fonts, so no `weight` is passed — next/font pulls the
// whole weight axis. `axes` is only for axes *other* than weight, which is why
// Bricolage names opsz and the other two name nothing. See
// node_modules/next/dist/docs/01-app/03-api-reference/02-components/font.md.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "iPropy — Curated, Title-Verified Properties",
    template: "%s | iPropy",
  },
  description:
    "Search, compare and shortlist verified projects and units — synced live from our sales desk, not a stale listings dump.",
  openGraph: {
    siteName: "iPropy",
    type: "website",
    title: "iPropy — Curated, Title-Verified Properties",
    description: "Search, compare and shortlist verified projects and units — synced live from our sales desk.",
  },
  twitter: { card: "summary_large_image" },
  // iOS ignores the web manifest, so installability there depends on these.
  appleWebApp: { capable: true, title: "iPropy", statusBarStyle: "default" },
  icons: {
    icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

// Split out of `metadata` because Next 15 requires viewport/theme colour here.
// The two theme colours let the browser chrome follow the site's own light and
// dark palettes instead of staying light in dark mode.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7f2" },
    { media: "(prefers-color-scheme: dark)", color: "#14120f" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${bricolage.variable} ${newsreader.variable} ${jetbrains.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col bg-paper text-ink" suppressHydrationWarning>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            name: "iPropy",
            url: SITE_URL,
            areaServed: "IN",
            description: "Curated, title-verified property listings synced live from our sales desk.",
          }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CompareTray />
      </body>
    </html>
  );
}
