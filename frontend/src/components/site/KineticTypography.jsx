import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * Kinetic Typography section — huge phrase that slides horizontally
 * based on scroll progress. Pure "wow moment" beat between two sections.
 */
export default function KineticTypography({
  lines = [
    { text: "STRATEGY × DESIGN × IMPACT.", direction: "left" },
    { text: "BRANDS. SYSTEMS. GROWTH.", direction: "right" },
  ],
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const xLeft = useTransform(scrollYProgress, [0, 1], ["20%", "-40%"]);
  const xRight = useTransform(scrollYProgress, [0, 1], ["-30%", "30%"]);

  return (
    <section
      ref={ref}
      className="relative py-32 md:py-48 overflow-hidden bg-ink-900"
      data-testid="kinetic-typography"
      aria-hidden
    >
      {/* atmospheric depth */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background:
            "radial-gradient(900px circle at 50% 50%, rgba(116,48,137,0.25), transparent 60%)",
        }}
      />
      <div className="absolute inset-0 grid-lines opacity-20 pointer-events-none" />

      <div className="relative">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            style={{ x: line.direction === "right" ? xRight : xLeft }}
            className="whitespace-nowrap font-display font-black tracking-[-0.05em] leading-[0.9] text-[clamp(4rem,14vw,14rem)]"
          >
            <span
              className={
                i % 2 === 0
                  ? "text-white"
                  : "text-transparent bg-gradient-to-r from-orange_impact via-gold_light to-orange_impact bg-clip-text italic"
              }
              style={
                i % 2 === 0
                  ? {
                      WebkitTextStroke: "1.5px rgba(255,255,255,0.18)",
                      color: "transparent",
                    }
                  : undefined
              }
            >
              {line.text}
              <span className="text-orange_impact mx-6">●</span>
              {line.text}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
