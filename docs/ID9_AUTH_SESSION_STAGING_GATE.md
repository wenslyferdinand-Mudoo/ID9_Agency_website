# ID9 — Admin session lifecycle and staging verification

## JWT session contract

- Access JWT: HS256, 15-minute lifetime, claims `sub`, `sid`, `jti`, `type=access`.
- Refresh JWT: 30-day rolling lifetime, HttpOnly cookie `id9_refresh`, path `/api/auth`, `Secure` + `SameSite=None` outside development.
- Absolute session lifetime: 90 days. Refresh rotation is atomic against the current SHA-256 hash of the refresh `jti`.
- Refresh-token reuse revokes the server-side session. Logout revokes the session whether the refresh cookie or a valid access token is supplied.
- Every admin request checks the session record and the user's current role. Missing/invalid/expired/revoked sessions return 401; authenticated non-admin users receive 403.
- Refresh-token raw values are not stored in MongoDB. Only a one-way SHA-256 hash of the random `jti` is stored.

## Required runtime configuration

- `JWT_SECRET`: at least 32 UTF-8 bytes; use a new random value in staging, never copy production credentials into staging.
- `APP_ENV=staging` for the Render staging service. This enables Secure cookies and SameSite=None.
- `CORS_ORIGINS`: explicit exact Vercel preview origin(s), plus any other trusted frontend origin. Do not use `*`.
- `MONGO_URL` and `DB_NAME`: dedicated Atlas staging cluster/database only.
- Frontend preview must use a staging-only `REACT_APP_API_URL`. The current Vercel project variable is scoped to both preview and production; do not validate auth from a preview until the value is split/verified.

## Verification layers

1. HTTP tests use in-memory persistence fakes. They validate login, cookie issuance, refresh rotation, replay detection, logout, malformed/expired tokens, privilege removal, and protected admin endpoints.
2. MongoDB unit-contract tests validate startup ping, required indexes, fail-fast index errors, and atomic rate-limit concurrency using fakes.
3. `test_atlas_staging_integration.py` is opt-in. It requires `ID9_ATLAS_STAGING_URI` and `ID9_ATLAS_STAGING_DB`; the database name must start with `id9_staging_test_`. It checks unique/TTL indexes, duplicate rejection, preservation of a sentinel record, concurrent counters, and single-use refresh rotation. It removes only its own uniquely named test records and never drops the database.

## Deployment gate

PR #74 must remain Draft/open. No Render service creation, production deployment, Atlas production access, or merge is authorized by this change. Production readiness requires:
- passing CI on the current PR head;
- a successful Vercel Preview build;
- isolated Render + Atlas staging with staging-only secrets and database;
- successful Atlas integration tests;
- browser-level login/refresh/logout validation from the exact Vercel preview origin;
- confirmation that the production frontend's API URL and current JWT secret are compatible before a separately approved production rollout.

The first deployment of a new Render Web Service starts a build/deploy. Do not click Create Web Service until the isolated staging configuration is reviewed.


## Render staging service template

Repository: `wenslyferdinand-Mudoo/ID9_Agency_website`  
Branch: `security/backend-hardening-consolidated-2026-11-22`  
Runtime: Python  
Build command: `pip install -r backend/requirements.txt`  
Start command: `cd backend && uvicorn server:app --host 0.0.0.0 --port $PORT`  
Recommended staging region for the Caribbean: Virginia (subject to measured latency and Atlas region compatibility).  

Required Render environment variables:

- `APP_ENV=staging`
- `MONGO_URL`: dedicated MongoDB Atlas staging connection string only.
- `DB_NAME`: dedicated database name beginning with `id9_staging_test_`.
- `JWT_SECRET`: newly generated random secret of at least 32 UTF-8 bytes.
- `CORS_ORIGINS`: exact HTTPS origin of the current Vercel Preview deployment; no wildcard and no trailing path.
- `ADMIN_EMAIL` and `ADMIN_PASSWORD`: optional initial staging administrator bootstrap. Existing account credentials are not changed by startup.
- `SEED_DEMO_CONTENT=false`: keep demo content insertion disabled.

The backend exposes its root health response at `/api/`. A successful health response alone does not prove authentication, Atlas index behavior, or frontend integration. Do not create the Render service until the dedicated Atlas staging URI and database name are available; the application imports `MONGO_URL` and `DB_NAME` during startup and will not start without them.


## Provisioning credentials (exact GitHub names)

In GitHub repository **Settings → Secrets and variables → Actions**:

- Create the Actions **secret** `ID9_ATLAS_STAGING_URI` with the connection string for a dedicated Atlas staging cluster/user. Do not use a production credential.
- Create the Actions **variable** `ID9_ATLAS_STAGING_DB` with a disposable database name beginning `id9_staging_test_` (for example, `id9_staging_test_ci`).

The backend workflow maps these exact names into the opt-in Atlas integration test. Until both exist, the Atlas test is intentionally skipped. For Render, set `MONGO_URL` to the same staging-only URI and `DB_NAME` to the same isolated database name. Do not paste either credential into a commit, issue, pull-request comment, or chat message.


## Consolidated PR #74 validation — 2026-11-22

- Current PR: #74, branch `security/backend-hardening-consolidated-2026-11-22`, based on current `main`.
- Exact validated HEAD: `4eb4638eeca2f52c921618f43fde2de0420afb92`.
- Backend: **43 passed, 1 skipped, 5 warnings**.
- Frontend: **1 test suite, 11 tests passed**; production build completed and `build/` is ready.
- Third-party action pin verification: **success**.
- The single skipped backend test is the opt-in Atlas Staging integration test because `ID9_ATLAS_STAGING_URI` and `ID9_ATLAS_STAGING_DB` are not configured in the workflow environment. This does not prove Atlas connectivity.
- GitHub reports the PR branch as mergeable against current main. The PR remains Draft because Staging, browser-level auth/contact tests, and real Resend mailbox receipt are not verified.
- The previous PR #52 branch is retained only as a historical source; the consolidated branch is the active candidate. Do not merge #52, #50, or #32 separately.
