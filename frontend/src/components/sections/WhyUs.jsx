import { motion } from "framer-motion";
import Counter from "@/components/site/Counter";
import RevealText from "@/components/site/RevealText";
import { useI18n } from "@/lib/i18n";

export default function WhyUs() {
  const { t } = useI18n();

  const STATS = [
    { to: 120, suffix: "+", label: t("why.stat1") },
    { to: 42, suffix: "", label: t("why.stat2") },
    { to: 18, suffix: "", label: t("why.stat3") },
    { to: 7, suffix: " yrs", label: t("why.stat4") },
  ];
  const REASONS = [
    { k: t("why.r1.k"), v: t("why.r1.v") },
    { k: t("why.r2.k"), v: t("why.r2.v") },
    { k: t("why.r3.k"), v: t("why.r3.v") },
    { k: t("why.r4.k"), v: t("why.r4.v") },
    { k: t("why.r5.k"), v: t("why.r5.v") },
    { k: t("why.r6.k"), v: t("why.r6.v") },
  ];

  return (
    <section className="relative py-28 md:py-40 px-4 md:px-8 bg-ink-800/60" data-testid="why-us-section">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-6">
            {t("why.tag")}
          </p>
          <RevealText
            as="h2"
            text={t("why.h1")}
            className="font-display text-4xl md:text-6xl font-black tracking-tighter leading-[1.05] text-balance max-w-4xl"
          />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.7 }}
              className="glass rounded-2xl p-6"
              data-testid={`stat-${i}`}
            >
              <p className="font-display font-black text-5xl md:text-6xl tracking-tighter text-gradient-gold tabular-nums">
                <Counter to={s.to} suffix={s.suffix} />
              </p>
              <p className="text-white/60 font-ui text-sm mt-2">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {REASONS.map((r, i) => (
            <motion.div
              key={r.k}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="relative bg-ink-700/40 border border-white/[0.06] rounded-2xl p-6 hover:border-orange_impact/40 transition-colors"
            >
              <span className="absolute top-6 right-6 text-white/20 font-display font-black tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h4 className="font-display font-bold text-xl tracking-tight pr-8">{r.k}</h4>
              <p className="text-white/60 font-inter text-sm mt-3 leading-relaxed">{r.v}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
