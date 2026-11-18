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
      className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-ink-700/60 p-7 transition-colors duration-300 hover:border-violet_premium/50"
      data-testid={"service-card-" + s.slug}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(600px circle at var(--mx,50%) var(--my,50%), rgba(255,165,0,0.10), transparent 40%)",
        }}
      />
      <div className="mb-8 flex items-start justify-between">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-orange_impact/20 bg-orange_impact/10 text-orange_impact transition-colors group-hover:bg-orange_impact group-hover:text-ink-900">
          <Icon className="h-5 w-5 shrink-0" strokeWidth={1.7} aria-hidden="true" />
        </span>
        <span className="font-display text-2xl font-black tabular-nums text-white/30">
          {String(idx + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="mb-3 font-display text-xl font-bold leading-snug tracking-tight md:text-2xl">{title}</h3>
      <p className="mb-6 line-clamp-4 font-inter text-sm leading-7 text-white/60">{desc}</p>
      <Link
        to="/services"
        className="inline-flex items-center gap-2 text-[10px] font-ui uppercase tracking-[0.2em] text-white/50 transition-colors group-hover:text-orange_impact"
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
    <section className="relative px-4 py-28 md:px-8 md:py-40" data-testid="services-section">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-6 font-ui text-xs uppercase tracking-[0.3em] text-orange_impact">
              {t("svc.tag")}
            </p>
            <RevealText
              as="h2"
              text={t("svc.h1")}
              className="font-display text-5xl font-black leading-[1.02] tracking-tighter md:text-6xl lg:text-7xl"
            />
            <RevealText
              as="h2"
              text={t("svc.h2")}
              className="font-display text-5xl font-black leading-[1.02] tracking-tighter text-gradient-gold md:text-6xl lg:text-7xl"
              delay={0.1}
            />
          </div>
          <p className="max-w-md font-inter text-base leading-7 text-white/60">{t("svc.sub")}</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm text-white/75 transition-colors hover:border-orange_impact/50 hover:text-white"
          >
            {lang === "fr" ? "Découvrir tous les services" : "Explore all services"}
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
