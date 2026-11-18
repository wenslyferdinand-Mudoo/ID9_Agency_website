import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import api, { safeArray } from "@/lib/api";
import { SERVICE_CATALOGUE, SERVICE_ICONS, mergeServices } from "@/lib/services-catalogue";
import RevealText from "@/components/site/RevealText";
import { useI18n } from "@/lib/i18n";

function ServiceCard({ s, idx, exploreLabel, lang }) {
  const Icon = SERVICE_ICONS[s.icon] || SERVICE_ICONS.Sparkles;
  const title = lang === "fr" && s.title_fr ? s.title_fr : s.title;
  const desc = lang === "fr" && s.desc_fr ? s.desc_fr : s.desc;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.42, delay: (idx % 4) * 0.025, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-ink-700/60 border border-white/[0.06] rounded-3xl p-7 overflow-hidden hover:border-violet_premium/50 transition-colors duration-300"
      data-testid={"service-card-" + s.slug}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "radial-gradient(600px circle at var(--mx,50%) var(--my,50%), rgba(255,165,0,0.10), transparent 40%)",
        }}
      />
      <div className="flex items-start justify-between mb-10">
        <div className="w-12 h-12 rounded-2xl bg-orange_impact/10 border border-orange_impact/20 grid place-items-center text-orange_impact group-hover:bg-orange_impact group-hover:text-ink-900 transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-white/30 font-display font-black text-2xl tabular-nums">
          {String(idx + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="font-display text-2xl font-bold tracking-tight mb-2">{title}</h3>
      <p className="text-white/60 font-inter text-sm leading-relaxed mb-6 line-clamp-3">{desc}</p>
      <Link
        to="/services"
        className="text-xs font-ui uppercase tracking-[0.2em] text-white/50 group-hover:text-orange_impact transition-colors inline-flex items-center gap-1"
      >
        {exploreLabel} <span aria-hidden="true">↗</span>
      </Link>
    </motion.div>
  );
}

export default function ServicesGrid() {
  const { t, lang } = useI18n();
  const [services, setServices] = useState(SERVICE_CATALOGUE);

  useEffect(() => {
    let active = true;
    api
      .get("/services", { timeout: 3500 })
      .then((response) => {
        if (active) setServices(mergeServices(safeArray(response?.data)));
      })
      .catch(() => {
        // Keep the local catalogue visible when the API is unavailable.
      });

    return () => {
      active = false;
    };
  }, []);

  const featuredServices = services.slice(0, 8);

  return (
    <section className="relative py-28 md:py-40 px-4 md:px-8" data-testid="services-section">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-6">
              {t("svc.tag")}
            </p>
            <RevealText
              as="h2"
              text={t("svc.h1")}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.02]"
            />
            <RevealText
              as="h2"
              text={t("svc.h2")}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.02] text-gradient-gold"
              delay={0.1}
            />
          </div>
          <p className="text-white/60 font-inter text-base max-w-md">{t("svc.sub")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {featuredServices.map((service, index) => (
            <ServiceCard
              key={service.slug}
              s={service}
              idx={index}
              exploreLabel={t("svc.explore")}
              lang={lang}
            />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm text-white/75 hover:border-orange_impact/50 hover:text-white transition-colors"
          >
            {lang === "fr" ? "Découvrir tous les services" : "Explore all services"}
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
