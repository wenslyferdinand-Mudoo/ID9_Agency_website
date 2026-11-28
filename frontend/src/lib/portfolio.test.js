jest.mock("@sanity/client", () => ({
  createClient: jest.fn(() => ({ fetch: jest.fn(), getDocument: jest.fn() })),
}));

jest.mock("./sanity", () => ({
  SANITY_CONFIG: { projectId: "test", dataset: "test", apiVersion: "2025-01-01" },
  sanityClient: { fetch: jest.fn() },
  // Plain function on purpose: CRA enables Jest `resetMocks`, which would wipe a jest.fn() implementation before each test.
  imageUrl: (source, width) => `https://cdn.example/image-${width}`,
}));

jest.mock("./founder-projects", () => ({
  MUDOO_PORTFOLIO_MEDIA: { cover: "", gallery: [] },
}));

import { normalizePortfolio } from "./portfolio";

const sourceDocument = {
  _id: "portfolio.cdmg",
  title: "CDMG Haïti — Brand Identity",
  titleFr: "CDMG Haïti — Identité de marque",
  summary: "English summary",
  summaryFr: "Résumé français",
  sector: "Arts · Culture · Dance",
  sectorFr: "Arts · Culture · Danse",
  description: "English context",
  descriptionFr: "Contexte français",
  challenge: "English challenge",
  challengeFr: "Défi en français",
  approach: "English approach",
  approachFr: "Approche en français",
  strategy: "English strategy",
  strategyFr: "Stratégie en français",
  solution: "English solution",
  solutionFr: "Solution en français",
  outcome: "English outcome",
  outcomeFr: "Résultat en français",
  services: ["Brand Identity"],
  servicesFr: ["Identité de marque"],
  gallery: [
    {
      _key: "gallery-1",
      asset: { _ref: "image-test" },
      alt: "English alternative text",
      altFr: "Texte alternatif français",
      caption: "English caption",
      captionFr: "Légende française",
    },
  ],
  externalLinks: [
    {
      _key: "link-1",
      label: "Instagram — CDMG Haiti",
      labelFr: "Instagram — CDMG Haïti",
      platform: "instagram",
      url: "https://www.instagram.com/cdmg_haiti/",
      description: "English link description",
      descriptionFr: "Description française du lien",
    },
  ],
};

describe("normalizePortfolio bilingual localization", () => {
  it("keeps English content when English is requested", () => {
    const project = normalizePortfolio(sourceDocument, "en");

    expect(project.title).toBe(sourceDocument.title);
    expect(project.summary).toBe(sourceDocument.summary);
    expect(project.services).toEqual(["Brand Identity"]);
    expect(project.gallery[0].alt).toBe("English alternative text");
    expect(project.gallery[0].caption).toBe("English caption");
    expect(project.externalLinks[0].label).toBe("Instagram — CDMG Haiti");
  });

  it("selects French content and image/link metadata when French is requested", () => {
    const project = normalizePortfolio(sourceDocument, "fr");

    expect(project.title).toBe("CDMG Haïti — Identité de marque");
    expect(project.summary).toBe("Résumé français");
    expect(project.sector).toBe("Arts · Culture · Danse");
    expect(project.description).toBe("Contexte français");
    expect(project.challenge).toBe("Défi en français");
    expect(project.approach).toBe("Approche en français");
    expect(project.strategy).toBe("Stratégie en français");
    expect(project.solution).toBe("Solution en français");
    expect(project.outcome).toBe("Résultat en français");
    expect(project.services).toEqual(["Identité de marque"]);
    expect(project.gallery[0].alt).toBe("Texte alternatif français");
    expect(project.gallery[0].caption).toBe("Légende française");
    expect(project.externalLinks[0].label).toBe("Instagram — CDMG Haïti");
    expect(project.externalLinks[0].description).toBe("Description française du lien");
  });

  it("falls back to English when a French translation is missing", () => {
    const project = normalizePortfolio(
      { ...sourceDocument, titleFr: "", summaryFr: "", gallery: [{ ...sourceDocument.gallery[0], altFr: "" }] },
      "fr"
    );

    expect(project.title).toBe(sourceDocument.title);
    expect(project.summary).toBe(sourceDocument.summary);
    expect(project.gallery[0].alt).toBe("English alternative text");
  });
});

describe("portfolio cover image sizing", () => {
  it("keeps a full-resolution case-study cover and a smaller card thumbnail", () => {
    const project = normalizePortfolio(
      { _id: "portfolio.sample", title: "Sample", coverImage: { asset: { _ref: "image-sample" } } },
      "en"
    );

    expect(project.cover_image).toBe("https://cdn.example/image-1600");
    expect(project.cover_thumbnail).toBe("https://cdn.example/image-960");
  });
});
