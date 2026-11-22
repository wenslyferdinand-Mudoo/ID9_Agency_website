jest.mock("@sanity/client", () => ({
  createClient: () => ({ fetch: jest.fn() }),
}));

jest.mock("./sanity", () => ({
  SANITY_CONFIG: {
    projectId: "mqrbsugj",
    dataset: "production",
    apiVersion: "2024-01-01",
    useCdn: true,
  },
  sanityClient: { fetch: jest.fn() },
  imageUrl: jest.fn(() => "https://cdn.sanity.io/test-image.webp"),
}));

import { normalizePortfolio } from "./portfolio";

describe("normalizePortfolio image accessibility metadata", () => {
  it("preserves cover and gallery alternative text from Sanity", () => {
    const project = normalizePortfolio({
      _id: "portfolio.alt-text",
      slug: "accessible-case-study",
      title: "Accessible Case Study",
      coverImage: {
        alt: "A campaign poster displayed on a storefront",
        asset: { _ref: "image-cover-1600x1200-jpg" },
      },
      gallery: [
        {
          _key: "gallery-1",
          alt: "Close-up of the campaign typography",
          caption: "Typography detail",
          asset: { _ref: "image-gallery-1600x1200-jpg" },
        },
      ],
    });

    expect(project.cover_image_alt).toBe("A campaign poster displayed on a storefront");
    expect(project.gallery[0].alt).toBe("Close-up of the campaign typography");
    expect(project.gallery[0].caption).toBe("Typography detail");
  });

  it("returns an empty cover alt when no editorial alternative text is supplied", () => {
    const project = normalizePortfolio({
      _id: "portfolio.fallback-alt",
      slug: "fallback-alt",
      title: "Fallback Alt",
      coverImage: { asset: { _ref: "image-cover-1600x1200-jpg" } },
    });

    expect(project.cover_image_alt).toBe("");
  });
});
