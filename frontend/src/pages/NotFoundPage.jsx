import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function NotFoundPage() {
  const { lang } = useI18n();
  const isFr = lang === "fr";

  return (
    <main className="relative min-h-[75vh] flex items-center px-5 md:px-10 pt-32 pb-24" aria-labelledby="not-found-title" data-testid="not-found-page">
      <div className="max-w-7xl w-full mx-auto">
        <p className="font-ui text-xs uppercase tracking-[0.3em] text-orange_impact mb-8">
          {isFr ? "Erreur 404 · Page introuvable" : "Error 404 · Page not found"}
        </p>
        <p className="font-display font-black text-[clamp(6rem,22vw,16rem)] leading-[0.78] tracking-[-0.08em] text-white" aria-hidden="true">
          404<span className="text-orange_impact">.</span>
        </p>
        <div className="mt-12 max-w-2xl">
          <h1 id="not-found-title" className="font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
            {isFr ? "Cette page n’existe pas à cette adresse." : "This page doesn’t exist at this address."}
          </h1>
          <p className="font-ui text-sm md:text-base text-white/60 mt-5 leading-relaxed">
            {isFr
              ? "Le lien est peut-être obsolète ou l’adresse contient une erreur. Retrouvez les projets et expertises d’ID9 depuis la page d’accueil."
              : "The link may be outdated or the address may contain a typo. Explore ID9’s work and services from the homepage."}
          </p>
          <Link to="/" className="touch-target inline-flex items-center gap-3 mt-9 rounded-full bg-orange_impact px-6 py-3.5 text-sm font-semibold text-ink-900 transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange_impact">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            {isFr ? "Retour à l’accueil" : "Back to homepage"}
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </main>
  );
}
