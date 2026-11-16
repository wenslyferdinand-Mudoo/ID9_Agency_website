import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

// ⚠️ Remplacez par votre domaine final avant la mise en production (voir README.md)
const SITE_URL = "https://id9agency.com";

const META = {
  "/": {
    en: ["Wensly Ferdinand × Impact Digital 9 — Creative & Digital Portfolio", "Wensly Ferdinand, founder of Impact Digital 9. Graphic design, brand identity, marketing campaigns, photography, content creation and digital services."],
    fr: ["Wensly Ferdinand × Impact Digital 9 — Portfolio créatif et digital", "Wensly Ferdinand, fondateur d’Impact Digital 9. Design graphique, identité de marque, campagnes marketing, photographie, création de contenus et services digitaux."],
  },
  "/about": {
    en: ["About Wensly Ferdinand & Impact Digital 9", "Meet Wensly Ferdinand, independent designer since 2015 and founder of Impact Digital 9."],
    fr: ["À propos de Wensly Ferdinand & Impact Digital 9", "Découvrez Wensly Ferdinand, designer indépendant depuis 2015 et fondateur d’Impact Digital 9."],
  },
  "/services": {
    en: ["Services — ID9_AGENCY", "Branding, web & app development, marketing, content and media production. 12 integrated capabilities."],
    fr: ["Services — ID9_AGENCY", "Branding, développement web & app, marketing, contenu et production média. 12 expertises intégrées."],
  },
  "/portfolio": {
    en: ["Portfolio — Wensly Ferdinand × Impact Digital 9", "Selected creative projects from Wensly Ferdinand and Impact Digital 9, with links to Instagram and the WhatsApp catalogue."],
    fr: ["Portfolio — Wensly Ferdinand × Impact Digital 9", "Projets créatifs sélectionnés de Wensly Ferdinand et Impact Digital 9, avec accès à Instagram et au catalogue WhatsApp."],
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
