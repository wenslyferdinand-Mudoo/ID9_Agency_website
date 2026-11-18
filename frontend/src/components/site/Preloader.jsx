import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import Logo from "@/components/site/Logo";

/**
 * Lightweight first-visit preloader.
 * Avoids per-frame React state updates and releases scroll quickly.
 */
export default function Preloader() {
  const loc = useLocation();
  const isAdmin = loc.pathname.startsWith("/admin");
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined" || loc.pathname.startsWith("/admin")) return false;
    try {
      return !window.sessionStorage.getItem("id9_preloaded");
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!show || isAdmin) return undefined;

    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeout = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem("id9_preloaded", "1");
      } catch {
        // Storage can be unavailable in private browsing contexts.
      }
      setShow(false);
    }, reducedMotion ? 0 : 480);

    return () => {
      window.clearTimeout(timeout);
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [show, isAdmin]);

  return (
    <AnimatePresence>
      {show && !isAdmin && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[100] bg-ink-900 grid place-items-center"
          data-testid="preloader"
          aria-label="Loading Impact Digital 9 Agency"
          role="status"
        >
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(800px circle at 30% 40%, rgba(116,48,137,0.38), transparent 60%), radial-gradient(700px circle at 70% 70%, rgba(255,165,0,0.24), transparent 60%)",
            }}
          />
          <div className="absolute inset-0 grid-lines opacity-20 pointer-events-none" />
          <div className="relative flex flex-col items-center gap-5">
            <Logo className="w-16 h-16" />
            <p className="font-display font-black text-xl tracking-tight">
              ID9<span className="text-orange_impact">_</span>AGENCY
            </p>
            <div className="w-40 h-px bg-white/10 overflow-hidden rounded-full">
              <motion.div
                className="h-full bg-gradient-to-r from-orange_impact via-gold_light to-orange_impact"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
