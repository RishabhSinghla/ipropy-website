---
name: prove-it
description: Drive the real site in a real browser and report pass / fail / couldn't tell before claiming a change works. Use after any change to a page, a filter, a form, a button or anything a visitor clicks — and whenever a report is "it does not work" and the build is green.
---

# Prove it in the browser

The same rule as the CRM repo, for the same reason: **a green build is not a
working page.** On 8 October 2026 the first build of this portal was green and
still had five faults a browser found in minutes — a hydration mismatch on the
save buttons, photos refused by the image optimiser, a filter row 3px too wide
on a phone, a sold home answering 200 instead of 404, and the CRM's own "Show
on website" switch invisible on production.

Report every check as **pass** (you watched it work), **fail** (you watched it
not work — say what you saw) or **couldn't tell** (you could not observe it
from here). The third word is the one that matters: without it anything
unobserved gets rounded up to a pass.

## How

1. The CRM must be running on :4000 (its own `npm run dev`, from the
   ipropy-crm folder next to this one). Without it every page is empty and the
   test proves nothing.
2. A listing to look at: in the CRM, an Inventory → More → **Show on website**.
3. `PORT=3000 npm run dev` here, then drive Chromium with Playwright
   (`executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'` in a
   cloud session — never `playwright install`).

## What to walk, every time a page changes

* Home → search → the results narrow, and the count says so.
* A filter chip on and off; sort both ways; page 2.
* A listing page: photos, facts, EMI, enquiry. **Search the whole page for the
  seller's name and number** — they must never appear.
* Send an enquiry and find the lead in the CRM, with the listing named in it.
* Save and Compare, then reload — they persist.
* A missing id answers **404** (Google drops sold homes only on a real 404).
* At 390px wide: no sideways scroll. In dark mode: nothing unreadable.
* No errors in the browser console.

## After pushing

`main` deploys to property.ipropy.com by itself (Vercel). The **Smoke test**
workflow opens the live deployment as a visitor once Vercel says it is ready;
read its result rather than assuming.
