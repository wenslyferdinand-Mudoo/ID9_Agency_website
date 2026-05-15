import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import api from "@/lib/api";
import RevealText from "@/components/site/RevealText";
import FinalCTA from "@/components/sections/FinalCTA";
import { useI18n } from "@/lib/i18n";

export default function PortfolioPage() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const { t } = useI18n();

  const FILTERS = [
    { k: "all", l: t("wk.filters.all") },
    { k: "branding", l: t("wk.filters.branding") },
    { k: "web", l: t("wk.filters.web") },
    { k: "app", l: t("wk.filters.app") },
    { k: "marketing", l: t("wk.filters.marketing") },
    { k: "motion", l: t("wk.filters.motion") },
  ];

  useEffect(() => {
    api.get("/portfolio").then((r) => setItems(r.data)).catch(() => {});
  }, []);

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((p) => p.category === filter)),
    [items, filter]
  );

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
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={p.cover_image}
                        alt={p.title}
                        className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/30 to-transparent" />
                    <div className="absolute bottom-0 inset-x-0 p-6 md:p-8 flex items-end justify-between">
                      <div>
                        <p className="text-orange_impact font-ui text-[10px] uppercase tracking-[0.25em] mb-2">
                          {p.category} · {p.year || "—"}
                        </p>
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
