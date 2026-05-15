import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Instagram, Facebook, Music2, Mail, MessageCircle } from "lucide-react";
import { BRAND, whatsappLink } from "@/lib/brand";
import { useI18n } from "@/lib/i18n";
import Logo from "@/components/site/Logo";
import FluidGradient from "@/components/site/FluidGradient";

export default function Footer() {
  const loc = useLocation();
  const { t } = useI18n();
  if (loc.pathname.startsWith("/admin")) return null;

  return (
    <footer
      className="relative bg-ink-900 border-t border-white/5 overflow-hidden"
      data-testid="site-footer"
    >
      {/* Massive signature word */}
      <section className="relative px-4 md:px-8 pt-32 md:pt-48 pb-24 overflow-hidden">
        <FluidGradient intensity={0.55} />

        <div className="relative max-w-7xl mx-auto">
          <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-8">
            (07) — {t("ft.contact")}
          </p>
          <motion.h2
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black tracking-[-0.05em] leading-[0.88] text-[clamp(3.5rem,14vw,15rem)] text-balance"
          >
            Let&rsquo;s build
            <br />
            something <span className="text-gradient-gold italic">undeniable.</span>
          </motion.h2>
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 bg-orange_impact text-ink-900 font-ui font-semibold text-base md:text-lg px-8 py-4 rounded-full hover:bg-gold_light transition-colors"
              data-testid="footer-cta-contact"
            >
              {t("nav.cta")}
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 glass text-white px-7 py-4 rounded-full font-ui font-semibold hover:bg-white/10 transition-colors"
              data-testid="footer-whatsapp"
            >
              <MessageCircle className="w-5 h-5" /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Links + socials */}
      <div className="relative px-6 md:px-12 pb-10 border-t border-white/5 pt-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6">
            <div className="md:col-span-5">
              <div className="flex items-center gap-3 mb-6">
                <Logo className="w-10 h-10" />
                <span className="font-display font-black text-xl tracking-tight">
                  ID9<span className="text-orange_impact">_</span>AGENCY
                </span>
              </div>
              <p className="font-inter text-white/55 max-w-md leading-relaxed text-sm">
                {BRAND.fullName} — premium digital studio for ambitious founders and brands.
                Branding, web, app, marketing & media production.
              </p>
              <p className="text-white/40 font-ui text-xs uppercase tracking-[0.2em] mt-8 mb-3">
                Social
              </p>
              <div className="flex items-center gap-2">
                <a
                  href={BRAND.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 grid place-items-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-orange_impact hover:border-orange_impact/40 hover:bg-orange_impact/5 transition-colors"
                  aria-label="Instagram"
                  data-testid="footer-instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={BRAND.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 grid place-items-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-orange_impact hover:border-orange_impact/40 hover:bg-orange_impact/5 transition-colors"
                  aria-label="TikTok"
                  data-testid="footer-tiktok"
                >
                  <Music2 className="w-4 h-4" />
                </a>
                <a
                  href={BRAND.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 grid place-items-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-orange_impact hover:border-orange_impact/40 hover:bg-orange_impact/5 transition-colors"
                  aria-label="Facebook"
                  data-testid="footer-facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="w-11 h-11 grid place-items-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-orange_impact hover:border-orange_impact/40 hover:bg-orange_impact/5 transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="md:col-span-2">
              <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-4 font-ui">
                {t("ft.pages")}
              </p>
              <ul className="space-y-2 font-ui text-sm">
                {[
                  [t("nav.about"), "/about"],
                  [t("nav.services"), "/services"],
                  [t("nav.portfolio"), "/portfolio"],
                  [t("nav.blog"), "/blog"],
                  [t("nav.contact"), "/contact"],
                ].map(([l, h]) => (
                  <li key={h}>
                    <Link className="text-white/70 hover:text-white transition-colors" to={h}>
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-4 font-ui">
                {t("ft.svc")}
              </p>
              <ul className="space-y-2 font-ui text-sm">
                {["Branding", "Web", "App", "Marketing", "Motion", "AI"].map((s) => (
                  <li key={s}>
                    <Link className="text-white/70 hover:text-white transition-colors" to="/services">
                      {s}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-3">
              <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-4 font-ui">
                {t("ft.contact")}
              </p>
              <ul className="space-y-3 font-ui text-sm">
                <li>
                  <a href={`mailto:${BRAND.email}`} className="text-white/80 hover:text-orange_impact break-all">
                    {BRAND.email}
                  </a>
                </li>
                <li>
                  <a
                    href={whatsappLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-orange_impact"
                  >
                    WhatsApp · {BRAND.whatsappDisplay}
                  </a>
                </li>
                <li className="text-white/50">{BRAND.city}</li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-6 pb-24 md:pb-0 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-3 text-xs font-ui text-white/40">
            <p>
              © {new Date().getFullYear()} {BRAND.fullName}. {t("ft.rights")}
            </p>
            <p>
              {t("ft.designed")} <span className="text-orange_impact">●</span>{" "}
              {t("ft.worldwide")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
