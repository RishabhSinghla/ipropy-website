import { listProjects } from "@/lib/crm-client";
import { SITE_URL } from "@/lib/site-url";

export const revalidate = 3600;

/**
 * llms.txt — a plain-text map of the site for AI assistants.
 *
 * The emerging convention (llmstxt.org) for telling a model what a site is and
 * which pages are worth reading, rather than making it infer that from
 * navigation chrome. Costs nothing, and when someone asks an assistant what a
 * builder floor in Greenfields costs, this is the file that decides whether our
 * answer is the one it finds.
 */
export async function GET(): Promise<Response> {
  const { items: projects } = await listProjects({ limit: 30 });

  const lines = [
    "# iPropy",
    "",
    "> Builder floors, plots and independent houses in Greenfields Colony, Faridabad (Delhi NCR).",
    "> Every listing is sourced from our own sales desk, so availability reflects what is actually",
    "> on the market today rather than a stale portal feed.",
    "",
    "## Projects",
    ...projects.map((p) => `- [${p.name}](${SITE_URL}/projects/${p.id})${p.locality ? `: ${p.locality}, ${p.city}` : ""}`),
    "",
    "## Pages",
    `- [All projects](${SITE_URL}/projects)`,
    `- [All properties](${SITE_URL}/properties)`,
  ];

  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
