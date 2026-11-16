import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useI18n } from "@/lib/i18n";


const META = {
  "/": {
    en: ["ID9_AGENCY — Be Impactful. Build Powerful Digital Brands.", "Premium creative & strategic digital agency. Branding, web, app, marketing & media production engineered for impact."],
    fr: ["ID9_AGENCY — Soyez impactant. Construisez des marques digitales puissantes.", "Agence digitale créative & stratégique premium. Branding, web, app, marketing et production média conçus pour l'impact."],
  },
  "/about": {
    en: ["About — ID9_AGENCY", "Meet Impact Digital 9: the team, the vision and the founder behind powerful digital brands."],
    fr: ["À propos — ID9_AGENCY", "Découvrez Impact Digital 9 : l'équipe, la vision et le fondateur derrière des marques digitales puissantes."],
  },
  "/services": {
    en: ["Services — ID9_AGENCY", "Branding, web & app development, marketing, content and media production. 12 integrated capabilities."],
    fr: ["Services — ID9_AGENCY", "Branding, développement web & app, marketing, contenu et production média. 12 expertises intégrées."],
  },
  "/portfolio": {
    en: ["Work — ID9_AGENCY", "Selected case studies: brands, products and campaigns engineered by Impact Digital 9."],
    fr: ["Projets — ID9_AGENCY", "Études de cas sélectionnées : marques, produits et campagnes conçus par Impact Digital 9."],
  },
  "/blog": {
    en: ["Journal — ID9_AGENCY", "Insights on branding, digital strategy and growth from the ID9 team."],
    fr: ["Journal — ID9_AGENCY", "Analyses sur le branding, la stratégie digitale et la croissance par l'équipe ID9."],
  },
  "/contact": {
    en: ["Contact — ID9_AGENCY", "Start a project with Impact Digital 9. Tell us about your goals and timeline."],
    fr: ["Contact — ID9_AGENCY", "Démarrez un projet avec Impact Digital 9. Présentez-nous vos objectifs et votre échéance."],
  },
};

function setMeta(selector, attr, value) {
  const el = document.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

export default function RouteSeo() {
  const { pathname } = useLocation();
  const { lang } = useI18n();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    const base = "/" + (pathname.split("/")[1] || "");
    const entry = META[pathname] || META[base] || META["/"];
    const [title, desc] = entry[lang] || entry.en;

    document.title = title;
    setMeta('meta[name="description"]', "content", desc);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", desc);
    const siteUrl = window.location.origin;
    setMeta('meta[property="og:url"]', "content", siteUrl + pathname);
    setMeta('meta[property="og:locale"]', "content", lang === "fr" ? "fr_FR" : "en_US");
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", desc);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", siteUrl + pathname);
    document.documentElement.lang = lang;
  }, [pathname, lang]);

  return null;
}
