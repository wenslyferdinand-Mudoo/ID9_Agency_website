import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";

export const SITE_URL = "https://id9-agency-website.vercel.app";
const DEFAULT_SHARE_IMAGE = `${SITE_URL}/wensly-founder.jpg`;
const projectId = process.env.REACT_APP_SANITY_PROJECT_ID || "mqrbsugj";
const dataset = process.env.REACT_APP_SANITY_DATASET || "production";
const apiVersion = process.env.REACT_APP_SANITY_API_VERSION || "2024-01-01";

const query = `*[_type == "portfolioProject" && defined(slug.current) && !(_id in path("drafts.**"))] | order(_createdAt desc) {
  "slug": slug.current,
  title,
  summary,
  seoTitle,
  seoDescription,
  "image": coverImage.asset->url,
  year,
  category,
  client
}`;

export const STATIC_ROUTES = {
  "/": {
    title: "Impact Digital 9 Agency (ID9) — Creative & Digital Agency in Haiti",
    description: "Impact Digital 9 Agency is a creative and digital agency in Haiti delivering brand identity, graphic design, web experiences, marketing, photography and digital solutions.",
  },
  "/about": {
    title: "About Impact Digital 9 Agency — Our Story",
    description: "Discover Impact Digital 9 Agency, its creative vision, integrated services and the founder behind the agency.",
  },
  "/services": {
    title: "Services — ID9_AGENCY",
    description: "Explore branding, web and app experiences, marketing, content creation, photography and media production services from Impact Digital 9 Agency.",
  },
  "/portfolio": {
    title: "Projects & Case Studies — Impact Digital 9 Agency",
    description: "Explore selected client work, brand identities, campaigns and digital projects created by Impact Digital 9 Agency.",
  },
  "/blog": {
    title: "Journal — ID9_AGENCY",
    description: "Insights on branding, digital strategy, design and business growth from Impact Digital 9 Agency.",
  },
  "/contact": {
    title: "Contact — Impact Digital 9 Agency",
    description: "Start a project with Impact Digital 9 Agency. Contact our team in Haiti to discuss your creative and digital requirements.",
  },
};

export function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
}

function safeSlug(value) {
  return typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(value);
}

function safeImageUrl(value) {
  if (typeof value !== "string" || !value.trim()) return DEFAULT_SHARE_IMAGE;
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "https:" || parsed.username || parsed.password) return DEFAULT_SHARE_IMAGE;
    return parsed.href;
  } catch {
    return DEFAULT_SHARE_IMAGE;
  }
}

