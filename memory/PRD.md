# ID9_AGENCY (Impact Digital 9) — PRD

## Original problem statement
Premium creative & strategic digital agency website. Tagline: "Be Impactful. Build Powerful Digital Brands." Full marketing site + admin dashboard, bilingual EN/FR. Brand colors: deep black #070707, premium violet #743089, impact orange #FFA500, gold light #FFCB60. Fonts: Montserrat / Poppins / Inter.

## Stack
- Backend: FastAPI + MongoDB (motor), bcrypt+JWT auth (Bearer)
- Frontend: React (CRA) + TailwindCSS + Framer Motion + Lenis smooth scroll + shadcn/ui

## Architecture
- Backend `/app/backend/server.py` exposes `/api/*` endpoints
- Frontend at `/app/frontend/src/` with routes:
  - Public: `/`, `/about`, `/services`, `/portfolio`, `/portfolio/:slug`, `/blog`, `/blog/:slug`, `/contact`
  - Admin: `/admin/login`, `/admin`, `/admin/portfolio`, `/admin/blog`, `/admin/contacts`
- i18n: context-based EN/FR dictionary in `/app/frontend/src/lib/i18n.jsx` (URL `?lang=fr` + localStorage)
- Auth: idempotent admin seed from env `ADMIN_EMAIL` / `ADMIN_PASSWORD`

## Personas
- **Founders / Owners** seeking premium digital partner
- **Marketing / Brand leads** evaluating agencies
- **ID9 Admin** managing portfolio, journal posts and inbound leads

## What's been implemented (date: 2025-12)

### Site (public)
- ✅ Cinematic hero with reveal animations, magnetic CTAs, marquee logos
- ✅ About preview + full About page with founder section + 5-step timeline
- ✅ 12-service grid + dedicated services page with deliverables
- ✅ Portfolio preview (masonry) + filterable portfolio page + case study detail
- ✅ Process timeline with scroll-progress line (6 steps)
- ✅ Why-Us with animated counters + 6 reasons
- ✅ Testimonials (4 cards)
- ✅ Lead-magnet "Free Strategy Session" CTA
- ✅ Final dramatic CTA
- ✅ Blog index (featured + grid) + post detail with markdown-lite renderer (4 seed posts)
- ✅ Contact page: full form (name/email/whatsapp/budget/service/deadline/message) with WhatsApp pre-fill on submit + map
- ✅ Footer with Instagram / TikTok / Facebook + email + WhatsApp + studio location
- ✅ Floating glass nav with section pill indicator + EN/FR toggle + mobile drawer
- ✅ Brand SVG logo (purple + magenta) matching the official ID9 mark

### Admin dashboard
- ✅ JWT login + protected routes
- ✅ Overview tiles (portfolio/blog/contacts/unread)
- ✅ Portfolio CRUD (create/edit/delete with all fields)
- ✅ Blog CRUD with markdown-lite content + publish/featured toggles
- ✅ Contact submissions list, mark-as-read, delete, mailto + WhatsApp follow-up

### Backend / API
- ✅ `POST /api/contact` (public), `GET/PATCH/DELETE /api/contact` (admin)
- ✅ `GET /api/portfolio`, `GET /api/portfolio/:slug`, admin CRUD
- ✅ `GET /api/blog`, `GET /api/blog/:slug`, admin CRUD
- ✅ `GET /api/services` (12 static services)
- ✅ `POST /api/auth/login`, `GET /api/auth/me` (Bearer)
- ✅ Idempotent admin seed + idempotent content seed (6 portfolio + 4 blog)
- ✅ Unique indexes on email/slug

### i18n (EN / FR)
- ✅ Translation dictionary covering nav, hero, about, services, portfolio, process, why-us, testimonials, lead magnet, final CTA, footer, contact, about page, services page, blog page
- ✅ URL `?lang=fr` override + localStorage persistence
- ✅ Toggle button in nav

