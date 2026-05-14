import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { NAV_LINKS } from "@/lib/brand";
import Logo from "@/components/site/Logo";

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  // hide on admin routes
  if (loc.pathname.startsWith("/admin")) return null;

  return (
    <>
      <div className="fixed top-0 inset-x-0 z-50 px-4 md:px-8 pt-4 md:pt-6" data-testid="site-navigation">
        <motion.nav
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="glass-strong rounded-full max-w-6xl mx-auto flex items-center justify-between pl-3 pr-3 py-2"
        >
          <Link to="/" className="flex items-center gap-2 pl-2" data-testid="nav-logo-link">
            <Logo className="w-8 h-8" />
            <span className="font-display font-black tracking-tight text-base hidden sm:inline">
              ID9<span className="text-orange_impact">_</span>
            </span>
          </Link>

          <ul className="hidden md:flex items-center gap-1 font-ui text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === "/"}
                  className={({ isActive }) =>
                    `relative px-4 py-2 rounded-full transition-colors ${
                      isActive ? "text-white" : "text-white/60 hover:text-white"
                    }`
                  }
                  data-testid={`nav-link-${l.label.toLowerCase()}`}
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
            <Link
              to="/contact"
              className="hidden md:inline-flex items-center gap-1.5 bg-orange_impact text-ink-900 font-ui font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-gold_light transition-colors"
              data-testid="nav-cta-contact"
            >
              Start a project
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden w-10 h-10 grid place-items-center rounded-full bg-white/5 border border-white/10"
              aria-label="Menu"
              data-testid="nav-mobile-toggle"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </motion.nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-40 bg-ink-900/95 backdrop-blur-xl pt-28 px-6"
            data-testid="nav-mobile-panel"
          >
            <ul className="flex flex-col gap-1 font-display text-4xl font-black tracking-tighter">
              {NAV_LINKS.map((l, i) => (
                <motion.li
                  key={l.to}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <NavLink
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="block py-3 border-b border-white/5"
                  >
                    {l.label}
                  </NavLink>
                </motion.li>
              ))}
            </ul>
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-8 inline-flex items-center gap-2 bg-orange_impact text-ink-900 font-ui font-semibold px-6 py-3 rounded-full"
            >
              Start a project <ArrowUpRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
