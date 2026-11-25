import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Phone, FileText, Home } from "lucide-react";
import { BRAND, whatsappLink } from "@/lib/brand";
import { useI18n } from "@/lib/i18n";

/**
 * Native-app feel sticky bottom action bar for mobile.
 * - Hidden on admin routes
 * - Hidden while scrolling down; revealed when scrolling up
 * - Safe-area aware for iPhone home indicator
 * - Quick actions: WhatsApp, Call, Free Quote
 */
export default function MobileBottomBar() {
  const loc = useLocation();
  const { t, lang } = useI18n();
  const [visible, setVisible] = useState(true);
  const lastYRef = useRef(0);

  useEffect(() => {
    lastYRef.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastYRef.current;
      const shouldBeVisible =
        y <= 80 ? true : delta < -4 ? true : delta > 4 ? false : null;

      // Ignore tiny scroll noise; reveal on upward intent and hide on downward intent.
      if (shouldBeVisible !== null) {
        setVisible((current) =>
          current === shouldBeVisible ? current : shouldBeVisible
        );
      }
      lastYRef.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (loc.pathname.startsWith("/admin")) return null;

  // Render outside the application tree so fixed positioning remains tied to
  // the viewport, not an ancestor affected by transform/filter/contain.
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="md:hidden fixed bottom-0 inset-x-0 z-40 safe-bottom px-3 pb-3 pointer-events-none"
          data-testid="mobile-bottom-bar"
        >
          <div className="pointer-events-auto glass-strong rounded-full border border-white/[0.09] shadow-2xl shadow-black/40 flex items-center justify-around p-1.5">
            <Link
              to="/"
              aria-label={lang === "fr" ? "Accueil" : "Home"}
              className="touch-target min-w-0 flex-1 flex flex-col items-center justify-center gap-0.5 px-1 py-2 rounded-full active:bg-white/5 transition-colors"
              data-testid="mbar-home"
            >
              <Home className="w-5 h-5 text-white/80" />
              <span className="font-ui text-[8px] sm:text-[9px] uppercase tracking-[0.04em] text-white/55">
                {lang === "fr" ? "Accueil" : "Home"}
              </span>
            </Link>

            <a
              href={`tel:+${BRAND.whatsappNumber}`}
              aria-label={lang === "fr" ? "Appeler" : "Call"}
              className="touch-target min-w-0 flex-1 flex flex-col items-center justify-center gap-0.5 px-1 py-2 rounded-full active:bg-white/5 transition-colors"
              data-testid="mbar-call"
            >
              <Phone className="w-5 h-5 text-white/80" />
              <span className="font-ui text-[8px] sm:text-[9px] uppercase tracking-[0.04em] text-white/55">
                {lang === "fr" ? "Appeler" : "Call"}
              </span>
            </a>

            {/* Central CTA — WhatsApp (highlighted) */}
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="touch-target -mt-7 h-14 w-14 shrink-0 grid place-items-center rounded-full bg-orange_impact text-ink-900 shadow-lg shadow-orange-500/40 active:scale-95 transition-transform"
              data-testid="mbar-whatsapp"
            >
              <MessageCircle className="w-6 h-6" strokeWidth={2.5} />
            </a>

            <Link
              to="/contact"
              aria-label={lang === "fr" ? "Devis" : "Quote"}
              className="touch-target min-w-0 flex-1 flex flex-col items-center justify-center gap-0.5 px-1 py-2 rounded-full active:bg-white/5 transition-colors"
              data-testid="mbar-quote"
            >
              <FileText className="w-5 h-5 text-white/80" />
              <span className="font-ui text-[8px] sm:text-[9px] uppercase tracking-[0.04em] text-white/55">
                {lang === "fr" ? "Devis" : "Quote"}
              </span>
            </Link>

            <Link
              to="/portfolio"
              aria-label={t("nav.portfolio")}
              className="touch-target min-w-0 flex-1 flex flex-col items-center justify-center gap-0.5 px-1 py-2 rounded-full active:bg-white/5 transition-colors"
              data-testid="mbar-projects"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              <span className="font-ui text-[8px] sm:text-[9px] uppercase tracking-[0.04em] text-white/55">
                {lang === "fr" ? "Projets" : "Work"}
              </span>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
