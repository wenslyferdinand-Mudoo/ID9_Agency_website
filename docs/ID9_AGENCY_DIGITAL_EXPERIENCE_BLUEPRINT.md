# Impact Digital 9 Agency — Website Professionalization Blueprint

> **Document type:** Product + UX + content + technical implementation specification  
> **Audience:** Emergent implementation agent, designers, frontend/backend engineers, CMS editors, QA  
> **Status:** Proposed implementation baseline — do not treat unchecked items as completed  
> **Brand rule:** The official agency name is always **Impact Digital 9 Agency**. The name is a proper noun and MUST remain in English in every locale, including French.

## 0. Non-negotiable project rules

1. Evolve the existing website. Do not replace it with a new template or remove established visual identity, routes, working sections, integrations, or content without evidence and approval.
2. The website represents **Impact Digital 9 Agency**, not Wensly Ferdinand's personal portfolio. Founder content may appear only where explicitly appropriate and must never replace agency positioning.
3. Keep the official brand name exactly **Impact Digital 9 Agency** in English in French and English interfaces. Do not translate it to “Agence Impact Digital 9”, “Impact Digital 9 Agence”, or any other variation.
4. Keep technical identifiers such as `ID9_AGENCY`, repository names, Sanity project ID `mqrbsugj`, and existing environment variable names stable unless a migration is explicitly approved.
5. Sanity is the intended editorial source of truth for agency portfolio/projects and case studies. Before removing legacy API/MongoDB reads or writes, inventory existing records and prove they are migrated and reconciled. Never delete legacy records as part of this work.
6. No secrets in frontend bundles, source control, documentation, logs, screenshots, or Emergent prompts. Never put a Sanity write token in a `REACT_APP_*` variable.
7. No destructive database operation, production content migration, merge to `main`, production deployment, domain change, or environment-variable mutation without explicit owner approval.
8. Work in small, reviewable branches/PRs. Preserve unrelated changes and existing open PR work. Do not force-push.
9. Every claim about client results, metrics, testimonials, awards, or deliverables must be supported by client-approved evidence. Do not invent KPIs or testimonials; omit unavailable data.
10. Do not claim QA passed unless the relevant test was actually run and its result recorded.

## 1. Product vision and positioning

Build a premium, international, agency-first digital experience that communicates strategy, creativity, craft, and measurable business value. The website should make it immediately clear:
- who the agency is;
- what business and creative problems it solves;
- which services it offers;
- how its work is approached;
- what evidence supports its quality;
- how a qualified prospect can start a conversation.

The brand expression should remain consistent with the existing ID9 visual language (dark premium surfaces, orange/violet accents, strong typography, editorial imagery and deliberate motion). Refine the system rather than introducing a disconnected visual theme.

### 1.1 Naming and localization policy

| Element | English locale | French locale |
|---|---|---|
| Official brand | Impact Digital 9 Agency | Impact Digital 9 Agency |
| Main project navigation | Projects | Projets |
| Case study label | Case Study | Étude de cas |
| Agency tagline | Keep approved English tagline | Translate only if a localized tagline is intentionally approved |
| Service and interface copy | English | French |
| Logo artwork / wordmark | Never translate or rewrite | Never translate or rewrite |

The official brand string must be centralized in the brand configuration and reused. Audit visible headers, footer, metadata, structured data, contact surfaces, email templates, admin labels, and CMS previews. Avoid hard-coded competing variants such as “Impact Digital 9” where the full legal/brand display name is required.

## 2. Information architecture

### 2.1 Primary navigation

Retain existing routes and navigation behavior unless audit proves a change is needed. The target information architecture is:

- Home
- About
- Services
- Projects
- Insights / Blog (only if the current content and implementation justify keeping it)
- Contact
- Language switcher (EN / FR)

The navigation label is localized (“Projects” / “Projets”), while the agency name is not.

### 2.2 Projects index

The Projects index is the agency's principal proof-of-work directory. It must be a first-class page, not merely a small home-page gallery.

Required filters, in this order:
1. All Projects
2. Branding
3. Graphic Design
4. Web Design
5. App Development
6. Marketing
7. Motion Design
8. Photography

Localized labels:
- All Projects / Tous les projets
- Branding / Identité de marque
- Graphic Design / Design graphique
- Web Design / Design web
- App Development / Développement d'applications
- Marketing / Marketing
- Motion Design / Motion design
- Photography / Photographie

