import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * Marquee divider between sections — large display text scrolling horizontally,
 * with subtle parallax tied to scroll. Use as a signature beat between major beats.
 */
export default function MarqueeDivider({
  items = ["Brand", "Web", "Motion", "Strategy", "Story", "Identity", "Growth"],
  speed = 30,
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-12 md:py-20 border-y border-white/[0.05] bg-ink-900/60"
      data-testid="marquee-divider"
      aria-hidden
    >
      <motion.div style={{ x }} className="flex gap-12 md:gap-20 w-max whitespace-nowrap">
        {[...items, ...items, ...items].map((w, i) => (
          <span
            key={i}
            className="font-display font-black text-[clamp(3rem,8vw,8rem)] tracking-[-0.04em] leading-[1] text-white/[0.06] hover:text-white/[0.15] transition-colors duration-700"
            style={{ animation: `ticker ${speed}s linear infinite` }}
          >
            {w}
            <span className="text-orange_impact/40 mx-3">●</span>
          </span>
        ))}
      </motion.div>
    </section>
  );
}
