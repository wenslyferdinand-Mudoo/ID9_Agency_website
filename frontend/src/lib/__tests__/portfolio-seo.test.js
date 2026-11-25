import { getPortfolioSeoMetadata } from "../portfolio-seo";

describe("getPortfolioSeoMetadata", () => {
  const canonicalUrl = "https://id9-agency-website.vercel.app/portfolio/mudoo";
  const defaultImage = "https://id9-agency-website.vercel.app/wensly-founder.jpg";

  test("uses project-specific title, summary and cover image", () => {
    const result = getPortfolioSeoMetadata(
      { title: "Mudoo", summary: "Private offline music player.", cover_image: "/mudoo.webp" },
      canonicalUrl,
      defaultImage
    );

    expect(result.title).toBe("Mudoo | Impact Digital 9 Agency");
    expect(result.description).toBe("Private offline music player.");
    expect(result.image).toBe("https://id9-agency-website.vercel.app/mudoo.webp");
    expect(result.schema.name).toBe("Mudoo");
    expect(result.schema.url).toBe(canonicalUrl);
  });

  test("prefers explicit SEO fields over editorial defaults", () => {
    const result = getPortfolioSeoMetadata(
      { title: "Mudoo", seoTitle: "Mudoo — Official Case Study", seoDescription: "SEO summary." },
      canonicalUrl,
      defaultImage
    );

    expect(result.title).toBe("Mudoo — Official Case Study");
    expect(result.description).toBe("SEO summary.");
  });

  test("rejects unsafe image protocols and credentials", () => {
    for (const cover_image of ["javascript:alert(1)", "data:image/svg+xml,<svg>", "http://cdn.example.com/image.jpg", "https://user:pass@cdn.example.com/image.jpg"]) {
      const result = getPortfolioSeoMetadata({ title: "Unsafe image", cover_image }, canonicalUrl, defaultImage);
      expect(result.image).toBe(defaultImage);
    }
  });

  test("uses the default share image when the project has no cover", () => {
    const result = getPortfolioSeoMetadata({ title: "Collect Story" }, canonicalUrl, defaultImage);
    expect(result.image).toBe(defaultImage);
    expect(result.schema.image).toBe(defaultImage);
  });

  test("ignores blank or malformed SEO values", () => {
    const result = getPortfolioSeoMetadata(
      { title: "  ", seoTitle: " ", seoDescription: 42, summary: " ", cover_image: " " },
      canonicalUrl,
      defaultImage
    );

    expect(result.title).toBe("Project | Impact Digital 9 Agency");
    expect(result.description).toBe("A selected project by Impact Digital 9 Agency.");
    expect(result.image).toBe(defaultImage);
  });
});
