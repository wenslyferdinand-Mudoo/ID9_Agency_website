import { markPageNoindex } from "./seo";

describe("markPageNoindex", () => {
  beforeEach(() => {
    document.head.innerHTML = '<title>Original</title><link rel="canonical" href="https://example.com/page" />';
  });

  it("sets a noindex robots directive and removes a misleading canonical", () => {
    markPageNoindex("Content not found — Impact Digital 9 Agency");

    expect(document.title).toBe("Content not found — Impact Digital 9 Agency");
    expect(document.querySelector('meta[name="robots"]')?.getAttribute("content")).toBe("noindex, follow");
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
  });

  it("updates an existing robots meta tag instead of creating duplicates", () => {
    const robots = document.createElement("meta");
    robots.setAttribute("name", "robots");
    robots.setAttribute("content", "index, follow");
    document.head.appendChild(robots);

    markPageNoindex("Not found");

    expect(document.querySelectorAll('meta[name="robots"]')).toHaveLength(1);
    expect(robots.getAttribute("content")).toBe("noindex, follow");
  });
});
