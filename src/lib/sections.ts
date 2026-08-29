import { listProjects, getCities } from "@/lib/crm-client";

/**
 * Which sections of this site actually have anything behind them.
 *
 * A project here is not a record. It is units grouped by `project_name`, and the
 * cities page is those same units grouped by `city`. Both fields are optional in
 * the CRM, and this business has deliberately removed them: it sells builder
 * floors in one area, so grouping by project and filtering by city are both
 * noise for it.
 *
 * That is a legitimate choice, and it used to produce a bad site. "Projects" and
 * "Cities" sat in the header and the footer, and a visitor who clicked either
 * landed on a page with nothing on it. An empty page reached from a promised
 * link reads as a broken site, or a fake one, which is the exact impression this
 * whole product is built to avoid.
 *
 * So the navigation asks rather than assumes. Add project names back in the CRM
 * tomorrow and the link returns on its own, with no deploy.
 */
export interface LiveSections {
  projects: boolean;
  cities: boolean;
}

export async function liveSections(): Promise<LiveSections> {
  // Both already degrade to an empty result when the CRM is unreachable — see
  // `safeGet` in crm-client. A sleeping CRM therefore hides these links for a
  // minute rather than failing the render, which is the better of the two.
  const [projects, cities] = await Promise.all([
    listProjects({ limit: 1 }),
    getCities(),
  ]);

  return {
    projects: projects.items.length > 0,
    cities: cities.items.length > 0,
  };
}
