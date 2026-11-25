import fs from 'node:fs'
import path from 'node:path'
import {createClient} from '@sanity/client'

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET
const token = process.env.SANITY_API_TOKEN
const slug = (process.env.PROJECT_SLUG || '').trim()
const mode = process.argv[2]

if (!token || !projectId || !dataset) throw new Error('Missing Sanity configuration.')
if (projectId !== 'mqrbsugj' || dataset !== 'production') {
  throw new Error('Safety stop: this workflow is restricted to ID9 project mqrbsugj / production.')
}
if (slug !== 'cdmg-haiti-brand-identity') {
  throw new Error('Safety stop: only the reviewed CDMG portfolio slug is allowed.')
}
if (!['backup', 'patch'].includes(mode)) throw new Error('Use backup or patch mode.')

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  token,
  useCdn: false,
  perspective: 'raw',
})

// Explicitly exclude drafts: this workflow only snapshots and updates the published document.
const doc = await client.fetch(
  '*[_type == "portfolioProject" && slug.current == $slug && !(_id in path("drafts.**"))][0]',
  {slug},
)
if (!doc) throw new Error(`No published portfolioProject found for slug "${slug}". No document was created.`)
if (doc._type !== 'portfolioProject' || doc._id.startsWith('drafts.')) {
  throw new Error('Unexpected document identity; refusing operation.')
}

const backupDir = path.resolve('.sanity-backup')
const backupPath = path.join(backupDir, 'cdmg-production-before.json')

if (mode === 'backup') {
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
    revision: doc._rev,
    backupPath: '.sanity-backup/cdmg-production-before.json',
    fieldsPresent: Object.keys(doc).sort(),
    galleryCount: Array.isArray(doc.gallery) ? doc.gallery.length : 0,
    externalLinkCount: Array.isArray(doc.externalLinks) ? doc.externalLinks.length : 0,
  }, null, 2))
  process.exit(0)
}

if (process.env.CONFIRM_PRODUCTION !== 'PUBLISH-CDMG-PRODUCTION') {
  throw new Error('Production confirmation phrase does not match. No mutation performed.')
}

function parseJsonEnv(name, fallback) {
  const raw = process.env[name]
  if (!raw || !raw.trim()) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    throw new Error(`${name} must contain valid JSON. No mutation performed.`)
  }
}

function cleanString(value, field, max = 5000) {
  if (typeof value !== 'string') throw new Error(`${field} must be a string.`)
  const cleaned = value.trim()
  if (!cleaned || cleaned.length > max) throw new Error(`${field} must contain 1-${max} characters.`)
  return cleaned
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

const frenchContent = parseJsonEnv('FRENCH_CONTENT_JSON', {})
const frenchAllowed = new Set([
  'titleFr', 'summaryFr', 'sectorFr', 'descriptionFr', 'challengeFr',
  'approachFr', 'strategyFr', 'solutionFr', 'outcomeFr', 'seoTitleFr',
  'seoDescriptionFr',
])
if (!frenchContent || typeof frenchContent !== 'object' || Array.isArray(frenchContent)) {
  throw new Error('FRENCH_CONTENT_JSON must be a JSON object.')
}
for (const [key, value] of Object.entries(frenchContent)) {
  if (!frenchAllowed.has(key)) throw new Error(`French field "${key}" is not allowed.`)
  const limit = key === 'summaryFr' ? 280 : key === 'seoDescriptionFr' ? 160 : key === 'titleFr' ? 120 : 5000
  patch[key] = cleanString(value, key, limit)
}

const servicesFr = parseJsonEnv('SERVICES_FR_JSON', null)
if (servicesFr !== null) {
  if (!Array.isArray(servicesFr) || servicesFr.length > 30) throw new Error('SERVICES_FR_JSON must be an array of at most 30 strings.')
  patch.servicesFr = servicesFr.map((value, index) => cleanString(value, `servicesFr[${index}]`, 80))
}

const externalLinksInput = parseJsonEnv('EXTERNAL_LINKS_JSON', null)
if (externalLinksInput !== null) {
  if (!Array.isArray(externalLinksInput) || externalLinksInput.length > 20) {
    throw new Error('EXTERNAL_LINKS_JSON must be an array of at most 20 link objects.')
  }
  const links = Array.isArray(doc.externalLinks) ? [...doc.externalLinks] : []
  for (const [index, input] of externalLinksInput.entries()) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error(`External link ${index} must be an object.`)
    const label = cleanString(input.label, `externalLinks[${index}].label`, 60)
    const platform = cleanString(input.platform, `externalLinks[${index}].platform`, 30)
    const rawUrl = cleanString(input.url, `externalLinks[${index}].url`, 500)
    const parsed = new URL(rawUrl)
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('External links must use HTTP or HTTPS.')
    const url = parsed.href
    const matchIndex = links.findIndex((entry) => {
      try { return new URL(entry?.url).href === url } catch { return false }
    })
    const current = matchIndex >= 0 ? links[matchIndex] : {}
    const merged = {
      ...current,
      _key: current._key || input._key || `cdmg-${platform}-${index + 1}`,
      label,
      platform,
      url,
    }
    for (const key of ['description', 'labelFr', 'descriptionFr']) {
      if (input[key] !== undefined && input[key] !== '') merged[key] = cleanString(input[key], `externalLinks[${index}].${key}`, key === 'labelFr' ? 60 : 120)
    }
    if (matchIndex >= 0) links[matchIndex] = merged
    else links.push(merged)
  }
  const keys = links.map((entry) => entry?._key).filter(Boolean)
  if (new Set(keys).size !== keys.length) throw new Error('External link array contains duplicate Sanity _key values.')
  patch.externalLinks = links
}

