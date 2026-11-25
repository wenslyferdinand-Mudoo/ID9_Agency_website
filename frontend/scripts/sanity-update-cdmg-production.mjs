import fs from 'node:fs'
import path from 'node:path'
import {createClient} from '@sanity/client'

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET
const token = process.env.SANITY_API_TOKEN
const slug = (process.env.PROJECT_SLUG || '').trim()

if (!token || !projectId || !dataset) throw new Error('Missing Sanity configuration.')
if (projectId !== 'mqrbsugj' || dataset !== 'production') {
  throw new Error('Safety stop: this workflow is restricted to ID9 project mqrbsugj / production.')
}
if (slug !== 'cdmg-haiti-brand-identity') {
  throw new Error('Safety stop: only the reviewed CDMG portfolio slug is allowed.')
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  token,
  useCdn: false,
  perspective: 'raw',
})

const doc = await client.fetch(
  '*[_type == "portfolioProject" && slug.current == $slug][0]',
  {slug},
)

if (!doc) throw new Error(`No existing portfolioProject found for slug "${slug}". No document was created.`)
if (doc._type !== 'portfolioProject') throw new Error('Unexpected document type; refusing mutation.')

const backupDir = path.resolve('.sanity-backup')
const backupPath = path.join(backupDir, 'cdmg-production-before.json')

if (process.argv[2] === 'backup') {
  fs.mkdirSync(backupDir, {recursive: true})
  fs.writeFileSync(backupPath, JSON.stringify({
    exportedAt: new Date().toISOString(),
    projectId,
    dataset,
    documentId: doc._id,
    document: doc,
  }, null, 2) + '\n', {flag: 'wx'})
  console.log(JSON.stringify({
    status: 'BACKUP_CREATED',
    documentId: doc._id,
    slug,
    backupPath: '.sanity-backup/cdmg-production-before.json',
    fieldsPresent: Object.keys(doc).sort(),
  }, null, 2))
  process.exit(0)
}

if (process.argv[2] !== 'patch') throw new Error('Use backup or patch mode.')
if (process.env.CONFIRM_PRODUCTION !== 'PUBLISH-CDMG-PRODUCTION') {
  throw new Error('Production confirmation phrase does not match. No mutation performed.')
}

const fields = {
  title: process.env.PROJECT_TITLE,
  summary: process.env.PROJECT_SUMMARY,
  client: process.env.PROJECT_CLIENT,
  sector: process.env.PROJECT_SECTOR,
  description: process.env.PROJECT_DESCRIPTION,
  challenge: process.env.PROJECT_CHALLENGE,
  approach: process.env.PROJECT_APPROACH,
  strategy: process.env.PROJECT_STRATEGY,
  solution: process.env.PROJECT_SOLUTION,
  outcome: process.env.PROJECT_OUTCOME,
  seoTitle: process.env.PROJECT_SEO_TITLE,
  seoDescription: process.env.PROJECT_SEO_DESCRIPTION,
}
const patch = {}
for (const [key, raw] of Object.entries(fields)) {
  if (raw !== undefined && raw.trim() !== '') patch[key] = raw.trim()
}
if (Object.keys(patch).length === 0) throw new Error('No non-empty fields supplied; refusing an empty patch.')
if (patch.summary && patch.summary.length > 280) throw new Error('summary exceeds 280 characters.')
if (patch.seoDescription && patch.seoDescription.length > 160) throw new Error('seoDescription exceeds 160 characters.')

const forbidden = ['_id', '_type', 'slug', 'coverImage', 'gallery', 'externalLinks', 'featured', 'kpis', 'testimonial']
if (Object.keys(patch).some((key) => forbidden.includes(key))) {
  throw new Error('Patch contains a protected field.')
}

// Compare against the exact pre-mutation snapshot uploaded by the backup job.
const backupPath = path.resolve('.sanity-backup/cdmg-production-before.json')
if (!fs.existsSync(backupPath)) throw new Error('Pre-mutation backup artifact is missing. No mutation performed.')
const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'))
if (backup.projectId !== projectId || backup.dataset !== dataset || backup.documentId !== doc._id) {
  throw new Error('Backup identity mismatch. No mutation performed.')
}
if (backup.document?._rev !== doc._rev) {
  throw new Error('Production document changed after backup. Refusing mutation; create a fresh backup and review again.')
}

const result = await client.patch(doc._id).ifRevisionId(backup.document._rev).set(patch).commit({autoGenerateArrayKeys: true})
const verified = await client.getDocument(doc._id)
for (const [key, value] of Object.entries(patch)) {
  if (verified?.[key] !== value) throw new Error(`Post-write verification failed for field "${key}".`)
}
console.log(JSON.stringify({
  status: 'PRODUCTION_PATCH_VERIFIED',
  dataset,
  documentId: result._id,
  slug,
  patchedFields: Object.keys(patch),
  revision: verified._rev,
  note: 'Existing document updated with targeted set(); media, gallery, links, slug, featured flag and other untouched fields were preserved.',
}, null, 2))
