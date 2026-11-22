/**
 * Resolve a public portfolio detail using the same precedence as the projects
 * index: Sanity (editorial source), legacy API (compatibility), then founder
 * projects (local fallback). A failed or malformed source must not block the
 * next source.
 */
function isProject(value, requestedSlug) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;

  const candidateSlug = typeof value.slug === "string" ? value.slug.trim().toLowerCase() : "";
  const candidateTitle = typeof value.title === "string" ? value.title.trim() : "";
  const expectedSlug = typeof requestedSlug === "string" ? requestedSlug.trim().toLowerCase() : "";

  return Boolean(expectedSlug && candidateSlug === expectedSlug && candidateTitle);
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
