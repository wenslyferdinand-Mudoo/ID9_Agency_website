import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import RevealText from "@/components/site/RevealText";
import { useI18n } from "@/lib/i18n";

export default function AboutPreview() {
  const { t } = useI18n();
  return (
    <section className="relative py-28 md:py-40 px-4 md:px-8 overflow-hidden" data-testid="about-preview">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start">
        <div className="md:col-span-5 md:sticky md:top-28">
          <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-6">
            {t("about.tag")}
          </p>
          <RevealText
            as="h2"
            text={t("about.h2")}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.05] text-balance"
          />
        </div>

        <div className="md:col-span-6 md:col-start-7 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[5/4] overflow-hidden rounded-3xl"
          >
            <img
              src="https://images.unsplash.com/photo-1663298172343-9238ba22cd30?auto=format&fit=crop&w=1400&q=80"
              alt="ID9 studio workspace"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/20 to-transparent" />
          </motion.div>

          <p className="font-inter text-lg text-white/70 leading-relaxed font-light">
            {t("about.body")}
          </p>

          <div className="grid grid-cols-3 gap-6 pt-4">
            {[
              { k: t("about.vision.k"), v: t("about.vision.v") },
              { k: t("about.mission.k"), v: t("about.mission.v") },
              { k: t("about.values.k"), v: t("about.values.v") },
            ].map((b) => (
              <div key={b.k}>
                <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.2em] mb-2">
                  {b.k}
                </p>
                <p className="text-white/70 text-sm font-inter leading-relaxed">{b.v}</p>
              </div>
            ))}
          </div>

          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-white hover:text-orange_impact transition-colors font-ui group"
            data-testid="about-preview-cta"
          >
            <span className="border-b border-white/30 group-hover:border-orange_impact transition-colors pb-0.5">
              {t("about.cta")}
            </span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
