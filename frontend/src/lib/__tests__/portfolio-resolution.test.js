import { resolvePortfolioProject } from "../portfolio-resolution";

const source = (name, slug = "shared-slug") => ({ slug, title: name, source: name });

describe("resolvePortfolioProject", () => {
  test("prefers the published Sanity project", async () => {
    const sanity = source("Sanity");
    const result = await resolvePortfolioProject({
      slug: "shared-slug",
      lang: "fr",
      fetchSanity: jest.fn().mockResolvedValue(sanity),
      fetchLegacy: jest.fn(),
      fetchFounder: jest.fn(),
    });

    expect(result).toBe(sanity);
  });

  test("uses the legacy project before a founder fallback on slug collision", async () => {
    const legacy = source("Legacy");
    const fetchLegacy = jest.fn().mockResolvedValue(legacy);
    const fetchFounder = jest.fn().mockReturnValue(source("Founder"));

    const result = await resolvePortfolioProject({
      slug: "shared-slug",
      lang: "fr",
      fetchSanity: jest.fn().mockResolvedValue(null),
      fetchLegacy,
      fetchFounder,
    });

    expect(result).toBe(legacy);
    expect(fetchFounder).not.toHaveBeenCalled();
  });

  test("uses founder content when both remote sources are empty", async () => {
    const founder = source("Founder", "mudoo");
    const result = await resolvePortfolioProject({
      slug: "mudoo",
      lang: "fr",
      fetchSanity: jest.fn().mockResolvedValue(null),
      fetchLegacy: jest.fn().mockResolvedValue(null),
      fetchFounder: jest.fn().mockReturnValue(founder),
    });

    expect(result).toBe(founder);
  });

  test("awaits an asynchronous founder fallback", async () => {
    const founder = source("Founder", "mudoo");
    const result = await resolvePortfolioProject({
      slug: "mudoo",
      lang: "fr",
      fetchSanity: jest.fn().mockResolvedValue(null),
      fetchLegacy: jest.fn().mockResolvedValue(null),
      fetchFounder: jest.fn().mockResolvedValue(founder),
    });

    expect(result).toBe(founder);
  });

  test("continues to legacy when Sanity rejects", async () => {
    const legacy = source("Legacy");
    const result = await resolvePortfolioProject({
      slug: "shared-slug",
      lang: "en",
      fetchSanity: jest.fn().mockRejectedValue(new Error("Sanity unavailable")),
      fetchLegacy: jest.fn().mockResolvedValue(legacy),
      fetchFounder: jest.fn(),
    });

    expect(result).toBe(legacy);
  });

  test("rejects malformed records and continues to the next source", async () => {
    const legacy = source("Legacy");
    const result = await resolvePortfolioProject({
      slug: "shared-slug",
      lang: "en",
      fetchSanity: jest.fn().mockResolvedValue({}),
      fetchLegacy: jest.fn().mockResolvedValue(legacy),
      fetchFounder: jest.fn(),
    });

    expect(result).toBe(legacy);
  });

  test("rejects a record whose slug does not match the requested route", async () => {
    const founder = source("Founder", "requested-slug");
    const result = await resolvePortfolioProject({
      slug: "requested-slug",
      lang: "en",
      fetchSanity: jest.fn().mockResolvedValue(source("Wrong Sanity project", "wrong-slug")),
      fetchLegacy: jest.fn().mockResolvedValue(source("Wrong legacy project", "wrong-slug")),
      fetchFounder: jest.fn().mockReturnValue(founder),
    });

    expect(result).toBe(founder);
  });

  test("returns null when no source contains the project", async () => {
    const result = await resolvePortfolioProject({
      slug: "missing",
      lang: "en",
      fetchSanity: jest.fn().mockResolvedValue(null),
      fetchLegacy: jest.fn().mockRejectedValue(new Error("API unavailable")),
      fetchFounder: jest.fn().mockReturnValue(null),
    });

    expect(result).toBeNull();
  });
});
