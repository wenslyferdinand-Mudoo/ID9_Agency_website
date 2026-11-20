import {createClient} from '@sanity/client'
import {SANITY_CONFIG, sanityClient, imageUrl} from './sanity'

// Retry detail lookup without the CDN if a newly published document is missing from cache.
const uncachedSanityClient = createClient({...SANITY_CONFIG, useCdn: false})

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
  videos,
  externalLinks
}`

const LIST_QUERY = `
*[_type == "portfolioProject" && defined(slug.current)]
| order(featured desc, year desc, _createdAt desc) ${PROJECTION}
`

const DETAIL_QUERY = `
*[_type == "portfolioProject" && slug.current == $slug][0] ${PROJECTION}
`

const FEATURED_QUERY = `
*[_type == "portfolioProject" && featured == true && defined(slug.current) && !(_id in path("drafts.**"))]
| order(year desc, _createdAt desc) ${PROJECTION}
`

/**
 * Normalise a Sanity portfolio document into the shape the UI expects
 * (matching the legacy FastAPI response so components stay unchanged).
 */
export function normalizePortfolio(doc) {
  if (!doc || typeof doc !== "object") return null
  const gallery = Array.isArray(doc.gallery) ? doc.gallery : []
  const services = Array.isArray(doc.services) ? doc.services : []
  const tools = Array.isArray(doc.tools) ? doc.tools : []
  const kpis = Array.isArray(doc.kpis) ? doc.kpis : []
  const externalLinks = Array.isArray(doc.externalLinks) ? doc.externalLinks : []
  return {
    ...doc,
    id: doc._id,
    cover_image: doc.coverImage ? imageUrl(doc.coverImage, 1600) : '',
    gallery: gallery.map((g) => ({
      _key: g?._key,
      url: imageUrl(g, 1600),
      alt: typeof g?.alt === 'string' ? g.alt.trim() : '',
      caption: typeof g?.caption === 'string' ? g.caption.trim() : '',
    })),
    services,
    tools,
    kpis,
    externalLinks: externalLinks
      .map((link) => {
        const rawUrl = typeof link?.url === "string" ? link.url.trim() : "";
        let url = "";
        try {
          const parsed = new URL(rawUrl);
          if (["http:", "https:"].includes(parsed.protocol)) url = parsed.href;
        } catch {
          // Ignore malformed or non-web URLs in public project links.
        }
        return {
          _key: link?._key,
          label: typeof link?.label === "string" ? link.label.trim() : "",
          platform: typeof link?.platform === "string" ? link.platform : "",
          url,
          description: typeof link?.description === "string" ? link.description.trim() : "",
        };
      })
      .filter((link) => link.label && link.url),
  }
}

export async function fetchPortfolioList() {
  try {
    const data = await sanityClient.fetch(LIST_QUERY)
    return Array.isArray(data) ? data.map(normalizePortfolio).filter(Boolean) : []
  } catch (e) {
    console.warn('[Sanity] fetchPortfolioList failed:', e?.message)
    return []
  }
}

export async function fetchPortfolioBySlug(slug) {
  if (!slug || typeof slug !== 'string') return null
  try {
    const data = await sanityClient.fetch(DETAIL_QUERY, {slug})
    if (data) return normalizePortfolio(data)
  } catch (e) {
    console.warn('[Sanity] CDN fetchPortfolioBySlug failed:', e?.message)
  }

  // The CDN may briefly serve a stale empty result after publication. Retry the
  // same query against Sanity's API directly before falling back to legacy data.
  try {
    const data = await uncachedSanityClient.fetch(DETAIL_QUERY, {slug})
    return normalizePortfolio(data)
  } catch (e) {
    console.warn('[Sanity] uncached fetchPortfolioBySlug failed:', e?.message)
    return null
  }
}

export async function fetchFeaturedPortfolio() {
  try {
    const data = await sanityClient.fetch(FEATURED_QUERY)
    return Array.isArray(data) ? data.map(normalizePortfolio).filter(Boolean) : []
  } catch (e) {
    console.warn('[Sanity] fetchFeaturedPortfolio failed:', e?.message)
    return []
  }
}
