import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import RevealText from "@/components/site/RevealText";
import GlowOrb from "@/components/site/GlowOrb";
import FinalCTA from "@/components/sections/FinalCTA";
import { useI18n } from "@/lib/i18n";

const TIMELINE_EN = [
  { y: "2015", t: "Independent creative practice", d: "Wensly begins working independently in design, building practical experience across visual communication and creative production." },
  { y: "2018", t: "Impact Digital 9 is founded", d: "On 1 May 2018, Wensly establishes Impact Digital 9 to bring creative and digital services together under one agency identity." },
  { y: "2021", t: "Training and knowledge sharing", d: "Wensly expands his work into training, sharing practical knowledge and creative methods with learners." },
];

const TIMELINE_FR = [
  { y: "2015", t: "Début de l’activité créative indépendante", d: "Wensly commence à travailler comme designer indépendant et développe une expérience pratique en communication visuelle et production créative." },
  { y: "2018", t: "Fondation d’Impact Digital 9", d: "Le 1er mai 2018, Wensly fonde Impact Digital 9 afin de réunir des services créatifs et digitaux sous une même identité d’agence." },
  { y: "2021", t: "Formation et transmission", d: "Wensly développe également son activité de formateur et partage des connaissances pratiques ainsi que des méthodes créatives." },
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
                alt="Wensly Ferdinand — Founder and Creative Director of Impact Digital 9 Agency"
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

      <section className="px-4 md:px-8 py-16 border-y border-white/[0.07]" aria-label="Experience indicators">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { value: "15+", label: lang === "fr" ? "Identités de marque" : "Brand identities" },
            { value: "5+", label: lang === "fr" ? "Campagnes marketing" : "Marketing campaigns" },
            { value: "25+", label: lang === "fr" ? "Clients accompagnés" : "Clients served" },
          ].map((item) => (
            <div key={item.label} className="border-l-2 border-orange_impact pl-5">
              <p className="font-display text-4xl md:text-5xl font-black tracking-tight text-gradient-gold">{item.value}</p>
              <p className="mt-2 text-sm uppercase tracking-[0.18em] text-white/55">{item.label}</p>
            </div>
          ))}
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
