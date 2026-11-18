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
  const { t, lang } = useI18n();

  const FILTERS = [
    { k: "all", l: t("wk.filters.all") },
    { k: "branding", l: t("wk.filters.branding") },
    { k: "web", l: t("wk.filters.web") },
    { k: "app", l: t("wk.filters.app") },
    { k: "marketing", l: t("wk.filters.marketing") },
    { k: "motion", l: t("wk.filters.motion") },
  ];

  useEffect(() => {
    // Founder products are always visible alongside CMS case studies.
    const founderProjects = getFounderProjects(lang);
    fetchPortfolioList()
      .then((sanityItems) => {
        const list = safeArray(sanityItems);
        if (list.length) {
          setItems([...founderProjects, ...list.filter((item) => !founderProjects.some((project) => project.slug === item.slug))]);
          return;
        }
        api
          .get("/portfolio")
          .then((r) => {
            const legacy = safeArray(r?.data);
            setItems([...founderProjects, ...legacy.filter((item) => !founderProjects.some((project) => project.slug === item.slug))]);
          })
          .catch(() => setItems(founderProjects));
      })
      .catch(() => setItems(founderProjects));
  }, [lang]);

  const filtered = useMemo(() => {
    const list = safeArray(items);
    return filter === "all" ? list : list.filter((p) => p && p.category === filter);
  }, [items, filter]);

  return (
    <main data-testid="portfolio-page" className="pt-32 md:pt-40">
      <section className="px-4 md:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-6">{t("nav.portfolio")}</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.98]">
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

      <section className="px-4 md:px-8 sticky top-[88px] z-30 bg-ink-900/80 backdrop-blur py-5 border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2" data-testid="portfolio-filters">
          {FILTERS.map((f) => (
            <button
              key={f.k}
              onClick={() => setFilter(f.k)}
              className={`px-4 py-2 rounded-full font-ui text-sm transition-colors ${
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

      <section className="px-4 md:px-8 py-12 pb-32">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {filtered.map((p, i) => (
                <motion.div
                  layout
                  key={p.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: (i % 4) * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative overflow-hidden rounded-3xl bg-ink-700"
                  data-testid={`portfolio-grid-card-${p.slug}`}
                >
                  <Link to={`/portfolio/${p.slug}`} className="block">
                    <div className="aspect-[4/3] overflow-hidden bg-ink-800 flex items-center justify-center">
                      {p.cover_image ? (
                        <img
                          src={p.cover_image}
                          alt={p.title}
                          loading="lazy"
                          className="w-full h-full object-contain transition-opacity duration-500 group-hover:opacity-90"
                        />
                      ) : (
                        <div className="w-full h-full grid place-items-center bg-[radial-gradient(circle_at_25%_20%,rgba(255,135,22,0.28),transparent_38%),radial-gradient(circle_at_80%_80%,rgba(111,29,157,0.4),transparent_42%),linear-gradient(135deg,#17131f,#09090d)] group-hover:scale-105 transition-transform duration-700">
                          <span className="font-display text-8xl md:text-9xl font-black tracking-tighter text-white/90">{p.monogram || p.title.slice(0, 2)}</span>
                          <span className="absolute top-6 left-6 text-[10px] uppercase tracking-[0.3em] text-white/45">Impact Digital 9 · Product</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/30 to-transparent" />
                    <div className="absolute bottom-0 inset-x-0 p-6 md:p-8 flex items-end justify-between">
                      <div>
                        <p className="text-orange_impact font-ui text-[10px] uppercase tracking-[0.25em] mb-2">
                          {p.category} · {p.year || "—"}
                        </p>
                        {p.status && <span className="inline-flex mb-2 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-white/75">{p.status}</span>}
                        <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
                          {p.title}
                        </h2>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 grid place-items-center group-hover:bg-orange_impact group-hover:text-ink-900 group-hover:border-orange_impact transition-colors shrink-0">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
          {filtered.length === 0 && (
            <p className="text-white/50 text-center py-20 font-ui">{t("wk.empty")}</p>
          )}
        </div>
      </section>

      <FinalCTA />
    </main>
  );
}
