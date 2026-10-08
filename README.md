# iPropy — ipropy.com and property.ipropy.com

One Next.js app (App Router, TypeScript, Tailwind) that is two things:

* **ipropy.com** — the company's front page: what iPropy does, the newest homes, where we have
  them, how it works, and a way to get in touch or sell a property.
* **property.ipropy.com** — the property portal: search, filters with live counts, a page per
  home, compare up to four, a saved list, and an enquiry that lands in the CRM as a lead.

On the portal's host, `/` opens the search (`next.config.ts`, `PORTAL_HOST`). Everything else is
the same pages on both addresses. `crm.ipropy.com` stays the CRM.

## Where the homes come from

Every listing is an **Inventory in the CRM that somebody ticked "Show on website"** (the record's
More menu). The CRM's `GET /api/public/listings` decides what is public, not this app:

* only ticked inventories, and a ticked one drops off once its status says sold, won, lost,
  booked or registered;
* only an allow-list of facts — size, locality, price, floor, facing… — and **never the
  seller's name or number**. Phone numbers typed into a description are masked.

See `core/sharing/publicListings.ts` in the CRM repo. This app has no way to ask for anything else.

## Quick start

```bash
cp .env.example .env.local   # defaults point at a local CRM on :4000
npm install
npm run dev                  # http://localhost:3000
```

Needs the CRM running (`npm run dev` there), or `CRM_API_URL` / `NEXT_PUBLIC_CRM_MEDIA_URL`
pointed at a deployed one.

## How it fits together

**Server to server.** Pages are Server Components calling the CRM from Node through
`lib/crm-client.ts` (server-only, cached 60 seconds). The browser never talks to the CRM, except
for photos, which it loads from the CRM's public media route.

**Enquiries become real leads.** `app/api/enquiry/route.ts` forwards to the CRM's
`POST /api/webhooks/forms/website-enquiry` — the same lead capture every other source uses. The
message names the listing, title and link, so the rep calling back knows which home it was.
A hidden field turns bots away.

**Saved and Compare need no account.** They live in this browser (`lib/store.ts`) and re-read
live prices through `app/api/compare/route.ts`; a home that has since sold drops out and the page
says so.

## Layout

```
src/
  app/
    page.tsx                 ipropy.com front page
    properties/page.tsx      the portal: search, filters, results
    properties/[id]/         one home: photos, facts, EMI, enquiry, more nearby, share card
    sell/                    "Sell with iPropy" — an enquiry marked as a seller
    compare/, saved/         client pages over this browser's lists
    api/enquiry, api/compare server-side bridges to the CRM
    sitemap.ts, robots.ts, llms.txt
  components/                ListingCard, PortalFilters, Gallery, EnquiryForm, CompareTable…
  lib/
    crm-client.ts            server-only calls to the CRM
    listing.ts               price/area wording, search parameters
    types.ts                 the CRM's listing shape
```

## Configuration

| Variable | Purpose |
|---|---|
| `CRM_API_URL` | Server-only. The CRM to read from. |
| `ENQUIRY_FORM_KEY` | Server-only. The CRM web form's key (seeded as `website-enquiry`). |
| `NEXT_PUBLIC_CRM_MEDIA_URL` | The host the browser loads photos from (the CRM). |
| `NEXT_PUBLIC_SITE_URL` | Absolute URLs in the sitemap and share links. |
| `PORTAL_HOST` | The portal's address (default `property.ipropy.com`). |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Optional business WhatsApp number; no button when unset. |

## Not here yet

Hosting and the two domains are not set up — this runs locally and in CI. The blog pages read a
CRM feed that does not exist, so they are out of the menus until it does.
