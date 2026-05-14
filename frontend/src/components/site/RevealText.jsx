import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * Reveal text word-by-word on view with fade + translate (no clipping wrappers).
 * Robust with italic, gradients, and tight line-heights.
 */
export default function RevealText({
  text,
  as: Tag = "h2",
  className = "",
  delay = 0,
  stagger = 0.05,
  wordClassName = "",
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px" });
  const words = String(text).split(" ");

  return (
    <Tag ref={ref} className={className}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{
            duration: 0.9,
            delay: delay + i * stagger,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={`inline-block ${wordClassName}`}
        >
          {w}
          {i < words.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </Tag>
  );
}