Recommended canonical category values (stable, language-independent):
- `all` (filter only; never stored as a project category)
- `branding`
- `graphic-design`
- `web-design`
- `app-development`
- `marketing`
- `motion-design`
- `photography`

Backward compatibility is mandatory. Existing records currently use legacy values including `web`, `app`, `motion`, and `photo`. Implement a single normalization/mapping layer so legacy records continue to render and filter correctly. Do not bulk-rewrite existing Sanity documents until a separately reviewed migration plan exists.

### 2.3 Project card requirements

Every card should display, when available:
- cover image with a deliberate crop/fit strategy and correct aspect ratio;
- project name;
- client name (respect confidentiality flags);
- category;
- year;
- a concise project summary;
- one or two service tags;
- clear affordance to open the detail page.

The card must remain visually robust when optional fields are absent. Use a neutral fallback, not fabricated metadata. Artwork must not be distorted or unexpectedly cropped; allow per-asset presentation metadata when different formats require different fit behavior.

### 2.4 Individual project page

Every project must have a stable, shareable slug route. The detail page should support:
- editorial hero and cover image;
- project title, client, year, category and services;
- summary and project context;
- challenge / opportunity;
- objectives;
- research or discovery (optional);
- strategic direction;
- creative / technical process;
- solution and deliverables;
- gallery with captions and accessible alt text;
- tools / platforms (optional);
- outcomes and verified KPIs (optional);
- approved client testimonial (optional);
- related projects;
- relevant CTA to Contact.

A missing section should be gracefully omitted. Do not render empty headings or placeholder claims. Do not make a case study appear complete merely because the slug exists.

### 2.5 Routing and backward compatibility

- Prefer a clean public route `/projects` and `/projects/:slug` if compatible with current routing.
- Preserve current `/portfolio` and `/portfolio/:slug` URLs with permanent redirects or in-app compatibility routes only after confirming current SEO and inbound links.
- Avoid duplicate canonical URLs. Set canonical metadata to one chosen route.
- Existing links and old shared URLs must not become 404s.
- The route decision must be documented before implementation; do not rename routes as a cosmetic-only change.

## 3. Case study editorial standard — highest content priority

Case studies are the most important upgrade. A case study must tell a credible business and creative story, not just display images.

### 3.1 Required editorial structure

| Section | Purpose | Editorial guidance |
|---|---|---|
| Overview | Fast understanding | 1–3 sentences; identify the work and context |
| Client & industry | Context | Use only publishable client details |
| Challenge | Define the problem | Explain the constraint or opportunity; do not invent pain points |
| Objectives | Define success | Specific goals agreed for the project |
| Strategy | Explain the thinking | Positioning, audience, message, experience or channel strategy |
| Creative / technical direction | Explain the craft | Visual system, UX, content, technology or production decisions |
| Execution / process | Demonstrate rigor | Key phases and actual work performed |
| Deliverables | Make scope tangible | Explicit list of approved deliverables |
| Outcome | Explain what changed | Qualitative outcome or verified metric |
| Gallery | Show the evidence | Final assets, mockups, screens, motion stills, photography |
| Testimonial | Third-party proof | Only an approved, attributable client quote |
| Next step | Convert | Relevant agency contact CTA |

### 3.2 Evidence and integrity rules

- Distinguish output metrics (number of assets delivered) from business outcome metrics (conversion, reach, revenue, engagement).
- For every KPI store: metric label, value, unit, time period, source/evidence note, and permission to publish.
- If a metric cannot be verified, do not show it.
- If a client cannot be named, support “Confidential client” and suppress identifying imagery/metadata as needed.
- Obtain permission for client logos, work samples, testimonials, and confidential screenshots.
- Never imply that the agency delivered work that was not actually part of the engagement.

### 3.3 Case study completeness states

Use an editorial readiness indicator in Sanity:
- Draft — internal work in progress, never public.
- In Review — content/media/evidence awaiting review.
- Approved — owner-approved, publishable.
- Published — visible publicly.

Do not expose internal notes, private evidence, approval comments, or draft documents on the public site.

## 4. Sanity CMS — editorial source of truth

Current repository evidence shows one `portfolioProject` document type with fields for title, slug, client, category, sector, year, featured, summary, services, tools, cover image, gallery, videos, context, challenge, approach, strategy, solution, outcome, KPIs, testimonial and SEO. The current category list does not yet represent all eight requested filters. The existing schema is a foundation, not a reason to replace the CMS.

### 4.1 Schema evolution requirements

Extend the existing schema incrementally. Review the current schema and all GROQ queries before changing field names.

