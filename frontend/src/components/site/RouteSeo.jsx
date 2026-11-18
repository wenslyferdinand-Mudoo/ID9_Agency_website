import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

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
    en: ["Services — Impact Digital 9 Agency", "Explore Impact Digital 9 Agency services across brand strategy, graphic design, digital experiences, marketing and media production."],
    fr: ["Services — Impact Digital 9 Agency", "Découvrez les expertises d’Impact Digital 9 Agency en stratégie de marque, design graphique, expériences numériques, marketing et production média."],
  },
  "/portfolio": {
    en: ["Projects & Case Studies — Impact Digital 9 Agency", "Explore selected client work, brand identities, campaigns and digital projects created by Impact Digital 9 Agency."],
    fr: ["Projets & réalisations — Impact Digital 9 Agency", "Découvrez une sélection de projets clients, identités de marque, campagnes et réalisations digitales d’Impact Digital 9 Agency."],
  },
  "/blog": {
    en: ["Journal — Impact Digital 9 Agency", "Insights on branding, design and digital strategy from Impact Digital 9 Agency."],
    fr: ["Journal — Impact Digital 9 Agency", "Analyses sur le branding, le design et la stratégie digitale par Impact Digital 9 Agency."],
  },
  "/contact": {
    en: ["Contact — Impact Digital 9 Agency", "Contact Impact Digital 9 Agency to discuss a branding, design, marketing or digital project."],
    fr: ["Contact — Impact Digital 9 Agency", "Contactez Impact Digital 9 Agency pour discuter d’un projet de branding, design, marketing ou numérique."],
  },
};

function ensureMeta(selector, attribute, value) {
  let element = document.querySelector(selector);
  if (!element && selector.startsWith("meta[")) {
    const match = selector.match(/meta\[(name|property)="([^"]+)"\]/);
    if (match) {
      element = document.createElement("meta");
      element.setAttribute(match[1], match[2]);
      document.head.appendChild(element);
    }
  }
  if (element) element.setAttribute(attribute, value);
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

function removeCanonical() {
  document.querySelector('link[rel="canonical"]')?.remove();
}

export default function RouteSeo() {
  const { pathname } = useLocation();
  const { lang } = useI18n();

  useEffect(() => {
    const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, "") : "/";
    const isAdmin = normalizedPath === "/admin" || normalizedPath.startsWith("/admin/");
    const isProjectDetail = /^\/portfolio\/[^/]+$/.test(normalizedPath);
    const isArticleDetail = /^\/blog\/[^/]+$/.test(normalizedPath);
    const isKnownRoute = Boolean(META[normalizedPath]) || isProjectDetail || isArticleDetail;

    document.documentElement.lang = lang === "fr" ? "fr" : "en";

    if (isAdmin) {
      document.title = "Administration — Impact Digital 9 Agency";
      ensureMeta('meta[name="robots"]', "content", "noindex, nofollow");
      removeCanonical();
      return;
    }

    if (!isKnownRoute) {
      document.title = lang === "fr" ? "Page introuvable — Impact Digital 9 Agency" : "Page not found — Impact Digital 9 Agency";
      ensureMeta('meta[name="description"]', "content", lang === "fr" ? "La page demandée est introuvable." : "The requested page could not be found.");
      ensureMeta('meta[name="robots"]', "content", "noindex, follow");
      removeCanonical();
      return;
    }

    const base = "/" + (normalizedPath.split("/")[1] || "");
    const entry = META[normalizedPath] || META[base] || META["/"];
    const [title, description] = entry[lang] || entry.en;

    document.title = title;
    ensureMeta('meta[name="description"]', "content", description);
    ensureMeta('meta[name="robots"]', "content", "index, follow");
    ensureMeta('meta[property="og:site_name"]', "content", "Impact Digital 9 Agency");
    ensureMeta('meta[property="og:title"]', "content", title);
    ensureMeta('meta[property="og:description"]', "content", description);
    ensureMeta('meta[property="og:type"]', "content", isArticleDetail ? "article" : "website");
    ensureMeta('meta[property="og:url"]', "content", SITE_URL + normalizedPath);
    ensureMeta('meta[property="og:locale"]', "content", lang === "fr" ? "fr_FR" : "en_US");
    ensureMeta('meta[name="twitter:title"]', "content", title);
    ensureMeta('meta[name="twitter:description"]', "content", description);
    setCanonical(normalizedPath);
  }, [pathname, lang]);

  return null;
}
