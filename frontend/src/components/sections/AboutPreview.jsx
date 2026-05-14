import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import RevealText from "@/components/site/RevealText";

export default function AboutPreview() {
  return (
    <section className="relative py-28 md:py-40 px-4 md:px-8 overflow-hidden" data-testid="about-preview">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start">
        <div className="md:col-span-5 md:sticky md:top-28">
          <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-6">
            (01) — About
          </p>
          <RevealText
            as="h2"
            text="A studio for ambitious founders, premium brands and serious operators."
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
            Since 2018, <span className="text-white">ID9_AGENCY</span> has been quietly building
            the digital ecosystems behind some of the most distinctive brands across the
            Caribbean, North America and Europe. We obsess over craft, strategy and outcomes —
            not deliverables.
          </p>

          <div className="grid grid-cols-3 gap-6 pt-4">
            {[
              { k: "Vision", v: "A world where every ambitious brand has an undeniable digital presence." },
              { k: "Mission", v: "Engineer premium digital ecosystems that compound credibility and growth." },
              { k: "Values", v: "Craft. Clarity. Speed. Integrity. Long-term thinking." },
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
              The full ID9 story
            </span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
