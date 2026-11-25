# Phase 1 — Integration control record

Date: 2026-11-24  
Repository: `wenslyferdinand-Mudoo/ID9_Agency_website`  
Integration branch: `phase1/integration-2026-11-24`  
Baseline commit: `b7dc9e70f46f201ffb1b64780fd74a6c908a594a`

## Scope and safety

This record tracks the controlled integration of PR #69 (portfolio source precedence), PR #73 (static SEO and 404), and PR #74 (backend hardening). It is not evidence that these changes have been integrated, tested in a browser, or deployed.

No production deployment, merge to `main`, database mutation, Sanity migration, secret read, or environment-variable value disclosure is authorized by this work.

## Verified repository state

- The integration branch exists and currently points to the same baseline commit as `main`.
- The branch comparison reports 0 commits ahead and 0 behind.
- PR #69 is open and draft; its head is `1a1624b015f5b60079558c8668ebfe5a47bd8bee`. It is 10 commits ahead and 7 behind `main`.
- PR #73 is open and draft; its head is `d94ea060316af612d6da28109dff379be910d575`. It is 69 commits ahead and 5 behind `main`.
- PR #74 is open and draft; its head is `05d0916986abc6a3a2563319c4819416112fb1bd`. It is 19 commits ahead and 3 behind `main`.
- The latest observed combined status for baseline `main` reports a Vercel failure whose target indicates a build-rate-limit / plan-quota condition. This is not proof of a source-code build failure.

## Integration collision map

### PR #69 and PR #73 — portfolio / SEO

Both modify:
- `frontend/src/components/site/RouteSeo.jsx`
- `frontend/src/pages/PortfolioDetailPage.jsx`

PR #69 adds a shared portfolio resolver and tests, aligning detail lookup with the listing precedence: published Sanity, legacy API compatibility, then founder-curated fallback. PR #73 adds static SEO generation, metadata handling and 404 routing. These behaviors must be reconciled in one implementation; accepting either whole file version would risk losing the other branch's behavior.

### PR #73 and PR #74 — CI workflow

Both modify `.github/workflows/backend-static.yml`. The final workflow must retain all required frontend and backend validation gates, immutable action pins, least-privilege permissions, and fail-closed test behavior. Do not resolve this collision by choosing one complete workflow without a line-by-line comparison.

### PR #74 — backend / contact / auth

PR #74 changes `backend/server.py`, authentication and API client behavior, and the contact page. Unit tests alone do not prove MongoDB Atlas staging connectivity, session-cookie behavior behind the deployed proxy, CORS correctness, or successful email delivery. Those require isolated staging checks with non-production credentials.

## Required integration sequence

1. Refresh `main` and all three PR heads; record exact SHAs before applying any patch.
2. Reconcile #69's resolver and listing behavior with #73's static SEO metadata and prerender pipeline.
3. Reconcile #73 and #74 workflow changes while preserving all quality gates.
4. Review #74 backend changes for startup safety, JWT/session lifecycle, cookie flags, CORS allowlist, rate limiting, MongoDB initialization, and contact persistence/email failure behavior.
5. Add or preserve regression tests for the combined behavior; run frontend tests, backend unit tests, static checks, and production build on the integration branch.
6. Verify generated HTML for canonical, title, description, Open Graph/Twitter, JSON-LD, sitemap entries, and correct 404 semantics.
7. Run Preview smoke tests for homepage, public pages, portfolio index/detail, blog detail, unknown route, contact submission, and admin noindex behavior.
8. Validate Atlas and Render staging with isolated test data and credentials; do not point tests at production.
9. Verify Vercel environment-variable presence and scope without exposing secret values.
10. Verify branch protection and required checks. Request explicit approval before any merge to `main` or production deployment.

## Acceptance criteria

A gate is green only when there is a reproducible artifact or test result tied to the exact integration commit. A PR description, a local code inspection, a passing test on an old head SHA, or a READY Preview from a different branch is not sufficient evidence.

| Gate | Current state | Evidence still required |
|---|---|---|
| Main baseline / integration branch | GREEN | Branch currently matches baseline SHA |
| PR #69 portfolio resolver | AMBER | Reconcile and test on combined branch |
| PR #73 static SEO / 404 | AMBER | Reconcile, build generated pages, inspect HTTP behavior |
| PR #74 backend hardening | AMBER | Review combined code and run isolated tests |
| CI workflow collision | AMBER | One consolidated workflow and passing run |
| Atlas Staging | RED / unverified | Successful isolated integration run |
| Render Staging | UNVERIFIED | Confirm service configuration and health |
| Contact E2E | RED / unverified | Successful Preview submission and persistence/email evidence |
| Vercel environment configuration | AMBER / partial | Verify required keys and scopes; never expose values |
| Vercel deployment | RED / blocked | Successful Preview for exact integration SHA; quota issue resolved |
| GitHub branch protection | UNVERIFIED | Required checks and protection rules inspected |
| Production merge / deployment | NOT AUTHORIZED | Separate explicit approval required |

## Change log

- 2026-11-24: Created this integration control record on `phase1/integration-2026-11-24`.
- No application source files changed in this record.
