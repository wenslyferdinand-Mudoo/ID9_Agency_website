import { buildBlogArticleMetadata, applyBlogArticleMetadata } from "./blog-seo";

describe("buildBlogArticleMetadata", () => {
  it("uses article-specific title, excerpt, cover, author, and canonical URL", () => {
    const meta = buildBlogArticleMetadata({
      title: "Brand systems",
      excerpt: "A practical guide to building a brand.",
      cover_image: "https://cdn.example.com/cover.jpg",
      author: "ID9 Editorial",
      created_at: "2026-01-10T12:00:00Z",
    }, "brand-systems", "fr");

    expect(meta.title).toBe("Brand systems");
    expect(meta.description).toBe("A practical guide to building a brand.");
    expect(meta.url).toBe("https://id9-agency-website.vercel.app/blog/brand-systems");
    expect(meta.image).toBe("https://cdn.example.com/cover.jpg");
    expect(meta.author).toBe("ID9 Editorial");
    expect(meta.publishedAt).toBe("2026-01-10T12:00:00.000Z");
    expect(meta.lang).toBe("fr");
  });

  it("falls back safely for missing excerpt and unsafe cover image", () => {
    const meta = buildBlogArticleMetadata({
      title: "Fallback title",
      content: "## Hello **world**\n\nAn article intro.",
      cover_image: "javascript:alert(1)",
    }, "fallback-test");

    expect(meta.description).toContain("Hello world");
    expect(meta.image).toBe("https://id9-agency-website.vercel.app/wensly-founder.jpg");
    expect(meta.author).toBe("Impact Digital 9 Agency");
    expect(meta.publishedAt).toBeUndefined();
  });

  it("updates article meta, canonical, and valid BlogPosting structured data", () => {
    document.head.innerHTML = '<title>Before</title><meta name="description" content=""><link rel="canonical" href="">';
    const cleanup = applyBlogArticleMetadata({
      title: "SEO title",
      excerpt: "SEO description",
      cover_image: "https://cdn.example.com/article.png",
      author: "Editor",
      publishedAt: "2026-05-02",
    }, "seo-title", "en");

    expect(document.title).toBe("SEO title");
    expect(document.querySelector('meta[name="description"]')?.content).toBe("SEO description");
    expect(document.querySelector('meta[property="og:type"]')?.content).toBe("article");
    expect(document.querySelector('meta[name="twitter:card"]')?.content).toBe("summary_large_image");
    expect(document.querySelector('link[rel="canonical"]')?.href).toBe("https://id9-agency-website.vercel.app/blog/seo-title");
    const schema = JSON.parse(document.querySelector('script[data-blog-article-seo]').textContent);
    expect(schema["@type"]).toBe("BlogPosting");
    expect(schema.headline).toBe("SEO title");
    expect(schema.author.name).toBe("Editor");
    cleanup();
    expect(document.querySelector('script[data-blog-article-seo]')).toBeNull();
  });
});
