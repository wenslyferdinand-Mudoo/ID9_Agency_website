import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import RevealText from "@/components/site/RevealText";
import GlowOrb from "@/components/site/GlowOrb";
import FinalCTA from "@/components/sections/FinalCTA";
import { useI18n } from "@/lib/i18n";

const TIMELINE_EN = [
  {
    y: "2018",
    t: "Foundation of ID9_AGENCY",
    d: "Impact Digital 9 is founded in Port-au-Prince by Wensly Ferdinand. The studio establishes a vision centered on strategy, precision design, and digital performance.",
  },
  {
    y: "2020",
    t: "International Expansion",
    d: "The agency welcomes its first clients across North America and Europe. ID9 adopts a remote-first and multi-market operational model.",
  },
  {
    y: "2022",
    t: "Studio Structuring",
    d: "The creative ecosystem expands with senior experts in branding, web development, UI/UX, and motion design. The studio begins producing immersive and narrative-driven experiences.",
  },
  {
    y: "2024",
    t: "Premium Positioning",
    d: "ID9_AGENCY becomes a leading digital studio for ambitious founders, premium brands, and companies scaling their digital presence.",
  },
  {
    y: "2025",
    t: "Global Deployment",
    d: "The agency manages projects across multiple continents and builds scalable digital ecosystems focused on visibility, credibility, and growth.",
  },
];

const TIMELINE_FR = [
  {
    y: "2018",
    t: "Fondation d'ID9_AGENCY",
    d: "Création d'Impact Digital 9 à Port-au-Prince par Wensly Ferdinand. Le studio pose les bases d'une approche centrée sur la stratégie, le design de précision et la performance digitale.",
  },
  {
    y: "2020",
    t: "Expansion internationale",
    d: "Les premiers clients en Amérique du Nord et en Europe rejoignent l'agence. ID9 adopte une structure remote-first et développe une approche multi-marché.",
  },
  {
    y: "2022",
    t: "Structuration du studio",
    d: "Renforcement de l'écosystème créatif avec des profils seniors en branding, développement web, UI/UX et motion design. Début des productions immersives et narratives.",
  },
  {
    y: "2024",
    t: "Positionnement premium",
    d: "ID9_AGENCY devient un studio digital de référence pour les fondateurs ambitieux, les marques premium et les entreprises en phase de croissance stratégique.",
  },
  {
    y: "2025",
    t: "Déploiement international",
    d: "L'agence pilote des projets sur plusieurs continents et construit des écosystèmes numériques scalables orientés visibilité, crédibilité et croissance.",
  },
];

export default function AboutPage() {
  const { t, lang } = useI18n();
  const TIMELINE = lang === "fr" ? TIMELINE_FR : TIMELINE_EN;
  return (
    <main data-testid="about-page" className="pt-32 md:pt-40 pb-0">
      <section className="relative px-4 md:px-8 pb-24 overflow-hidden">
        <GlowOrb color="#743089" size={760} intensity={0.45} className="-top-20 -left-40" />
        <div className="relative max-w-7xl mx-auto">
          <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-6 inline-flex items-center gap-2">
            <Sparkles className="w-3 h-3" /> {t("ap.tag")}
          </p>
          <RevealText
            as="h1"
            text={t("ap.h1")}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.98] text-balance max-w-5xl"
          />
          <p className="mt-10 max-w-3xl font-inter text-lg md:text-xl text-white/70 leading-relaxed">
            {t("ap.body")}
          </p>
        </div>
      </section>

      <section className="px-4 md:px-8 py-20 bg-ink-800/60">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-6">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden group">
              <img
                src="/wensly-founder.jpg"
                alt="Wensly Ferdinand — Founder & Creative Director"
                className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/20 to-transparent" />
              {/* signature red halo glow accent */}
              <div
                className="absolute -inset-10 opacity-40 pointer-events-none mix-blend-screen"
                style={{
                  background:
                    "radial-gradient(circle at 50% 35%, rgba(255,40,80,0.35), transparent 55%)",
                }}
              />
              <div className="absolute bottom-8 left-8 right-8">
                <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.25em] mb-2">
                  {t("ap.founderRole")}
                </p>
                <p className="font-display text-3xl font-bold tracking-tight">Wensly Ferdinand</p>
              </div>
            </div>
          </div>
          <div className="md:col-span-6">
            <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-6">
              {t("ap.founderNote")}
            </p>
            <blockquote className="font-display text-3xl md:text-4xl font-black tracking-tighter leading-[1.05] text-balance">
              {t("ap.founderQuote")}
            </blockquote>
            <p className="mt-8 font-inter text-white/70 leading-relaxed">{t("ap.founderBio")}</p>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-8 py-28">
        <div className="max-w-7xl mx-auto">
          <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-6">
            {t("ap.timeline")}
          </p>
          <RevealText
            as="h2"
            text={t("ap.timelineH")}
            className="font-display text-4xl md:text-6xl font-black tracking-tighter leading-[1.02] text-balance max-w-3xl"
          />
          <ul className="mt-14 space-y-10 max-w-4xl">
            {TIMELINE.map((it, i) => (
              <motion.li
                key={it.y}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="grid grid-cols-12 gap-6 border-t border-white/10 pt-8"
              >
                <p className="col-span-3 md:col-span-2 font-display font-black text-2xl md:text-3xl tabular-nums text-orange_impact">
                  {it.y}
                </p>
                <div className="col-span-9 md:col-span-10">
                  <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
                    {it.t}
                  </h3>
                  <p className="text-white/65 mt-2 font-inter leading-relaxed">{it.d}</p>
                </div>
              </motion.li>
            ))}
          </ul>
          <Link
            to="/contact"
            className="mt-16 inline-flex items-center gap-2 bg-orange_impact text-ink-900 font-ui font-semibold px-7 py-3.5 rounded-full hover:bg-gold_light transition-colors"
          >
            {t("ap.workWithUs")} <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <FinalCTA />
    </main>
  );
}
