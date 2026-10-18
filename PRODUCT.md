# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Families buying a builder floor to live in themselves. They arrive from Google
and property portals searching for a specific sector or configuration, and they
are comparing a small handful of options rather than browsing. A meaningful
share of traffic is also people a sales rep has sent the link to mid-conversation
on WhatsApp.

Not the primary audience, though they turn up: investors and out-of-city or NRI
buyers. The site should not be tuned for them at the expense of a family.

## Product Purpose

A public catalogue of the builder floors iPropy Realty currently has, in
Faridabad and the surrounding NCR.

Its job, in the owner's stated order of priority:

1. **Get enquiries from strangers.** Success is a submitted enquiry or a
   WhatsApp conversation started.
2. **Be a page a rep can send.** Success is a buyer taking the firm seriously
   and turning up to a site visit.
3. **Prove the listings are real.** Success is a buyer believing the stock is
   genuinely available, unlike the portals.

The third is the reason the first two work, but it is not the headline.

## Positioning

Every listing is read live from the same CRM the sales desk works in. A floor
that gets booked leaves the site within minutes rather than on a weekly
refresh, so the catalogue can show gaps in a building honestly. Portal listings
and most broker sites are periodic dumps, and cannot make that claim.

The product sold is a **builder floor**: one independent floor of a low-rise
building, typically four floors to a plot, with its own entrance and no shared
lobby. The unit and the floor are the same object, which is why availability is
a vertical fact about a building rather than a row in a list.

## Operating Context

- Stock originates in the CRM, not in the website. The site is a read-only view
  over the CRM's public API; nothing is authored here.
- Reps share links from WhatsApp during a live conversation, so a shared page is
  often opened on a phone, on mobile data, by someone mid-chat.
- Buyers routinely compare two or three floors before visiting, and ask about
  floor, facing, carpet area and price in that order.
- Site visits are the conversion event the business actually runs on.

## Capabilities and Constraints

Current surfaces: home, projects list and detail, properties list and detail,
cities list and detail, compare.

Supporting features already built: search and filter by city, configuration and
budget; side-by-side compare; EMI calculator; enquiry form capturing name,
phone, email and message; recently viewed; per-property share links.

**Geography is Faridabad and nearby NCR only.** This is a correction the owner
confirmed: the previous tagline claimed "Bespoke Living, Nationwide" and the
city filter offered 27 cities across India, neither of which is true. Copy and
filters should reflect the real footprint. Being specific is also better for
local search.

Constraints:

- The CRM's public API decides what fields exist. An administrator can delete a
  field, and the site must degrade rather than break when they do. `project_name`
  and `city` are currently absent on production, so project and city pages
  legitimately have nothing to show.
- Images are served from the CRM's media route and may 404 when an attachment
  has no file behind it.
- The CRM sleeps on its current hosting plan, so a first request can be slow.

## Brand Commitments

- Name: **iPropy** (wordmark set in capitals). Existing descriptor line
  "Bespoke Living", which is not geographic and can stay.
- Existing channels the site links to: website ipropy.com, Instagram, Facebook,
  X, LinkedIn, YouTube, and a WhatsApp number.
- Voice, as established across the product: plain English, specific over clever,
  no jargon, honest about limits. Short sentences.

## Evidence on Hand

- Live availability comes from the CRM and can be demonstrated rather than
  asserted.
- RERA numbers and title verification are checked before a listing is shown; the
  site already claims this.
- Commission is paid by the seller side, so guidance is free to the buyer.

## Open Decisions

- Whether project and city pages should return once `project_name` and `city`
  are re-added to the CRM model, or be retired.
- Whether the property detail page should carry the media the pipeline produces
  (reel, walkthrough) or keep to stills.
