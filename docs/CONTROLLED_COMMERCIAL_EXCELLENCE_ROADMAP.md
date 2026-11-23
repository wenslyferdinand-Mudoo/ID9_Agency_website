# ID9 Agency — Controlled Commercial Excellence Roadmap

Status: execution plan; production changes remain gated by review and verification.

## Guardrails

- Preserve the current visual identity, routes, existing content, admin tools, and legacy records.
- Work in isolated branches and submit focused pull requests.
- Never merge or deploy a change solely because a build succeeds.
- Back up and reconcile legacy MongoDB portfolio records before any migration or deletion.
- Use only authentic client testimonials, verified case-study outcomes, and approved client assets.
- Keep credentials in provider environment variables; never commit secrets.
- Production changes require passing CI, code review, staging checks, and a documented rollback path.

## P0 — Acquisition and credibility

### P0.1 Contact brief reliability
- [x] Add server-side input trimming and bounded field validation.
- [x] Add automated model-validation tests.
- [ ] Verify MongoDB authentication and startup on staging with valid credentials.
- [ ] Verify contact persistence and email delivery through Resend.
- [ ] Verify delivery in the destination mailbox, not only provider acceptance.
- [x] Add server-side rate limiting to the contact endpoint; spam mitigation beyond rate limiting remains to be evaluated.
- [x] Confirm user-facing error states distinguish saved-but-email-failed from full submission failure.

Acceptance: a real staging submission is persisted exactly once, has a traceable ID, and reaches the configured mailbox; failure paths are tested without losing the saved brief.

### P0.2 Complete case studies
- [ ] Inventory Sanity, MongoDB legacy records, and founder-curated projects.
- [ ] Export and back up legacy records before reconciliation.
- [ ] Resolve duplicate identity and slug collisions without deleting source records.
- [ ] Complete only verifiable case-study fields: context, challenge, approach, solution, deliverables, media, and evidenced outcomes.
- [ ] Add image alt text and validate all external links.
- [ ] Define a documented editorial source of truth before changing read/write paths.

Acceptance: every published case study has a real client/project identity, consistent media, no broken links, and no unsupported KPI or testimonial claims.

## P1 — Trust, conversion, SEO, and measurement

- Testimonials: publish only approved quotes with attributable client identity and permission.
- Collaboration process: explain discovery, scope, proposal, agreement, production, review, delivery, and support.
- Commercial FAQ: answer scope, revisions, payment milestones, timelines, ownership, maintenance, and communication.
- Service detail pages: create unique pages from verified deliverables, audiences, process, FAQs, and related case studies.
- Structured quote request: qualify objectives, scope, budget range, deadline, decision context, and preferred contact channel while keeping the current contact path available.
- Conversion analytics: define privacy-conscious events for service views, portfolio views, CTA clicks, form starts, successful submissions, and qualified leads.
- SEO: validate canonical URLs, sitemap, robots directives, language alternates, structured data, metadata, and indexability on the deployed HTML.

Acceptance: every tracked event has a documented purpose, no personal form content is sent to analytics, and SEO checks pass on production URLs.

## P2 — Scheduling, retention, and sales operations

- Consultation calendar: add only after timezone, availability, confirmation, cancellation, and privacy behavior are defined.
- Newsletter: use explicit opt-in, double opt-in where appropriate, unsubscribe handling, and a published privacy notice.
- Lead tracking: define pipeline stages, ownership, status history, follow-up dates, and retention policy before implementing a CRM-like admin view.

Acceptance: opt-in and consent are auditable; leads have a clear lifecycle and access is restricted to authorized staff.

## Commercial journey

Visitor → Service discovery → Relevant case study → Trust signals → Structured brief → Lead qualification → Proposal → Agreement → Delivery → Follow-up.

Each step should have one primary action, a measurable event, and an accessible fallback. Do not introduce calendar, newsletter, or CRM dependencies before the P0 contact and data foundations are reliable.

## Validation gates for every pull request

1. Scope is narrow and existing behavior is preserved.
2. Automated tests pass.
3. Production build passes.
4. Accessibility and responsive checks cover affected routes.
5. Staging integration is verified with non-production data.
6. Security and privacy implications are reviewed.
7. PR describes evidence, limitations, and rollback.
8. Production deployment occurs only after approval and post-deploy smoke tests.

## Current execution slice

Active implementation PR: #74 — branch `security/backend-hardening-consolidated-2026-11-22`

Changes in this slice:
- Server-side contact field length constraints and whitespace normalization.
- Persist-first Resend notification flow with explicit `sent` / `failed` delivery state.
- HTTP 202 response when the brief is saved but email notification fails, preventing ambiguous retry behavior.
- Focused tests for field validation, persistence, and notification success/failure.

Not yet verified:
- Atlas/Render Staging authentication and persistence on PR #74.
- Actual Resend mailbox receipt on Staging.
- Render startup and MongoDB connectivity.
- Resend delivery and mailbox receipt.
- Browser-level form submission.

PR #74 CI on HEAD `4eb4638` passed backend (43 passed, 1 skipped), frontend (11 tests), and production build. A documentation-only update is being revalidated on the latest HEAD. Atlas Staging remains skipped until the required staging-only secrets and variables exist.

No production deployment is authorized by this roadmap or this PR.
