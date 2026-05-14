import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export default function Counter({ to = 100, suffix = "", duration = 1.8, prefix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const startTime = performance.now();
    let raf;
    const step = (now) => {
      const t = Math.min(1, (now - startTime) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3);
      const v = Math.round(start + (to - start) * eased);
      setVal(v);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}