Recommended additions or refinements:
- localized title and summary (FR/EN), with a safe fallback policy;
- localized long-form case-study sections (FR/EN);
- category enum covering all seven project categories;
- secondary categories only if needed and clearly governed;
- client display name + confidentiality flag;
- project year as validated number or existing string with compatibility;
- services as controlled tags;
- cover image with alt text, caption and display-fit metadata;
- gallery items with alt text, caption, role/type and optional display-fit metadata;
- deliverables list;
- objectives;
- process phases;
- KPI objects with unit, period, evidence/source note and publish permission;
- testimonial attribution and permission;
- related project references;
- SEO title, description, social image;
- editorial status and approval metadata;
- featured flag and sort priority.

Do not introduce every proposed field blindly. Define the minimum viable schema, review the frontend query contract, then implement in a staged PR.

### 4.2 Editorial experience

Organize Sanity Studio for non-technical editors:
- clear document title: “Projects & Case Studies”;
- logical field groups: Overview, Classification, Story, Deliverables, Media, Results & Evidence, SEO & Sharing;
- field descriptions with examples and character guidance;
- required-field validation and useful error messages;
- preview showing title, client, category, year, cover and editorial status;
- ordering for featured and newest projects;
- no misleading field labels or developer jargon.

### 4.3 Content operations

- Sanity public dataset reads must use public read-only access where appropriate.
- No write token may be bundled into browser JavaScript.
- CMS roles should follow least privilege.
- Confirm CORS origins explicitly; do not use wildcard credentials.
- Back up/export content before any bulk migration.
- Verify counts and slugs before and after any migration.
- Never delete legacy MongoDB/API portfolio content until the owner signs off on a reconciliation report.

## 5. Bilingual experience (EN / FR)

- All user-facing UI labels, filters, forms, navigation, error states, metadata templates and case-study narratives must support English and French.
- Keep a single translation dictionary or established localization mechanism; do not scatter ad-hoc ternaries through components.
- The language switch must preserve the current page and project slug where translations exist.
- Define fallback behavior when a case study has only one language. Do not show mixed-language paragraphs without a clear fallback rule.
- Preserve names, trademarks, product names, URLs, social handles, and the official agency name exactly.
- Verify French typography, accents, apostrophes, responsive line breaks and form validation messages.

## 6. Brand and design system

Preserve and refine the existing design system:
- retain current ID9 orange/violet identity and dark premium foundation;
- consistent spacing, typography scale, content widths, radii, borders and elevation;
- clear visual hierarchy and accessible contrast;
- consistent button, link, filter, card, tag, form and gallery patterns;
- motion should clarify hierarchy, not block content or harm performance;
- respect `prefers-reduced-motion`;
- avoid heavy effects on mobile and low-powered devices;
- use real project artwork rather than generic stock imagery.

Do not make the site look like a personal portfolio. Agency voice should use “we / our team / the agency” only where accurate; do not fabricate team size or capabilities.

## 7. Accessibility, responsive behavior and performance

Target WCAG 2.2 AA as the acceptance objective:
- keyboard-accessible navigation, filters, menus, dialogs and forms;
- visible focus states;
- semantic heading hierarchy and landmarks;
- meaningful image alt text; decorative images use empty alt;
- labels and errors associated with form controls;
- sufficient contrast;
- reduced-motion support;
- no color-only status communication;
- touch targets appropriate for mobile.

Responsive QA must cover at least:
- 360–390 px mobile;
- 768 px tablet;
- 1280 px desktop;
- 1440 px wide desktop.

Performance:
- lazy-load below-the-fold media;
- prioritize only the actual hero/LCP asset;
- use responsive image sizes and modern formats where supported;
- avoid shipping unnecessary libraries or duplicate animation systems;
- prevent layout shifts with image dimensions/aspect ratios;
- verify no console errors, broken images, or repeated network requests.

## 8. SEO, sharing and discoverability

- Unique title and meta description for each index/detail page and locale.
- Canonical URLs must match the chosen route strategy.
- Open Graph and social preview metadata per case study.
- Valid structured data only where the content genuinely qualifies; do not fabricate ratings, reviews or awards.
- Sitemap includes indexable published projects only.
- Draft, review and private projects are excluded from sitemap and public queries.
- Image alt text and descriptive filenames.
- Preserve existing valid inbound routes and redirect only after route inventory.
- Confirm robots directives and production domain before changing canonical host. Do not assume an unverified custom domain is canonical.

## 9. Security and privacy requirements

