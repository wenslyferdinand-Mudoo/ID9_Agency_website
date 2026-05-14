import { motion, useScroll, useSpring } from "framer-motion";

/** Slim top scroll progress bar with brand gradient. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      data-testid="scroll-progress"
      className="fixed top-0 inset-x-0 h-[2px] z-[60] origin-left bg-gradient-to-r from-orange_impact via-gold_light to-violet_glow"
      style={{ scaleX }}
    />
  );
}
