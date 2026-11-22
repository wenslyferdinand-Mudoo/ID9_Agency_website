# Portfolio source precedence — controlled audit

Date: 2026-11-22  
Scope: static code inspection of the repository default branch. This document does not claim a live Sanity, MongoDB, or browser audit.

## Current public data paths

### Projects index
File: `frontend/src/pages/PortfolioPage.jsx`

The index currently loads three sources concurrently:
1. Sanity via `fetchPortfolioList()`.
2. Legacy FastAPI endpoint `GET /portfolio`.
3. Founder-curated local records via `getFounderProjects(lang)`.

The merge order gives Sanity precedence over legacy API records, and legacy records precedence over founder records, when their deduplication key matches. Deduplication uses slug when present, otherwise ID, otherwise client + title. It does not prove that two differently named slugs represent the same real-world project.

### Project detail
File: `frontend/src/pages/PortfolioDetailPage.jsx`

Before this change, detail resolution used:
1. Sanity.
2. Founder-curated local records.
3. Legacy FastAPI endpoint `GET /portfolio/:slug`.

This did not match the index precedence. If a founder-curated project and a legacy project shared a slug while Sanity had no matching document, the index selected the legacy record but the detail route selected the founder record. That could make a card open a different project's content.

## Change in this branch

A shared resolver now applies the same explicit precedence to detail lookup:
1. Sanity published document.
2. Legacy API compatibility record.
3. Founder-curated local fallback.

A failed remote source no longer prevents the next source from being checked. The resolver rejects arrays and non-object values as invalid project records. Unit tests cover source precedence, collisions, remote-source failure, local fallback, and missing records.

## Data governance observations

- Sanity is the intended editorial source of truth for public agency case studies.
- The legacy FastAPI/MongoDB portfolio remains a compatibility source until a complete inventory, export, reconciliation, and owner-approved migration exist.
- Founder-curated product entries are local editorial records and should remain clearly labeled as founder products / product concepts, not presented as client engagements.
- The public Sanity projection currently includes context, challenge, approach, strategy, solution, outcome, KPIs, testimonial, SEO, cover, gallery, videos, and external links.
- The Sanity schema currently requires title, slug, category, summary, and cover image. Story sections, KPIs, and testimonial remain optional.
- The schema's category values include `branding`, `graphic-design`, `flyers`, `web`, `app`, `marketing`, `motion`, and `photo`. The public index additionally exposes an `app-development` and `web-design` filter, with a normalization layer for legacy values.
- The current listing exposes a separate Flyers filter via `isFlyer` or category. Keep this behavior until category usage and content volume have been audited; do not silently remove existing navigation affordances.

## Not yet verified

The following require live access or a controlled environment and are intentionally not inferred from static code:
- draft count, duplicate slugs, asset availability, and content completeness remain unverified. The latest Vercel Preview build's SEO generation step reported 8 published portfolio routes from Sanity; this is build-time evidence, not a complete CMS export or reconciliation;
- actual legacy MongoDB record count and content quality;
- cross-source project identity reconciliation;
- external-link reachability and publication permissions;
- live portfolio rendering on mobile/tablet/desktop;
- production and preview CORS configuration for Sanity;
- migration completeness or permission to retire legacy writes.

## Next acceptance gates

1. Run the frontend unit tests and production build on this branch.
2. Inspect the Vercel Preview for `/portfolio` and at least one project detail route.
3. Run a live, read-only Sanity inventory and export a backup of legacy records before any data mutation.
4. Produce a slug and project-identity reconciliation table.
5. Obtain owner approval before changing the source-of-truth read/write architecture or removing legacy records.
