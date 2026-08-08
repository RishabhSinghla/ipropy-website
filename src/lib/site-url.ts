/**
 * The site's own canonical origin, with no trailing slash.
 *
 * Four call sites (sitemap, robots.txt, layout metadata, JSON-LD) build URLs
 * as `${SITE_URL}${path}` with `path` already starting with "/". Vercel's env
 * var UI doesn't validate the value, so a trailing slash pasted into
 * NEXT_PUBLIC_SITE_URL silently doubled up: `vercel.app//projects` in every
 * sitemap entry. Google normalises that in practice, but it is still wrong,
 * and a raw `env.get` at each call site meant fixing it once wouldn't fix all
 * of them — this is the one place that reads the variable.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
