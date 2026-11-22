export function getPortfolioSeoMetadata(project, canonicalUrl, defaultImage) {
  const projectTitle =
    typeof project?.title === "string" && project.title.trim()
      ? project.title.trim()
      : "Project";
  const title =
    (typeof project?.seoTitle === "string" && project.seoTitle.trim()) ||
    `${projectTitle} | Impact Digital 9 Agency`;
  const description =
    (typeof project?.seoDescription === "string" && project.seoDescription.trim()) ||
    (typeof project?.summary === "string" && project.summary.trim()) ||
    "A selected project by Impact Digital 9 Agency.";
  const rawImage =
    (typeof project?.cover_image === "string" && project.cover_image.trim()) ||
    (typeof project?.coverImage === "string" && project.coverImage.trim()) ||
    "";
  let image = defaultImage;
  try {
    if (rawImage) image = new URL(rawImage, new URL(canonicalUrl).origin).href;
  } catch {
    image = defaultImage;
  }

  return {
    title,
    description,
    image,
    url: canonicalUrl,
    schema: {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: projectTitle,
      description,
      url: canonicalUrl,
      image,
      creator: {
        "@type": "Organization",
        name: "Impact Digital 9 Agency",
        url: new URL(canonicalUrl).origin,
      },
    },
  };
}
