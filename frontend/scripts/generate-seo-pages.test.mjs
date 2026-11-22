import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { applyProjectMetadata, applyStaticRouteMetadata, buildSitemapXml, dedupeProjectsBySlug, escapeHtml, STATIC_ROUTES, SITE_URL } from "./generate-seo-pages.mjs";

const template = `<!doctype html>
<html lang="en"><head>
<title>Default title</title>
<meta name="description" content="Default description" />
<link rel="canonical" href="https://example.com/" />
<meta property="og:title" content="Default title" />
<meta property="og:description" content="Default description" />
<meta property="og:url" content="https://example.com/" />
<meta property="og:type" content="website" />
<meta property="og:image" content="https://example.com/default.jpg" />
<meta name="twitter:title" content="Default title" />
<meta name="twitter:description" content="Default description" />
<meta name="twitter:image" content="https://example.com/default.jpg" />
</head><body><div id="root"></div></body></html>`;

test("every public static route receives unique canonical and social metadata", () => {
  const seenTitles = new Set();
  for (const [route, metadata] of Object.entries(STATIC_ROUTES)) {
    const result = applyStaticRouteMetadata(template, route);
    const expectedUrl = route === "/" ? `${SITE_URL}/` : `${SITE_URL}${route}`;
    assert.equal(result.url, expectedUrl);
    assert.ok(result.html.includes(`<title>${escapeHtml(metadata.title)}</title>`));
    assert.ok(result.html.includes(`href="${expectedUrl}"`));
    assert.ok(result.html.includes(`content="${expectedUrl}"`));
    assert.ok(result.html.includes('property="og:type" content="website"'));
    assert.ok(result.html.includes('name="twitter:card" content="summary_large_image"'));
    assert.equal((result.html.match(/<link\b[^>]*rel="canonical"/gi) || []).length, 1);
    assert.equal((result.html.match(/property="og:url"/gi) || []).length, 1);
    assert.equal((result.html.match(/name="twitter:title"/gi) || []).length, 1);
    assert.ok(result.html.includes('data-route-seo="static-page"'));
    assert.ok(!seenTitles.has(metadata.title), `Duplicate title configured for ${route}`);
    seenTitles.add(metadata.title);
  }
});

test("static route structured data is valid JSON-LD", () => {
  const { html } = applyStaticRouteMetadata(template, "/services");
  const match = html.match(/<script type="application\/ld\+json" data-route-seo="static-page">([\s\S]*?)<\/script>/);
  assert.ok(match, "Expected a WebPage JSON-LD block");
  const data = JSON.parse(match[1]);
  assert.equal(data["@type"], "WebPage");
  assert.equal(data.url, `${SITE_URL}/services`);
});

test("portfolio sitemap generation input removes invalid and duplicate slugs with Sanity-first precedence", () => {
  const projects = dedupeProjectsBySlug([
    { slug: "shared", title: "Sanity version" },
    { slug: "SHARED", title: "Case-only duplicate" },
    { slug: "shared", title: "Duplicate Sanity version" },
    { slug: "local-only", title: "Founder project" },
    { slug: "../bad", title: "Invalid path" },
    { slug: "Upper-Case", title: "Valid case-insensitive slug" },
  ]);
  assert.deepEqual(projects.map((project) => project.title), [
    "Sanity version", "Founder project", "Valid case-insensitive slug",
  ]);
  assert.equal(projects.at(-1).slug, "Upper-Case", "valid mixed-case slugs remain supported");
});

test("unknown routes fail instead of receiving misleading metadata", () => {
  assert.throws(() => applyStaticRouteMetadata(template, "/not-a-real-page"), /No static SEO metadata/);
});

test("project metadata rejects unsafe slugs and falls back from unsafe image URLs", () => {
  assert.throws(() => applyProjectMetadata(template, { slug: "../escape", title: "Invalid" }), /valid URL-safe slug/);
  for (const image of ["javascript:alert(1)", "data:image/svg+xml,<svg>", "http://example.com/image.jpg", "not-a-url"]) {
    const { html } = applyProjectMetadata(template, { slug: "safe-project", title: "Safe", image });
    assert.ok(html.includes(`content="${SITE_URL}/wensly-founder.jpg"`));
    assert.ok(!html.includes(image));
  }
});

test("project metadata keeps canonical URLs and escapes untrusted text", () => {
  const { html, url } = applyProjectMetadata(template, {
    slug: "case-study",
    title: "A <script>case</script>",
    summary: "A & B",
    seoTitle: "",
    seoDescription: "",
    image: null,
  });
  assert.equal(url, `${SITE_URL}/portfolio/case-study`);
  assert.ok(html.includes("A &lt;script&gt;case&lt;/script&gt;"));
  assert.ok(html.includes('property="og:type" content="article"'));
  assert.ok(html.includes('name="twitter:card" content="summary_large_image"'));
  assert.ok(html.includes(`href="${url}"`));
  assert.ok(!html.includes("<script>case</script>"));
});

