# ID9_AGENCY — Official Website

Premium creative and strategic digital agency website for Impact Digital 9.

## Project documentation

**Implementation must follow the specifications before changing application code.**

1. [Emergent implementation brief — full product, portfolio, CMS, security and QA requirements](docs/EMERGENT_IMPLEMENTATION_BRIEF.md)
2. [Professionalization audit and phased roadmap](docs/PROFESSIONALIZATION_ROADMAP.md)
3. [Setup and deployment guide](docs/SETUP_GUIDE.md)

## Non-negotiable engineering rules

- Evolve the existing application; do not rebuild or replace its visual identity.
- Audit the current branch, open pull requests and runtime before editing.
- Work in dedicated branches and reviewed pull requests.
- Do not push directly to `main`.
- Do not expose secrets or run tests against production systems.
- Do not delete or migrate production data without verified backups, a dry-run, reconciliation and explicit owner approval.
- Do not invent portfolio projects, client testimonials, KPIs or business outcomes.
- No production deployment without explicit owner approval.

## Existing stack

- Frontend: React / CRACO
- Backend: FastAPI / MongoDB
- CMS: Sanity Studio
- Hosting: Vercel

See the documentation above for the verified implementation scope and acceptance criteria.
