import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import RevealText from "@/components/site/RevealText";
import { useI18n } from "@/lib/i18n";

const PREVIEW_COPY = {
  en: {
    vision: "An ecosystem where ambitious brands can be understood, trusted and built to evolve.",
    mission: "We connect strategy, identity, creativity and technology into purposeful digital experiences.",
    values: "Strategic clarity · Execution excellence · Intentional innovation · Integrity · Agility · Long-term thinking · Meaningful impact.",
  },
  fr: {
    vision: "Un écosystème où les marques ambitieuses peuvent être comprises, reconnues et conçues pour évoluer.",
    mission: "Nous relions stratégie, identité, créativité et technologie au sein d’expériences digitales porteuses de sens.",
    values: "Clarté stratégique · Excellence d’exécution · Innovation intentionnelle · Intégrité · Agilité · Vision à long terme · Impact concret.",
  },
};

export default function AboutPreview() {
  const { t, lang } = useI18n();
  const copy = PREVIEW_COPY[lang === "fr" ? "fr" : "en"];
  return (
    <section className="relative py-20 sm:py-28 md:py-40 px-5 sm:px-6 md:px-8 overflow-hidden" data-testid="about-preview">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-9 sm:gap-10 md:gap-16 items-start">
        <div className="md:col-span-5 md:sticky md:top-28">
          <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-6">{t("about.tag")}</p>
          <RevealText as="h2" text={t("about.h2")} className="max-w-2xl font-display text-[clamp(2rem,7.5vw,3rem)] md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.08] md:leading-[1.02] text-balance" />
        </div>
        <div className="md:col-span-6 md:col-start-7 space-y-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="relative aspect-[4/3] sm:aspect-[5/4] overflow-hidden rounded-2xl sm:rounded-3xl">
            <img src="https://images.unsplash.com/photo-1663298172343-9238ba22cd30?auto=format&fit=crop&w=1400&q=80" alt={lang === "fr" ? "Espace de création représentant le travail de design et de production digitale d’Impact Digital 9 Agency" : "Creative workspace representing the design and digital production work of Impact Digital 9 Agency"} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/20 to-transparent" />
          </motion.div>
          <p className="max-w-3xl font-inter text-base sm:text-lg text-white/70 leading-relaxed font-light">{t("about.body")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-5 lg:gap-6 pt-2 sm:pt-4">
            {[
              { k: lang === "fr" ? "Vision" : "Vision", v: copy.vision },
              { k: lang === "fr" ? "Mission" : "Mission", v: copy.mission },
              { k: lang === "fr" ? "Valeurs" : "Values", v: copy.values },
            ].map((item) => (
              <div key={item.k}>
                <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.2em] mb-2">{item.k}</p>
                <p className="text-white/70 text-sm font-inter leading-relaxed">{item.v}</p>
              </div>
            ))}
          </div>
          <Link to="/about" className="inline-flex min-h-11 items-center gap-2 py-2 text-white hover:text-orange_impact transition-colors font-ui group" data-testid="about-preview-cta">
            <span className="border-b border-white/30 group-hover:border-orange_impact transition-colors pb-0.5">{t("about.cta")}</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
