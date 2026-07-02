import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import Logo from "@/components/site/Logo";

/**
 * Cinematic preloader — logo + counter, ~1.8s.
 * Stores a sessionStorage flag so it only shows once per tab session.
 * Skipped on admin routes.
 */
export default function Preloader() {
  const loc = useLocation();
  const isAdmin = loc.pathname.startsWith("/admin");
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return true;
    if (loc.pathname.startsWith("/admin")) return false;
    return !sessionStorage.getItem("id9_preloaded");
  });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!show || isAdmin) return;
    let raf;
    const start = performance.now();
    const dur = 1700;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      setProgress(Math.round(t * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else {
        setTimeout(() => {
          sessionStorage.setItem("id9_preloaded", "1");
          setShow(false);
        }, 320);
      }
    };
    raf = requestAnimationFrame(tick);
    document.documentElement.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = "";
    };
  }, [show, isAdmin]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[100] bg-ink-900 grid place-items-center"
          data-testid="preloader"
        >
          {/* mesh gradient bg */}
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background:
                "radial-gradient(800px circle at 30% 40%, rgba(116,48,137,0.45), transparent 60%), radial-gradient(700px circle at 70% 70%, rgba(255,165,0,0.30), transparent 60%)",
            }}
          />
          <div className="absolute inset-0 grid-lines opacity-30 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center gap-6"
          >
            <motion.div
              animate={{ rotateY: [0, 12, -12, 0] }}
              transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity }}
              style={{ transformPerspective: 1000 }}
            >
              <Logo className="w-20 h-20" />
            </motion.div>
            <p className="font-display font-black text-2xl tracking-tight">
              ID9<span className="text-orange_impact">_</span>AGENCY
            </p>
            <div className="w-48 h-px bg-white/10 overflow-hidden rounded-full">
              <motion.div
                className="h-full bg-gradient-to-r from-orange_impact via-gold_light to-orange_impact"
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear", duration: 0.05 }}
              />
            </div>
            <p className="text-white/40 font-ui text-xs tabular-nums tracking-[0.3em]">
              {String(progress).padStart(3, "0")} /  100
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
