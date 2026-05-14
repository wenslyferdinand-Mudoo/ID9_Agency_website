import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Custom cursor — dot + ring, magnetic to [data-cursor="..."] elements.
 * Hidden on touch devices. Replaces native cursor.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState("default"); // default | hover | text | hidden
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 320, damping: 28, mass: 0.4 });
  const ry = useSpring(y, { stiffness: 320, damping: 28, mass: 0.4 });

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;
    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-on");

    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e) => {
      const el = e.target;
      if (!(el instanceof Element)) return;
      const interactive = el.closest("a, button, [role='button'], [data-cursor='hover']");
      if (interactive) setVariant("hover");
      else if (el.closest("input, textarea, [contenteditable]")) setVariant("text");
      else setVariant("default");
    };
    const leave = () => setVariant("hidden");
    const enter = () => setVariant("default");

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
      document.documentElement.classList.remove("custom-cursor-on");
    };
  }, [x, y]);

  if (!enabled) return null;

  const ringScale = variant === "hover" ? 1.8 : variant === "text" ? 0.6 : 1;
  const dotScale = variant === "hover" ? 0.3 : variant === "text" ? 1.2 : 1;
  const opacity = variant === "hidden" ? 0 : 1;

  return (
    <>
      {/* Dot — instant follow */}
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 z-[200] pointer-events-none mix-blend-difference"
        style={{ x, y, opacity }}
      >
        <motion.div
          className="w-2 h-2 rounded-full bg-white -translate-x-1/2 -translate-y-1/2"
          animate={{ scale: dotScale }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      </motion.div>
      {/* Ring — spring follow */}
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 z-[200] pointer-events-none mix-blend-difference"
        style={{ x: rx, y: ry, opacity }}
      >
        <motion.div
          className="w-9 h-9 rounded-full border border-white/80 -translate-x-1/2 -translate-y-1/2"
          animate={{ scale: ringScale }}
          transition={{ type: "spring", stiffness: 240, damping: 22 }}
        />
      </motion.div>
    </>
  );
}
