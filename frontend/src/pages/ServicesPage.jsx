import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SERVICE_CATALOGUE, SERVICE_ICONS, mergeServices } from "@/lib/services-catalogue";
import api, { safeArray } from "@/lib/api";
import RevealText from "@/components/site/RevealText";
import FinalCTA from "@/components/sections/FinalCTA";
import LeadMagnet from "@/components/sections/LeadMagnet";
import { useI18n } from "@/lib/i18n";

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
        // The local catalogue is the reliable fallback.
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main data-testid="services-page" className="pt-32 md:pt-40">
      <section className="relative px-4 md:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-6">
            {t("nav.services")}
          </p>
          <RevealText
            as="h1"
            text={t("sp.h1")}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.98]"
          />
          <RevealText
            as="h1"
            text={t("sp.h2")}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.98] text-gradient-gold"
            delay={0.1}
          />
          <p className="mt-10 max-w-2xl font-inter text-lg text-white/70 leading-relaxed">
            {t("sp.sub")}
          </p>
        </div>
      </section>

      <section className="px-4 md:px-8 pb-24">
        <div className="max-w-7xl mx-auto space-y-3">
          {services.map((service, index) => {
            const Icon = SERVICE_ICONS[service.icon] || SERVICE_ICONS.Sparkles;
            const title = lang === "fr" && service.title_fr ? service.title_fr : service.title;
            const desc = lang === "fr" && service.desc_fr ? service.desc_fr : service.desc;
            const deliverables =
              lang === "fr" && Array.isArray(service.deliverables_fr)
                ? service.deliverables_fr
                : safeArray(service.deliverables);

            return (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.42, delay: (index % 6) * 0.02, ease: [0.16, 1, 0.3, 1] }}
                className="group relative grid grid-cols-12 gap-4 md:gap-8 items-start border-t border-white/10 py-8 md:py-10 hover:border-orange_impact/40 transition-colors"
                data-testid={"service-row-" + service.slug}
              >
                <p className="col-span-2 md:col-span-1 font-display text-white/30 font-black tabular-nums text-lg md:text-xl">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div className="col-span-10 md:col-span-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-9 h-9 rounded-xl bg-orange_impact/10 border border-orange_impact/30 grid place-items-center text-orange_impact">
                      <Icon className="w-4 h-4" />
                    </span>
                    <h2 className="font-display text-3xl md:text-4xl font-black tracking-tighter group-hover:text-gradient-gold transition-colors">
                      {title}
                    </h2>
                  </div>
                </div>
                <p className="col-span-12 md:col-span-4 text-white/70 font-inter leading-relaxed">
                  {desc}
                </p>
                <ul className="col-span-12 md:col-span-3 flex md:block flex-wrap gap-2 md:gap-1.5">
                  {deliverables.map((deliverable) => (
                    <li
                      key={deliverable}
                      className="text-xs font-ui text-white/55 inline-flex items-center gap-2 md:before:content-['—'] md:before:text-orange_impact md:before:mr-1.5"
                    >
                      <span className="md:hidden text-orange_impact">•</span>
                      {deliverable}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </section>

      <LeadMagnet />
      <FinalCTA />
    </main>
  );
}