### Real ID9 contact data
- WhatsApp: https://wa.me/50931634848 (display: +509 31 63 4848)
- Email: Contact.id9agency@gmail.com
- Instagram: https://www.instagram.com/id9_agency
- TikTok: https://vm.tiktok.com/ZS9F3FmSnqJ6c-m9Pph/
- Facebook: https://www.facebook.com/share/17bgvsS8ZN/
- Studio: Port-au-Prince, Haïti

## Verified (Testing Agent iterations 1 & 2)
- 22/22 backend tests pass
- All 6 public routes load with 0 console errors
- FR/EN toggle works (Home ↔ Accueil), URL param works
- Contact form submits and persists
- Admin login + CRUD working

## Backlog (P1 / P2)
- P1 — Replace seeded portfolio/blog content with real ID9 case studies (user to provide)
- P1 — Email notification on new contact (Resend / SendGrid integration)
- P2 — Service detail pages (`/services/:slug`) currently link to `/services` only
- P2 — Booking widget (Calendly / Cal.com) for "Book a strategy session"
- P2 — Newsletter signup persistence + mailchimp/sendgrid
- P2 — Animated preloader + scroll-progress bar
- P2 — Add 3D / WebGL hero accent for cinematic edge
- P2 — Localisation of services list (currently EN only)
- P2 — SEO meta per page (react-helmet-async) — currently only the global meta
- P3 — Stripe payments + client portal (per problem statement future scalability)

## Iteration 4 (2026-02) — Vercel deployment compatibility fix

### Problem
Vercel build failing with `Cannot find module 'ajv/dist/compile/codegen'` on Node.js v24.15.0.

### Root cause
1. Vercel defaulted to npm installer which hoisted `ajv@6` at top-level while `schema-utils@4` (via CRA/webpack chain) expected `ajv@8` codegen path.
2. No `engines` field → Vercel used Node 24 (non-LTS, incompatible with `react-scripts@5`).
3. `CI=true` on Vercel treated CRA ESLint warnings as errors.

### Definitive fix applied
- `package.json`: added `engines.node = ">=20.0.0 <23.0.0"`, added `vercel-build` script (`CI=false craco build`), removed obsolete `cra-template` dep.
- `vercel.json`: rewritten with `installCommand=yarn install --frozen-lockfile`, `buildCommand=yarn vercel-build`, `framework=create-react-app`, `outputDirectory=build`, `build.env.CI=false`, `SKIP_PREFLIGHT_CHECK`, `DISABLE_ESLINT_PLUGIN`, `GENERATE_SOURCEMAP=false`, plus SPA rewrites and cache headers.
- `.nvmrc`: new file pinning Node `20`.
- `yarn.lock`: regenerated cleanly.

### Verified
- `yarn install --frozen-lockfile` → exit 0, no ajv errors.
- `CI=true yarn vercel-build` → exit 0, full `build/` output (`index.html`, `static/`, `favicon.svg`, `sitemap.xml`, `robots.txt`, `asset-manifest.json`).
- Frontend dev server (supervisor) still running on port 3000.


## Iteration 3 (2025-12) — Awwwards-level upgrade

### New cinematic systems
- ✅ **Preloader** — logo morph + 0→100 counter + ambient mesh glow, session-gated, skipped on /admin
- ✅ **CustomCursor** — dot + ring, mix-blend-difference, magnetic states on links/buttons, hidden on touch
- ✅ **FluidGradient** — animated mesh background (conic + 3 radial blobs + noise grain + vignette) used on Hero & Footer signature
- ✅ **ScrollProgress** — top brand-gradient progress bar bound to scrollYProgress
- ✅ **MarqueeDivider** — large display text marquee between Home sections with parallax
- ✅ **Footer signature** — clamp(3.5,14vw,15rem) "Let's build something undeniable." with gradient gold italic word

### Verified (Testing Agent iteration 3)
- 22/22 backend pytest pass (no regression)
- All Awwwards features render correctly
- All previous flows (lang toggle, contact form, admin CRUD) still pass