- Keep secrets in server-side environment variables / secret manager only.
- Never commit `.env`, credentials, access tokens, service-role keys or database dumps.
- Never expose admin APIs, database credentials or privileged Sanity tokens to the public frontend.
- Validate and sanitize form inputs server-side; rate-limit public forms and protect against spam.
- Restrict CORS to exact approved origins.
- Enforce authorization server-side for admin routes and content writes.
- Use least-privilege CMS roles and review access periodically.
- Avoid logging personal form submissions, tokens, passwords or private client data.
- Do not add analytics/marketing trackers without privacy review and consent requirements assessment.
- Do not put secrets or private evidence into case-study fields intended for public output.

## 10. Existing implementation observations to preserve and address

Based on the inspected `main` branch files:
- `frontend/src/pages/PortfolioPage.jsx` already renders a project listing, animated cards, and a filter bar. Current filters cover only `all`, `branding`, `web`, `app`, `marketing`, and `motion`; Graphic Design and Photography are absent as distinct UI filters, and App/Web/Motion labels are not yet the requested canonical taxonomy.
- The listing currently reads Sanity first, then falls back to a legacy `/portfolio` API and founder projects. This dual-source behavior must be understood before changing data flow.
- `frontend/src/pages/PortfolioDetailPage.jsx` already has a substantial detail/case-study layout with context, challenge, approach, strategy, solution, tools, gallery, outcomes/KPIs and testimonial. Upgrade and complete this existing page; do not rebuild it from scratch.
- `studio/schemas/portfolioProject.js` already defines a `portfolioProject` schema and a useful set of story/media/result/SEO fields, but the category enum is incomplete and there are no explicit objectives/deliverables/evidence permissions/localized story objects.
- `studio/schemas/index.js` currently registers `portfolioProject` only.
- `frontend/src/lib/brand.js` currently has `name: "ID9_AGENCY"` and `fullName: "Impact Digital 9"`. Audit all references and align the public full name to **Impact Digital 9 Agency** without changing technical identifiers.
- The existing `PortfolioPage` route is called “portfolio” in code. A “Projects” user-facing label does not automatically require a URL migration.
- The repository contains an existing Sanity v4 upgrade branch and other PR work. Do not overwrite, duplicate, or merge those changes blindly.

These are repository observations, not proof that the full website has been tested.

## 11. Implementation phases and gates

### Phase 0 — Baseline audit (no public behavior changes)
- [ ] Inventory routes, components, translations, brand references and metadata.
- [ ] Inventory all portfolio data sources (Sanity, legacy API/database, local founder project data).
- [ ] Record current schema, GROQ projections, image URL handling and fallback behavior.
- [ ] Inspect open PRs and branch ownership; identify overlap before editing.
- [ ] Record baseline screenshots at mobile/tablet/desktop and current build/test status.
- [ ] Confirm production domain and canonical host from project settings; do not infer.

**Exit gate:** written audit with file paths, data-flow diagram, risk list and test baseline.

### Phase 1 — Brand consistency and localization
- [ ] Centralize display name as “Impact Digital 9 Agency”.
- [ ] Audit home, navigation, footer, about, services, contact, SEO, structured data and CMS labels.
- [ ] Ensure French never translates the official brand name.
- [ ] Verify EN/FR switching and preserve page context.

**Exit gate:** no incorrect public brand variants; both locales reviewed.

### Phase 2 — Projects taxonomy and listing
- [ ] Implement the seven canonical categories and all eight filters including All Projects.
- [ ] Add a normalization layer for legacy category values.
- [ ] Ensure counts, empty states, loading states and errors are clear.
- [ ] Ensure card metadata and image fitting work with missing optional fields.
- [ ] Add accessible keyboard interaction and responsive layouts.
- [ ] Add sorting only if justified (featured, newest); do not overcomplicate.

**Exit gate:** all filters tested against legacy and new records in EN/FR; no project disappears due to category normalization.

### Phase 3 — Case study completeness
- [ ] Extend current Sanity schema with the minimum approved fields.
- [ ] Update GROQ queries and data adapters with backward-compatible projections.
- [ ] Upgrade existing detail page rather than replacing it.
- [ ] Add objectives, deliverables, process and evidence-aware KPI display.
- [ ] Add related projects and useful next-step CTA.
- [ ] Support confidential clients and missing optional content.
- [ ] Confirm media rights and alt text.

**Exit gate:** one representative project fully tested from Sanity editor to public detail page in both languages.

