import {createClient} from '@sanity/client'
import {SANITY_CONFIG, sanityClient, imageUrl} from './sanity'

// Retry detail lookup without the CDN if a newly published document is missing from cache.
const uncachedSanityClient = createClient({...SANITY_CONFIG, useCdn: false})
 
// Verified public destinations for the two client case studies.
// Incomplete Instagram handles are intentionally excluded rather than guessed.
const VERIFIED_PROJECT_LINKS = [
  {
    matches: (identity) => /ika[\s_-]*collections?/i.test(identity),
    links: [
      {
        _key: 'ika-facebook',
        label: 'Facebook — IKA Collection',
        platform: 'facebook',
        url: 'https://www.facebook.com/share/1Z2S8g7G6R/?utm_source=chatgpt.com',
        description: 'Page Facebook communiquée pour IKA Collection.',
      },
      {
        _key: 'ika-whatsapp-catalog',
        label: 'Catalogue WhatsApp — IKA Collection',
        platform: 'other',
        url: 'https://wa.me/c/50940832021?utm_source=chatgpt.com',
        description: 'Accès direct au catalogue de produits sur WhatsApp.',
      },
      {
        _key: 'ika-inufocad-press',
        label: 'Article INUFOCAD — IKACOLLECTIONS',
        platform: 'press',
        url: 'https://inufocad.edu.ht/de-latelier-a-lentreprise-faika-sabiana-laure-structure-lavenir-de-lartisanat-haitien-avec-ikacollections/',
        description: 'Portrait publié par l’Université INUFOCAD le 16 septembre 2026.',
      },
      {
        _key: 'ika-instagram',
        label: 'Instagram — IKA Collection',
        platform: 'instagram',
        url: 'https://www.instagram.com/ika.collections20?fqnt=MWVxNW5mMTQzMnNicA==',
        description: 'Compte Instagram officiel communiqué pour IKA Collection.',
      },
    ],
  },
  {
    matches: (identity) => /ak(?:y|i)a[\s_-]*dan[cs]e(?:[\s_-]*company)?/i.test(identity),
    links: [
      {
        _key: 'akya-facebook',
        label: 'Facebook — AKYA Dance Company',
        platform: 'facebook',
        url: 'https://www.facebook.com/share/1979tXee2S/?utm_source=chatgpt.com',
        description: 'Page Facebook communiquée pour AKYA Dance Company.',
      },
      {
        _key: 'akya-instagram-main',
        label: 'Instagram — AKYA Dance Haiti',
        platform: 'instagram',
        url: 'https://www.instagram.com/akyadancehaiti?lqvp=dnh4OW1sbmJob3Uw',
        description: 'Compte Instagram communiqué pour AKYA Dance Haiti.',
      },
      {
        _key: 'akya-instagram-509',
        label: 'Instagram — AKYA Dance Haiti 509',
        platform: 'instagram',
        url: 'https://www.instagram.com/akyadancehaiti509?knvt=MTh2anVpYzBrOGN3Nw==',
        description: 'Compte Instagram communiqué pour AKYA Dance Haiti 509.',
      },
    ],
  },
  {
    matches: (identity) => /\\bmudoo\\b/i.test(identity),
    links: [
      {
        _key: 'mudoo-website',
        label: 'Site officiel — Mudoo',
        platform: 'website',
        url: 'https://landing-page-mudoo-media-player-wensly-s-projects.vercel.app/',
        description: 'Site officiel de présentation de l’application Mudoo.',
      },
      {
        _key: 'mudoo-facebook',
        label: 'Facebook — Mudoo',
        platform: 'facebook',
        url: 'https://www.facebook.com/share/18TmCMjhrD/',
        description: 'Page Facebook de l’application Mudoo.',
      },
      {
        _key: 'mudoo-instagram',
        label: 'Instagram — Mudoo',
        platform: 'instagram',
        url: 'https://www.instagram.com/mudooapp?jplx=ZHBwcnNjdWZlcmU3',
        description: 'Compte Instagram de l’application Mudoo.',
      },
    ],
  },
]

function getVerifiedProjectLinks(doc) {
  const identity = [doc?.slug, doc?.title, doc?.client]
    .filter((value) => typeof value === 'string')
    .join(' ')
  return VERIFIED_PROJECT_LINKS.find((entry) => entry.matches(identity))?.links || []
}


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
  const existingExternalUrls = new Set(externalLinks.map((link) => String(link?.url || '').trim().replace(/\/$/, '')))
  const verifiedExternalLinks = getVerifiedProjectLinks(doc).filter(
    (link) => !existingExternalUrls.has(link.url.replace(/\/$/, ''))
  )
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
      .filter((link) => link.label && link.url)
      .concat(verifiedExternalLinks),
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
