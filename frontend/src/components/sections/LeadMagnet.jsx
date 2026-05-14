import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, Check } from "lucide-react";
import MagneticButton from "@/components/site/MagneticButton";
import GlowOrb from "@/components/site/GlowOrb";
import { whatsappLink } from "@/lib/brand";

export default function LeadMagnet() {
  return (
    <section className="relative py-28 md:py-40 px-4 md:px-8 overflow-hidden" data-testid="lead-magnet-section">
      <GlowOrb color="#FFA500" size={700} intensity={0.4} className="-top-40 left-1/2 -translate-x-1/2" />
      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative glass-strong rounded-[2rem] p-8 md:p-16 overflow-hidden noise-overlay"
        >
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7">
              <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-5 inline-flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" /> Free · 15 minutes · No pitch
              </p>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.04] mb-6 text-balance">
                Book a free strategy session.
              </h2>
              <p className="font-inter text-white/70 leading-relaxed max-w-xl mb-8">
                A 15-minute call with a senior strategist. Walk away with three concrete moves
                to sharpen your positioning, accelerate growth or unblock your launch — no
                strings, no slides.
              </p>
              <ul className="space-y-2.5 text-sm font-ui text-white/80 mb-8">
                {[
                  "Free digital audit of your current brand & site",
                  "3 concrete growth recommendations",
                  "No pitch — call only converts if it's a fit",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-orange_impact/15 border border-orange_impact/40 grid place-items-center">
                      <Check className="w-3 h-3 text-orange_impact" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                <MagneticButton to="/contact" variant="primary" testid="lead-cta-book">
                  Book my session
                  <ArrowUpRight className="w-4 h-4" />
                </MagneticButton>
                <MagneticButton
                  href={whatsappLink("Hello ID9, I'd like my free 15-min strategy session.")}
                  variant="secondary"
                  testid="lead-cta-whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp now
                </MagneticButton>
              </div>
            </div>
            <div className="md:col-span-5 hidden md:block">
              <div className="relative aspect-square rounded-3xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80"
                  alt="Strategy session"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-ink-900/70 to-transparent" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
