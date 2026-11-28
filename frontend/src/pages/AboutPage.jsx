import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import RevealText from "@/components/site/RevealText";
import GlowOrb from "@/components/site/GlowOrb";
import FinalCTA from "@/components/sections/FinalCTA";
import { useI18n } from "@/lib/i18n";
import { ABOUT_CONTENT } from "@/lib/about-content";

export default function AboutPage() {
  const { t, lang } = useI18n();
  const content = ABOUT_CONTENT[lang === "fr" ? "fr" : "en"];

  return (
    <main data-testid="about-page" className="pt-32 md:pt-40 pb-0">
      <section className="relative px-4 sm:px-6 md:px-8 pb-16 sm:pb-24 overflow-hidden">
        <GlowOrb color="#743089" size={760} intensity={0.45} className="-top-20 -left-40" />
        <div className="relative max-w-7xl mx-auto">
          <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.24em] mb-5 sm:mb-6">{t("ap.tag")}</p>
          <RevealText as="h1" text={t("ap.h1")} className="max-w-5xl font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.04] md:leading-[0.98] text-balance" />
          <p className="mt-6 sm:mt-8 md:mt-10 max-w-3xl font-inter text-base sm:text-lg md:text-xl text-white/70 leading-relaxed">{t("ap.body")}</p>
        </div>
      </section>

      <section className="px-4 sm:px-6 md:px-8 py-16 sm:py-20 bg-ink-800/60">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-6">
            <div className="relative aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden group">
              <img src="/wensly-founder.jpg" alt="Wensly Ferdinand — Founder and Creative Director of Impact Digital 9 Agency" className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[time:1500ms] ease-premium" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/20 to-transparent" />
              <div className="absolute -inset-10 opacity-40 pointer-events-none mix-blend-screen" style={{ background: "radial-gradient(circle at 50% 35%, rgba(255,40,80,0.35), transparent 55%)" }} />
              <div className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8">
                <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.25em] mb-2">{t("ap.founderRole")}</p>
                <p className="font-display text-3xl font-bold tracking-tight">Wensly Ferdinand</p>
              </div>
            </div>
          </div>
          <div className="md:col-span-6">
            <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-6">{t("ap.founderNote")}</p>
            <blockquote className="font-display text-3xl md:text-4xl font-black tracking-tighter leading-[1.05] text-balance">{t("ap.founderQuote")}</blockquote>
            <p className="mt-8 font-inter text-white/70 leading-relaxed">{t("ap.founderBio")}</p>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-8 py-16 border-y border-white/[0.07]" aria-label={lang === "fr" ? "Repères d’expérience" : "Experience indicators"}>
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

      <section className="px-4 sm:px-6 md:px-8 py-20 sm:py-28" aria-labelledby="about-vision-title">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6 lg:gap-8">
          {[content.vision, content.mission].map((item, index) => (
            <motion.article key={item.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, delay: index * 0.08 }} className="rounded-3xl border border-white/10 bg-white/[0.025] p-7 sm:p-9 md:p-11">
              <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.25em] mb-5">{item.title}</p>
              <h2 id={index === 0 ? "about-vision-title" : undefined} className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight text-balance">{item.lead}</h2>
              <p className="mt-6 text-white/65 font-inter leading-relaxed">{item.body}</p>
              <p className="mt-7 pt-6 border-t border-white/10 text-white font-medium leading-relaxed">{item.statement}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-6 md:px-8 py-16 sm:py-24 bg-ink-800/50 border-y border-white/[0.06]" aria-labelledby="about-values-title">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12 sm:mb-16">
            <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.25em] mb-5">{lang === "fr" ? "Nos standards" : "Our standards"}</p>
            <h2 id="about-values-title" className="font-display text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter leading-tight">{content.valuesTitle}</h2>
            <p className="mt-5 text-white/60 font-inter text-base sm:text-lg leading-relaxed">{content.valuesIntro}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {content.values.map(([number, title, body]) => (
              <motion.article key={number} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="min-h-full rounded-2xl border border-white/10 bg-ink-900/50 p-6 sm:p-7">
                <p className="font-display text-sm font-bold tracking-[0.2em] text-orange_impact">{number}</p>
                <h3 className="mt-5 font-display text-xl sm:text-2xl font-bold tracking-tight">{title}</h3>
                <p className="mt-3 text-sm sm:text-base text-white/60 leading-relaxed">{body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 md:px-8 py-16 sm:py-24" aria-labelledby="about-framework-title">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-20">
          <div>
            <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.25em] mb-5">{lang === "fr" ? "Notre approche" : "Our approach"}</p>
            <h2 id="about-framework-title" className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-tight">{content.frameworkTitle}</h2>
          </div>
          <ol className="divide-y divide-white/10 border-y border-white/10">
            {content.framework.map(([title, body], index) => (
              <li key={title} className="grid grid-cols-[2.5rem_minmax(0,1fr)] sm:grid-cols-[3rem_minmax(0,1fr)] gap-4 py-5 sm:py-6">
                <span className="font-display text-sm text-orange_impact tabular-nums">0{index + 1}</span>
                <div><h3 className="font-display text-lg sm:text-xl font-bold">{title}</h3><p className="mt-2 text-white/60 leading-relaxed">{body}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-4 sm:px-6 md:px-8 py-20 sm:py-28 border-t border-white/[0.07]" aria-labelledby="about-timeline-title">
        <div className="max-w-7xl mx-auto">
          <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-6">{content.timelineLabel}</p>
          <RevealText as="h2" text={content.timelineTitle} className="font-display text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter leading-[1.02] text-balance max-w-4xl" />
          <ol className="mt-12 sm:mt-16 space-y-0 max-w-5xl">
            {content.timeline.map(([year, title, description], index) => (
              <motion.li
                key={year}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className={`grid grid-cols-[4rem_minmax(0,1fr)] sm:grid-cols-12 gap-4 sm:gap-6 border-t border-white/10 py-7 sm:py-9 ${year === "2026" ? "items-start" : ""}`}
              >
                <p className="font-display font-black text-2xl md:text-3xl tabular-nums text-orange_impact sm:col-span-2 pt-1">{year}</p>
                <div className={`min-w-0 sm:col-span-10 ${year === "2026" ? "rounded-2xl border border-orange_impact/20 bg-white/[0.025] p-5 sm:p-7 md:p-8" : ""}`}>
                  <h3 className={`font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-tight break-words text-balance ${year === "2026" ? "max-w-3xl" : ""}`}>{title}</h3>
                  {Array.isArray(description) ? (
                    <div className="mt-5 sm:mt-6 max-w-4xl space-y-4 sm:space-y-5">
                      {description.map((paragraph, paragraphIndex) => (
                        <p key={paragraphIndex} className="font-inter text-sm sm:text-base text-white/70 leading-7 sm:leading-8 [overflow-wrap:anywhere]">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/65 mt-3 font-inter leading-relaxed max-w-3xl">{description}</p>
                  )}
                </div>
              </motion.li>
            ))}
          </ol>
          <p className="mt-10 font-display text-lg sm:text-xl font-bold text-orange_impact">{content.closing}</p>
          <Link to="/contact" className="mt-10 sm:mt-12 min-h-12 inline-flex items-center justify-center gap-2 bg-orange_impact text-ink-900 font-ui font-semibold px-7 py-3.5 rounded-full hover:bg-gold_light transition-colors">
            {t("ap.workWithUs")} <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
      <FinalCTA />
    </main>
  );
}
