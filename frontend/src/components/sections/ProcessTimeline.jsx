import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import RevealText from "@/components/site/RevealText";
import { useI18n } from "@/lib/i18n";

export default function ProcessTimeline() {
  const ref = useRef(null);
  const { t } = useI18n();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lineH = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);

  const STEPS = [
    { n: "01", k: t("pr.discover"), v: t("pr.discoverV") },
    { n: "02", k: t("pr.strategy"), v: t("pr.strategyV") },
    { n: "03", k: t("pr.design"), v: t("pr.designV") },
    { n: "04", k: t("pr.develop"), v: t("pr.developV") },
    { n: "05", k: t("pr.launch"), v: t("pr.launchV") },
    { n: "06", k: t("pr.scale"), v: t("pr.scaleV") },
  ];

  return (
    <section
      ref={ref}
      className="relative py-28 md:py-40 px-4 md:px-8 overflow-hidden"
      data-testid="process-section"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-4 md:sticky md:top-28 self-start">
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
            className="font-display text-5xl md:text-6xl font-black tracking-tighter leading-[1.02] text-gradient-gold"
            delay={0.1}
          />
          <p className="text-white/60 mt-6 font-inter leading-relaxed max-w-sm">{t("pr.sub")}</p>
        </div>

        <div className="md:col-span-8 relative pl-8 md:pl-16">
          <div className="absolute left-2 md:left-6 top-2 bottom-2 w-px bg-white/8" />
          <motion.div
            style={{ height: lineH }}
            className="absolute left-2 md:left-6 top-2 w-px bg-gradient-to-b from-orange_impact via-violet_premium to-transparent"
          />

          <ul className="space-y-12 md:space-y-16">
            {STEPS.map((s, i) => (
              <motion.li
                key={s.n}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
                data-testid={`process-step-${s.n}`}
              >
                <span className="absolute -left-[26px] md:-left-[44px] top-2 w-3 h-3 rounded-full bg-orange_impact ring-4 ring-ink-900" />
                <p className="text-white/40 font-display font-black text-xs tabular-nums mb-2">
                  STEP / {s.n}
                </p>
                <h3 className="font-display text-3xl md:text-4xl font-black tracking-tighter">
                  {s.k}
                </h3>
                <p className="text-white/65 mt-3 font-inter leading-relaxed max-w-xl">{s.v}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
