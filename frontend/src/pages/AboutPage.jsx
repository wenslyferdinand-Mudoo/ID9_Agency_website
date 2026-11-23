import { motion } from "framer-motion";
import { ArrowUpRight, Compass, Layers3, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import RevealText from "@/components/site/RevealText";
import GlowOrb from "@/components/site/GlowOrb";
import FinalCTA from "@/components/sections/FinalCTA";
import { useI18n } from "@/lib/i18n";

const TIMELINE_EN = [
  { y: "2015", t: "Independent creative practice", d: "Wensly begins working independently in design, building practical experience across visual communication and creative production." },
  { y: "2018", t: "Impact Digital 9 is founded", d: "On 1 May 2018, Wensly establishes Impact Digital 9 to bring creative and digital services together under one agency identity." },
  { y: "2021", t: "Knowledge sharing and training", d: "The practice expands into training, helping learners strengthen their creative skills and understand practical digital workflows." },
];

const TIMELINE_FR = [
  { y: "2015", t: "Début de l’activité créative indépendante", d: "Wensly commence à travailler comme designer indépendant et développe une expérience pratique en communication visuelle et production créative." },
  { y: "2018", t: "Fondation d’Impact Digital 9", d: "Le 1er mai 2018, Wensly fonde Impact Digital 9 afin de réunir des services créatifs et digitaux sous une même identité d’agence." },
  { y: "2021", t: "Transmission et formation", d: "L’activité s’étend à la formation afin d’aider les apprenants à renforcer leurs compétences créatives et à comprendre les méthodes de travail digitales." },
];

const PRINCIPLES = [
  { icon: Compass, title: "about.principle1.title", body: "about.principle1.body" },
  { icon: Layers3, title: "about.principle2.title", body: "about.principle2.body" },
  { icon: ShieldCheck, title: "about.principle3.title", body: "about.principle3.body" },
  { icon: Sparkles, title: "about.principle4.title", body: "about.principle4.body" },
];

const DISCIPLINES = [
  ["about.discipline1.title", "about.discipline1.body"],
  ["about.discipline2.title", "about.discipline2.body"],
  ["about.discipline3.title", "about.discipline3.body"],
  ["about.discipline4.title", "about.discipline4.body"],
];

export default function AboutPage() {
  const { t, lang } = useI18n();
  const timeline = lang === "fr" ? TIMELINE_FR : TIMELINE_EN;

  return (
    <main data-testid="about-page" className="pt-32 md:pt-40 pb-0">
      <section className="relative px-4 sm:px-6 md:px-8 pb-20 sm:pb-28 overflow-hidden">
        <GlowOrb color="#743089" size={760} intensity={0.45} className="-top-20 -left-40" />
        <div className="relative max-w-7xl mx-auto">
          <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.24em] mb-5 sm:mb-6">{t("ap.tag")}</p>
          <RevealText as="h1" text={t("ap.h1")} className="max-w-5xl font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.04] md:leading-[0.98] text-balance" />
          <p className="mt-6 sm:mt-8 md:mt-10 max-w-3xl font-inter text-base sm:text-lg md:text-xl text-white/70 leading-relaxed">{t("ap.body")}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/services" className="min-h-12 inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold hover:border-orange_impact/70 transition-colors">
              {t("about.exploreServices")} <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link to="/contact" className="min-h-12 inline-flex items-center gap-2 rounded-full bg-orange_impact px-6 py-3 text-sm font-semibold text-ink-900 hover:bg-gold_light transition-colors">
              {t("ap.workWithUs")} <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 md:px-8 py-16 sm:py-20 bg-ink-800/60">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-5">
            <div className="relative aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden group">
              <img src="/wensly-founder.jpg" alt="Wensly Ferdinand — Founder and Creative Director of Impact Digital 9 Agency" loading="lazy" decoding="async" className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[1500ms] ease-premium" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8">
                <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.25em] mb-2">{t("ap.founderRole")}</p>
                <p className="font-display text-3xl font-bold tracking-tight">Wensly Ferdinand</p>
              </div>
            </div>
          </div>
          <div className="md:col-span-7">
            <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-6">{t("ap.founderNote")}</p>
            <blockquote className="font-display text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter leading-[1.05] text-balance">“{t("ap.founderQuote")}”</blockquote>
            <p className="mt-8 font-inter text-white/70 leading-relaxed">{t("ap.founderBio")}</p>
            <p className="mt-5 font-inter text-white/55 leading-relaxed">{t("about.founderApproach")}</p>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-8 py-16 border-y border-white/[0.07]" aria-label={t("about.experienceLabel")}>
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

      <section className="px-4 md:px-8 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto">
          <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-5">{t("about.principlesEyebrow")}</p>
          <h2 className="font-display text-4xl md:text-6xl font-black tracking-tighter leading-[1.02] text-balance max-w-4xl">{t("about.principlesTitle")}</h2>
          <p className="mt-6 max-w-2xl text-white/60 leading-relaxed">{t("about.principlesIntro")}</p>
          <div className="mt-12 grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {PRINCIPLES.map(({ icon: Icon, title, body }, index) => (
              <motion.article key={title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-7">
                <Icon className="w-6 h-6 text-orange_impact" aria-hidden="true" />
                <h3 className="mt-7 font-display text-xl font-bold">{t(title)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{t(body)}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 md:px-8 py-20 sm:py-24 bg-ink-800/45">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-5">{t("about.disciplinesEyebrow")}</p>
            <h2 className="font-display text-4xl md:text-5xl font-black tracking-tighter leading-tight">{t("about.disciplinesTitle")}</h2>
            <p className="mt-6 text-white/60 leading-relaxed">{t("about.disciplinesIntro")}</p>
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-x-8">
            {DISCIPLINES.map(([title, body], index) => (
              <div key={title} className="border-t border-white/10 py-6">
                <p className="text-orange_impact text-xs font-ui tracking-[0.2em]">0{index + 1}</p>
                <h3 className="mt-3 font-display text-xl font-bold">{t(title)}</h3>
                <p className="mt-2 text-sm text-white/60 leading-relaxed">{t(body)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 md:px-8 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto">
          <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-6">{t("ap.timeline")}</p>
          <RevealText as="h2" text={t("ap.timelineH")} className="font-display text-4xl md:text-6xl font-black tracking-tighter leading-[1.02] text-balance max-w-3xl" />
          <ol className="mt-14 space-y-10 max-w-4xl">
            {timeline.map((item, index) => (
              <motion.li key={item.y} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="grid grid-cols-[4.25rem_minmax(0,1fr)] sm:grid-cols-12 gap-4 sm:gap-6 border-t border-white/10 pt-7 sm:pt-8">
                <p className="font-display font-black text-2xl md:text-3xl tabular-nums text-orange_impact sm:col-span-2">{item.y}</p>
                <div className="min-w-0 sm:col-span-10">
                  <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-tight break-words">{item.t}</h3>
                  <p className="text-white/65 mt-2 font-inter leading-relaxed">{item.d}</p>
                </div>
              </motion.li>
            ))}
          </ol>
          <Link to="/contact" className="mt-12 sm:mt-16 min-h-12 inline-flex items-center justify-center gap-2 bg-orange_impact text-ink-900 font-ui font-semibold px-7 py-3.5 rounded-full hover:bg-gold_light transition-colors">
            {t("ap.workWithUs")} <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
      <FinalCTA />
    </main>
  );
}
