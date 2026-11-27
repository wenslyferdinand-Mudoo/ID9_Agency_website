import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

const COPY = {
  en: {
    title: "Page not found",
    text: "The page you are looking for does not exist or has moved.",
    home: "Back to home",
    contact: "Contact us",
  },
  fr: {
    title: "Page introuvable",
    text: "La page que vous cherchez n’existe pas ou a été déplacée.",
    home: "Retour à l’accueil",
    contact: "Nous contacter",
  },
};

export default function NotFoundPage() {
  const { lang } = useI18n();
  const t = COPY[lang] || COPY.en;

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${t.title} | Impact Digital 9 Agency`;
    const meta = document.createElement("meta");
    meta.setAttribute("name", "robots");
    meta.setAttribute("content", "noindex, follow");
    meta.setAttribute("data-route-seo", "not-found");
    document.head.appendChild(meta);
    return () => {
      document.title = previousTitle;
      meta.remove();
    };
  }, [t.title]);

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6 pt-32 pb-20">
      <div className="max-w-xl text-center">
        <p className="font-inter text-sm tracking-widest text-orange_impact mb-4">404</p>
        <h1 className="font-inter text-3xl md:text-5xl text-white mb-4">{t.title}</h1>
        <p className="font-inter text-base text-white/70 mb-8">{t.text}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center min-h-12 px-6 border border-white/20 text-white hover:border-orange_impact transition-colors"
          >
            {t.home}
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center min-h-12 px-6 text-white hover:text-orange_impact transition-colors"
          >
            {t.contact}
          </Link>
        </div>
      </div>
    </main>
  );
}
