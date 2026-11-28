export function markPageNoindex(title) {
  if (typeof document === "undefined") return;

  if (title) document.title = title;

  let robots = document.querySelector('meta[name="robots"]');
  if (!robots) {
    robots = document.createElement("meta");
    robots.setAttribute("name", "robots");
    document.head.appendChild(robots);
  }
  robots.setAttribute("content", "noindex, follow");
  document.querySelector('link[rel="canonical"]')?.remove();
}
