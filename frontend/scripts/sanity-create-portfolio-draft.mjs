import fs from 'node:fs'
import path from 'node:path'
import {randomUUID} from 'node:crypto'
import {createClient} from '@sanity/client'

const root = process.env.GITHUB_WORKSPACE || process.cwd()
const required = ['SANITY_API_TOKEN', 'SANITY_PROJECT_ID', 'SANITY_DATASET']
for (const key of required) {
  if (!process.env[key]) throw new Error(`Missing required environment variable: ${key}`)
}

if (process.env.SANITY_DATASET !== 'staging') {
  throw new Error('Safety stop: this workflow only writes to the Sanity staging dataset. Production is not permitted.')
}

const input = (name) => (process.env[name] || '').trim()
const title = input('PROJECT_TITLE')
const slug = input('PROJECT_SLUG')
const summary = input('PROJECT_SUMMARY')
const category = input('PROJECT_CATEGORY')
const clientName = input('PROJECT_CLIENT')
const year = input('PROJECT_YEAR')
const coverPath = input('PROJECT_COVER_PATH')
const galleryPath = input('PROJECT_GALLERY_PATH')
const galleryAlt = input('PROJECT_GALLERY_ALT')
const galleryCaption = input('PROJECT_GALLERY_CAPTION')

if (title.length < 3 || title.length > 120) throw new Error('Title must contain 3–120 characters.')
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Slug must be lowercase kebab-case.')
if (!summary || summary.length > 280) throw new Error('Summary is required and must not exceed 280 characters.')
if (!['branding', 'graphic-design', 'web', 'app', 'marketing', 'motion', 'photo'].includes(category)) throw new Error('Unsupported portfolio category.')
if (!coverPath) throw new Error('A cover image path is required.')

function resolveImage(relativePath) {
  const absolute = path.resolve(root, relativePath)
  const relative = path.relative(root, absolute)
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Image path must stay inside the checked-out repository: ${relativePath}`)
  }
  if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) {
    throw new Error(`Image file not found in repository: ${relativePath}`)
  }
  const ext = path.extname(absolute).toLowerCase()
  const mime = ({'.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp'})[ext]
  if (!mime) throw new Error(`Unsupported image format for ${relativePath}; use JPG, PNG or WebP.`)
  return {absolute, mime, filename: path.basename(absolute)}
}

const cover = resolveImage(coverPath)
const gallery = galleryPath ? resolveImage(galleryPath) : null
const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: '2025-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const duplicate = await sanity.fetch(
  '*[_type == "portfolioProject" && slug.current == $slug][0]._id',
  {slug},
)
if (duplicate) throw new Error(`A portfolio document already uses slug "${slug}" (id: ${duplicate}). No document was created.`)

console.log('Uploading cover image to Sanity staging…')
const coverAsset = await sanity.assets.upload('image', fs.createReadStream(cover.absolute), {
  filename: cover.filename,
  contentType: cover.mime,
})
let galleryAsset
if (gallery) {
  console.log('Uploading gallery image to Sanity staging…')
  galleryAsset = await sanity.assets.upload('image', fs.createReadStream(gallery.absolute), {
    filename: gallery.filename,
    contentType: gallery.mime,
  })
}

const draftId = `drafts.${randomUUID()}`
const document = {
  _id: draftId,
  _type: 'portfolioProject',
  title,
  slug: {_type: 'slug', current: slug},
  category,
  summary,
  featured: false,
  coverImage: {
    _type: 'image',
    asset: {_type: 'reference', _ref: coverAsset._id},
  },
  ...(clientName ? {client: clientName} : {}),
  ...(year ? {year} : {}),
  ...(galleryAsset ? {
    gallery: [{
      _key: randomUUID(),
      _type: 'image',
      asset: {_type: 'reference', _ref: galleryAsset._id},
      alt: galleryAlt || title,
      caption: galleryCaption || 'Présentation du projet',
    }],
  } : {}),
}

const created = await sanity.create(document)
console.log(JSON.stringify({
  status: 'DRAFT_CREATED',
  dataset: process.env.SANITY_DATASET,
  documentId: created._id,
  title: created.title,
  slug: created.slug?.current,
  coverAssetId: coverAsset._id,
  galleryAssetId: galleryAsset?._id || null,
  published: false,
}, null, 2))
