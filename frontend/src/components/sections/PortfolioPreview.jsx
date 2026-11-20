import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import api, { safeArray } from "@/lib/api";
import { fetchFeaturedPortfolio } from "@/lib/portfolio";
import RevealText from "@/components/site/RevealText";
import { useI18n } from "@/lib/i18n";
import { getFounderProjects } from "@/lib/founder-projects";

const SPANS = ["md:col-span-8", "md:col-span-4", "md:col-span-4", "md:col-span-8", "md:col-span-6", "md:col-span-6"];

export default function PortfolioPreview() {
  const [items, setItems] = useState([]);
  const { t, lang } = useI18n();

  useEffect(() => {
    let cancelled = false;

    async function loadHomepageProjects() {
      const founderProjects = getFounderProjects(lang);
      let homepageProjects = [];

      // The homepage must prioritize published projects explicitly marked Featured in Sanity.
      try {
        homepageProjects = orderHomepageProjects(await fetchFeaturedPortfolio());
      } catch (error) {
        console.warn("[PortfolioPreview] Sanity featured projects unavailable:", error?.message);
      }

      // Keep the legacy API as a compatibility fallback, but never promote unfeatured records.
      if (!homepageProjects.length) {
        try {
          const response = await api.get("/portfolio");
          const legacyFeatured = safeArray(response?.data).filter(
            (project) => project && project.featured === true
          );
          homepageProjects = orderHomepageProjects(legacyFeatured);
        } catch (error) {
          console.warn("[PortfolioPreview] Legacy portfolio fallback unavailable:", error?.message);
        }
      }

      // Founder-owned products remain a final fallback when no client project is featured.
      if (!homepageProjects.length) {
        homepageProjects = orderHomepageProjects(founderProjects);
      }

      if (!cancelled) setItems(homepageProjects);
    }

    loadHomepageProjects();
    return () => {
      cancelled = true;
    };
  }, [lang]);

  return (
    <section className="relative py-28 md:py-40 px-4 md:px-8 bg-ink-800/60" data-testid="portfolio-preview">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-6">
              {t("wk.tag")}
            </p>
            <h2 className="max-w-5xl font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.04] md:leading-[1.02] text-balance">
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
              className="max-w-5xl font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.04] md:leading-[1.02] italic text-balance"
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
                <div className="aspect-[4/3] sm:aspect-[16/10] overflow-hidden">
                  {p.cover_image ? (
                    <img
                      src={p.cover_image}
                      alt={p.cover_image_alt || p.title || "Impact Digital 9 portfolio project"}
                      loading={i === 0 ? "eager" : "lazy"}
                      decoding="async"
                      data-testid={`portfolio-cover-${p.slug}`}
                      className={
                        p.slug === "rtci-brand-identity-visual-communication"
                          ? "h-full w-full bg-ink-900 object-contain object-center transition-transform duration-700 group-hover:scale-[1.02]"
                          : "h-full w-full object-cover object-center scale-105 transition-transform duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                      }
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center bg-[radial-gradient(circle_at_25%_20%,rgba(255,135,22,0.28),transparent_38%),radial-gradient(circle_at_80%_80%,rgba(111,29,157,0.4),transparent_42%),linear-gradient(135deg,#17131f,#09090d)] group-hover:scale-105 transition-transform duration-700">
                      <span className="font-display text-7xl md:text-8xl font-black tracking-tighter text-white/90">{p.monogram || p.title.slice(0, 2)}</span>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/20 to-transparent opacity-90" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:gap-4 sm:p-6 md:p-8">
                  <div className="min-w-0 flex-1">
                    <p className="mb-2 min-h-[1.2em] break-words font-ui text-[10px] uppercase leading-relaxed tracking-[0.2em] text-orange_impact">
                      {p.category || (lang === "fr" ? "Projet" : "Project")}{p.year ? " · " + p.year : ""}
                    </p>
                    {p.status && (
                      <span className="mb-2 inline-flex max-w-full rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-white/75">
                        {p.status}
                      </span>
                    )}
                    <h3 className="line-clamp-2 min-h-[2.35em] break-words font-display text-xl font-bold leading-[1.15] tracking-tight sm:text-2xl md:text-3xl">
                      {p.title || (lang === "fr" ? "Projet" : "Project")}
                    </h3>
                    <p className="mt-2 line-clamp-3 min-h-[3.9em] max-w-2xl break-words font-inter text-xs leading-[1.3] text-white/70 sm:text-sm">
                      {p.summary || ""}
                    </p>
                  </div>
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 transition-colors group-hover:border-orange_impact group-hover:bg-orange_impact group-hover:text-ink-900 sm:h-12 sm:w-12">
                    <ArrowUpRight className="h-4 w-4" />
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


function orderHomepageProjects(projects) {
  const validProjects = safeArray(projects).filter(
    (project) =>
      project &&
      typeof project.slug === "string" &&
      project.slug.trim() &&
      typeof project.title === "string" &&
      project.title.trim()
  );

  // RTCI is intentionally featured as the lead client case study on the homepage.
  const rtciIndex = validProjects.findIndex(
    (project) => project.slug === "rtci-brand-identity-visual-communication"
  );

  if (rtciIndex > 0) {
    const [rtciProject] = validProjects.splice(rtciIndex, 1);
    validProjects.unshift(rtciProject);
  }

  return validProjects.slice(0, 6);
}
