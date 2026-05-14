import { motion } from "framer-motion";
import Counter from "@/components/site/Counter";
import RevealText from "@/components/site/RevealText";

const STATS = [
  { to: 120, suffix: "+", label: "Projects shipped" },
  { to: 42, suffix: "", label: "Active retainer clients" },
  { to: 18, suffix: "", label: "Industries served" },
  { to: 7, suffix: " yrs", label: "Building powerful brands" },
];

const REASONS = [
  { k: "International standards", v: "Editorial craft and engineering rigor matched to global agencies." },
  { k: "Result-oriented", v: "Every engagement starts with a number we are accountable to." },
  { k: "Fast delivery", v: "Senior team, no junior buffer, ships in weeks not quarters." },
  { k: "Transparent communication", v: "One Slack/WhatsApp channel. Weekly updates. No silos." },
  { k: "Scalable solutions", v: "Built so your next 10x stage doesn't require rebuilding everything." },
  { k: "Premium creativity", v: "We design the brand you wish existed in your category." },
];

export default function WhyUs() {
  return (
    <section className="relative py-28 md:py-40 px-4 md:px-8 bg-ink-800/60" data-testid="why-us-section">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-6">
            (05) — Why ID9
          </p>
          <RevealText
            as="h2"
            text="Built for founders who refuse forgettable."
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