test("sitemap builder emits XML envelope and unique canonical URLs", () => {
  const xml = buildSitemapXml([
    `${SITE_URL}/`, `${SITE_URL}/about`, `${SITE_URL}/about`,
    `${SITE_URL}/portfolio/case-study`,
  ]);
  assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'));
  assert.ok(xml.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'));
  assert.equal((xml.match(/<url>/g) || []).length, 3);
  assert.equal((xml.match(/<loc>/g) || []).length, 3);
  assert.ok(xml.includes(`<loc>${SITE_URL}/portfolio/case-study</loc>`));
  assert.ok(xml.endsWith("</urlset>\n"));
});

test("sitemap builder XML-escapes paths and rejects malformed or noncanonical URLs", () => {
  const xml = buildSitemapXml([`${SITE_URL}/portfolio/brand&design`]);
  assert.ok(xml.includes("<loc>https://id9-agency-website.vercel.app/portfolio/brand&amp;design</loc>"));
  for (const invalid of [
    "not-a-url",
    "http://id9-agency-website.vercel.app/about",
    "https://example.com/external",
    `${SITE_URL}/about?campaign=1`,
    `${SITE_URL}/about#section`,
    `https://user:password@id9-agency-website.vercel.app/about`,
    `${SITE_URL}/about/`,
    "",
    null,
  ]) {
    assert.throws(() => buildSitemapXml([invalid]), /Sitemap|Malformed/i);
  }
  assert.throws(() => buildSitemapXml("not-an-array"), /array/i);
});

test("Vercel routing serves prerendered routes and limits SPA rewrites to known dynamic paths", async () => {
  const config = JSON.parse(await readFile(new URL("../vercel.json", import.meta.url), "utf8"));
  const rewrites = config.rewrites;
  assert.deepEqual(config.redirects, [{ source: "/journal", destination: "/blog", permanent: true }]);
  assert.ok(!rewrites.some((rule) => rule.source === "/(.*)"), "A catch-all SPA rewrite would turn unknown URLs into soft 404s");

  for (const route of Object.keys(STATIC_ROUTES).filter((value) => value !== "/")) {
    const rule = rewrites.find((item) => item.source === route);
    assert.ok(rule, `Missing explicit rewrite for ${route}`);
    assert.equal(rule.destination, `${route}/index.html`);
  }

  const projectRule = rewrites.find((item) => item.source === "/portfolio/:slug");
  assert.ok(projectRule, "Missing generated portfolio detail rewrite");
  assert.equal(projectRule.destination, "/portfolio/:slug/index.html");

  for (const route of ["/blog/:slug", "/admin", "/admin/:path*"]) {
    const rule = rewrites.find((item) => item.source === route);
    assert.ok(rule, `Missing explicit SPA rewrite for ${route}`);
    assert.equal(rule.destination, "/index.html");
  }

  for (const route of ["/admin", "/admin/:path*"]) {
    const rule = config.headers.find((item) => item.source === route);
    assert.ok(rule, `Missing noindex response header for ${route}`);
    assert.ok(rule.headers.some((header) => header.key === "X-Robots-Tag" && header.value === "noindex, nofollow"));
  }
});

test("static branded 404 document is available for unmatched Vercel routes", async () => {
  const html = await readFile(new URL("../public/404.html", import.meta.url), "utf8");
  assert.ok(html.includes("<title>404 — Page not found | Impact Digital 9 Agency</title>"));
  assert.ok(html.includes('name="robots" content="noindex, follow"'));
  assert.ok(html.includes("Retour à l’accueil"));
});

test("JSON-LD serialization is script-safe and generation is idempotent", () => {
  const hostile = {
    slug: "script-safety",
    title: '</script><script>alert("xss")</script>',
    summary: "Agency work </script> & client story",
    seoTitle: "",
    seoDescription: "",
    image: null,
  };
  const first = applyProjectMetadata(template, hostile);
  const second = applyProjectMetadata(first.html, hostile);
  const blocks = second.html.match(/<script type="application\/ld\+json" data-route-seo="project">/g) || [];
  assert.equal(blocks.length, 1, "reprocessing must not accumulate generated JSON-LD blocks");
  const match = second.html.match(/<script type="application\/ld\+json" data-route-seo="project">([\s\S]*?)<\/script>/);
  assert.ok(match, "Expected one generated project JSON-LD block");
  assert.ok(!match[1].includes("</script>"), "Untrusted text must not terminate the JSON-LD script element");
  const data = JSON.parse(match[1]);
  assert.equal(data.name, hostile.title);
  assert.equal(data.description, hostile.summary);
});

test("static metadata generation replaces its own prior JSON-LD block", () => {
  const once = applyStaticRouteMetadata(template, "/about");
  const twice = applyStaticRouteMetadata(once.html, "/about");
  assert.equal((twice.html.match(/data-route-seo="static-page"/g) || []).length, 1);
});
