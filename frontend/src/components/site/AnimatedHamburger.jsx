import { useRef } from "react";
import { motion, useSpring } from "framer-motion";

/**
 * Premium animated hamburger button — Apple/Stripe-grade.
 * - 3 bars → X (top/bottom rotate ±45°, middle fades + scales out)
 * - Subtle 3D flip (rotateY) during the transition
 * - Spring easing with a light end-bounce
 * - Magnetic effect: follows cursor up to 5px, smooth return
 * - Dynamic micro-shadow while rotating
 */
const BAR_SPRING = { type: "spring", stiffness: 420, damping: 17, mass: 0.8 };

export default function AnimatedHamburger({ open, onClick, label, testId, className = "" }) {
  const ref = useRef(null);
  const mx = useSpring(0, { stiffness: 320, damping: 22 });
  const my = useSpring(0, { stiffness: 320, damping: 22 });

  const handleMouseMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    mx.set(Math.max(-5, Math.min(5, dx * 0.3)));
    my.set(Math.max(-5, Math.min(5, dy * 0.3)));
  };

  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: mx, y: my, perspective: 600 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      animate={{
        boxShadow: open
          ? "0 10px 30px -8px rgba(255,165,0,0.35), 0 4px 14px rgba(0,0,0,0.45)"
          : "0 6px 18px -6px rgba(0,0,0,0.45)",
      }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      aria-label={label}
      aria-expanded={open}
      data-testid={testId}
      className={`touch-target relative w-11 h-11 grid place-items-center rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-md ${className}`}
    >
      <motion.span
        className="relative block w-[18px] h-[14px]"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: open ? [0, 40, 0] : [0, -40, 0] }}
        transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
      >
        {/* top bar */}
        <motion.span
          className="absolute left-0 top-0 h-[2px] w-full rounded-full bg-white"
          animate={open ? { y: 6, rotate: 45 } : { y: 0, rotate: 0 }}
          transition={BAR_SPRING}
        />
        {/* middle bar — fades + scales out */}
        <motion.span
          className="absolute left-0 top-[6px] h-[2px] w-full rounded-full bg-white"
          animate={open ? { opacity: 0, scaleX: 0.15 } : { opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        />
        {/* bottom bar */}
        <motion.span
          className="absolute left-0 bottom-0 h-[2px] w-full rounded-full bg-white"
          animate={open ? { y: -6, rotate: -45 } : { y: 0, rotate: 0 }}
          transition={BAR_SPRING}
        />
      </motion.span>
    </motion.button>
  );
}
