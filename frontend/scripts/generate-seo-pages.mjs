import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const SITE_URL = "https://id9-agency-website.vercel.app";
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

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
}

function safeSlug(value) {
  return typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(value);
}

function replaceMeta(html, selector, attribute, value) {
  const escaped = escapeHtml(value);
  const pattern = new RegExp(`(<meta[^>]*${selector}[^>]*${attribute}=")[^"]*("[^>]*>)`, "i");
  if (pattern.test(html)) return html.replace(pattern, `$1${escaped}$2`);
  return html.replace("</head>", `<meta ${selector} ${attribute}="${escaped}" />\n</head>`);
}

function applyProjectMetadata(template, project) {
  const title = (project.seoTitle || "").trim() || `${project.title || "Project"} | Impact Digital 9 Agency`;
  const description = (project.seoDescription || "").trim() || (project.summary || "").trim() || `Selected work by Impact Digital 9 Agency: ${project.title || "project"}.`;
  const image = project.image || `${SITE_URL}/og-cover.png`;
  const url = `${SITE_URL}/portfolio/${project.slug}`;
  let html = template.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  html = replaceMeta(html, 'name="description"', "content", description);
  html = replaceMeta(html, 'property="og:title"', "content", title);
  html = replaceMeta(html, 'property="og:description"', "content", description);
  html = replaceMeta(html, 'property="og:url"', "content", url);
  html = replaceMeta(html, 'property="og:type"', "content", "article");
  html = replaceMeta(html, 'property="og:image"', "content", image);
  html = replaceMeta(html, 'name="twitter:title"', "content", title);
  html = replaceMeta(html, 'name="twitter:description"', "content", description);
  html = replaceMeta(html, 'name="twitter:image"', "content", image);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title || title,
    headline: title,
    description,
    url,
    image,
    dateCreated: project.year ? String(project.year) : undefined,
    about: project.category || undefined,
    creator: {
      "@type": "Organization",
      name: "Impact Digital 9 Agency",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Impact Digital 9 Agency",
      url: SITE_URL,
    },
  };
  html = html.replace("</head>", `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>\n</head>`);
  return { html, url, title };
}

async function main() {
  const endpoint = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}`;
  const response = await fetch(endpoint, { headers: { Accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`Sanity SEO build query failed: HTTP ${response.status}. Refusing to publish an incomplete project sitemap.`);
  }
  const payload = await response.json();
  const projects = Array.isArray(payload.result) ? payload.result.filter((item) => safeSlug(item?.slug)) : [];
  const template = await readFile(path.resolve("build/index.html"), "utf8");
  const sitemapPath = path.resolve("build/sitemap.xml");
  const staticRoutes = ["/", "/about", "/services", "/portfolio", "/blog", "/contact"];
  const sitemapEntries = staticRoutes.map((route) => `  <url><loc>${SITE_URL}${route}</loc></url>`);
  let generated = 0;

  for (const project of projects) {
    const { html, url } = applyProjectMetadata(template, project);
    const outputDir = path.resolve("build/portfolio", project.slug);
    await mkdir(outputDir, { recursive: true });
    await writeFile(path.join(outputDir, "index.html"), html, "utf8");
    sitemapEntries.push(`  <url><loc>${escapeHtml(url)}</loc></url>`);
    generated += 1;
  }

  await writeFile(
    sitemapPath,
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries.join("\n")}\n</urlset>\n`,
    "utf8"
  );
  console.log(`[SEO] Generated ${generated} published portfolio route(s) and sitemap entries from Sanity.`);
}

main().catch((error) => {
  console.error("[SEO] Static project metadata generation failed:", error);
  process.exitCode = 1;
});
