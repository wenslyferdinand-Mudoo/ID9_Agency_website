/**
 * Resolve a public portfolio detail using the same precedence as the projects
 * index: Sanity (editorial source), legacy API (compatibility), then founder
 * projects (local fallback). A failed source must not block later fallbacks.
 */
function isProject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
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
    if (isProject(project)) return project;
  } catch {
    // Continue to the legacy source when Sanity is temporarily unavailable.
  }

  try {
    const project = await fetchLegacy(slug);
    if (isProject(project)) return project;
  } catch {
    // Continue to local founder content when the compatibility API is unavailable.
  }

  try {
    const project = fetchFounder(slug, lang);
    if (isProject(project)) return project;
  } catch {
    // A missing local fallback is represented by null below.
  }

  return null;
}
