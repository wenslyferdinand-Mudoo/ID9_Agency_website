import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { fetchPortfolioBySlug } from "@/lib/portfolio";

// Production canonical host until id9agency.com is purchased and attached to Vercel.
const SITE_URL = "https://id9-agency-website.vercel.app";
const DEFAULT_SHARE_IMAGE = `${SITE_URL}/wensly-founder.jpg`;

const META = {
  "/": {
    en: ["Impact Digital 9 Agency (ID9) — Creative & Digital Agency", "Impact Digital 9 Agency is a creative and digital agency delivering brand identity, graphic design, web experiences, marketing, photography and digital solutions."],
    fr: ["Impact Digital 9 Agency (ID9) — Agence créative et digitale", "Impact Digital 9 Agency est une agence créative et digitale spécialisée en identité de marque, design graphique, expériences web, marketing, photographie et solutions numériques."],
  },
  "/about": {
    en: ["About Impact Digital 9 Agency — Our Story", "Discover Impact Digital 9 Agency, its creative vision, integrated services and the founder behind the agency."],
    fr: ["À propos d’Impact Digital 9 Agency — Notre histoire", "Découvrez Impact Digital 9 Agency, sa vision créative, ses services intégrés et son fondateur."],
  },
  "/services": {
    en: ["Services — ID9_AGENCY", "Branding, web & app development, marketing, content and media production. 12 integrated capabilities."],
    fr: ["Services — ID9_AGENCY", "Branding, développement web & app, marketing, contenu et production média. 12 expertises intégrées."],
  },
  "/portfolio": {
    en: ["Projects & Case Studies — Impact Digital 9 Agency", "Explore selected client work, brand identities, campaigns and digital projects created by Impact Digital 9 Agency."],
    fr: ["Projets & réalisations — Impact Digital 9 Agency", "Découvrez une sélection de projets clients, identités de marque, campagnes et réalisations digitales d’Impact Digital 9 Agency."],
  },
  "/blog": {
    en: ["Journal — ID9_AGENCY", "Insights on branding, digital strategy and growth from the ID9 team."],
    fr: ["Journal — ID9_AGENCY", "Analyses sur le branding, la stratégie digitale et la croissance par l'équipe ID9."],
  },
  "/contact": {
    en: ["Contact — ID9_AGENCY", "Start a project with Impact Digital 9. Contact our team to discuss your requirements."],
    fr: ["Contact — ID9_AGENCY", "Démarrez un projet avec Impact Digital 9. Contactez notre équipe pour discuter de vos besoins."],
  },
};

function setMeta(selector, attr, value) {
  const el = document.querySelector(selector);
  if (el && typeof value === "string" && value.trim()) el.setAttribute(attr, value);
}

function setCanonical(pathname) {
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", SITE_URL + pathname);
}

function applyMeta({ title, description, image = DEFAULT_SHARE_IMAGE, url, type = "website" }) {
  document.title = title;
  setMeta('meta[name="description"]', "content", description);
  setMeta('meta[property="og:title"]', "content", title);
  setMeta('meta[property="og:description"]', "content", description);
  setMeta('meta[property="og:url"]', "content", url);
  setMeta('meta[property="og:type"]', "content", type);
  setMeta('meta[property="og:image"]', "content", image);
  setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
  setMeta('meta[name="twitter:title"]', "content", title);
  setMeta('meta[name="twitter:description"]', "content", description);
  setMeta('meta[name="twitter:image"]', "content", image);
}

export default function RouteSeo() {
  const { pathname } = useLocation();
  const { lang } = useI18n();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return undefined;

    let cancelled = false;
    const canonicalUrl = SITE_URL + pathname;
    document.documentElement.lang = lang;
    setCanonical(pathname);

    if (pathname.startsWith("/portfolio/")) {
      const slug = pathname.split("/").filter(Boolean)[1];
      if (!slug) return undefined;

      fetchPortfolioBySlug(slug, lang).then((project) => {
        if (cancelled || !project) return;
        const title =
          (typeof project.seoTitle === "string" && project.seoTitle.trim()) ||
          `${project.title || "Project"} | Impact Digital 9 Agency`;
        const description =
          (typeof project.seoDescription === "string" && project.seoDescription.trim()) ||
          (typeof project.summary === "string" && project.summary.trim()) ||
          "A selected project by Impact Digital 9 Agency.";
        const image = project.cover_image || DEFAULT_SHARE_IMAGE;

        applyMeta({ title, description, image, url: canonicalUrl });
        const schema = {
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.title || title,
          description,
          url: canonicalUrl,
          image,
          creator: {
            "@type": "Organization",
            name: "Impact Digital 9 Agency",
            url: SITE_URL,
          },
        };
        let script = document.querySelector('script[data-route-seo="project"]');
        if (!script) {
          script = document.createElement("script");
          script.type = "application/ld+json";
          script.dataset.routeSeo = "project";
          document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(schema);
      }).catch(() => {
        // Static prerendered metadata remains available if the CMS is temporarily unavailable.
      });

      return () => { cancelled = true; };
    }

    const entry = META[pathname] || META["/" + (pathname.split("/")[1] || "")] || META["/"];
    const [title, description] = entry[lang] || entry.en;
    applyMeta({ title, description, url: canonicalUrl });
    return () => { cancelled = true; };
  }, [pathname, lang]);

  return null;
}
