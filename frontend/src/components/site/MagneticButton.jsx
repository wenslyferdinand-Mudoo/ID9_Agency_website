import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

/** Magnetic button — follows cursor subtly. */
export default function MagneticButton({
  as = "button",
  to,
  href,
  children,
  className = "",
  variant = "primary",
  testid,
  ...rest
}) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 });
  const tx = useTransform(sx, (v) => `${v}px`);
  const ty = useTransform(sy, (v) => `${v}px`);

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - (r.left + r.width / 2)) * 0.18);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.18);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    "magnetic-btn relative inline-flex items-center gap-2 font-ui font-semibold rounded-full px-7 py-3.5 transition-colors";
  const variants = {
    primary: "bg-orange_impact text-ink-900 hover:bg-gold_light ring-orange-glow",
    secondary: "glass text-white hover:bg-white/10",
    ghost: "text-white/70 hover:text-white",
  };
  const cls = `${base} ${variants[variant] || variants.primary} ${className}`;

  const inner = (
    <motion.span style={{ x: tx, y: ty }} className="inline-flex items-center gap-2">
      {children}
    </motion.span>
  );

  const sharedHandlers = { onMouseMove: onMove, onMouseLeave: onLeave, ref, className: cls };

  if (to) {
    return (
      <Link to={to} {...sharedHandlers} data-testid={testid} {...rest}>
        {inner}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} {...sharedHandlers} data-testid={testid} {...rest}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" {...sharedHandlers} data-testid={testid} {...rest}>
      {inner}
    </button>
  );
}
