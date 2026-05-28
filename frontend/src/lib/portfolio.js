import {sanityClient, imageUrl} from './sanity'

/** GROQ queries */
const PROJECTION = `{
  _id,
  title,
  "slug": slug.current,
  category,
  client,
  sector,
  year,
  featured,
  summary,
  description,
  services,
  tools,
  challenge,
  approach,
  strategy,
  solution,
  outcome,
  kpis,
  testimonial,
  seoTitle,
  seoDescription,
  coverImage,
  gallery,
  videos
}`

const LIST_QUERY = `
*[_type == "portfolioProject" && defined(slug.current)]
| order(featured desc, year desc, _createdAt desc) ${PROJECTION}
`

const DETAIL_QUERY = `
*[_type == "portfolioProject" && slug.current == $slug][0] ${PROJECTION}
`

const FEATURED_QUERY = `
*[_type == "portfolioProject" && featured == true && defined(slug.current)]
| order(year desc) ${PROJECTION}
`

/**
 * Normalise a Sanity portfolio document into the shape the UI expects
 * (matching the legacy FastAPI response so components stay unchanged).
 */
export function normalizePortfolio(doc) {
  if (!doc) return null
  return {
    ...doc,
    id: doc._id,
    cover_image: doc.coverImage ? imageUrl(doc.coverImage, 1600) : '',
    gallery: (doc.gallery || []).map((g) => imageUrl(g, 1600)),
    // pass-through fields stay as-is: title, slug, category, client, sector, year,
    // featured, summary, description, services, tools, challenge, approach,
    // strategy, solution, outcome, kpis, testimonial, videos.
  }
}

export async function fetchPortfolioList() {
  try {
    const data = await sanityClient.fetch(LIST_QUERY)
    return (data || []).map(normalizePortfolio)
  } catch (e) {
    console.warn('[Sanity] fetchPortfolioList failed:', e?.message)
    return []
  }
}

export async function fetchPortfolioBySlug(slug) {
  try {
    const data = await sanityClient.fetch(DETAIL_QUERY, {slug})
    return normalizePortfolio(data)
  } catch (e) {
    console.warn('[Sanity] fetchPortfolioBySlug failed:', e?.message)
    return null
  }
}

export async function fetchFeaturedPortfolio() {
  try {
    const data = await sanityClient.fetch(FEATURED_QUERY)
    return (data || []).map(normalizePortfolio)
  } catch (e) {
    console.warn('[Sanity] fetchFeaturedPortfolio failed:', e?.message)
    return []
  }
}
