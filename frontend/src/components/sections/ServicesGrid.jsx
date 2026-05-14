import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import RevealText from "@/components/site/RevealText";
import { useI18n } from "@/lib/i18n";

function ServiceCard({ s, idx, exploreLabel }) {
  const Icon = Icons[s.icon] || Icons.Sparkles;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: (idx % 4) * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-ink-700/60 border border-white/[0.06] rounded-3xl p-7 overflow-hidden hover:border-violet_premium/50 transition-colors duration-500"
      data-testid={`service-card-${s.slug}`}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(600px circle at var(--mx,50%) var(--my,50%), rgba(255,165,0,0.10), transparent 40%)",
        }}
      />
      <div className="flex items-start justify-between mb-12">
        <div className="w-12 h-12 rounded-2xl bg-orange_impact/10 border border-orange_impact/20 grid place-items-center text-orange_impact group-hover:bg-orange_impact group-hover:text-ink-900 transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-white/30 font-display font-black text-2xl tabular-nums">
          {String(idx + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="font-display text-2xl font-bold tracking-tight mb-2">{s.title}</h3>
      <p className="text-white/60 font-inter text-sm leading-relaxed mb-6 line-clamp-3">{s.desc}</p>
      <Link
        to="/services"
        className="text-xs font-ui uppercase tracking-[0.2em] text-white/50 group-hover:text-orange_impact transition-colors inline-flex items-center gap-1"
      >
        {exploreLabel} <Icons.ArrowUpRight className="w-3 h-3" />
      </Link>
    </motion.div>
  );
}

export default function ServicesGrid() {
  const [services, setServices] = useState([]);
  const { t } = useI18n();

  useEffect(() => {
    api.get("/services").then((r) => setServices(r.data)).catch(() => {});
  }, []);

  return (
    <section className="relative py-28 md:py-40 px-4 md:px-8" data-testid="services-section">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-6">
              {t("svc.tag")}
            </p>
            <RevealText
              as="h2"
              text={t("svc.h1")}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.02]"
            />
            <RevealText
              as="h2"
              text={t("svc.h2")}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.02] text-gradient-gold"
              delay={0.1}
            />
          </div>
          <p className="text-white/60 font-inter text-base max-w-md">
            {t("svc.sub")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {services.map((s, i) => (
            <ServiceCard key={s.slug} s={s} idx={i} exploreLabel={t("svc.explore")} />
          ))}
        </div>
      </div>
    </section>
  );
}
