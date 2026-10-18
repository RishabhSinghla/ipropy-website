// Open the live site in a real browser, the way a buyer would, and report.
//
// Run by .github/workflows/look.yml, because the people who build this site
// cannot always reach it from where they work. It reads only — it never sends
// an enquiry — and prints each check as PASS, FAIL or COULDN'T TELL.
//
// Screenshots are printed into the log between ===SHOT name=== markers as
// base64 JPEG, so they can be read back without downloading an artifact.
import { chromium } from "playwright";

const BASE = process.env.SITE_URL ?? "https://property.ipropy.com";
const SHOTS = (process.env.SHOTS ?? "true") === "true";
const results = [];
const check = (name, ok, note = "") =>
  results.push(`${ok === true ? "PASS" : ok === false ? "FAIL" : "COULDN'T TELL"}  ${name}${note ? ` — ${note}` : ""}`);

async function shot(page, name) {
  if (!SHOTS) return;
  const jpg = await page.screenshot({ type: "jpeg", quality: 45, fullPage: false });
  console.log(`===SHOT ${name}===\n${jpg.toString("base64")}\n===END===`);
}

const browser = await chromium.launch();
try {
  for (const device of [
    { name: "desktop", viewport: { width: 1366, height: 860 } },
    { name: "phone", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
  ]) {
    const page = await browser.newPage({ viewport: device.viewport, isMobile: device.isMobile, hasTouch: device.hasTouch });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => { if (m.type() === "error" && !/404/.test(m.text())) errors.push(m.text().slice(0, 160)); });
    const d = device.name;

    const home = await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
    check(`${d}: home opens`, home?.status() === 200, String(home?.status()));
    check(`${d}: no sideways scroll on home`, !(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)));
    await shot(page, `${d}-home`);

    const search = await page.goto(`${BASE}/properties`, { waitUntil: "networkidle" });
    check(`${d}: search opens`, search?.status() === 200);
    const cards = await page.locator("article").count();
    check(`${d}: homes listed`, cards > 0 ? true : null, `${cards} on the first page`);
    check(`${d}: no "0 BHK"`, !(await page.content()).includes("0 BHK"));
    await shot(page, `${d}-search`);

    if (cards > 0) {
      await page.locator("article h3").first().click();
      await page.waitForURL(/\/properties\/[0-9a-f-]{36}/, { timeout: 30000 });
      await page.waitForLoadState("networkidle");
      const body = await page.content();
      check(`${d}: a home's page opens`, /Book a visit or ask a question/.test(body));
      check(`${d}: no phone number on the page`, !/\b[6-9]\d{9}\b/.test(body.replace(/<script[\s\S]*?<\/script>/g, "")));
      check(`${d}: no sideways scroll on a home`, !(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)));
      await shot(page, `${d}-home-page`);
    }

    const missing = await page.goto(`${BASE}/properties/00000000-0000-0000-0000-000000000000`, { waitUntil: "networkidle" });
    check(`${d}: a missing home answers 404`, missing?.status() === 404, String(missing?.status()));
    check(`${d}: no browser errors`, errors.length === 0, errors.slice(0, 3).join(" | "));
    await page.close();
  }
} finally {
  await browser.close();
}
console.log(results.join("\n"));
if (results.some((r) => r.startsWith("FAIL"))) process.exit(1);
