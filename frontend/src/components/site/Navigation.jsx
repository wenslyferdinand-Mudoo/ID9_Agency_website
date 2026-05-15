import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, Languages, Instagram, Facebook, Mail, MessageCircle } from "lucide-react";
import Logo from "@/components/site/Logo";
import { useI18n } from "@/lib/i18n";
import { BRAND, whatsappLink } from "@/lib/brand";

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const { t, lang, toggle } = useI18n();

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  // Auto-close on route change
  useEffect(() => {
    setOpen(false);
  }, [loc.pathname]);

  if (loc.pathname.startsWith("/admin")) return null;

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/about", label: t("nav.about") },
    { to: "/services", label: t("nav.services") },
    { to: "/portfolio", label: t("nav.portfolio") },
    { to: "/blog", label: t("nav.blog") },
    { to: "/contact", label: t("nav.contact") },
  ];

  return (
    <>
      <div className="fixed top-0 inset-x-0 z-50 px-4 md:px-8 pt-4 md:pt-6 lg:pt-10" data-testid="site-navigation">
        <motion.nav
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="glass-strong rounded-full max-w-6xl mx-auto flex items-center justify-between pl-3 pr-3 py-2"
        >
          <Link to="/" className="flex items-center gap-2.5 pl-2" data-testid="nav-logo-link">
            <Logo className="w-9 h-9" />
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-display font-black tracking-tight text-base">
                ID9<span className="text-orange_impact">_</span>AGENCY
              </span>
              <span className="font-ui text-[9px] uppercase tracking-[0.22em] text-white/55 mt-0.5">
                Impact Digital 9
              </span>
            </div>
          </Link>

          <ul className="hidden md:flex items-center gap-1 font-ui text-sm">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === "/"}
                  className={({ isActive }) =>
                    `relative px-4 py-2 rounded-full transition-colors ${
                      isActive ? "text-white" : "text-white/60 hover:text-white"
                    }`
                  }
                  data-testid={`nav-link-${l.to === "/" ? "home" : l.to.replace("/", "")}`}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-full bg-white/8 border border-white/10"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="relative">{l.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="hidden md:inline-flex items-center gap-1.5 text-white/70 hover:text-white text-xs font-ui font-semibold uppercase tracking-[0.15em] px-3 py-2 rounded-full hover:bg-white/5 transition-colors"
              data-testid="nav-lang-toggle"
              title={lang === "en" ? "Passer en français" : "Switch to English"}
            >
              <Languages className="w-3.5 h-3.5" />
              {lang === "en" ? "FR" : "EN"}
            </button>
            <Link
              to="/contact"
              className="hidden md:inline-flex items-center gap-1.5 bg-orange_impact text-ink-900 font-ui font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-gold_light transition-colors"
              data-testid="nav-cta-contact"
            >
              {t("nav.cta")}
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <motion.button
              onClick={() => setOpen((v) => !v)}
              whileTap={{ scale: 0.9 }}
              className="md:hidden touch-target w-11 h-11 grid place-items-center rounded-full bg-white/5 border border-white/10 active:bg-white/10 transition-colors"
              aria-label={open ? "Close menu" : "Open menu"}
              data-testid="nav-mobile-toggle"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </motion.nav>
      </div>

      {/* ============ CINEMATIC FULLSCREEN MOBILE MENU ============ */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden fixed inset-0 z-[60] safe-x"
            data-testid="nav-mobile-panel"
          >
            {/* Background — solid + mesh + blur layers */}
            <motion.div
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.02, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 bg-ink-900"
            >
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  background:
                    "radial-gradient(900px circle at 20% 15%, rgba(255,165,0,0.25), transparent 55%), radial-gradient(700px circle at 85% 90%, rgba(116,48,137,0.35), transparent 55%)",
                }}
              />
              <div className="absolute inset-0 grid-lines opacity-25 pointer-events-none" />
              <div className="noise-overlay absolute inset-0 pointer-events-none" />
            </motion.div>

            {/* Top: close button */}
            <div className="relative pt-6 px-6 safe-top flex justify-between items-center">
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2"
                data-testid="nav-mobile-logo"
              >
                <Logo className="w-9 h-9" />
                <div className="flex flex-col leading-none">
                  <span className="font-display font-black tracking-tight text-base">
                    ID9<span className="text-orange_impact">_</span>AGENCY
                  </span>
                  <span className="font-ui text-[9px] uppercase tracking-[0.22em] text-white/55 mt-0.5">
                    Impact Digital 9
                  </span>
                </div>
              </Link>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setOpen(false)}
                aria-label={lang === "fr" ? "Fermer le menu" : "Close menu"}
                className="touch-target w-12 h-12 grid place-items-center rounded-full glass-strong border border-white/10"
                data-testid="nav-mobile-close"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Main menu items — staggered cinematic reveal */}
            <nav className="relative px-6 mt-12 overflow-y-auto" style={{ maxHeight: "calc(100vh - 240px)" }}>
              <ul className="flex flex-col gap-0">
                {links.map((l, i) => (
                  <motion.li
                    key={l.to}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.15 + i * 0.07,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="border-b border-white/[0.07]"
                  >
                    <NavLink
                      to={l.to}
                      end={l.to === "/"}
                      className={({ isActive }) =>
                        `group flex items-center justify-between py-5 touch-target ${
                          isActive ? "text-orange_impact" : "text-white"
                        }`
                      }
                      data-testid={`nav-mobile-link-${l.to === "/" ? "home" : l.to.replace("/", "")}`}
                    >
                      <span className="font-display font-black tracking-tighter text-[clamp(2rem,9vw,3.5rem)] leading-none">
                        {l.label}
                      </span>
                      <motion.span
                        className="text-white/30 group-hover:text-orange_impact transition-colors"
                        initial={false}
                      >
                        <ArrowUpRight className="w-7 h-7" />
                      </motion.span>
                    </NavLink>
                  </motion.li>
                ))}
              </ul>

              {/* Lang toggle */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="mt-8 flex items-center gap-3"
              >
                <button
                  onClick={toggle}
                  className="touch-target inline-flex items-center gap-2 text-white/80 text-sm font-ui glass rounded-full px-5 py-3 active:scale-95 transition-transform"
                  data-testid="nav-mobile-lang"
                >
                  <Languages className="w-4 h-4" /> {lang === "en" ? "Français" : "English"}
                </button>
              </motion.div>
            </nav>

            {/* Bottom: socials + contact info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-0 inset-x-0 px-6 pb-10 safe-bottom"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-white/55 font-ui text-xs">
                  <span className="relative flex w-1.5 h-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-orange_impact opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange_impact" />
                  </span>
                  {lang === "fr" ? "Disponible 24/7" : "Available 24/7"}
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={whatsappLink()}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="WhatsApp"
                    className="touch-target w-12 h-12 grid place-items-center rounded-full glass border border-white/10 active:scale-95 transition-transform"
                    data-testid="nav-mobile-whatsapp"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </a>
                  <a
                    href={`mailto:${BRAND.email}`}
                    aria-label="Email"
                    className="touch-target w-12 h-12 grid place-items-center rounded-full glass border border-white/10 active:scale-95 transition-transform"
                    data-testid="nav-mobile-email"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                  <a
                    href={BRAND.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="touch-target w-12 h-12 grid place-items-center rounded-full glass border border-white/10 active:scale-95 transition-transform"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href={BRAND.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                    className="touch-target w-12 h-12 grid place-items-center rounded-full glass border border-white/10 active:scale-95 transition-transform"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <Link
                    to="/contact"
                    onClick={() => setOpen(false)}
                    className="touch-target flex-1 inline-flex items-center justify-center gap-2 bg-orange_impact text-ink-900 font-ui font-semibold px-6 py-3 rounded-full active:scale-95 transition-transform ml-auto"
                    data-testid="nav-mobile-cta"
                  >
                    {t("nav.cta")} <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
