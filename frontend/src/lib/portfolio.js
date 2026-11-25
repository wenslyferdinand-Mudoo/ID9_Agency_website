import {createClient} from '@sanity/client'
import {SANITY_CONFIG, sanityClient, imageUrl} from './sanity'
import {MUDOO_PORTFOLIO_MEDIA} from './founder-projects'

// Retry detail lookup without the CDN if a newly published document is missing from cache.
const uncachedSanityClient = createClient({...SANITY_CONFIG, useCdn: false})
 
// Verified public destinations for client case studies and the Mudoo product.
const VERIFIED_PROJECT_LINKS = [
  {
    // Keep CDMG separate from the legacy AKYA Dance Company case study.
    matches: (identity) =>
      !/akya[\\s_-]*dance/i.test(identity) &&
      /centre de danse markenley george|cdmg(?:[\\s_-]*ha[iï]ti)?/i.test(identity),
    links: [
      {
        _key: 'cdmg-instagram',
        label: 'Instagram — CDMG Haïti',
        platform: 'instagram',
        url: 'https://www.instagram.com/cdmg_haiti/',
        description: 'Official Instagram account supplied for CDMG Haïti.',
        descriptionFr: 'Compte Instagram officiel communiqué pour le CDMG Haïti.',
      },
      {
        _key: 'cdmg-founder-instagram',
        label: 'Instagram — Markenley Georges',
        platform: 'instagram',
        url: 'https://www.instagram.com/markenleygeorges/',
        description: 'Instagram profile supplied for Markenley Georges.',
        descriptionFr: 'Profil Instagram communiqué de Markenley Georges.',
      },
    ],
  },
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
    matches: (identity) => /mudoo/i.test(identity),
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
  titleFr,
  "slug": slug.current,
  category,
  isFlyer,
  client,
  sector,
  sectorFr,
  year,
  featured,
  summary,
  summaryFr,
  servicesFr,
  description,
  descriptionFr,
  challengeFr,
  approachFr,
  strategyFr,
  solutionFr,
  outcomeFr,
  seoTitleFr,
  seoDescriptionFr,
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
*[_type == "portfolioProject" && defined(slug.current) && !(_id in path("drafts.**"))]
| order(featured desc, year desc, _createdAt desc) ${PROJECTION}
`

const DETAIL_QUERY = `
*[_type == "portfolioProject" && slug.current == $slug && !(_id in path("drafts.**"))][0] ${PROJECTION}
`

const FEATURED_QUERY = `
*[_type == "portfolioProject" && featured == true && defined(slug.current) && !(_id in path("drafts.**"))]
| order(year desc, _createdAt desc) ${PROJECTION}
`

function localizedValue(source, field, lang) {
  const translated = source?.[`${field}Fr`]
  const value = lang === 'fr' && typeof translated === 'string' && translated.trim()
    ? translated
    : source?.[field]
  return typeof value === 'string' ? value.trim() : value
}

/**
 * Normalise a Sanity portfolio document into the shape the UI expects
 * (matching the legacy FastAPI response so components stay unchanged).
 */
export function normalizePortfolio(doc, lang = 'en') {
  if (!doc || typeof doc !== "object") return null
  const gallery = Array.isArray(doc.gallery) ? doc.gallery : []
  const services = Array.isArray(doc.services) ? doc.services : []
  const tools = Array.isArray(doc.tools) ? doc.tools : []
  const kpis = Array.isArray(doc.kpis) ? doc.kpis : []
  const externalLinks = Array.isArray(doc.externalLinks) ? doc.externalLinks : []
  const isMudoo = /mudoo/i.test([doc?.slug, doc?.title, doc?.client].filter(Boolean).join(" "))
  const existingExternalUrls = new Set(externalLinks.map((link) => String(link?.url || '').trim().replace(/\/$/, '')))
  const verifiedExternalLinks = getVerifiedProjectLinks(doc)
    .filter((link) => !existingExternalUrls.has(link.url.replace(/\/$/, '')))
    .map((link) => ({
      ...link,
      label: localizedValue(link, 'label', lang),
      description: localizedValue(link, 'description', lang),
    }))
  return {
    ...doc,
    id: doc._id,
    cover_image: isMudoo ? MUDOO_PORTFOLIO_MEDIA.cover : (doc.coverImage ? imageUrl(doc.coverImage, 1600) : ''),
    gallery: gallery.length > 0
      ? gallery.map((g) => ({
          _key: g?._key,
          url: imageUrl(g, 1600),
          alt: localizedValue(g, 'alt', lang) || '',
          caption: localizedValue(g, 'caption', lang) || '',
        }))
      : (isMudoo ? MUDOO_PORTFOLIO_MEDIA.gallery : []),
    services: lang === 'fr' && Array.isArray(doc.servicesFr) && doc.servicesFr.length ? doc.servicesFr : services,
    title: localizedValue(doc, 'title', lang),
    summary: localizedValue(doc, 'summary', lang),
    sector: localizedValue(doc, 'sector', lang),
    description: localizedValue(doc, 'description', lang),
    challenge: localizedValue(doc, 'challenge', lang),
    approach: localizedValue(doc, 'approach', lang),
    strategy: localizedValue(doc, 'strategy', lang),
    solution: localizedValue(doc, 'solution', lang),
    outcome: localizedValue(doc, 'outcome', lang),
    seoTitle: localizedValue(doc, 'seoTitle', lang),
    seoDescription: localizedValue(doc, 'seoDescription', lang),
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
          label: localizedValue(link, 'label', lang) || "",
          platform: typeof link?.platform === "string" ? link.platform : "",
          url,
          description: localizedValue(link, 'description', lang) || "",
        };
      })
      .filter((link) => link.label && link.url)
      .concat(verifiedExternalLinks),
  }
}

export async function fetchPortfolioList(lang = 'en') {
  try {
    const data = await sanityClient.fetch(LIST_QUERY)
    return Array.isArray(data) ? data.map((doc) => normalizePortfolio(doc, lang)).filter(Boolean) : []
  } catch (e) {
    console.warn('[Sanity] fetchPortfolioList failed:', e?.message)
    return []
  }
}

export async function fetchPortfolioBySlug(slug, lang = 'en') {
  if (!slug || typeof slug !== 'string') return null
  try {
    const data = await sanityClient.fetch(DETAIL_QUERY, {slug})
    if (data) return normalizePortfolio(data, lang)
  } catch (e) {
    console.warn('[Sanity] CDN fetchPortfolioBySlug failed:', e?.message)
  }

  // The CDN may briefly serve a stale empty result after publication. Retry the
  // same published-document query against Sanity's API directly. MongoDB legacy
  // records are handled by the portfolio page compatibility layer, not this CMS client.
  try {
    const data = await uncachedSanityClient.fetch(DETAIL_QUERY, {slug})
    return normalizePortfolio(data, lang)
  } catch (e) {
    console.warn('[Sanity] uncached fetchPortfolioBySlug failed:', e?.message)
    return null
  }
}

export async function fetchFeaturedPortfolio(lang = 'en') {
  try {
    const data = await sanityClient.fetch(FEATURED_QUERY)
    return Array.isArray(data) ? data.map((doc) => normalizePortfolio(doc, lang)).filter(Boolean) : []
  } catch (e) {
    console.warn('[Sanity] fetchFeaturedPortfolio failed:', e?.message)
    return []
  }
}
