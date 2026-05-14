import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Instagram } from "lucide-react";
import { BRAND, whatsappLink } from "@/lib/brand";
import Logo from "@/components/site/Logo";

export default function Footer() {
  const loc = useLocation();
  if (loc.pathname.startsWith("/admin")) return null;

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
              Let&rsquo;s build something <span className="text-gradient-gold">undeniable.</span>
            </h2>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center gap-2 bg-orange_impact text-ink-900 font-ui font-semibold px-6 py-3 rounded-full hover:bg-gold_light transition-colors"
              data-testid="footer-cta-contact"
            >
              Start a project <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="md:col-span-2">
            <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-4 font-ui">Pages</p>
            <ul className="space-y-2 font-ui text-sm">
              {[
                ["About", "/about"],
                ["Services", "/services"],
                ["Work", "/portfolio"],
                ["Journal", "/blog"],
                ["Contact", "/contact"],
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
            <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-4 font-ui">Services</p>
            <ul className="space-y-2 font-ui text-sm">
              {["Branding", "Web", "App", "Marketing", "Motion", "AI"].map((s) => (
                <li key={s}>
                  <Link
                    className="text-white/70 hover:text-white transition-colors"
                    to={`/services`}
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-4 font-ui">Contact</p>
            <ul className="space-y-3 font-ui text-sm">
              <li>
                <a href={`mailto:${BRAND.email}`} className="text-white/80 hover:text-orange_impact">
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
              <li>
                <a
                  href={BRAND.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white/80 hover:text-orange_impact"
                >
                  <Instagram className="w-4 h-4" /> {BRAND.instagram}
                </a>
              </li>
              <li className="text-white/50">{BRAND.city}</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-3 text-xs font-ui text-white/40">
          <p>
            © {new Date().getFullYear()} {BRAND.fullName}. All rights reserved.
          </p>
          <p>
            Crafted with obsession in {BRAND.city}. <span className="text-orange_impact">●</span>{" "}
            Available worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
