import { useLocation } from "react-router-dom";
import { Phone, Mail, Clock, Instagram, Facebook } from "lucide-react";
import { BRAND, whatsappLink } from "@/lib/brand";
import { useI18n } from "@/lib/i18n";

/**
 * Thin top contact bar — phone (WhatsApp), email, availability, socials.
 * Hidden on admin routes. Auto-fades when user scrolls.
 */
export default function TopContactBar() {
  const loc = useLocation();
  const { t, lang } = useI18n();
  if (loc.pathname.startsWith("/admin")) return null;

  return (
    <div
      className="hidden lg:block fixed top-0 inset-x-0 z-[51] bg-ink-900/85 backdrop-blur-md border-b border-white/[0.06]"
      data-testid="top-contact-bar"
    >
      <div className="max-w-7xl mx-auto px-6 py-1.5 flex items-center justify-between text-[11px] font-ui text-white/70">
        <div className="flex items-center gap-6">
          <span className="inline-flex items-center gap-1.5">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-orange_impact opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange_impact" />
            </span>
            <Clock className="w-3 h-3" />
            {lang === "fr" ? "Disponible 24/7 — Réponse sous 1h" : "Available 24/7 — Reply within 1h"}
          </span>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 hover:text-orange_impact transition-colors"
            data-testid="topbar-phone"
          >
            <Phone className="w-3 h-3" /> {BRAND.whatsappDisplay}
          </a>
          <a
            href={`mailto:${BRAND.email}`}
            className="hidden md:inline-flex items-center gap-1.5 hover:text-orange_impact transition-colors"
            data-testid="topbar-email"
          >
            <Mail className="w-3 h-3" /> {BRAND.email}
          </a>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-white/40 uppercase tracking-[0.22em]">
            {lang === "fr" ? "Suivez-nous" : "Follow us"}
          </span>
          <a
            href={BRAND.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-orange_impact transition-colors"
            aria-label="Instagram"
            data-testid="topbar-instagram"
          >
            <Instagram className="w-3.5 h-3.5" />
          </a>
          <a
            href={BRAND.facebookUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-orange_impact transition-colors"
            aria-label="Facebook"
            data-testid="topbar-facebook"
          >
            <Facebook className="w-3.5 h-3.5" />
          </a>
          <a
            href={BRAND.tiktokUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-orange_impact transition-colors uppercase tracking-[0.15em] text-[10px] font-semibold"
            aria-label="TikTok"
            data-testid="topbar-tiktok"
          >
            TikTok
          </a>
        </div>
      </div>
    </div>
  );
}