### Phase 4 — CMS editorial usability
- [ ] Reorganize Studio groups and field descriptions.
- [ ] Add validation, preview, editorial status and ordering.
- [ ] Add an editor guide with a content checklist and image guidance.
- [ ] Test create/edit/preview/publish on a non-production draft or approved test record.
- [ ] Keep all production documents unchanged unless separately authorized.

**Exit gate:** a non-developer can create and publish a complete case study following the guide.

### Phase 5 — Quality, accessibility, SEO and security
- [ ] Responsive and browser QA.
- [ ] Keyboard/screen-reader and contrast checks.
- [ ] Reduced-motion and media performance checks.
- [ ] SEO metadata, canonical and sitemap checks.
- [ ] Security review of public API, admin paths, CORS, CMS permissions and secrets.
- [ ] Test form success/failure, spam/rate limiting and privacy handling.
- [ ] Verify no private or draft data leaks.

**Exit gate:** evidence-based QA report; all critical/high issues fixed or explicitly accepted.

### Phase 6 — Release readiness
- [ ] PR review and CI checks green.
- [ ] Preview URL manually checked at desktop/mobile.
- [ ] Sanity content reads correctly on preview.
- [ ] API routes return expected JSON (not SPA fallback HTML).
- [ ] No production data migration without separate approval and rollback plan.
- [ ] Owner approves merge and production release explicitly.

**Exit gate:** written owner approval. Emergent must not merge or deploy production on its own.

## 12. Required test matrix

| Area | Test | Expected result |
|---|---|---|
| Brand | FR locale header/footer/metadata | Exact string “Impact Digital 9 Agency” |
| Filters | Each of 8 filters | Correct category set, including legacy records |
| Listing | Empty, loading, error | Clear accessible state; no crash |
| Card | Missing client/year/services/cover | Graceful fallback; no fabricated data |
| Detail | Full case study | Correct sections, images, metadata and links |
| Detail | Partial case study | Empty sections omitted; page remains coherent |
| Localization | FR/EN switch on detail route | Same project context, correct localized copy/fallback |
| Privacy | Confidential client | Client identity and restricted assets hidden |
| KPI | Unverified metric | Not published |
| CMS | Draft / Review / Approved / Published | Only approved/published content public |
| Security | Public frontend bundle | No privileged tokens/secrets |
| API | Backend route on preview | JSON/API response, not index.html |
| Accessibility | Keyboard only | All controls usable and focus visible |
| Motion | Reduced-motion preference | Non-essential animation reduced/disabled |
| Responsive | 360, 768, 1280, 1440 px | No overflow, clipping or broken hierarchy |
| SEO | Published project | Unique metadata and canonical |
| SEO | Draft/private project | Not indexed or exposed |
| Regression | Existing project URLs | No broken old links |

## 13. Definition of Done

A phase is complete only when:
- the relevant checklist is complete;
- code review and automated checks are recorded;
- a preview deployment is available and manually inspected;
- no unrelated changes are bundled;
- data integrity and backward compatibility are demonstrated;
- screenshots or test evidence are attached to the PR;
- known limitations are documented;
- no production merge/deploy occurred without owner approval.

## 14. Emergent execution protocol

Emergent must:
1. Read this entire blueprint and the repository setup guide before changing code.
2. Inspect the current branch, open PRs, package versions, routes, schemas, GROQ queries and API/data adapters.
3. Produce a short file-by-file implementation plan and identify conflicts with open PRs before coding.
4. Work in isolated branches and small commits.
5. Implement one phase at a time; do not bundle CMS schema, data migration, routing and visual redesign into one unreviewable change.
6. Preserve existing work and report all files changed.
7. Run relevant lint, tests and builds; include exact commands and results.
8. Provide screenshots for desktop and mobile plus a preview URL.
9. Report blockers instead of inventing data, credentials, routes or test results.
10. Stop before merge, production deployment, destructive migrations, secret changes or production content changes; request owner approval.

## 15. Reference files to inspect

- `frontend/src/pages/PortfolioPage.jsx`
- `frontend/src/pages/PortfolioDetailPage.jsx`
- `frontend/src/lib/portfolio.js`
- `frontend/src/lib/sanity.js`
- `frontend/src/lib/brand.js`
- `frontend/src/lib/i18n.jsx`
- `frontend/src/App.js` or current router entry
- `studio/schemas/portfolioProject.js`
- `studio/schemas/index.js`
- `studio/sanity.config.js`
- `backend/server.py` and portfolio routes/models, if still active
- `docs/SETUP_GUIDE.md`

**End of specification.**
