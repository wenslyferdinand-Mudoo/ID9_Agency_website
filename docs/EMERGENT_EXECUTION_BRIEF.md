# Emergent — Implementation Brief for Impact Digital 9 Agency

## Read first
Read `docs/ID9_AGENCY_DIGITAL_EXPERIENCE_BLUEPRINT.md` in full. It is the source specification for this work. Do not start coding until the current repository and open PRs have been inspected.

## Mission
Professionalize the existing website of **Impact Digital 9 Agency**. This is the agency's official website, not a personal portfolio for Wensly Ferdinand. Preserve the current codebase, brand identity, routes, integrations and existing content while improving the actual experience.

## Absolute brand requirement
The official name is **Impact Digital 9 Agency** and MUST remain in English in every locale. On the French website, translate the surrounding interface and copy, never the agency name. Keep `ID9_AGENCY` as a technical identifier where it is already used.

## Highest priorities
1. **Projects index:** deliver the eight filters in this exact order: All Projects, Branding, Graphic Design, Web Design, App Development, Marketing, Motion Design, Photography. French labels must be accurate. Add a backward-compatible category adapter for existing values (`web`, `app`, `motion`, `photo`) so no existing project disappears.
2. **Project cards:** cover, title, client (if publishable), category, year, services and concise description; preserve native artwork proportions and responsive image handling.
3. **Individual project pages:** stable slug, hero, client/year/category/services, context, challenge, objectives, strategy, process, solution, deliverables, gallery, verified outcomes, approved testimonial, related projects and CTA. Omit missing optional sections cleanly.
4. **Detailed case studies:** this is the most important content improvement. Explain the problem, objectives, thinking, process, actual deliverables and verified outcome. Never invent metrics, clients, testimonials or results.
5. **Sanity Studio:** extend the existing `portfolioProject` schema; improve editor groups, help text, validations, previews and bilingual fields. Do not replace the CMS or bulk-migrate production content without separate approval.
6. **Agency-wide brand audit:** align public display references to “Impact Digital 9 Agency”; do not present the website as an individual's personal portfolio.
7. **Quality:** accessibility, mobile/desktop responsiveness, performance, SEO, security, privacy and regression tests.

## Existing implementation to preserve
The current main branch already has:
- `PortfolioPage.jsx` with a Sanity-first list, legacy API fallback, founder-project data, cards and partial filters;
- `PortfolioDetailPage.jsx` with an existing case-study layout;
- `studio/schemas/portfolioProject.js` with current content fields;
- bilingual localization infrastructure;
- a brand constants file.

Upgrade these components incrementally. Do not duplicate pages or create a second portfolio data source.

## Data and security constraints
- Sanity is the intended editorial source of truth for projects/case studies, but legacy API/MongoDB paths still exist. Inventory and reconcile data before changing or removing those paths.
- Never put privileged Sanity tokens, API secrets, database credentials or admin tokens in browser code, `REACT_APP_*` variables, Git, or documentation.
- Keep public reads read-only; enforce all writes and admin authorization server-side.
- Keep draft/private content and internal editorial notes out of public queries and the sitemap.
- Do not delete, overwrite or bulk-migrate production content.
- Do not modify production environment variables, merge to `main`, or deploy production without explicit owner approval.

## Required workflow
1. Audit repository, current branch, open PRs and current implementation.
2. Return a file-by-file plan and identify overlaps/blockers.
3. Implement Phase 1 (brand consistency), Phase 2 (taxonomy/listing), Phase 3 (case study/schema) in separate reviewable PRs.
4. Follow the blueprint's remaining phases for CMS usability, accessibility, SEO, performance and security.
5. For each PR, include scope, files changed, compatibility risks, commands run, exact test/build results, preview URL and desktop/mobile screenshots.
6. Stop at Preview. Ask for approval before merge or production deployment.

## Acceptance criteria
- French and English both display the official brand name exactly as “Impact Digital 9 Agency”.
- All eight project filters work and preserve legacy projects.
- Each card displays available metadata without inventing missing fields.
- A project can be authored in Sanity and displayed on its detail route with bilingual content/fallback.
- Case-study sections are evidence-based; unverified KPIs and unapproved testimonials are not shown.
- Existing project URLs continue to work or have an explicitly reviewed redirect strategy.
- Public bundle contains no privileged secret.
- Responsive, accessibility, SEO, security and regression checks are evidenced.
- No production data, main branch or production deployment is changed without approval.

## First deliverable before code
Return:
- repository baseline and active branch;
- open PR overlap report;
- current project data-flow diagram (Sanity / API / local data);
- exact files to change for each phase;
- category legacy-to-canonical mapping;
- risk register and test plan.

If any detail is unknown, say so and ask. Do not guess.
