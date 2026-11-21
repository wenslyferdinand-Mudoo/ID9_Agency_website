# Sanity portfolio draft automation

## Scope and safety

This workflow creates **unpublished drafts in the Sanity `staging` dataset only** in a dedicated Sanity staging project. It must never target the production project.

- It is manual-only (`workflow_dispatch`); it does not run on pushes or pull requests.
- It refuses to run unless `SANITY_PROJECT_ID=xr9ruoim` (the dedicated ID9 staging project) and `SANITY_DATASET=staging`.
- It explicitly rejects the production project ID `mqrbsugj` and any unknown project ID.
- It never calls `publish`, `patch().publish()`, or a production dataset.
- It refuses duplicate portfolio slugs before uploading assets. The duplicate lookup uses the authenticated `raw` perspective so it checks both draft and published document variants.
- It only accepts image files checked into the selected repository commit (JPG, PNG, WebP).
- It uses the existing `portfolioProject` schema and category values, including optional services (separated by `|` in the workflow input).
- It creates a document with an ID beginning `drafts.`; no publish mutation is performed.
- A successful run prints the draft ID and uploaded asset IDs. It does not publish the project or deploy the website.

## One-time GitHub configuration

1. Create a separate Sanity project named `ID9 Agency Staging`. Do not reuse the production project ID `mqrbsugj`.
2. Create the `staging` dataset in this new project. The project ID must be exactly `xr9ruoim`; the script rejects every other project ID, including production `mqrbsugj`.
3. In Sanity Manage for the new project, create a token with the minimum role needed to create documents and upload assets. Keep it private.
4. In GitHub repository Settings → Secrets and variables → Actions → Variables, create:
   - `SANITY_PROJECT_ID`: the new staging project's project ID (not `mqrbsugj`).
5. In GitHub repository Settings → Secrets and variables → Actions → Secrets, create:
   - `SANITY_API_TOKEN`: the token value.
6. Create a GitHub Actions Environment named `sanity-staging`. Add required reviewers if desired. Add the secret to this environment (or make the repository secret available to it).
7. Verify that the staging token can write to the staging dataset.
8. Do not create a token in the production project. The script hard-fails unless the project ID is exactly `xr9ruoim` and the dataset is exactly `staging`.

## Dataset visibility note

The current Sanity `staging` dataset reports visibility `public`. Treat its content and uploaded image assets as non-confidential. Draft status prevents normal published-content queries from treating the document as published, but it is not a substitute for private dataset access control. Do not upload personal data, credentials, confidential client material, or assets that must remain private. The staging project is still isolated from the production project.

## Running the workflow

1. Commit the required JPG/PNG/WebP assets into the repository, preferably under `studio/content-assets/`.
2. Open Actions → **Sanity — create portfolio draft (staging only)** → Run workflow.
3. Select the branch/commit containing the script and assets.
4. Enter the title, slug, category, summary, optional client/year, cover path and optional gallery path.
5. Inspect the run log. A successful run reports `DRAFT_CREATED` and the draft document ID.
6. Open Sanity Studio against the staging dataset and review the draft. Publication is a separate editorial action and is intentionally not automated here.

## Current limitation

GitHub Actions cannot access images attached only to a ChatGPT conversation. Images must first be committed to the repository or added through a separate authenticated upload process. Never put the Sanity token in a workflow input, commit, issue, or chat message.

## Portfolio schema mapping

Required by the current `studio/schemas/portfolioProject.js` schema:
- `title`
- `slug`
- `category`
- `summary`
- `coverImage`

Optional fields supported by this workflow:
- `client`
- `year`
- `gallery` (one image with `alt` and `caption`)
- `services` (optional list; separate values with `|` in the workflow input)
- `featured` is always `false`

Additional case-study, KPI, testimonial and SEO fields are intentionally omitted unless verified content is supplied.
