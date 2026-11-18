import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

// ⚠️ Remplacez par votre domaine final avant la mise en production (voir README.md)
const SITE_URL = "https://id9agency.com";

const META = {
  "/": {
    en: ["Impact Digital 9 Agency (ID9) — Creative & Digital Agency", "Impact Digital 9 Agency is a creative and digital agency delivering brand identity, graphic design, web experiences, marketing, photography and digital solutions."],
    fr: ["Impact Digital 9 Agency (ID9) — Agence créative et digitale", "Impact Digital 9 Agency est une agence créative et digitale spécialisée en identité de marque, design graphique, expériences web, marketing, photographie et solutions numériques."],
  },
  "/about": {
    en: ["About Impact Digital 9 Agency — Our Story", "Discover Impact Digital 9 Agency, its creative vision, integrated services and the founder behind the studio."],
    fr: ["À propos d’Impact Digital 9 Agency — Notre histoire", "Découvrez Impact Digital 9 Agency, sa vision créative, ses services intégrés et le fondateur du studio."],
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
    en: ["Contact — ID9_AGENCY", "Start a project with Impact Digital 9. Free strategy session, reply within 1 hour."],
    fr: ["Contact — ID9_AGENCY", "Démarrez un projet avec Impact Digital 9. Session stratégique gratuite, réponse sous 1h."],
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
    setMeta('meta[property="og:url"]', "content", SITE_URL + pathname);
    setMeta('meta[property="og:locale"]', "content", lang === "fr" ? "fr_FR" : "en_US");
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", desc);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", SITE_URL + pathname);
    document.documentElement.lang = lang;
  }, [pathname, lang]);

  return null;
}