const galleryMetadata = parseJsonEnv('GALLERY_METADATA_JSON', null)
if (galleryMetadata !== null) {
  if (!Array.isArray(galleryMetadata) || galleryMetadata.length > 100) {
    throw new Error('GALLERY_METADATA_JSON must be an array of gallery metadata objects.')
  }
  const gallery = Array.isArray(doc.gallery) ? doc.gallery.map((entry) => ({...entry})) : []
  const seen = new Set()
  for (const [index, metadata] of galleryMetadata.entries()) {
    if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) throw new Error(`Gallery metadata ${index} must be an object.`)
    const key = cleanString(metadata._key, `galleryMetadata[${index}]._key`, 128)
    if (seen.has(key)) throw new Error(`Duplicate gallery key "${key}".`)
    seen.add(key)
    const galleryIndex = gallery.findIndex((entry) => entry?._key === key)
    if (galleryIndex < 0) throw new Error(`Gallery key "${key}" does not exist in the backed-up document.`)
    for (const field of ['alt', 'caption', 'altFr', 'captionFr']) {
      if (metadata[field] !== undefined) gallery[galleryIndex][field] = cleanString(metadata[field], `gallery[${key}].${field}`, 300)
    }
  }
  patch.gallery = gallery
}

if (patch.summary && patch.summary.length > 280) throw new Error('summary exceeds 280 characters.')
if (patch.seoDescription && patch.seoDescription.length > 160) throw new Error('seoDescription exceeds 160 characters.')
if (Object.keys(patch).length === 0) throw new Error('No non-empty fields supplied; refusing an empty patch.')

// Compare against the exact pre-mutation snapshot uploaded by the backup job.
if (!fs.existsSync(backupPath)) throw new Error('Pre-mutation backup artifact is missing. No mutation performed.')
const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'))
if (backup.projectId !== projectId || backup.dataset !== dataset || backup.documentId !== doc._id) {
  throw new Error('Backup identity mismatch. No mutation performed.')
}
if (backup.document?._rev !== doc._rev) {
  throw new Error('Production document changed after backup. Refusing mutation; create a fresh backup and review again.')
}

const result = await client.patch(doc._id)
  .ifRevisionId(backup.document._rev)
  .set(patch)
  .commit({autoGenerateArrayKeys: true})
const verified = await client.getDocument(doc._id)
for (const [key, value] of Object.entries(patch)) {
  if (JSON.stringify(verified?.[key]) !== JSON.stringify(value)) {
    throw new Error(`Post-write verification failed for field "${key}".`)
  }
}
console.log(JSON.stringify({
  status: 'PRODUCTION_PATCH_VERIFIED',
  dataset,
  documentId: result._id,
  slug,
  patchedFields: Object.keys(patch),
  revision: verified._rev,
  galleryCount: Array.isArray(verified.gallery) ? verified.gallery.length : 0,
  externalLinkCount: Array.isArray(verified.externalLinks) ? verified.externalLinks.length : 0,
  note: 'Only reviewed fields were patched. Existing gallery image assets, hotspots, unrelated links, slug and other untouched fields were preserved.',
}, null, 2))