export function buildSitemapXml(urls) {
  if (!Array.isArray(urls)) throw new TypeError("Sitemap URLs must be provided as an array.");
  const uniqueUrls = new Set();
  for (const value of urls) {
    if (typeof value !== "string" || !value.trim()) {
      throw new TypeError("Sitemap URLs must be non-empty strings.");
    }
    let parsed;
    try {
      parsed = new URL(value);
    } catch {
      throw new Error(`Malformed sitemap URL: ${value}`);
    }
    if (parsed.protocol !== "https:" || parsed.origin !== SITE_URL || parsed.username || parsed.password || parsed.search || parsed.hash) {
      throw new Error(`Sitemap URL is not a valid canonical ID9 URL: ${value}`);
    }
    if (parsed.pathname !== "/" && parsed.pathname.endsWith("/")) {
      throw new Error(`Sitemap URL contains a non-canonical trailing slash: ${value}`);
    }
    uniqueUrls.add(parsed.href);
  }
  const entries = [...uniqueUrls].map((url) => `  <url><loc>${escapeHtml(url)}</loc></url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;
}
export function dedupePublishedBlogPosts(posts) {
  if (!Array.isArray(posts)) return [];
  const seen = new Set();
  return posts.filter((post) => {
    if (post?.published !== true || !safeSlug(post?.slug)) return false;
    const normalized = post.slug.toLowerCase();
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

function stripBlogMarkup(value = "") {
  return String(value)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]*>/g, " ")
    .replace(/[#>*_~`]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildBlogArticleMetadata(post) {
  const title = String(post?.seo_title || post?.seoTitle || post?.title || "Article");
  const rawDescription = post?.seo_description || post?.seoDescription || post?.excerpt || stripBlogMarkup(post?.content);
  const description = String(rawDescription || "Insights from Impact Digital 9 Agency.").trim().slice(0, 300);
  const url = `${SITE_URL}/blog/${encodeURIComponent(post.slug)}`;
  const image = safeImageUrl(post?.cover_image || post?.coverImage || "");
  const author = String(post?.author || "Impact Digital 9 Agency");
  const published = post?.created_at || post?.publishedAt || post?.published_at;
  const publishedAt = published && !Number.isNaN(Date.parse(published)) ? new Date(published).toISOString() : undefined;
  return { title: title.length > 70 ? title.slice(0, 67).trimEnd() + "..." : title, description, url, image, author, publishedAt };
}

export function applyBlogArticleMetadata(template, post) {
  const meta = buildBlogArticleMetadata(post);
  let html = template.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(meta.title)}</title>`);
  html = replaceMeta(html, 'name="description"', "content", meta.description);
  html = replaceMeta(html, 'property="og:title"', "content", meta.title);
  html = replaceMeta(html, 'property="og:description"', "content", meta.description);
  html = replaceMeta(html, 'property="og:url"', "content", meta.url);
  html = replaceMeta(html, 'property="og:type"', "content", "article");
  html = replaceMeta(html, 'property="og:image"', "content", meta.image);
  html = replaceMeta(html, 'name="twitter:card"', "content", "summary_large_image");
  html = replaceMeta(html, 'name="twitter:title"', "content", meta.title);
  html = replaceMeta(html, 'name="twitter:description"', "content", meta.description);
  html = replaceMeta(html, 'name="twitter:image"', "content", meta.image);
  html = replaceCanonical(html, meta.url);
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.description,
    image: meta.image,
    url: meta.url,
    author: { "@type": "Person", name: meta.author },
    publisher: { "@type": "Organization", name: "Impact Digital 9 Agency", url: SITE_URL },
    ...(meta.publishedAt ? { datePublished: meta.publishedAt } : {}),
  };
  html = replaceGeneratedStructuredData(html);
  html = html.replace("</head>", `<script type="application/ld+json" data-route-seo="blog-article">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>\n</head>`);
  return { html, url: meta.url, title: meta.title };
}

export async function fetchPublishedBlogPosts() {
  const configuredBackendUrl = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_URL || "";
  const base = configuredBackendUrl.replace(/\/+$/, "");
  if (!base) {
    console.warn("[SEO] Blog article prerender skipped: no backend URL configured. Static pages and portfolio SEO will still be generated.");
    return [];
  }
  let parsedBase;
  try {
    parsedBase = new URL(base);
  } catch {
    console.warn("[SEO] Blog article prerender skipped: backend URL is invalid.");
    return [];
  }
  if (parsedBase.protocol !== "https:" || parsedBase.username || parsedBase.password || parsedBase.hostname === "xxx") {
    console.warn("[SEO] Blog article prerender skipped: backend URL must be a valid HTTPS host.");
    return [];
  }
  const apiBase = base.endsWith("/api") ? base : `${base}/api`;
  try {
    const response = await fetch(`${apiBase}/blog`, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(12000) });
    if (!response.ok) {
      console.warn(`[SEO] Blog article prerender skipped: API returned HTTP ${response.status}. Published articles will remain available through the live blog API.`);
      return [];
    }
    const payload = await response.json();
    if (!Array.isArray(payload)) {
      console.warn("[SEO] Blog article prerender skipped: API payload is not an array. Live blog remains the runtime source.");
      return [];
    }
    return dedupePublishedBlogPosts(payload);
  } catch (error) {
    console.warn(`[SEO] Blog article prerender skipped due to API/network timeout: ${error?.name || "fetch error"}. Static routes and sitemap will be generated without article entries.`);
    return [];
  }
}


export async function fetchLegacyPortfolioProjects() {
  const configuredBackendUrl = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_URL || "";
  const base = configuredBackendUrl.trim().replace(/\/+$/, "").replace(/\/api$/i, "");
  if (!base) return [];

  let parsedBase;
  try {
    parsedBase = new URL(base);
  } catch {
    console.warn("[SEO] Legacy portfolio prerender skipped: backend URL is invalid.");
    return [];
  }
  if (parsedBase.protocol !== "https:" || parsedBase.username || parsedBase.password) {
    console.warn("[SEO] Legacy portfolio prerender skipped: backend URL must be a trusted HTTPS host.");
    return [];
  }

  try {
    const response = await fetch(`${parsedBase.origin}/api/portfolio`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) {
      console.warn(`[SEO] Legacy portfolio prerender skipped: API returned HTTP ${response.status}.`);
      return [];
    }
    const payload = await response.json();
    const projects = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
    return projects.filter((project) =>
      safeSlug(project?.slug) && typeof project?.title === "string" && project.title.trim()
    );
  } catch (error) {
    console.warn(`[SEO] Legacy portfolio prerender skipped due to API/network timeout: ${error?.name || "fetch error"}.`);
    return [];
  }
}

export function dedupeProjectsBySlug(projects) {
  const seen = new Set();
  return projects.filter((project) => {
    if (!safeSlug(project?.slug)) return false;
    // Treat slugs case-insensitively to avoid case-only path collisions on hosting/CDN layers.
    const normalizedSlug = project.slug.toLowerCase();
    if (seen.has(normalizedSlug)) return false;
    seen.add(normalizedSlug);
    return true;
  });
}

function replaceMeta(html, selector, attribute, value) {
  const escaped = escapeHtml(value);
  const pattern = new RegExp(`(<meta[^>]*${selector}[^>]*${attribute}=")[^"]*("[^>]*>)`, "i");
  if (pattern.test(html)) return html.replace(pattern, (_match, prefix, suffix) => `${prefix}${escaped}${suffix}`);
  return html.replace("</head>", `<meta ${selector} ${attribute}="${escaped}" />\n</head>`);
}

function replaceGeneratedStructuredData(html) {
  return html.replace(/<script\b(?=[^>]*data-route-seo=)[^>]*>[\s\S]*?<\/script>/gi, "");
}

function replaceCanonical(html, url) {
  const escaped = escapeHtml(url);
  const canonicalPattern = /<link\b[^>]*rel=["']canonical["'][^>]*>/i;
  if (canonicalPattern.test(html)) {
    return html.replace(canonicalPattern, (tag) => {
      if (/href=["'][^"']*["']/i.test(tag)) {
        return tag.replace(/href=["'][^"']*["']/i, `href="${escaped}"`);
      }
      return tag.replace(/>$/, ` href="${escaped}">`);
    });
  }
  return html.replace("</head>", `<link rel="canonical" href="${escaped}" />\n</head>`);
}

export function applyStaticRouteMetadata(template, route) {
  const metadata = STATIC_ROUTES[route];
  if (!metadata) throw new Error(`No static SEO metadata configured for route: ${route}`);

  const url = route === "/" ? `${SITE_URL}/` : `${SITE_URL}${route}`;
  const { title, description } = metadata;
  let html = template.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  html = replaceMeta(html, 'name="description"', "content", description);
  html = replaceMeta(html, 'property="og:title"', "content", title);
  html = replaceMeta(html, 'property="og:description"', "content", description);
  html = replaceMeta(html, 'property="og:url"', "content", url);
  html = replaceMeta(html, 'property="og:type"', "content", "website");
  html = replaceMeta(html, 'property="og:image"', "content", DEFAULT_SHARE_IMAGE);
  html = replaceMeta(html, 'name="twitter:card"', "content", "summary_large_image");
  html = replaceMeta(html, 'name="twitter:title"', "content", title);
  html = replaceMeta(html, 'name="twitter:description"', "content", description);
  html = replaceMeta(html, 'name="twitter:image"', "content", DEFAULT_SHARE_IMAGE);
  html = replaceCanonical(html, url);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url,
    isPartOf: { "@type": "WebSite", name: "Impact Digital 9 Agency", url: SITE_URL },
    publisher: { "@type": "Organization", name: "Impact Digital 9 Agency", url: SITE_URL },
  };
  html = replaceGeneratedStructuredData(html);
  html = html.replace(
    "</head>",
    `<script type="application/ld+json" data-route-seo="static-page">${JSON.stringify(structuredData).replace(/</g, "\\u003c")}</script>\n</head>`
  );
  return { html, url, title };
}

export function applyProjectMetadata(template, project) {
  if (!safeSlug(project?.slug)) throw new Error("Project SEO metadata requires a valid URL-safe slug.");
  const title = (project.seoTitle || "").trim() || `${project.title || "Project"} | Impact Digital 9 Agency`;
  const description = (project.seoDescription || "").trim() || (project.summary || "").trim() || `Selected work by Impact Digital 9 Agency: ${project.title || "project"}.`;
  const image = safeImageUrl(project.image || project.cover_image || project.coverImage);
  const url = `${SITE_URL}/portfolio/${project.slug}`;
  let html = template.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  html = replaceMeta(html, 'name="description"', "content", description);
  html = replaceMeta(html, 'property="og:title"', "content", title);
  html = replaceMeta(html, 'property="og:description"', "content", description);
  html = replaceMeta(html, 'property="og:url"', "content", url);
  html = replaceMeta(html, 'property="og:type"', "content", "article");
  html = replaceMeta(html, 'property="og:image"', "content", image);
  html = replaceMeta(html, 'name="twitter:card"', "content", "summary_large_image");
  html = replaceMeta(html, 'name="twitter:title"', "content", title);
  html = replaceMeta(html, 'name="twitter:description"', "content", description);
  html = replaceMeta(html, 'name="twitter:image"', "content", image);
  html = replaceCanonical(html, url);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title || title,
    headline: title,
    description,
    url,
    image,
    about: project.category || undefined,
    creator: { "@type": "Organization", name: "Impact Digital 9 Agency", url: SITE_URL },
    publisher: { "@type": "Organization", name: "Impact Digital 9 Agency", url: SITE_URL },
  };
  html = replaceGeneratedStructuredData(html);
  html = html.replace("</head>", `<script type="application/ld+json" data-route-seo="project">${JSON.stringify(structuredData).replace(/</g, "\\u003c")}</script>\n</head>`);
  return { html, url, title };
}

