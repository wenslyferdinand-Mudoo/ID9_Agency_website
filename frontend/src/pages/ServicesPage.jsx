import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import {
  SERVICE_CATALOGUE,
  SERVICE_FAMILIES,
  SERVICE_ICONS,
  mergeServices,
} from "@/lib/services-catalogue";
import api, { safeArray } from "@/lib/api";
import RevealText from "@/components/site/RevealText";
import FinalCTA from "@/components/sections/FinalCTA";
import LeadMagnet from "@/components/sections/LeadMagnet";
import { useI18n } from "@/lib/i18n";

function ServiceCard({ service, index, lang }) {
  const Icon = SERVICE_ICONS[service.icon] || SERVICE_ICONS.Sparkles;
  const title = lang === "fr" && service.title_fr ? service.title_fr : service.title;
  const description = lang === "fr" && service.desc_fr ? service.desc_fr : service.desc;
  const scope = lang === "fr" && Array.isArray(service.scope_fr)
    ? service.scope_fr
    : safeArray(service.scope);
  const deliverables = lang === "fr" && Array.isArray(service.deliverables_fr)
    ? service.deliverables_fr
    : safeArray(service.deliverables);
  const outcome = lang === "fr" && service.outcome_fr ? service.outcome_fr : service.outcome;
  const scopeLabel = lang === "fr" ? "Périmètre d’intervention" : "Scope of work";
  const deliverablesLabel = lang === "fr" ? "Livrables possibles" : "Typical deliverables";
  const outcomeLabel = lang === "fr" ? "Objectif" : "Intended outcome";

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.035, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-[#101012] p-6 md:p-7 transition-colors duration-300 hover:border-orange_impact/35 hover:bg-[#141416]"
      data-testid={"service-card-" + service.slug}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange_impact/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="mb-6 flex items-center justify-between gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-orange_impact/20 bg-orange_impact/[0.08] text-orange_impact">
          <Icon className="h-5 w-5 shrink-0" strokeWidth={1.7} aria-hidden="true" />
        </span>
        <span className="font-display text-sm font-semibold tabular-nums tracking-[0.16em] text-white/30">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <h3 className="mb-3 max-w-xl font-display text-xl font-bold leading-snug tracking-tight text-white md:text-2xl">
        {title}
      </h3>
      <p className="mb-7 text-sm leading-7 text-white/62">{description}</p>

      <div className="mb-6">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-orange_impact/85">
          {scopeLabel}
        </p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {scope.map((item) => (
            <li key={item} className="flex items-start gap-2 text-xs leading-5 text-white/70">
              <span className="mt-[3px] text-orange_impact/75">
                <Check className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {deliverables.length > 0 && (
        <div className="mb-6">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
            {deliverablesLabel}
          </p>
          <div className="flex flex-wrap gap-2">
            {deliverables.map((item) => (
              <span
                key={item}
                className="rounded-md border border-white/[0.08] bg-white/[0.025] px-2.5 py-1.5 text-[11px] leading-4 text-white/55"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {outcome && (
        <div className="mt-auto border-t border-white/[0.08] pt-4">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
            {outcomeLabel}
          </p>
          <p className="text-sm leading-6 text-white/75">{outcome}</p>
        </div>
      )}
    </motion.article>
  );
}

export default function ServicesPage() {
  const [services, setServices] = useState(SERVICE_CATALOGUE);
  const { t, lang } = useI18n();

  useEffect(() => {
    let active = true;
    api
      .get("/services", { timeout: 3500 })
      .then((response) => {
        if (active) setServices(mergeServices(safeArray(response?.data)));
      })
      .catch(() => {
        // The local catalogue remains available if the API is offline.
      });

    return () => {
      active = false;
    };
  }, []);

  const groupedServices = useMemo(
    () => SERVICE_FAMILIES
      .map((family) => ({
        ...family,
        services: services.filter((service) => service.family === family.id),
      }))
      .filter((family) => family.services.length > 0),
    [services]
  );

  const totalLabel = lang === "fr" ? "expertises structurées" : "structured capabilities";
  const familyLabel = lang === "fr" ? "domaines d’intervention" : "practice areas";

  return (
    <main data-testid="services-page" className="pt-32 md:pt-40">
      <section className="relative px-4 pb-16 md:px-8 md:pb-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-6 font-ui text-xs uppercase tracking-[0.3em] text-orange_impact">
            {t("nav.services")}
          </p>
          <RevealText
            as="h1"
            text={t("sp.h1")}
            className="font-display text-5xl font-black leading-[0.98] tracking-tighter md:text-7xl lg:text-8xl"
          />
          <RevealText
            as="h2"
            text={t("sp.h2")}
            className="font-display text-5xl font-black leading-[0.98] tracking-tighter text-gradient-gold md:text-7xl lg:text-8xl"
            delay={0.1}
          />
          <div className="mt-9 flex flex-col gap-8 border-t border-white/10 pt-7 md:mt-10 md:flex-row md:items-end md:justify-between">
            <p className="max-w-2xl font-inter text-base leading-8 text-white/65 md:text-lg">
              {t("sp.sub")}
            </p>
            <div className="flex shrink-0 gap-8 text-xs uppercase tracking-[0.14em] text-white/40">
              <div>
                <span className="mb-1 block font-display text-2xl font-bold tracking-normal text-white">18</span>
                {totalLabel}
              </div>
              <div>
                <span className="mb-1 block font-display text-2xl font-bold tracking-normal text-white">04</span>
                {familyLabel}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 md:px-8 md:pb-32">
        <div className="mx-auto max-w-7xl space-y-20 md:space-y-28">
          {groupedServices.map((family, familyIndex) => (
            <section key={family.id} aria-labelledby={"service-family-" + family.id}>
              <div className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-6 md:mb-10 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl">
                  <p className="mb-3 font-ui text-[10px] uppercase tracking-[0.24em] text-orange_impact/80">
                    {lang === "fr" ? "Domaine" : "Practice area"} / {String(familyIndex + 1).padStart(2, "0")}
                  </p>
                  <h2
                    id={"service-family-" + family.id}
                    className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl"
                  >
                    {lang === "fr" ? family.title_fr : family.title}
                  </h2>
                </div>
                <p className="max-w-xl text-sm leading-7 text-white/50">
                  {lang === "fr" ? family.intro_fr : family.intro}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 md:gap-5">
                {family.services.map((service, index) => (
                  <ServiceCard
                    key={service.slug}
                    service={service}
                    index={index + groupedServices
                      .slice(0, familyIndex)
                      .reduce((count, item) => count + item.services.length, 0)}
                    lang={lang}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="px-4 pb-20 md:px-8 md:pb-28">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.025] p-7 md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <p className="mb-2 font-ui text-[10px] uppercase tracking-[0.22em] text-orange_impact">
              {lang === "fr" ? "Un besoin spécifique ?" : "A specific requirement?"}
            </p>
            <h2 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
              {lang === "fr" ? "Construisons la bonne réponse." : "Let's shape the right solution."}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/55">
              {lang === "fr"
                ? "Chaque mission commence par la compréhension de votre contexte, de vos priorités et du résultat attendu."
                : "Every engagement starts with understanding your context, priorities and the outcome you need."}
            </p>
          </div>
          <a
            href="/contact"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-full bg-orange_impact px-6 py-3 text-sm font-semibold text-ink-900 transition-transform hover:-translate-y-0.5"
          >
            {lang === "fr" ? "Parler de votre projet" : "Discuss your project"}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </section>

      <LeadMagnet />
      <FinalCTA />
    </main>
  );
}
