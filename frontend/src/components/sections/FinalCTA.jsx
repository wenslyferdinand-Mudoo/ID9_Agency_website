import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import MagneticButton from "@/components/site/MagneticButton";
import GlowOrb from "@/components/site/GlowOrb";
import { whatsappLink } from "@/lib/brand";

export default function FinalCTA() {
  return (
    <section className="relative py-32 md:py-48 px-4 md:px-8 overflow-hidden" data-testid="final-cta-section">
      <GlowOrb color="#743089" size={900} intensity={0.5} className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <GlowOrb color="#FFA500" size={500} intensity={0.3} className="bottom-0 right-0" delay={0.3} />
      <div className="relative max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black tracking-tighter leading-[0.92] text-[clamp(2.8rem,10vw,9rem)] text-balance"
        >
          Ready to build <br />a brand that <span className="text-gradient-gold italic">truly impacts?</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-10 max-w-xl mx-auto font-inter text-white/65 text-lg"
        >
          One call. One studio. One arc — from ambiguous ambition to compounding outcome.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.8 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-3"
        >
          <MagneticButton to="/contact" variant="primary" testid="final-cta-project">
            Launch my project
            <ArrowUpRight className="w-4 h-4" />
          </MagneticButton>
          <MagneticButton
            href={whatsappLink()}
            variant="secondary"
            testid="final-cta-whatsapp"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp ID9
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
