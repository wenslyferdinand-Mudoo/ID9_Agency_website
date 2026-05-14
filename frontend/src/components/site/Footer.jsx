import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Instagram, Facebook, Music2 } from "lucide-react";
import { BRAND, whatsappLink } from "@/lib/brand";
import { useI18n } from "@/lib/i18n";
import Logo from "@/components/site/Logo";

export default function Footer() {
  const loc = useLocation();
  const { t } = useI18n();
  if (loc.pathname.startsWith("/admin")) return null;

  const ftH2 = t("ft.h2"); // "Let's build something undeniable."
  // Highlight the last word in gradient
  const words = ftH2.split(" ");
  const lastWord = words.pop();
  const headPart = words.join(" ");

  return (
    <footer
      className="relative bg-ink-900 border-t border-white/5 pt-24 pb-10 px-6 md:px-12 overflow-hidden"
      data-testid="site-footer"
    >
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(circle at center, rgba(116,48,137,0.35) 0%, rgba(7,7,7,0) 70%)",
        }}
      />
      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <Logo className="w-10 h-10" />
              <span className="font-display font-black text-xl tracking-tight">
                ID9<span className="text-orange_impact">_</span>AGENCY
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-black tracking-tighter leading-[1.05] text-balance max-w-md">
              {headPart} <span className="text-gradient-gold">{lastWord}</span>
            </h2>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center gap-2 bg-orange_impact text-ink-900 font-ui font-semibold px-6 py-3 rounded-full hover:bg-gold_light transition-colors"
              data-testid="footer-cta-contact"
            >
              {t("nav.cta")} <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="md:col-span-2">
            <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-4 font-ui">{t("ft.pages")}</p>
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
            <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-4 font-ui">{t("ft.svc")}</p>
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
            <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-4 font-ui">{t("ft.contact")}</p>
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
                  data-testid="footer-whatsapp"
                >
                  WhatsApp · {BRAND.whatsappDisplay}
                </a>
              </li>
              <li className="text-white/50">{BRAND.city}</li>
            </ul>

            <p className="text-white/40 text-xs uppercase tracking-[0.2em] mt-6 mb-3 font-ui">Social</p>
            <div className="flex items-center gap-2">
              <a
                href={BRAND.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 grid place-items-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-orange_impact hover:border-orange_impact/40 transition-colors"
                aria-label="Instagram"
                data-testid="footer-instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={BRAND.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 grid place-items-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-orange_impact hover:border-orange_impact/40 transition-colors"
                aria-label="TikTok"
                data-testid="footer-tiktok"
              >
                <Music2 className="w-4 h-4" />
              </a>
              <a
                href={BRAND.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 grid place-items-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-orange_impact hover:border-orange_impact/40 transition-colors"
                aria-label="Facebook"
                data-testid="footer-facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-3 text-xs font-ui text-white/40">
          <p>
            © {new Date().getFullYear()} {BRAND.fullName}. {t("ft.rights")}
          </p>
          <p>
            {t("ft.crafted")} {BRAND.city}. <span className="text-orange_impact">●</span> {t("ft.worldwide")}
          </p>
        </div>
      </div>
    </footer>
  );
}
