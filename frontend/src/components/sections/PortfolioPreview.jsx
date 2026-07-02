import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import api, { safeArray } from "@/lib/api";
import { fetchPortfolioList } from "@/lib/portfolio";
import RevealText from "@/components/site/RevealText";
import { useI18n } from "@/lib/i18n";

const SPANS = ["md:col-span-8", "md:col-span-4", "md:col-span-4", "md:col-span-8", "md:col-span-6", "md:col-span-6"];

export default function PortfolioPreview() {
  const [items, setItems] = useState([]);
  const { t } = useI18n();

  useEffect(() => {
    // 1) Sanity CMS first
    fetchPortfolioList()
      .then((sanityItems) => {
        const list = safeArray(sanityItems);
        if (list.length) {
          setItems(list.slice(0, 6));
          return;
        }
        // 2) Fallback to FastAPI/MongoDB (legacy data)
        api
          .get("/portfolio")
          .then((r) => setItems(safeArray(r?.data).slice(0, 6)))
          .catch(() => setItems([]));
      })
      .catch(() => setItems([]));
  }, []);

  return (
    <section className="relative py-28 md:py-40 px-4 md:px-8 bg-ink-800/60" data-testid="portfolio-preview">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-6">
              {t("wk.tag")}
            </p>
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.02]">
              {t("wk.h1.pre") && (
                <RevealText as="span" text={t("wk.h1.pre")} className="inline" />
              )}
              {t("wk.h1.pre") && <span>&nbsp;</span>}
              <motion.span
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px" }}
                transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block text-gradient-gold italic pr-2"
              >
                {t("wk.h1.hl")}
              </motion.span>
              {t("wk.h1.post") && <span>&nbsp;</span>}
              {t("wk.h1.post") && (
                <RevealText as="span" text={t("wk.h1.post")} className="inline" delay={0.2} />
              )}
            </h2>
            <RevealText
              as="h2"
              text={t("wk.h2")}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.02] italic"
              delay={0.1}
            />
          </div>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-white/80 hover:text-orange_impact font-ui group"
          >
            <span className="border-b border-white/20 group-hover:border-orange_impact pb-0.5">
              {t("wk.viewAll")}
            </span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
          {items.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, delay: (i % 3) * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative overflow-hidden rounded-3xl bg-ink-700 ${SPANS[i % SPANS.length]}`}
              data-testid={`portfolio-card-${p.slug}`}
            >
              <Link to={`/portfolio/${p.slug}`} className="block">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={p.cover_image}
                    alt={p.title}
                    className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/20 to-transparent opacity-90" />
                <div className="absolute bottom-0 inset-x-0 p-6 md:p-8 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-orange_impact font-ui text-[10px] uppercase tracking-[0.25em] mb-2">
                      {p.category} · {p.year}
                    </p>
                    <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight">{p.title}</h3>
                    <p className="text-white/60 text-sm font-inter mt-1 hidden md:block max-w-lg">
                      {p.summary}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 grid place-items-center group-hover:bg-orange_impact group-hover:text-ink-900 group-hover:border-orange_impact transition-colors shrink-0">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
