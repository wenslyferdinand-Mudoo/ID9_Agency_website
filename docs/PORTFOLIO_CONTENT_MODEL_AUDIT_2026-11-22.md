# ID9 Agency — Portfolio Content Model & Governance Audit

**Date:** 2026-11-22  
**Scope:** Static repository inspection only. No live Sanity or MongoDB query was executed.  
**Status:** Findings and recommendations; no content, schema, database, or production change.

## Executive summary

The Sanity Studio currently registers one document type: `portfolioProject`. The schema already provides a useful case-study structure (identity, category, summary, services, tools, media, story, outcomes, SEO). However, several editorially sensitive fields are optional or lack provenance/approval metadata. This creates a risk that incomplete case studies, unverified metrics, or unapproved testimonials can be published without the schema warning the editor.

The frontend reads published Sanity documents and normalizes them into the portfolio UI. It also appends a small set of identity-matched public links from a frontend constant. The SEO build script independently queries published Sanity projects to generate static project metadata/routes.

This audit does **not** establish how many documents exist, whether current documents are complete, whether links are reachable, or whether MongoDB contains duplicates. Those require read-only live data access and an export.

## 1. Repository evidence

Files inspected on the portfolio branch:
- `studio/schemas/index.js`: registers only `portfolioProject`.
- `studio/schemas/portfolioProject.js`: defines the content fields and Studio validation.
- `frontend/src/lib/portfolio.js`: Sanity GROQ queries, normalization, image mapping, and identity-based supplemental links.
- `frontend/scripts/generate-seo-pages.mjs`: queries published Sanity projects at build time and generates SEO metadata.
- `backend/server.py`: legacy MongoDB portfolio model and public/admin CRUD routes.

## 2. Content model assessment

| Field / group | Current schema behavior | Risk / assessment |
|---|---|---|
| Title | Required, 3–120 chars | Good baseline |
| Slug | Required, generated from title | No uniqueness check is visible in the schema |
| Client | Optional string | Client attribution can be absent or ambiguous |
| Category | Required controlled list | Good controlled vocabulary; category values need editorial mapping to services |
| Year | Optional string | No format/range validation |
| Summary | Required, max 280 | Good card-level baseline |
| Services / tools | Optional string arrays | No controlled vocabulary or minimum evidence |
| Cover image | Required image | Good baseline |
| Gallery | Optional; alt/caption optional | Accessibility and media context can be incomplete |
| External links | URL required, HTTP/HTTPS only | No status/provenance/last-checked metadata |
| Challenge / approach / strategy / solution | Optional text | A published case study can have an incomplete narrative |
| Outcome | Optional text | Outcome claims have no evidence/provenance field |
| KPIs | Optional label/value objects | No source, period, baseline, methodology, or approval metadata |
| Testimonial | Optional free text | No author attribution, consent status, or approval evidence |
| SEO title | Optional string | No length validation |
| SEO description | Optional, max 160 | Reasonable upper bound; no minimum |

## 3. Source-of-truth and duplication risks

### 3.1 Sanity + legacy MongoDB + frontend constants

The portfolio experience has multiple data origins:
1. Sanity published documents.
2. Legacy FastAPI/MongoDB records.
3. Founder-curated frontend fallback records.
4. Additional identity-matched links in `VERIFIED_PROJECT_LINKS` within `frontend/src/lib/portfolio.js`.

PR #62 aligns detail resolution with the index precedence (Sanity → legacy API → founder fallback). It does not consolidate storage or migrate content.

The hardcoded link supplement can become a second editorial source. Before changing it, inventory each link, confirm its owner/source, and reconcile it with the corresponding Sanity document. Do not delete or overwrite a CMS link merely because a similar URL exists in the frontend constant.

### 3.2 Build-time SEO inventory

`generate-seo-pages.mjs` independently queries published Sanity projects and writes static metadata/routes. The build log reported 8 published portfolio routes on the reviewed preview build. This is build-time evidence only, not a full CMS export or proof of content completeness.

A release check should compare:
- Published Sanity slugs.
- Generated SEO route slugs.
- Frontend index slugs.
- Detail routes resolving to the same project identity.
- Legacy MongoDB slugs and IDs.

## 4. Editorial governance recommendations

Do not add mandatory fields or change publish behavior until existing records have been inventoried and the editor workflow has been agreed.

Recommended next schema iteration, after data profiling:

1. **Publication readiness**
   - Editorial checklist: identity confirmed, cover approved, alt text reviewed, links checked, EN/FR copy reviewed.
   - A visible completeness indicator in Studio; do not block existing published records without a migration plan.

2. **Client attribution**
   - Separate public display name from internal client/legal identity if needed.
   - Add explicit permission status for client naming and logo/media usage.

3. **Testimonials**
   - Store quote, attributed person/role, client, permission/approval status, approval date, and evidence reference.
   - Render only records with explicit approval.

4. **Metrics**
   - Store metric name/value/unit, period, baseline, measurement method, evidence reference, and approval status.
   - Hide unverified metrics from public rendering. Never invent values to fill empty fields.

5. **Media accessibility**
   - Require meaningful alt text for informative images; allow explicitly decorative images to use empty alt text.
   - Preserve captions, credits, usage rights, and source provenance where applicable.

6. **External links**
   - Store source/owner, verification date, and status.
   - Recheck links before publication; distinguish official client destinations from press/social references.

7. **Bilingual editorial model**
   - Decide whether each text field is localized with Sanity's internationalization pattern or maintained as parallel language fields.
   - Ensure title, summary, case-study narrative, CTA, and SEO metadata have a complete FR/EN strategy before publishing translated claims.

## 5. Safe live-data audit plan (read-only)

Before any content migration or schema enforcement:

1. Export the Sanity `portfolioProject` dataset (published + drafts) using a read-only token with the minimum required permissions. Keep credentials outside GitHub and chat.
2. Export MongoDB `portfolio` records with stable IDs and timestamps. Do not run update/delete operations.
3. Export the frontend fallback records and the `VERIFIED_PROJECT_LINKS` constant.
4. Generate a reconciliation matrix using stable IDs first, then normalized slugs and client/title pairs.
5. Flag duplicates, slug collisions, missing covers, missing alt text, missing narrative fields, unverified KPIs/testimonials, broken URLs, and language gaps.
6. Preserve source snapshots and checksums. Record each proposed merge as a human-reviewed mapping.
7. Only after approval, define a canonical write source and a reversible migration plan.

## 6. Release gates

A portfolio content/schema change is not production-ready until:
- A full Sanity export and MongoDB export are retained securely.
- Every existing published record is mapped and classified.
- Slug uniqueness and source precedence are tested.
- Published routes, SEO routes, and cards resolve to the same record.
- No unverified testimonial, KPI, client logo, or outcome is exposed.
- FR/EN completeness and image accessibility are checked.
- Staging verification and rollback are documented.

## 7. Explicitly unverified

- Live Sanity document counts, draft counts, and actual field completeness.
- Sanity asset existence and image usage permissions.
- Live MongoDB record counts, duplicate IDs/slugs, and data integrity.
- Reachability and ownership of external client links.
- Testimonial permissions and KPI evidence.
- Whether all 8 build-generated Sanity routes are visually correct and accessible.

**Conclusion:** The schema is a workable MVP case-study model, but it needs stronger editorial provenance and publication governance before it can reliably support a premium agency portfolio. The next safe step is a read-only CMS/database export and reconciliation—not an immediate schema migration.
