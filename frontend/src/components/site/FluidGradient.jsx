import { motion } from "framer-motion";

/**
 * Animated fluid mesh gradient background.
 * Uses multiple animated radial blobs + a base conic gradient for iridescent look.
 * Pass `intensity` (0-1) to tone down for less prominent sections.
 */
export default function FluidGradient({ intensity = 1, className = "" }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {/* base conic — extremely subtle, gives iridescent direction */}
      <div
        className="absolute -inset-[20%] opacity-[0.18]"
        style={{
          background:
            "conic-gradient(from 90deg at 50% 50%, #743089, #FFA500, #FFCB60, #743089, #9D4BB8, #FFA500, #743089)",
          filter: "blur(140px)",
          opacity: 0.4 * intensity,
        }}
      />

      {/* animated blob 1 — violet */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 900,
          height: 900,
          left: "-15%",
          top: "-10%",
          background:
            "radial-gradient(circle at 50% 50%, rgba(116,48,137,0.65), rgba(7,7,7,0) 65%)",
          filter: "blur(80px)",
          opacity: 0.7 * intensity,
        }}
        animate={{
          x: [0, 120, -40, 0],
          y: [0, 60, -80, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 18, ease: "easeInOut", repeat: Infinity }}
      />

      {/* animated blob 2 — orange */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 700,
          height: 700,
          right: "-10%",
          top: "30%",
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,165,0,0.55), rgba(7,7,7,0) 65%)",
          filter: "blur(80px)",
          opacity: 0.6 * intensity,
        }}
        animate={{
          x: [0, -80, 40, 0],
          y: [0, -60, 100, 0],
          scale: [1, 0.9, 1.15, 1],
        }}
        transition={{ duration: 22, ease: "easeInOut", repeat: Infinity, delay: 1 }}
      />

      {/* animated blob 3 — gold accent */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 500,
          height: 500,
          left: "40%",
          bottom: "-20%",
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,203,96,0.4), rgba(7,7,7,0) 65%)",
          filter: "blur(70px)",
          opacity: 0.5 * intensity,
        }}
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -100, 40, 0],
        }}
        transition={{ duration: 25, ease: "easeInOut", repeat: Infinity, delay: 2 }}
      />

      {/* noise overlay for cinematic grain */}
      <div
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />

      {/* vignette to deepen edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(7,7,7,0.55) 100%)",
        }}
      />
    </div>
  );
}
