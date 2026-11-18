import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// ---- Public config (safe to expose in client bundle) ----
export const SANITY_CONFIG = {
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID || 'mqrbsugj',
  dataset: process.env.REACT_APP_SANITY_DATASET || 'production',
  apiVersion: process.env.REACT_APP_SANITY_API_VERSION || '2024-01-01',
  useCdn: true, // Free, fast, globally cached
}

export const sanityClient = createClient(SANITY_CONFIG)

const builder = imageUrlBuilder(sanityClient)

/**
 * Generate optimised Sanity CDN image URL.
 * Usage: urlFor(image).width(1600).fit('crop').auto('format').url()
 */
export function urlFor(source) {
  return builder.image(source)
}

/**
 * Helper: full transformed URL with sensible defaults (1600w, webp/avif auto, quality 80).
 */
export function imageUrl(source, width = 1600, height = null) {
  if (!source) return ''
  let b = builder.image(source).width(width).auto('format').quality(82)
  if (height) b = b.height(height).fit('crop')
  return b.url()
}
