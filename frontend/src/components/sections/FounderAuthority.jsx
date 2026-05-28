import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Quote, MessageCircle } from "lucide-react";
import RevealText from "@/components/site/RevealText";
import { useI18n } from "@/lib/i18n";
import { whatsappLink } from "@/lib/brand";

/**
 * Founder Authority — editorial section.
 * Bold intellectual statement + market critique + positioning pillars.
 * Designed to feel like a Stripe / Linear founder essay block.
 */
export default function FounderAuthority() {
  const ref = useRef(null);
  const { t } = useI18n();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 1.03]);

  const PILLARS = [
    { k: t("fa.pillar1.k"), v: t("fa.pillar1.v") },
    { k: t("fa.pillar2.k"), v: t("fa.pillar2.v") },
    { k: t("fa.pillar3.k"), v: t("fa.pillar3.v") },
    { k: t("fa.pillar4.k"), v: t("fa.pillar4.v") },
  ];

  return (
    <section
      ref={ref}
      className="relative py-28 md:py-40 px-4 md:px-8 overflow-hidden bg-ink-900"
      data-testid="founder-authority"
    >
      {/* Ambient atmosphere */}
      <div
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{
          background:
            "radial-gradient(900px circle at 85% 30%, rgba(255,165,0,0.12), transparent 55%), radial-gradient(800px circle at 10% 80%, rgba(116,48,137,0.22), transparent 55%)",
        }}
      />
      <div className="absolute inset-0 noise-overlay opacity-50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          {/* ============ LEFT: Portrait + signature ============ */}
          <div className="md:col-span-5 md:sticky md:top-32 self-start">
            <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-6">
              {t("fa.tag")}
            </p>

            <div className="relative rounded-3xl overflow-hidden bg-ink-800 aspect-[4/5] md:aspect-[3/4] max-w-md">
              <motion.div
                style={{ y: imgY, scale: imgScale }}
                className="absolute inset-0"
              >
                <img
                  src="/wensly-founder.jpg"
                  alt={t("fa.signature")}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
              {/* Vignette + frame */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-transparent to-transparent" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/[0.07] rounded-3xl pointer-events-none" />

              {/* Floating Quote icon */}
              <div className="absolute top-5 left-5 w-11 h-11 grid place-items-center rounded-full glass-strong">
                <Quote className="w-5 h-5 text-orange_impact" />
              </div>

              {/* Signature block */}
              <div className="absolute bottom-0 inset-x-0 p-6 md:p-7">
                <p className="font-display text-2xl md:text-3xl font-black tracking-tight">
                  {t("fa.signature")}
                </p>
                <p className="font-ui text-xs uppercase tracking-[0.22em] text-white/60 mt-1.5">
                  {t("fa.role")}
                </p>
              </div>
            </div>
          </div>

          {/* ============ RIGHT: Editorial statement ============ */}
          <div className="md:col-span-7 space-y-12">
            {/* Eyebrow */}
            <p className="font-ui text-xs uppercase tracking-[0.3em] text-white/45">
              {t("fa.eyebrow")}
            </p>

            {/* Headline */}
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-black tracking-[-0.03em] leading-[1.02] text-balance">
              <RevealText as="span" text={t("fa.h1")} className="block" />
              <RevealText as="span" text={t("fa.h2")} className="block text-white/55" delay={0.1} />
              <motion.span
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="block text-gradient-gold italic"
              >
                {t("fa.h3")}
              </motion.span>
            </h2>

            {/* Body paragraphs */}
            <div className="space-y-7 font-inter text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                {t("fa.body1")}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {t("fa.body2")}
              </motion.p>
            </div>

            {/* Pillars grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-6 border-t border-white/[0.07]">
              {PILLARS.map((p, i) => (
                <motion.div
                  key={p.k}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="glass rounded-2xl p-6 hover:bg-white/[0.04] transition-colors"
                  data-testid={`founder-pillar-${i}`}
                >
                  <p className="text-orange_impact font-ui text-[10px] uppercase tracking-[0.28em] mb-3 font-semibold">
                    — {p.k}
                  </p>
                  <p className="font-display text-lg md:text-xl font-bold tracking-tight leading-snug text-balance">
                    {p.v}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-orange_impact text-ink-900 font-ui font-semibold px-6 py-3.5 rounded-full hover:bg-gold_light transition-colors group"
                data-testid="founder-cta-philosophy"
              >
                {t("fa.cta")}
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 glass-strong text-white/90 font-ui font-semibold px-6 py-3.5 rounded-full hover:bg-white/[0.06] transition-colors"
                data-testid="founder-cta-talk"
              >
                <MessageCircle className="w-4 h-4" /> {t("fa.cta2")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
