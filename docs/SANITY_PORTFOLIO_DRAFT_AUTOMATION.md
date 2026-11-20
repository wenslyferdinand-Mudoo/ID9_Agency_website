# Sanity portfolio draft automation

## Scope and safety

This workflow creates **unpublished drafts in the Sanity `staging` dataset only** for project `mqrbsugj`.

- It is manual-only (`workflow_dispatch`); it does not run on pushes or pull requests.
- It refuses to run unless `SANITY_DATASET=staging`.
- It never calls `publish`, `patch().publish()`, or a production dataset.
- It refuses duplicate portfolio slugs before uploading assets.
- It only accepts image files checked into the selected repository commit (JPG, PNG, WebP).
- It uses the existing `portfolioProject` schema and category values.
- It creates a document with an ID beginning `drafts.`; public GROQ queries exclude drafts.
- A successful run prints the draft ID and uploaded asset IDs. It does not publish the project or deploy the website.

## One-time GitHub configuration

1. In Sanity Manage, create a token for project `mqrbsugj` with the minimum role needed to create documents and upload assets. Keep it private.
2. In GitHub repository Settings → Secrets and variables → Actions → Secrets, create:
   - `SANITY_API_TOKEN`: the token value.
3. Create a GitHub Actions Environment named `sanity-staging`. Add required reviewers if desired. Add the secret to this environment (or make the repository secret available to it).
4. Create the Sanity dataset `staging` in project `mqrbsugj` if it does not already exist, and verify that the token can write to it.
5. Do not create a production-scoped token for this workflow. The workflow hard-fails if the dataset is not exactly `staging`.

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
- `featured` is always `false`

Additional case-study, KPI, testimonial and SEO fields are intentionally omitted unless verified content is supplied.
