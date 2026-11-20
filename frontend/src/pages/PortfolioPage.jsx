import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { BRAND } from "@/lib/brand";
import api, { safeArray } from "@/lib/api";
import { fetchPortfolioList } from "@/lib/portfolio";
import RevealText from "@/components/site/RevealText";
import FinalCTA from "@/components/sections/FinalCTA";
import { useI18n } from "@/lib/i18n";
import { getFounderProjects } from "@/lib/founder-projects";

export default function PortfolioPage() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const { t, lang } = useI18n();

  const FILTERS = [
    { k: "all", l: t("wk.filters.all") },
    { k: "branding", l: t("wk.filters.branding") },
    { k: "graphic-design", l: lang === "fr" ? "Design graphique" : "Graphic Design" },
    { k: "web-design", l: lang === "fr" ? "Design web" : "Web Design" },
    { k: "app-development", l: lang === "fr" ? "Développement d'applications" : "App Development" },
    { k: "marketing", l: t("wk.filters.marketing") },
    { k: "motion-design", l: lang === "fr" ? "Motion design" : "Motion Design" },
    { k: "photography", l: lang === "fr" ? "Photographie" : "Photography" },
  ];

  useEffect(() => {
    let cancelled = false;

    async function loadPortfolio() {
      const founderProjects = safeArray(getFounderProjects(lang));

      // Sanity and the legacy API are complementary sources. Previously, the
      // presence of even one Sanity document caused every legacy project
      // (including the existing Akya case study) to disappear from the list.
      const [sanityResult, legacyResult] = await Promise.allSettled([
        fetchPortfolioList(),
        api.get("/portfolio"),
      ]);

      const sanityItems =
        sanityResult.status === "fulfilled" ? safeArray(sanityResult.value) : [];
      const legacyItems =
        legacyResult.status === "fulfilled"
          ? safeArray(legacyResult.value?.data)
          : [];

      // Prefer CMS records when a project exists in both sources, then retain
      // legacy and founder records that have not yet been migrated to Sanity.
      const merged = [...sanityItems, ...legacyItems, ...founderProjects];
      const seen = new Set();
      const unique = merged.filter((project) => {
        if (!project || typeof project !== "object") return false;
        const key = project.slug
          ? String(project.slug).trim().toLowerCase()
          : project.id
            ? String(project.id).trim().toLowerCase()
            : [String(project.client || "").trim().toLowerCase(), String(project.title || "").trim().toLowerCase()].join("::");
        if (!key || key === "::" || seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      if (!cancelled) setItems(unique);
    }

    loadPortfolio()
      .catch(() => {
        if (!cancelled) setItems(safeArray(getFounderProjects(lang)));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [lang]);

  const filtered = useMemo(() => {
    const list = safeArray(items).filter(
      (project) => project && typeof project.slug === "string" && project.slug.trim()
    );
    return filter === "all"
      ? list
      : list.filter((project) => normalizePortfolioCategory(project.category) === filter);
  }, [items, filter]);

  return (
    <main data-testid="portfolio-page" className="pt-32 md:pt-40">
      <section className="px-4 md:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-6">{t("nav.portfolio")}</p>
          <h1 className="max-w-6xl font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.04] md:leading-[0.98] text-balance">
            {t("wk.h1.pre") && (
              <RevealText as="span" text={t("wk.h1.pre")} className="inline" />
            )}
            {t("wk.h1.pre") && <span>&nbsp;</span>}
            <motion.span
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block text-gradient-gold italic pr-2"
            >
              {t("wk.h1.hl")}
            </motion.span>
            {t("wk.h1.post") && <span>&nbsp;</span>}
            {t("wk.h1.post") && (
              <RevealText as="span" text={t("wk.h1.post")} className="inline" delay={0.2} />
            )}
            <span>&nbsp;</span>
            <RevealText as="span" text={t("wk.h2")} className="inline italic" delay={0.3} />
          </h1>
        </div>
      </section>

      <div className="px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-white/45 text-xs uppercase tracking-[0.22em] mb-4">{t("wk.socialProof")}</p>
          <div className="flex flex-wrap gap-3">
            <a href={BRAND.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm text-white/80 hover:border-orange_impact/50 hover:text-white transition-colors" data-testid="portfolio-instagram-link">
              {t("wk.instagram")} <ArrowUpRight className="w-4 h-4" />
            </a>
            <a href={BRAND.catalogUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm text-white/80 hover:border-orange_impact/50 hover:text-white transition-colors" data-testid="portfolio-whatsapp-catalog-link">
              {t("wk.catalog")} <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <section className="sticky top-0 z-30 border-y border-white/[0.06] bg-ink-900/95 px-4 py-3 backdrop-blur-xl sm:px-6 md:px-8 md:py-4">
        <div className="scrollbar-none mx-auto flex max-w-7xl flex-nowrap gap-2 overflow-x-auto overscroll-x-contain md:flex-wrap" data-testid="portfolio-filters">
          {FILTERS.map((f) => (
            <button
              key={f.k}
              onClick={() => setFilter(f.k)}
              aria-pressed={filter === f.k}
              className={`min-h-11 shrink-0 whitespace-nowrap rounded-full px-4 py-2.5 font-ui text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange_impact ${
                filter === f.k
                  ? "bg-orange_impact text-ink-900"
                  : "bg-white/5 text-white/70 hover:text-white border border-white/10"
              }`}
              data-testid={`portfolio-filter-${f.k}`}
            >
              {f.l}
            </button>
          ))}
        </div>
      </section>

      <section className="px-4 py-10 pb-32 sm:px-6 sm:py-12 md:px-8">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <p className="py-20 text-center font-ui text-sm text-white/55" role="status" aria-live="polite">
              {lang === "fr" ? "Chargement des projets…" : "Loading projects…"}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
              <AnimatePresence mode="popLayout">
                {filtered.map((p, i) => (
                <motion.div
                  layout
                  key={p.id || p.slug || "project-" + i}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: (i % 4) * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative overflow-hidden rounded-3xl bg-ink-700"
                  data-testid={`portfolio-grid-card-${p.slug}`}
                >
                  <Link to={"/portfolio/" + p.slug} className="block">
                    <PortfolioCover project={p} lang={lang} />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/30 to-transparent" />
                    <div className="absolute bottom-0 inset-x-0 flex items-end justify-between gap-3 p-4 sm:p-6 md:p-8">
                      <div className="min-w-0">
                        <p className="mb-2 break-words font-ui text-[10px] uppercase tracking-[0.2em] text-orange_impact">
                          {getCategoryLabel(p.category, lang)}{p.year ? " · " + p.year : ""}
                        </p>
                        {p.status && <span className="mb-2 inline-flex rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-white/75">{p.status}</span>}
                        <h2 className="break-words font-display text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
                          {p.title || (lang === "fr" ? "Projet" : "Project")}
                        </h2>
                        {p.client && <p className="mt-1 break-words text-xs text-white/55">{p.client}</p>}
                        {p.summary && <p className="mt-2 line-clamp-2 max-w-xl text-sm leading-relaxed text-white/65">{p.summary}</p>}
                        {Array.isArray(p.services) && p.services.length > 0 && (
                          <p className="mt-3 text-[11px] text-white/45">{p.services.slice(0, 2).join(" · ")}</p>
                        )}
                      </div>
                      <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 grid place-items-center group-hover:bg-orange_impact group-hover:text-ink-900 group-hover:border-orange_impact transition-colors shrink-0">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
          {!isLoading && filtered.length === 0 && (
            <p className="py-20 text-center font-ui text-white/50">{t("wk.empty")}</p>
          )}
        </div>
      </section>

      <FinalCTA />
    </main>
  );
}


function normalizePortfolioCategory(category) {
  const value = typeof category === "string" ? category.trim().toLowerCase() : "";
  const aliases = {
    web: "web-design",
    app: "app-development",
    motion: "motion-design",
    photo: "photography",
  };
  return aliases[value] || value;
}

function getCategoryLabel(category, lang) {
  const value = normalizePortfolioCategory(category);
  const labels = {
    branding: lang === "fr" ? "Identité de marque" : "Branding",
    "graphic-design": lang === "fr" ? "Design graphique" : "Graphic Design",
    "web-design": lang === "fr" ? "Design web" : "Web Design",
    "app-development": lang === "fr" ? "Développement d'applications" : "App Development",
    marketing: "Marketing",
    "motion-design": lang === "fr" ? "Motion design" : "Motion Design",
    photography: lang === "fr" ? "Photographie" : "Photography",
  };
  return labels[value] || (category || "");
}

function PortfolioCover({ project, lang }) {
  const [imageFailed, setImageFailed] = useState(false);
  const title = typeof project.title === "string" ? project.title : "";
  const imageUrl = typeof project.cover_image === "string" ? project.cover_image : "";

  return (
    <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-ink-800">
      {imageUrl && !imageFailed ? (
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          decoding="async"
          onError={() => setImageFailed(true)}
          className="h-full w-full object-contain transition-opacity duration-500 group-hover:opacity-90"
        />
      ) : (
        <div className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_25%_20%,rgba(255,135,22,0.28),transparent_38%),radial-gradient(circle_at_80%_80%,rgba(111,29,157,0.4),transparent_42%),linear-gradient(135deg,#17131f,#09090d)] transition-transform duration-700 group-hover:scale-105">
          <span className="font-display text-8xl font-black tracking-tighter text-white/90 md:text-9xl">
            {project.monogram || title.slice(0, 2) || "ID9"}
          </span>
          <span className="absolute left-6 top-6 text-[10px] uppercase tracking-[0.3em] text-white/45">
            {lang === "fr" ? "Impact Digital 9 Agency · Projet" : "Impact Digital 9 Agency · Project"}
          </span>
        </div>
      )}
    </div>
  );
}
