/**
 * Resolve a public portfolio detail using the same precedence as the projects
 * index: Sanity (editorial source), legacy API (compatibility), then founder
 * projects (local fallback). A failed or malformed source must not block the
 * next source.
 */
export function isValidPortfolioProject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const slug = typeof value.slug === "string" ? value.slug.trim() : "";
  const title = typeof value.title === "string" ? value.title.trim() : "";
  return Boolean(slug && title);
}

function isProject(value, requestedSlug) {
  if (!isValidPortfolioProject(value)) return false;
  const candidateSlug = value.slug.trim().toLowerCase();
  const expectedSlug = typeof requestedSlug === "string" ? requestedSlug.trim().toLowerCase() : "";
  return Boolean(expectedSlug && candidateSlug === expectedSlug);
}

/**
 * Merge portfolio sources using the exact same precedence as detail lookup.
 * Records without a usable slug/title are excluded because they cannot produce
 * a stable public detail route. The first valid record for a slug wins.
 */
export function mergePortfolioProjects(sanityItems, legacyItems, founderItems) {
  const seenSlugs = new Set();
  const merged = [];

  for (const source of [sanityItems, legacyItems, founderItems]) {
    if (!Array.isArray(source)) continue;
    for (const project of source) {
      if (!isValidPortfolioProject(project)) continue;
      const key = project.slug.trim().toLowerCase();
      if (seenSlugs.has(key)) continue;
      seenSlugs.add(key);
      merged.push(project);
    }
  }

  return merged;
}

export async function resolvePortfolioProject({
  slug,
  lang,
  fetchSanity,
  fetchLegacy,
  fetchFounder,
}) {
  try {
    const project = await fetchSanity(slug);
    if (isProject(project, slug)) return project;
  } catch {
    // Continue to the legacy source when Sanity is temporarily unavailable.
  }

  try {
    const project = await fetchLegacy(slug);
    if (isProject(project, slug)) return project;
  } catch {
    // Continue to local founder content when the compatibility API is unavailable.
  }

  try {
    const project = await fetchFounder(slug, lang);
    if (isProject(project, slug)) return project;
  } catch {
    // A missing local fallback is represented by null below.
  }

  return null;
}
