import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import MagneticButton from "@/components/site/MagneticButton";
import FluidGradient from "@/components/site/FluidGradient";
import RevealText from "@/components/site/RevealText";
import { whatsappLink } from "@/lib/brand";
import { useI18n } from "@/lib/i18n";

export default function HeroSection() {
  const ref = useRef(null);
  const { t } = useI18n();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen overflow-hidden pt-32 md:pt-40 pb-20 px-4 md:px-8"
      data-testid="hero-section"
    >
      <div className="absolute inset-0 grid-lines opacity-30 pointer-events-none z-10" />
      <FluidGradient intensity={1} />

      <motion.div style={{ y, opacity }} className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-ui uppercase tracking-[0.2em] text-white/80">
            <span className="w-1.5 h-1.5 rounded-full bg-orange_impact animate-pulse" />
            {t("hero.badge")}
          </span>
        </motion.div>

        <h1 className="font-display font-black tracking-[-0.04em] leading-[1] text-[clamp(2.4rem,7.5vw,7rem)] text-balance">
          <RevealText as="span" text={t("hero.h1.line1")} className="block" />
          <RevealText as="span" text={t("hero.h1.line2")} className="block" delay={0.2} />
          <motion.span
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
            className="block text-gradient-gold italic pr-2"
          >
            {t("hero.h1.line3")}
          </motion.span>
          <RevealText as="span" text={t("hero.h1.line4")} className="block" delay={0.55} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 font-inter text-base md:text-lg text-white/70 max-w-2xl leading-relaxed font-light"
        >
          {t("hero.sub")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <MagneticButton to="/contact" variant="primary" testid="hero-cta-quote">
            {t("hero.cta.quote")}
            <ArrowUpRight className="w-4 h-4" />
          </MagneticButton>
          <MagneticButton
            href={whatsappLink()}
            variant="secondary"
            testid="hero-cta-whatsapp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Play className="w-4 h-4" />
            {t("hero.cta.whatsapp")}
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.15, duration: 1 }}
          className="mt-20 md:mt-28"
        >
          <p className="text-white/40 text-xs uppercase tracking-[0.3em] font-ui mb-6">
            {t("hero.trust")}
          </p>
          <div className="marquee-mask overflow-hidden">
            <div className="flex gap-12 animate-ticker w-max">
              {[
                "LUMEN",
                "ATLAS·CAPITAL",
                "NOIR",
                "VORTEX",
                "SOLARA",
                "ARIA",
                "FORM/CO",
                "OBSIDIAN",
                "LUMEN",
                "ATLAS·CAPITAL",
                "NOIR",
                "VORTEX",
                "SOLARA",
                "ARIA",
                "FORM/CO",
                "OBSIDIAN",
              ].map((n, i) => (
                <span
                  key={i}
                  className="font-display font-black text-2xl md:text-3xl tracking-tight text-white/30 whitespace-nowrap"
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
