import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect, lazy, Suspense } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import MagneticButton from "@/components/site/MagneticButton";
import FluidGradient from "@/components/site/FluidGradient";
import RevealText from "@/components/site/RevealText";
import { whatsappLink } from "@/lib/brand";
import { useI18n } from "@/lib/i18n";

// Lazy load 3D scene — keeps initial bundle light
const Hero3D = lazy(() => import("@/components/site/Hero3D"));

export default function HeroSection() {
  const ref = useRef(null);
  const { t } = useI18n();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Mount 3D after first paint to keep LCP fast
  const [show3D, setShow3D] = useState(false);
  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = Boolean(navigator.connection && navigator.connection.saveData);
    if (!isDesktop || reducedMotion || saveData) return undefined;

    const id = window.requestIdleCallback
      ? window.requestIdleCallback(() => setShow3D(true), { timeout: 1800 })
      : window.setTimeout(() => setShow3D(true), 900);
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(id);
      else window.clearTimeout(id);
    };
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-[min(900px,100svh)] overflow-hidden pt-28 sm:pt-32 md:pt-40 pb-16 sm:pb-20 px-4 sm:px-6 md:px-8"
      data-testid="hero-section"
    >
      {/* Background layers — z order matters */}
      <FluidGradient intensity={0.55} />
      {show3D && (
        <Suspense fallback={null}>
          <Hero3D className="opacity-80" />
        </Suspense>
      )}
      <div className="absolute inset-0 grid-lines opacity-[0.08] pointer-events-none z-10" />
      {/* Soft vignette to focus center */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 25%, rgba(7,7,7,0.45) 95%)",
        }}
      />

      <motion.div
        style={{ y, opacity }}
        className="relative z-20 mx-auto flex max-w-6xl flex-col items-center text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 sm:mb-8"
        >
          <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-ui uppercase tracking-[0.2em] text-white/80">
            <span className="w-1.5 h-1.5 rounded-full bg-orange_impact animate-pulse" />
            {t("hero.badge")}
          </span>
        </motion.div>

        <h1
          className="mx-auto max-w-6xl font-display font-black tracking-[-0.045em] leading-[0.98] text-[clamp(1.95rem,6.5vw,6.25rem)] text-balance"
          style={{ textShadow: "0 2px 40px rgba(0,0,0,0.4)" }}
        >
          <span className="block">
            <RevealText as="span" text={t("hero.h1.line1a")} className="inline" />
            <span>&nbsp;</span>
            <motion.span
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block text-gradient-gold italic"
            >
              {t("hero.h1.line1b")}
            </motion.span>
          </span>
          <RevealText as="span" text={t("hero.h1.line2")} className="block" delay={0.2} />
          <motion.span
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
            className="block text-gradient-gold italic"
          >
            {t("hero.h1.line3")}
          </motion.span>
          <RevealText as="span" text={t("hero.h1.line4")} className="block" delay={0.55} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.68, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 sm:mt-10 w-full max-w-2xl border-y border-white/10 px-3 py-3 font-ui text-[0.62rem] leading-relaxed sm:text-xs md:text-sm uppercase tracking-[0.12em] sm:tracking-[0.18em] text-orange_impact/90 text-center text-balance"
        >
          {t("hero.capabilities")}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.78, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 sm:mt-7 max-w-2xl px-2 font-inter text-[0.95rem] sm:text-base md:text-lg text-white/70 leading-[1.8] font-light text-balance"
        >
          {t("hero.sub")}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.88, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 sm:mt-7 max-w-2xl px-2 font-display text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-white/90 leading-snug text-balance"
        >
          {t("hero.tagline")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 sm:mt-10 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center"
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
          className="mt-16 sm:mt-20 md:mt-28 w-full"
        >
          <p className="text-white/40 text-xs uppercase tracking-[0.3em] font-ui mb-6 text-center">
            {t("hero.trust")}
          </p>
          <div className="marquee-mask overflow-hidden">
            <div className="flex gap-12 animate-ticker w-max">
              {[
                "MOOJE",
                "MW·EVENT",
                "AKYA·DANCE",
                "MENNHA",
                "CADI",
                "LINE·CREATIONS",
                "RUBY",
                "DÉLICES·DE·DOUTY",
                "NETOO",
                "CDMG",
                "RTCI",
                "MOOJE",
                "MW·EVENT",
                "AKYA·DANCE",
                "MENNHA",
                "CADI",
                "LINE·CREATIONS",
                "RUBY",
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
