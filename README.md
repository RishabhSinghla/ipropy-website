# iPropy — Property Website

A customer-facing property showcase site — Next.js (App Router) + TypeScript + Tailwind CSS.
Projects and units are pulled **live** from the [iPropy CRM](../iPropy-crm)'s own database via a
small, read-only public API added to that server; enquiry forms write real Leads back into the
same CRM. There is no separate content database or CMS — the CRM is the single source of truth.

## Quick start

```bash
cp .env.example .env.local   # defaults already point at a local CRM on :4000
npm install
npm run dev                  # http://localhost:3000
```

Requires the iPropy CRM API running (`npm run dev` in `../iPropy-crm`, or set `CRM_API_URL` /
`NEXT_PUBLIC_CRM_MEDIA_URL` to a deployed instance).

## Why it's built this way

**Server-to-server, not browser-to-CRM.** Every listing page is a Server Component (or a route
handler) that calls the CRM's `GET /api/public/*` endpoints from Node, cached with Next's
`fetch(..., { next: { revalidate: 60 } })`. The browser never talks to the CRM directly — no CORS
setup was needed, and the CRM's URL/credentials never ship in client JS. See `lib/crm-client.ts`
(marked `server-only`) vs. `lib/media.ts` (the one deliberately public exception: gallery/floor-plan
images are fetched straight from the CRM by the browser, via a `NEXT_PUBLIC_CRM_MEDIA_URL`).

**The CRM decides what's public, not this app.** `packages/server/src/api/routes/public.ts` in the
CRM repo hand-picks an explicit column whitelist per query — this app has no way to request a field
that isn't already deliberately exposed. A record is visible when its status is public-appropriate
(`New Launch` / `Under Construction` / `Nearing Possession` / `Ready To Move` for projects,
`Available` for units) **and** its `publish_to_web` field (default on) isn't explicitly turned off —
an admin can hide any one record from the CRM without changing its status.

**Enquiries become real CRM Leads.** `app/api/enquiry/route.ts` forwards submissions server-side to
the CRM's existing `POST /api/webhooks/forms/website-enquiry` endpoint — the same lead-capture,
assignment and SLA pipeline every other lead source already uses. No parallel CRM integration to
maintain.

## Project layout

```
src/
  app/
    page.tsx                 Home — hero search, featured projects, recently viewed, city explorer, process, FAQ
    projects/                Search/filter grid + [id] detail (gallery, units table, similar projects)
      [id]/opengraph-image.tsx  branded social-share card, generated per project from live data
    properties/               Unit-level search + [id] detail (price breakup, EMI calculator)
      [id]/opengraph-image.tsx
    cities/                   /cities index + /cities/[city] SEO landing pages (real stats, not filler copy)
    compare/                  CarWale-style spec-by-spec comparison, up to 4 items, shareable URL
    api/
      enquiry/route.ts        Server-side proxy → CRM webform endpoint
      compare/route.ts        Server-side proxy → CRM project/property lookups for the client-driven compare page
    sitemap.ts, robots.ts, opengraph-image.tsx (site default), error.tsx, not-found.tsx
  components/                 Cards, filters, compare table/tray, EMI calculator, enquiry form,
                               JsonLd, ThemeToggle, RecentlyViewedRail, ViewTracker
  lib/
    crm-client.ts             server-only typed fetch wrapper around CRM_API_URL
    media.ts                  client-safe image URL helper (NEXT_PUBLIC_CRM_MEDIA_URL)
    store.ts                  zustand — compare/shortlist/recentlyViewed, persisted to localStorage
    jsonld.ts                 schema.org RealEstateListing builders for project/property pages
    amenityIcons.tsx          maps the CRM's 30 canonical amenities to lucide icons
    types.ts                  mirrors the CRM public API's response shape
```

## Configuration

| Variable | Purpose |
|---|---|
| `CRM_API_URL` | Server-only. Base URL of the CRM API for data fetching. |
| `ENQUIRY_FORM_KEY` | Server-only. The CRM webform's `public_key` (seeded as `website-enquiry`). |
| `NEXT_PUBLIC_CRM_MEDIA_URL` | Public. Host the browser fetches gallery/floor-plan images from. |
| `NEXT_PUBLIC_SITE_URL` | Public. Used to build absolute URLs in `sitemap.xml`. |

## Commands

```bash
npm run dev      # local dev, hot reload
npm run build    # typecheck + production build
npm run lint      # eslint
```

## Two CRM fields are gone on purpose, and this site follows

A project on this site is not a record. It is units grouped by `project_name`, and the cities list
is those units grouped by `city`. Delete either field in the CRM and there is genuinely no such
thing as a project or a city, so the API correctly answers with an empty list and this site hides
the section rather than showing an empty one.

That is the state of production today, **and it is deliberate**. This business sells builder floors
in one area, so a project grouping and a city filter are both noise on its own site. Neither field is
coming back, and the CRM does not stop an admin removing them.

So this site adapts rather than complains. `lib/sections.ts` asks the CRM what actually exists, and
the header and footer only offer Projects and Cities when there is something behind them. Nothing
links to an empty page. Add project names back in the CRM tomorrow and both links return on their
own, with no deploy here.

Check with:

```bash
curl -s https://ipropy-crm.onrender.com/api/public/cities
```

An `items: []` means the field is gone or no published unit has a value in it — never that the code
is broken.

## What's not here yet

Locality-level (as opposed to city-level) SEO pages, map-based search, and deployment — this
currently only runs against a local CRM instance.
