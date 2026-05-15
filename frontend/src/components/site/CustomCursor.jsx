import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

/**
 * Premium luxe cursor — Awwwards/Cuberto style.
 * - Outer halo (orange glow, brand color) with soft inertia
 * - Inner precision dot (instant follow)
 * - Hover state: ring expands into a filled gold disc + "VOIR" label for links/buttons
 * - Text state: vertical I-beam
 * - Drag/grab state: "→" arrow on data-cursor="drag"
 * - Hidden on touch devices
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState("default"); // default | hover | text | drag | hidden
  const [label, setLabel] = useState("");

  // Inner dot — instant
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // Outer halo — spring (cinematic inertia)
  const hx = useSpring(x, { stiffness: 180, damping: 22, mass: 0.55 });
  const hy = useSpring(y, { stiffness: 180, damping: 22, mass: 0.55 });
  // Label — slower, premium follow
  const lx = useSpring(x, { stiffness: 120, damping: 20, mass: 0.7 });
  const ly = useSpring(y, { stiffness: 120, damping: 20, mass: 0.7 });

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
      const drag = el.closest("[data-cursor='drag']");
      const customLabel = el.closest("[data-cursor-label]");
      const interactive = el.closest("a, button, [role='button'], [data-cursor='hover']");
      const textEl = el.closest("input, textarea, [contenteditable='true']");
      if (drag) {
        setVariant("drag");
        setLabel(drag.getAttribute("data-cursor-label") || "DRAG");
      } else if (customLabel) {
        setVariant("hover");
        setLabel(customLabel.getAttribute("data-cursor-label") || "");
      } else if (interactive) {
        setVariant("hover");
        setLabel("");
      } else if (textEl) {
        setVariant("text");
        setLabel("");
      } else {
        setVariant("default");
        setLabel("");
      }
    };
    const leave = () => setVariant("hidden");
    const enter = () => setVariant("default");
    const down = () => document.documentElement.classList.add("cursor-pressed");
    const up = () => document.documentElement.classList.remove("cursor-pressed");

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
      document.documentElement.classList.remove("custom-cursor-on");
      document.documentElement.classList.remove("cursor-pressed");
    };
  }, [x, y]);

  if (!enabled) return null;

  // Halo size & state
  const haloSize =
    variant === "hover" ? 64 : variant === "drag" ? 80 : variant === "text" ? 28 : 40;
  const haloOpacity = variant === "hidden" ? 0 : variant === "default" ? 1 : 1;
  const dotOpacity = variant === "hidden" ? 0 : variant === "hover" ? 0 : 1;
  const dotScale = variant === "text" ? 0.5 : 1;

  return (
    <>
      {/* Outer halo — golden glow, springs behind dot */}
      <motion.div
        aria-hidden
        data-testid="custom-cursor-halo"
        className="fixed top-0 left-0 z-[200] pointer-events-none"
        style={{ x: hx, y: hy }}
      >
        <motion.div
          className="rounded-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
          animate={{
            width: haloSize,
            height: haloSize,
            opacity: haloOpacity,
            backgroundColor:
              variant === "hover"
                ? "rgba(255,165,0,0.95)"
                : variant === "drag"
                ? "rgba(255,165,0,0.85)"
                : "rgba(255,165,0,0)",
            borderColor:
              variant === "default"
                ? "rgba(255,200,96,0.9)"
                : variant === "text"
                ? "rgba(255,200,96,0)"
                : "rgba(255,165,0,0)",
            boxShadow:
              variant === "hover"
                ? "0 0 28px 6px rgba(255,165,0,0.55), 0 0 80px 12px rgba(255,107,0,0.35)"
                : variant === "drag"
                ? "0 0 36px 10px rgba(255,165,0,0.45)"
                : "0 0 20px 2px rgba(255,165,0,0.25)",
          }}
          transition={{ type: "spring", stiffness: 260, damping: 24, mass: 0.5 }}
          style={{ borderWidth: 1.5, borderStyle: "solid" }}
        >
          <AnimatePresence mode="popLayout">
            {variant === "hover" && label && (
              <motion.span
                key={label}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="font-display tracking-[0.18em] text-[10px] uppercase text-black"
              >
                {label}
              </motion.span>
            )}
            {variant === "drag" && (
              <motion.span
                key="drag"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-display tracking-[0.18em] text-[10px] uppercase text-black"
              >
                {label || "DRAG"}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Crosshair reticle ticks — luxe signature on default state */}
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 z-[201] pointer-events-none"
        style={{ x: hx, y: hy }}
      >
        <motion.svg
          width="60"
          height="60"
          viewBox="0 0 60 60"
          className="-translate-x-1/2 -translate-y-1/2"
          animate={{
            opacity: variant === "default" ? 0.55 : 0,
            rotate: variant === "default" ? 0 : 45,
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* 4 outer ticks */}
          <line x1="30" y1="2" x2="30" y2="8" stroke="#ffcb60" strokeWidth="1" strokeLinecap="round" />
          <line x1="30" y1="52" x2="30" y2="58" stroke="#ffcb60" strokeWidth="1" strokeLinecap="round" />
          <line x1="2" y1="30" x2="8" y2="30" stroke="#ffcb60" strokeWidth="1" strokeLinecap="round" />
          <line x1="52" y1="30" x2="58" y2="30" stroke="#ffcb60" strokeWidth="1" strokeLinecap="round" />
        </motion.svg>
      </motion.div>

      {/* Inner precision dot — instant follow */}
      <motion.div
        aria-hidden
        data-testid="custom-cursor-dot"
        className="fixed top-0 left-0 z-[202] pointer-events-none"
        style={{ x, y }}
      >
        <motion.div
          className="rounded-full -translate-x-1/2 -translate-y-1/2"
          animate={{
            opacity: dotOpacity,
            scale: dotScale,
            width: variant === "text" ? 2 : 4,
            height: variant === "text" ? 18 : 4,
            backgroundColor: "#ffffff",
            boxShadow: "0 0 8px rgba(255,255,255,0.9)",
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </motion.div>

      {/* Trailing accent — slower, builds depth */}
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 z-[199] pointer-events-none"
        style={{ x: lx, y: ly }}
      >
        <motion.div
          className="rounded-full -translate-x-1/2 -translate-y-1/2"
          animate={{
            opacity: variant === "hidden" ? 0 : 0.25,
            width: variant === "hover" ? 110 : 70,
            height: variant === "hover" ? 110 : 70,
            backgroundColor: "rgba(255,165,0,0.12)",
            filter: "blur(18px)",
          }}
          transition={{ type: "spring", stiffness: 80, damping: 18 }}
        />
      </motion.div>
    </>
  );
}
