@AGENTS.md

# CLAUDE.md — permanent instructions for property.ipropy.com

This repo is the public property portal. It lives beside the CRM
(`RishabhSinghla/ipropy-crm`, live at `crm.ipropy.com`) and is worked **exactly the
same way**, by the same people. When the two disagree about how to work, the CRM's
`CLAUDE.md` is the original; keep this one in step with it.

---

## How Rishabh wants to work — the same rules as the CRM

Rishabh Singhla owns this product and is **not a technical person**. These hold in
every session, without being asked for again.

* **Production is the only thing that counts.** He looks at `property.ipropy.com`. A fix
  that works locally and is not live is not a fix yet — always say plainly what is live
  and what is still waiting.
* **Write for someone who does not code.** Short, plain words, no jargon, no preamble.
  An everyday analogy for anything unfamiliar.
* **Being right beats being fast.** Never guess a fact and present it as known. Say which
  part is unverified and how it could be checked.
* **No apologies.** Correct the thing and carry on.
* **Smallest possible change**, and **stupidly simple, still enterprise grade**: names that
  say what things are, one idea per function, comments that say why, no cleverness that
  costs understanding.
* **Check the work before showing it**, and report every check as **pass**, **fail** or
  **couldn't tell**. A green build is not a working page — anything a visitor clicks gets
  driven in a real browser (the `prove-it` skill).
* **Keep the docs true** in the same piece of work.
* **Decide without asking**, except money, data loss or anything irreversible.
* **Work on `main`, and do not open pull requests.** Commit to `main` and push: Vercel
  deploys it to `property.ipropy.com` within a minute or two. So **every push is live**,
  and `npm run typecheck`, `npm run lint` and `npm run build` pass *before* the push.
* **Use the tooling that is here** — the workflows in `.github/workflows/`, the skills.
* **End every reply to Rishabh with a short "What's the status now?"** covering both repos
  — only when he has actually written something, never for a hook or a timer.
* **Keep both repos in line.** A change on one side that the other depends on (a new fact
  in the listing feed, a new field on the enquiry) ships on the CRM first, is checked live,
  and only then is used here.

---

## What this site is, and the two rules it exists under

`property.ipropy.com` — search, filters with live counts, a page per home (full-screen photos,
facts, EMI, breadcrumbs, a pinned Book-a-visit / WhatsApp / share bar on phones), compare,
saved, sell, alerts ("tell me when a home like this comes in", which lands in the CRM as a
lead with the search written in), and an enquiry that lands in the CRM as a lead. **`ipropy.com` itself is not this
site and is not touched** (owner's decision, 8 October 2026); it is a Wix site, and its DNS
is managed at Wix, where `crm` and `property` are two CNAME lines.

1. **Only an inventory somebody ticked is listed.** The tick is *Show on website* in the
   CRM record's **More** menu. A ticked home still drops off once its status says sold,
   won, lost, booked or registered.
2. **The seller never appears.** Not their name, not their number. On the CRM's
   Inventories `full_name` and `mobile` *are* the seller.

**Both rules are enforced by the CRM, not here** — `core/sharing/publicListings.ts` in the
CRM repo builds the feed from an allow-list of field names. This site cannot ask for a fact
the CRM did not decide to publish, and must never try (no second API, no direct database).

---

## How it fits together

* `src/lib/crm-client.ts` — **server-only**; every page reads the CRM from Node, cached 60s.
  Listing pages use `safeGet`, so a sleeping CRM gives an empty page rather than a failed
  build. Detail pages use `get` and 404 on a missing home.
* `src/app/api/enquiry/route.ts` — forwards to the CRM's
  `POST /api/webhooks/forms/website-enquiry`. The message names the listing, title and
  link. A hidden `website` field turns bots away.
* `src/app/api/compare/route.ts` — the bridge for the client-side Saved and Compare pages.
* `src/lib/listing.ts` — price, area and search-parameter wording, in one place.
* Photos load from the CRM's public media route (`NEXT_PUBLIC_CRM_MEDIA_URL`).

## Commands

```bash
npm run dev          # http://localhost:3000 — start the CRM on :4000 first
npm run typecheck    # MUST be clean before pushing
npm run lint
npm run build        # what Vercel runs
```

## Deploys and checks

* **Vercel project `ipropy-website`, team `rishabh-s-team`.** `main` → production; every
  other branch gets a preview address.
* **Smoke test** (`.github/workflows/smoke.yml`) opens each deployment as a visitor the
  moment Vercel reports it ready: home, search, sell, a missing home answering 404, the
  sitemap. Read it after a push rather than assuming.
* **Look at the live site** (`.github/workflows/look.yml`, `scripts/look.mjs`) drives the real
  `property.ipropy.com` in Chrome — desktop and phone — after each production deploy and on
  demand: pages open, homes are listed, no phone number on a home's page, a missing home is a
  404, no sideways scroll, no browser errors. Screenshots come back inside the log between
  `===SHOT name===` markers as base64 JPEG, because this container cannot reach the site and
  cannot download artifacts. Read-only: it never sends an enquiry.
* **Vercel setup** (`.github/workflows/vercel-setup.yml`) holds the four settings and the
  domain, using the `VERCEL_TOKEN` repository secret (Rishabh's; expires October 2027).
  Run it with *apply* off to only look. **Never print a token, never paste one into chat.**
* **CI** (`ci.yml`) — typecheck, lint, and a build against a dead CRM port, which proves
  the listing pages still degrade instead of failing.
* **Commits say whose Claude made them** — `.claude/helpers/git-identity.cjs`, the same
  file as the CRM's. Add a teammate there.

---

## Traps that have already cost a round

* **This is not the Next.js you know** (16.x). Read `node_modules/next/dist/docs/` before
  writing code. Middleware is called *proxy* now; page props come from the generated
  `PageProps<"/route">`, which `next typegen` writes — that is why `typecheck` runs it first.
* **A `loading.tsx` above a page turns its `notFound()` into a 200.** Streaming starts
  before the page decides, so a sold home answered 200 and search engines would keep it.
  There is no loading file under `app/properties/` for that reason.
* **Anything from this browser's own lists must wait for hydration.** The server always
  draws "not saved"; reading the store during the first render made the save buttons'
  labels disagree with the server's (`useHasMounted`).
* **The image optimiser refuses private addresses.** `dangerouslyAllowLocalIP` is on only
  when the CRM is `localhost`; never on the live site.
* **The blog reads a CRM feed that does not exist**, so it is out of the menus. Bring it
  back only once the CRM serves `/api/public/blog`.
* **A field hidden from forms is hidden from the CRM screen's field list too.** That is why
  the *Show on website* switch asks the CRM server (`GET /api/records/:module/:id/website`)
  instead of looking for the field on screen — it was invisible on production the day it
  shipped.
* **This container cannot reach `*.vercel.app` or `crm.ipropy.com` directly.** Look through
  the workflows above; their logs are readable through the GitHub tools.
