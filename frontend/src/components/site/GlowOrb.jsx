import { motion } from "framer-motion";

/**
 * Animated decorative orb. Use absolute-positioned with custom size/color.
 */
export default function GlowOrb({
  color = "#743089",
  size = 600,
  className = "",
  delay = 0,
  intensity = 0.35,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at center, ${color}${Math.round(intensity * 255)
          .toString(16)
          .padStart(2, "0")} 0%, rgba(7,7,7,0) 70%)`,
      }}
    />
  );
}
