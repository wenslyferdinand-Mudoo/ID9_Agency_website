import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown, Sparkles, Target, Palette, Code2, Rocket, TrendingUp } from "lucide-react";
import RevealText from "@/components/site/RevealText";
import { useI18n } from "@/lib/i18n";

/**
 * System Architecture Flow — premium reframing of the "process".
 * Layered system, not linear steps. Each layer = Purpose / Output / Impact.
 */
export default function ProcessTimeline() {
  const ref = useRef(null);
  const { t } = useI18n();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lineH = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);

  const LAYERS = [
    {
      n: "01",
      icon: Sparkles,
      k: t("pr.discover"),
      v: t("pr.discoverV"),
      impact: t("pr.impact01"),
    },
    {
      n: "02",
      icon: Target,
      k: t("pr.strategy"),
      v: t("pr.strategyV"),
      impact: t("pr.impact02"),
    },
    {
      n: "03",
      icon: Palette,
      k: t("pr.design"),
      v: t("pr.designV"),
      impact: t("pr.impact03"),
    },
    {
      n: "04",
      icon: Code2,
      k: t("pr.develop"),
      v: t("pr.developV"),
      impact: t("pr.impact04"),
    },
    {
      n: "05",
      icon: Rocket,
      k: t("pr.launch"),
      v: t("pr.launchV"),
      impact: t("pr.impact05"),
    },
    {
      n: "06",
      icon: TrendingUp,
      k: t("pr.scale"),
      v: t("pr.scaleV"),
      impact: t("pr.impact06"),
    },
  ];

  return (
    <section
      ref={ref}
      className="relative py-28 md:py-40 px-4 md:px-8 overflow-hidden"
      data-testid="process-section"
    >
      {/* Subtle ambient mesh */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(700px circle at 80% 10%, rgba(255,165,0,0.10), transparent 60%), radial-gradient(700px circle at 10% 80%, rgba(116,48,137,0.18), transparent 60%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-4 md:sticky md:top-32 self-start">
          <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-6">
            {t("pr.tag")}
          </p>
          <RevealText
            as="h2"
            text={t("pr.h1")}
            className="font-display text-5xl md:text-6xl font-black tracking-tighter leading-[1.02]"
          />
          <RevealText
            as="h2"
            text={t("pr.h2")}
            className="font-display text-5xl md:text-6xl font-black tracking-tighter leading-[1.02] text-gradient-gold italic"
            delay={0.1}
          />
          <p className="text-white/65 mt-6 font-inter leading-relaxed max-w-sm text-balance">
            {t("pr.sub")}
          </p>

          {/* Flow diagram (vertical) */}
          <div className="hidden md:flex flex-col gap-2 mt-10 text-[10px] font-ui uppercase tracking-[0.22em] text-white/40">
            <span>Input</span>
            <ArrowDown className="w-3 h-3 text-orange_impact/60" />
            <span>Strategy</span>
            <ArrowDown className="w-3 h-3 text-orange_impact/60" />
            <span>Design</span>
            <ArrowDown className="w-3 h-3 text-orange_impact/60" />
            <span>Engineering</span>
            <ArrowDown className="w-3 h-3 text-orange_impact/60" />
            <span>Launch</span>
            <ArrowDown className="w-3 h-3 text-orange_impact/60" />
            <span className="text-orange_impact">Growth</span>
          </div>
        </div>

        <div className="md:col-span-8 relative pl-8 md:pl-16">
          <div className="absolute left-2 md:left-6 top-2 bottom-2 w-px bg-white/[0.08]" />
          <motion.div
            style={{ height: lineH }}
            className="absolute left-2 md:left-6 top-2 w-px bg-gradient-to-b from-orange_impact via-violet_premium to-transparent"
          />

          <ul className="space-y-14 md:space-y-20">
            {LAYERS.map((layer, i) => {
              const Icon = layer.icon;
              return (
                <motion.li
                  key={layer.n}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="relative"
                  data-testid={`process-step-${layer.n}`}
                >
                  {/* Node on timeline */}
                  <span className="absolute -left-[30px] md:-left-[48px] top-2 w-4 h-4 rounded-full bg-orange_impact ring-4 ring-ink-900 grid place-items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-ink-900" />
                  </span>

                  {/* Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <Icon className="w-5 h-5 text-orange_impact" />
                    <p className="text-white/40 font-display font-black text-xs tabular-nums tracking-wider">
                      LAYER · {layer.n}
                    </p>
                  </div>

                  {/* Layer name */}
                  <h3 className="font-display text-3xl md:text-5xl font-black tracking-tighter leading-[1]">
                    {layer.k}
                  </h3>

                  {/* Purpose + Output description */}
                  <p className="text-white/75 mt-5 font-inter leading-relaxed max-w-2xl text-base md:text-lg">
                    {layer.v}
                  </p>

                  {/* Impact tag */}
                  <div className="mt-5 inline-flex items-center gap-3 glass rounded-full px-4 py-2">
                    <span className="text-orange_impact font-ui text-[10px] uppercase tracking-[0.22em] font-semibold">
                      {t("pr.impact")}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-orange_impact/50" />
                    <span className="font-ui text-sm text-white/85">{layer.impact}</span>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
