# ID9 Portfolio — data ownership and migration policy

**Status:** transitional architecture decision  
**Canonical public CMS target:** Sanity project `mqrbsugj`, dataset `production`  
**Current public website:** Vercel `https://id9-agency-website.vercel.app`

## 1. Target source of truth

Sanity is the intended single source of truth for all published portfolio content:

- project identity, title, slug, category and client attribution;
- summaries, case-study narrative and services;
- cover image, gallery, captions and alternative text;
- SEO title, SEO description and social sharing image;
- publication state and editorial review.

A project is publicly publishable only when its Sanity document is published. Draft Sanity documents must never be returned by public list/detail queries or included in the sitemap.

## 2. Current transitional state — do not misrepresent it as fully migrated

The current website still combines three sources:

1. Sanity published projects — primary editorial source and first priority on duplicate slugs.
2. Legacy FastAPI/MongoDB portfolio records — retained in the public catalogue so historical projects do not disappear before reconciliation. The existing admin workflow still has legacy MongoDB write paths.
3. Founder project definitions stored in frontend code — curated product/founder case studies.

Therefore, the public catalogue is Sanity-first, but the migration to one physical source of truth is **not yet complete**. Do not remove the legacy API or founder records until their content has been inventoried and reconciled in Sanity.

## 3. Responsibility boundaries

| System | Responsibility | Must not become |
|---|---|---|
| Sanity | Canonical portfolio editorial content, publication and project SEO | Admin authentication or contact lead database |
| MongoDB | Admin accounts, contact enquiries, and preserved legacy portfolio records during migration | Long-term second portfolio CMS |
| FastAPI | Server-side auth, contact intake, admin operations and transitional legacy API | Public portfolio content authority after migration |
| React/Vercel | Public presentation, routing, build-time route metadata and sitemap | A store of editable portfolio content |
| GitHub | Source code, schema changes, migration scripts and operational documentation | A manual replacement for CMS publishing |

## 4. Non-destructive migration procedure

No legacy record may be deleted or overwritten as part of this transition.

1. Export every MongoDB portfolio record, including IDs, slugs, images, galleries, timestamps and publication-related fields.
2. Create and verify a restorable backup before any import or update.
3. Export the current Sanity published and draft project inventory.
4. Reconcile by stable slug first, then by title/client; manually resolve ambiguous matches.
5. Map legacy fields to the Sanity schema. Preserve original MongoDB IDs in a migration reference field or a separate reconciliation manifest.
6. Import missing records into Sanity as drafts. Do not automatically publish records with uncertain ownership, client permission, claims or KPIs.
7. Compare record counts, media references, galleries, project details and public URLs. Verify all images resolve.
8. Run the site against Sanity-only data in Preview and compare the result with the current merged catalogue.
9. Migrate the admin portfolio editor to Sanity and test create/update/publish/unpublish workflows.
10. Only after explicit owner acceptance, disable MongoDB portfolio writes and later remove the public legacy fallback. Keep the MongoDB export/archive according to the retention decision.

## 5. Acceptance criteria for declaring Sanity the only source

- Every approved public project exists as a published Sanity document.
- Every historical project has a documented disposition: migrated, intentionally unpublished, duplicate, or withdrawn with owner approval.
- No portfolio create/update path writes new editorial records to MongoDB.
- Public list, detail, featured sections, search and sitemap all use Sanity only.
- Draft and unpublished projects are not publicly discoverable.
- Project SEO metadata and images are complete or use documented fallbacks.
- Preview route-by-route comparison passes; no content, media or URL loss is found.
- Backup and restoration evidence exists for the pre-migration MongoDB dataset.

Until all criteria pass, the correct status is **Sanity-first transition**, not “single source fully migrated”.