async function main() {
  const endpoint = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}`;
  const response = await fetch(endpoint, { headers: { Accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`Sanity SEO build query failed: HTTP ${response.status}. Refusing to publish an incomplete project sitemap.`);
  }
  const payload = await response.json();
  const sanityProjects = Array.isArray(payload.result) ? payload.result.filter((item) => safeSlug(item?.slug)) : [];

  const [blogPosts, legacyProjects] = await Promise.all([
    fetchPublishedBlogPosts(),
    fetchLegacyPortfolioProjects(),
  ]);
  const founderSource = await readFile(path.resolve("src/lib/founder-projects.js"), "utf8");
  const founderMatch = founderSource.match(/const PROJECTS = (\[[\s\S]*?\]);\s*\n\s*export function/);
  if (!founderMatch) throw new Error("Could not locate the founder project data array for SEO generation.");
  const founderProjects = runInNewContext("(" + founderMatch[1] + ")");
  const existingRemoteSlugs = new Set(
    [...sanityProjects, ...legacyProjects].map((item) => item.slug.toLowerCase())
  );
  const localProjects = founderProjects
    .filter((item) => safeSlug(item?.slug) && !existingRemoteSlugs.has(item.slug.toLowerCase()))
    .map((item) => ({
      slug: item.slug,
      title: item.title,
      summary: item.summary,
      seoTitle: String(item.title || "Project") + " | Impact Digital 9 Agency",
      seoDescription: item.summary,
      image: null,
      year: item.year,
      category: item.category,
    }));
  // Sanity is authoritative; duplicate slugs are discarded deterministically (first source wins).
  const projects = dedupeProjectsBySlug([...sanityProjects, ...localProjects]);
  const template = await readFile(path.resolve("build/index.html"), "utf8");
  const sitemapPath = path.resolve("build/sitemap.xml");
  const sitemapUrls = Object.keys(STATIC_ROUTES).map((route) => route === "/" ? `${SITE_URL}/` : `${SITE_URL}${route}`);

  for (const [route] of Object.entries(STATIC_ROUTES)) {
    const { html } = applyStaticRouteMetadata(template, route);
    const outputDir = route === "/" ? path.resolve("build") : path.resolve("build", route.slice(1));
    await mkdir(outputDir, { recursive: true });
    await writeFile(path.join(outputDir, "index.html"), html, "utf8");
  }

  let generatedProjects = 0;
  for (const project of projects) {
    const { html, url } = applyProjectMetadata(template, project);
    const outputDir = path.resolve("build/portfolio", project.slug);
    await mkdir(outputDir, { recursive: true });
    await writeFile(path.join(outputDir, "index.html"), html, "utf8");
    sitemapUrls.push(url);
    generatedProjects += 1;
  }

  let generatedBlogPosts = 0;
  for (const post of blogPosts) {
    const { html, url } = applyBlogArticleMetadata(template, post);
    const outputDir = path.resolve("build/blog", post.slug);
    await mkdir(outputDir, { recursive: true });
    await writeFile(path.join(outputDir, "index.html"), html, "utf8");
    sitemapUrls.push(url);
    generatedBlogPosts += 1;
  }

  await writeFile(sitemapPath, buildSitemapXml(sitemapUrls), "utf8");
  console.log(`[SEO] Generated ${Object.keys(STATIC_ROUTES).length} static route metadata page(s), ${generatedProjects} portfolio route(s), ${generatedBlogPosts} published blog route(s), and sitemap entries.`);
}

const isDirectExecution = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectExecution) {
  main().catch((error) => {
    console.error("[SEO] Static metadata generation failed:", error);
    process.exitCode = 1;
  });
}
