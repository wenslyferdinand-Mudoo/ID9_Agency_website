const SITE_URL = "https://id9-agency-website.vercel.app";
const FALLBACK_IMAGE = `${SITE_URL}/wensly-founder.jpg`;

function getMeta(selector, attributeName, value) {
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attributeName, selector.includes('property="') ? selector.match(/property="([^"]+)"/)[1] : selector.match(/name="([^"]+)"/)[1]);
    document.head.appendChild(element);
  }
  element.setAttribute("content", value);
}

function safeArticleImage(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" && !parsed.username && !parsed.password ? parsed.href : FALLBACK_IMAGE;
  } catch {
    return FALLBACK_IMAGE;
  }
}

function stripMarkup(value = "") {
  return String(value)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]*>/g, " ")
    .replace(/[#>*_~`]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildBlogArticleMetadata(post, slug, lang = "en") {
  const title = String(post?.seo_title || post?.seoTitle || post?.title || "Article");
  const rawDescription = post?.seo_description || post?.seoDescription || post?.excerpt || stripMarkup(post?.content);
  const description = String(rawDescription || "Insights from Impact Digital 9 Agency.").trim().slice(0, 300);
  const url = `${SITE_URL}/blog/${encodeURIComponent(slug)}`;
  const image = safeArticleImage(post?.cover_image || post?.coverImage || "");
  const author = String(post?.author || "Impact Digital 9 Agency");
  const published = post?.created_at || post?.publishedAt || post?.published_at;
  const publishedAt = published && !Number.isNaN(Date.parse(published)) ? new Date(published).toISOString() : undefined;
  return {
    title: title.length > 70 ? title.slice(0, 67).trimEnd() + "..." : title,
    description,
    url,
    image,
    author,
    publishedAt,
    lang: lang === "fr" ? "fr" : "en",
  };
}

export function applyBlogArticleMetadata(post, slug, lang = "en") {
  const meta = buildBlogArticleMetadata(post, slug, lang);
  document.title = meta.title;
  getMeta('meta[name="description"]', "name", meta.description);
  getMeta('meta[property="og:title"]', "property", meta.title);
  getMeta('meta[property="og:description"]', "property", meta.description);
  getMeta('meta[property="og:url"]', "property", meta.url);
  getMeta('meta[property="og:type"]', "property", "article");
  getMeta('meta[property="og:image"]', "property", meta.image);
  getMeta('meta[name="twitter:card"]', "name", "summary_large_image");
  getMeta('meta[name="twitter:title"]', "name", meta.title);
  getMeta('meta[name="twitter:description"]', "name", meta.description);
  getMeta('meta[name="twitter:image"]', "name", meta.image);
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", meta.url);
  let script = document.querySelector('script[data-blog-article-seo]');
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-blog-article-seo", "");
    document.head.appendChild(script);
  }
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.description,
    image: meta.image,
    url: meta.url,
    author: { "@type": "Person", name: meta.author },
    publisher: { "@type": "Organization", name: "Impact Digital 9 Agency", url: SITE_URL },
    inLanguage: meta.lang,
    ...(meta.publishedAt ? { datePublished: meta.publishedAt } : {}),
  };
  script.textContent = JSON.stringify(schema).replace(/</g, "\\u003c");
  return () => script.remove();
}
