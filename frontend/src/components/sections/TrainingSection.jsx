import { motion } from "framer-motion";
import { ArrowUpRight, GraduationCap } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { useI18n } from "@/lib/i18n";

export default function TrainingSection() {
  const { t } = useI18n();

  return (
    <section
      className="relative px-4 md:px-8 py-24 md:py-32 overflow-hidden"
      data-testid="training-section"
      aria-labelledby="training-section-title"
    >
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_15%_50%,rgba(116,48,137,0.2),transparent_55%)]" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-7xl mx-auto rounded-[2rem] border border-white/10 bg-ink-800/70 p-8 md:p-14 overflow-hidden"
      >
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="md:col-span-8">
            <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-5 inline-flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              {t("tr.tag")}
            </p>
            <h2
              id="training-section-title"
              className="font-display text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.04] text-balance"
            >
              {t("tr.h2")}
            </h2>
            <p className="mt-6 max-w-2xl font-inter text-white/65 leading-relaxed md:text-lg">
              {t("tr.body")}
            </p>
          </div>
          <div className="md:col-span-4 md:flex md:justify-end">
            <a
              href={BRAND.trainingGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full md:w-auto items-center justify-center gap-3 rounded-full bg-orange_impact px-7 py-4 font-ui font-semibold text-ink-900 transition-colors hover:bg-gold_light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange_impact"
              data-testid="training-group-cta"
            >
              {t("tr.cta")}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
