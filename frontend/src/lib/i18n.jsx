import { createContext, useContext, useEffect, useState } from "react";

const I18nCtx = createContext(null);

// Translation dictionary. Keys are dotted paths. Missing key falls back to English.
const DICT = {
  // Nav
  "nav.home": { en: "Home", fr: "Accueil" },
  "nav.about": { en: "About", fr: "À propos" },
  "nav.services": { en: "Services", fr: "Services" },
  "nav.portfolio": { en: "Projects", fr: "Projets" },
  "nav.blog": { en: "Journal", fr: "Journal" },
  "nav.contact": { en: "Contact", fr: "Contact" },
  "nav.cta": { en: "Start a project", fr: "Démarrer un projet" },

  // Hero
  "hero.badge": { en: "International Digital Agency", fr: "Agence Digitale Internationale" },
  "hero.h1.line1a": { en: "Be", fr: "Soyez" },
  "hero.h1.line1b": { en: "Impactful.", fr: "Impactant." },
  "hero.h1.line2": { en: "Build", fr: "Bâtissez des" },
  "hero.h1.line3": { en: "Unforgettable", fr: "Marques" },
  "hero.h1.line4": { en: "Digital Brands.", fr: "Digitales Inoubliables." },
  "hero.sub": {
    en: "We design exceptional digital ecosystems from ambitious ideas, transforming brands into global references. Branding, web, marketing, and media production unified under one vision: strategic clarity, visual impact, and measurable growth. Brands engineered to dominate their space.",
    fr: "Nous concevons des écosystèmes numériques d'exception à partir d'idées ambitieuses, pour transformer les marques en références mondiales. Branding, web, marketing et production média intégrés dans une seule vision: la clarté stratégique, l'impact visuel et la croissance mesurable. Des marques pensées pour dominer leur espace.",
  },
  "hero.cta.quote": { en: "Free Quote", fr: "Devis gratuit" },
  "hero.cta.whatsapp": { en: "Message Us on WhatsApp", fr: "Nous écrire sur WhatsApp" },
  "hero.trust": { en: "Trusted by ambitious brands worldwide", fr: "La confiance de marques ambitieuses dans le monde" },

  // About preview
  "about.tag": { en: "(01) — About", fr: "(01) — À propos" },
  "about.h2": {
    en: "A studio built for founders creating enduring brands. For ambitious companies, premium brands, and execution-driven operators.",
    fr: "Un studio pour les fondateurs qui construisent des marques durables. Pour les entreprises ambitieuses, les marques premium et les opérateurs orientés exécution.",
  },
  "about.body": {
    en: "Since 2018, ID9_AGENCY has designed and structured digital ecosystems for distinctive brands across Haiti, the Caribbean, North America, and Europe. Our work exists at the intersection of design, strategy, and product engineering. We do not produce deliverables. We build systems that generate value, credibility, and growth.",
    fr: "Depuis 2018, ID9_AGENCY conçoit et structure des écosystèmes numériques pour des marques distinctives en Haïti, dans la Caraïbe, en Amérique du Nord et en Europe. Notre travail se situe à l'intersection du design, de la stratégie et de l'ingénierie produit. Nous ne produisons pas de livrables. Nous construisons des systèmes qui génèrent de la valeur, de la crédibilité et de la croissance.",
  },
  "about.vision.k": { en: "Vision", fr: "Vision" },
  "about.vision.v": {
    en: "A digital environment where every serious brand owns a clear, coherent, and undeniable presence.",
    fr: "Un environnement digital où chaque marque sérieuse possède une présence claire, cohérente et incontestable.",
  },
  "about.mission.k": { en: "Mission", fr: "Mission" },
  "about.mission.v": {
    en: "To design premium digital ecosystems that align identity, performance, and expansion.",
    fr: "Concevoir des écosystèmes numériques premium qui alignent identité, performance et expansion.",
  },
  "about.values.k": { en: "Values", fr: "Valeurs" },
  "about.values.v": {
    en: "Structural clarity. Rapid execution. Product integrity. Long-term vision.",
    fr: "Clarté structurelle. Exécution rapide. Intégrité produit. Vision long terme.",
  },
  "about.cta": { en: "The full ID9 story", fr: "L'histoire complète d'ID9" },

  // Services
  "svc.tag": { en: "(02) — Services", fr: "(02) — Services" },
  "svc.h1": { en: "Twelve disciplines.", fr: "Douze disciplines." },
  "svc.h2": { en: "One unified system.", fr: "Un seul système." },
  "svc.sub": {
    en: "We operate as an integrated agency: strategy, design, development, motion, and growth within one connected workflow. Every discipline is connected. Every decision serves the overall coherence of the brand. We do not create visible brands. We create unavoidable brands.",
    fr: "Nous opérons comme une agence intégrée : stratégie, design, développement, motion et croissance dans un flux unifié. Chaque discipline est connectée. Chaque décision sert la cohérence globale de la marque. Nous ne créons pas des marques visibles. Nous créons des marques inévitables.",
  },
  "svc.explore": { en: "Explore", fr: "Découvrir" },

  // Portfolio
  "wk.tag": { en: "(03) — Selected Projects", fr: "(03) — Projets sélectionnés" },
  "wk.h1": { en: "Impactful brands made", fr: "Des marques impactantes rendues" },
  "wk.h1.pre": { en: "", fr: "Des marques" },
  "wk.h1.hl": { en: "Impactful", fr: "impactantes" },
  "wk.h1.post": { en: "brands made", fr: "rendues" },
  "wk.h2": { en: "undeniable.", fr: "indéniables." },
  "wk.viewAll": { en: "View all Projects", fr: "Voir tous les projets" },
  "wk.filters.all": { en: "All", fr: "Tous" },
  "wk.filters.branding": { en: "Branding", fr: "Branding" },
  "wk.filters.web": { en: "Web", fr: "Web" },
  "wk.filters.app": { en: "App", fr: "App" },
  "wk.filters.marketing": { en: "Marketing", fr: "Marketing" },
  "wk.filters.motion": { en: "Motion", fr: "Motion" },
  "wk.empty": { en: "No projects in this category yet — more coming soon.", fr: "Pas encore de projets dans cette catégorie — d'autres arrivent." },
  "wk.client": { en: "Client", fr: "Client" },
  "wk.year": { en: "Year", fr: "Année" },
  "wk.servicesL": { en: "Services", fr: "Services" },
  "wk.challenge": { en: "Challenge", fr: "Défi" },
  "wk.strategy": { en: "Strategy", fr: "Stratégie" },
  "wk.outcome": { en: "Outcome", fr: "Résultat" },
  "wk.allBack": { en: "All Projects", fr: "Tous les projets" },
  "wk.deserveCraft": {
    en: "Do you have a project that deserves this level of dedication?",
    fr: "Avez-vous un projet qui mérite ce niveau de dévouement ?",
  },
  "wk.startProject": { en: "Start a project", fr: "Démarrer un projet" },

  // Process
  "pr.tag": { en: "(04) — Process", fr: "(04) — Processus" },
  "pr.h1": { en: "Six moves.", fr: "Six mouvements." },
  "pr.h2": { en: "One logic.", fr: "Une seule logique." },
  "pr.sub": {
    en: "A structured production system that transforms uncertainty into controlled execution — without friction, improvisation, or the \u201Cagency effect.\u201D",
    fr: "Un système de production structuré qui transforme l'incertitude en exécution maîtrisée — sans friction, sans improvisation, sans «\u00A0effet agence\u00A0».",
  },
  "pr.discover": { en: "Discovery", fr: "Découverte" },
  "pr.strategy": { en: "Strategy", fr: "Stratégie" },
  "pr.design": { en: "Design", fr: "Design" },
  "pr.develop": { en: "Engineering", fr: "Ingénierie" },
  "pr.launch": { en: "Launch", fr: "Lancement" },
  "pr.scale": { en: "Growth", fr: "Croissance" },
  "pr.discoverV": {
    en: "Complete audits, product immersion, founder workshops, and extraction of critical strategic leverage points. We clarify what must exist before building it.",
    fr: "Audits complets, immersion produit, ateliers fondateurs et extraction des leviers stratégiques critiques. Nous clarifions ce qui doit exister avant de le construire.",
  },
  "pr.strategyV": {
    en: "Brand architecture, narrative design, user journey mapping, and multi-channel growth planning. Strategy designed as a system — not a document.",
    fr: "Architecture de marque, conception narrative, cartographie du parcours utilisateur et planification de croissance multi-canal. Une stratégie conçue comme un système — pas comme un document.",
  },
  "pr.designV": {
    en: "Systemic visual identity, precision UX, and coherent motion language. Every detail serves one purpose: perceived value.",
    fr: "Identité visuelle systémique, UX de précision et langage motion cohérent. Chaque détail sert un seul objectif : la valeur perçue.",
  },
  "pr.developV": {
    en: "High-performance development, scalable by design, product-oriented by nature. Fast, stable systems built for scale.",
    fr: "Développement haute performance, scalable par conception, orienté produit par nature. Des systèmes rapides et stables, pensés pour l'échelle.",
  },
  "pr.launchV": {
    en: "Controlled deployment, media activation, launch assets, and visibility orchestration. We do not publish — we activate.",
    fr: "Déploiement contrôlé, activation média, supports de lancement et orchestration de la visibilité. Nous ne publions pas — nous activons.",
  },
  "pr.scaleV": {
    en: "Continuous optimization, product iterations, marketing performance, and expansion. A partnership mindset — not a one-time project.",
    fr: "Optimisation continue, itérations produit, performance marketing et expansion. Un état d'esprit partenariat — pas un projet ponctuel.",
  },

  // Why
  "why.tag": { en: "(05) — Why ID9", fr: "(05) — Pourquoi ID9" },
  "why.h1": { en: "Built for founders who refuse to be forgettable.", fr: "Conçu pour les fondateurs qui refusent l'oubliable." },
  "why.stat1": { en: "Projects shipped", fr: "Projets livrés" },
  "why.stat2": { en: "Active retainer clients", fr: "Clients actifs" },
  "why.stat3": { en: "Industries served", fr: "Secteurs couverts" },
  "why.stat4": { en: "Building powerful brands", fr: "Au service de marques fortes" },
  "why.r1.k": { en: "International standards", fr: "Standards internationaux" },
  "why.r1.v": { en: "Editorial craft and engineering rigor matched to global agencies.", fr: "Artisanat éditorial et rigueur d'ingénierie alignés sur les agences globales." },
  "why.r2.k": { en: "Result-oriented", fr: "Orienté résultats" },
  "why.r2.v": { en: "Every engagement starts with a number we are accountable to.", fr: "Chaque mission commence par un chiffre dont nous sommes responsables." },
  "why.r3.k": { en: "Fast delivery", fr: "Livraison rapide" },
  "why.r3.v": { en: "Senior team, no junior buffer, ships in weeks not quarters.", fr: "Équipe senior, sans intermédiaire, livraison en semaines pas en trimestres." },
  "why.r4.k": { en: "Transparent communication", fr: "Communication transparente" },
  "why.r4.v": { en: "One Slack/WhatsApp channel. Weekly updates. No silos.", fr: "Un seul canal Slack/WhatsApp. Updates hebdomadaires. Aucun silo." },
  "why.r5.k": { en: "Scalable solutions", fr: "Solutions évolutives" },
  "why.r5.v": { en: "Built so your next 10x stage doesn't require rebuilding everything.", fr: "Conçu pour que votre prochain palier 10x ne demande pas de tout reconstruire." },
  "why.r6.k": { en: "Premium creativity", fr: "Créativité premium" },
  "why.r6.v": { en: "We design the brand you wish existed in your category.", fr: "Nous concevons la marque que vous auriez aimé voir exister dans votre secteur." },

  // Testimonials
  "ts.tag": { en: "(06) — Testimonials", fr: "(06) — Témoignages" },
  "ts.h1": { en: "Founders we've helped.", fr: "Les fondateurs accompagnés." },

  // Lead magnet
  "lm.badge": { en: "Free · 15 minutes · No pitch", fr: "Gratuit · 15 minutes · Sans argumentaire" },
  "lm.h2": { en: "Book a free strategy session.", fr: "Réservez une session stratégie gratuite." },
  "lm.body": {
    en: "A 15-minute call with a senior strategist. Walk away with three concrete moves to sharpen your positioning, accelerate growth or unblock your launch — no strings, no slides.",
    fr: "Un appel de 15 minutes avec un stratège senior. Repartez avec trois actions concrètes pour affiner votre positionnement, accélérer votre croissance ou débloquer votre lancement — sans engagement, sans slides.",
  },
  "lm.b1": { en: "Free digital audit of your current brand & site", fr: "Audit digital gratuit de votre marque et site actuels" },
  "lm.b2": { en: "3 concrete growth recommendations", fr: "3 recommandations concrètes de croissance" },
  "lm.b3": { en: "No pitch — call only converts if it's a fit", fr: "Aucun pitch — l'appel ne convertit que si c'est aligné" },
  "lm.book": { en: "Book my session", fr: "Réserver ma session" },
  "lm.wa": { en: "WhatsApp now", fr: "WhatsApp maintenant" },

  // Final CTA
  "fc.h1.a": { en: "Ready to build", fr: "Prêt à bâtir" },
  "fc.h1.b": { en: "a brand that", fr: "une marque qui" },
  "fc.h1.c": { en: "redefines its market?", fr: "redéfinit son marché ?" },
  "fc.sub": {
    en: "One call. One studio. One system. From blurred ambition to controlled execution — without friction, dilution, or randomness. \u201CWe transform intentions into dominant brands.\u201D",
    fr: "Un appel. Un studio. Un système. De l'ambition floue à une exécution maîtrisée — sans friction, sans dilution, sans hasard. «\u00A0Nous transformons les intentions en marques dominantes.\u00A0»",
  },
  "fc.launch": { en: "Launch My Project", fr: "Lancer mon projet" },
  "fc.wa": { en: "WhatsApp ID9", fr: "WhatsApp ID9" },

  // Footer
  "ft.h2": { en: "Let's build something undeniable.", fr: "Bâtissons quelque chose d'indéniable." },
  "ft.pages": { en: "Pages", fr: "Pages" },
  "ft.svc": { en: "Services", fr: "Services" },
  "ft.contact": { en: "Contact", fr: "Contact" },
  "ft.rights": { en: "All rights reserved.", fr: "Tous droits réservés." },
  "ft.designed": { en: "Designed with precision.", fr: "Conçu avec précision." },
  "ft.worldwide": { en: "Deployed without borders.", fr: "Déployé sans frontières." },

  // Contact page
  "co.tag": { en: "Contact", fr: "Contact" },
  "co.h1": { en: "Let's build something", fr: "Bâtissons quelque chose" },
  "co.h2": { en: "undeniable.", fr: "d'indéniable." },
  "co.studio": { en: "Studio", fr: "Studio" },
  "co.field.name": { en: "Name *", fr: "Nom *" },
  "co.field.email": { en: "Email *", fr: "Email *" },
  "co.field.whatsapp": { en: "WhatsApp", fr: "WhatsApp" },
  "co.field.deadline": { en: "Deadline", fr: "Échéance" },
  "co.field.deadlinePh": { en: "e.g. 6 weeks", fr: "ex. 6 semaines" },
  "co.field.budget": { en: "Budget", fr: "Budget" },
  "co.field.budgetPh": { en: "Choose budget range", fr: "Choisir une fourchette" },
  "co.field.service": { en: "Service", fr: "Service" },
  "co.field.servicePh": { en: "Choose service", fr: "Choisir un service" },
  "co.field.message": { en: "Tell us about your project *", fr: "Parlez-nous de votre projet *" },
  "co.field.messagePh": {
    en: "The brand, the ambition, where you're stuck — anything helps.",
    fr: "La marque, l'ambition, ce qui vous bloque — tout est utile.",
  },
  "co.submit": { en: "Send brief", fr: "Envoyer le brief" },
  "co.submitting": { en: "Sending\u2026", fr: "Envoi\u2026" },
  "co.wa": { en: "Send on WhatsApp", fr: "Envoyer sur WhatsApp" },
  "co.success.h2": { en: "Brief received.", fr: "Brief bien reçu." },
  "co.success.body": {
    en: "We'll be in touch within 24 hours. Want to fast-track? Continue the conversation on WhatsApp now.",
    fr: "Nous revenons vers vous sous 24h. Pour aller plus vite, continuez la conversation sur WhatsApp.",
  },
  "co.success.wa": { en: "Continue on WhatsApp", fr: "Continuer sur WhatsApp" },
  "co.requiredErr": { en: "Name, email and message are required.", fr: "Nom, email et message sont obligatoires." },
  "co.received": { en: "Brief received. We'll be in touch within 24h.", fr: "Brief reçu. Nous revenons sous 24h." },
  "co.couldNotSend": { en: "Could not send. Try WhatsApp.", fr: "Envoi impossible. Essayez WhatsApp." },

  // About page
  "ap.tag": { en: "About ID9", fr: "À propos d'ID9" },
  "ap.h1": {
    en: "A digital studio built around clarity, precision, and performance.",
    fr: "Un studio digital construit autour de la clarté, de la précision et de la performance.",
  },
  "ap.body": {
    en: "Since 2018, ID9_AGENCY has designed and structured digital ecosystems for distinctive brands across Haiti, the Caribbean, North America, and Europe. We operate as an integrated agency — strategy, design, development, motion, and growth — ensuring total coherence between vision, execution, and impact.",
    fr: "Depuis 2018, ID9_AGENCY conçoit et structure des écosystèmes numériques pour des marques distinctives en Haïti, dans la Caraïbe, en Amérique du Nord et en Europe. Nous opérons comme une agence intégrée — stratégie, design, développement, motion et croissance — afin d'assurer une cohérence totale entre vision, exécution et impact.",
  },
  "ap.founderRole": { en: "Founder · Creative Director", fr: "Fondateur · Directeur créatif" },
  "ap.founderNote": { en: "Founder's Note", fr: "Note du fondateur" },
  "ap.founderQuote": {
    en: "\u201CImpact is never accidental. It emerges from alignment between vision, precision of execution, and the right moment of activation.\u201D",
    fr: "«\u00A0L'impact n'est jamais accidentel. Il naît de l'alignement entre la vision, la précision d'exécution et le bon moment d'activation.\u00A0»",
  },
  "ap.founderBio": {
    en: "Wensly is a designer, entrepreneur, digital strategist, and creative director. He founded ID9_AGENCY with one simple conviction: most agencies overcomplicate what should be clear. Today, he leads a selective, senior-level studio centered around one requirement: every brand we work with must emerge stronger, clearer, and more performant.",
    fr: "Wensly est designer, entrepreneur, stratège digital et directeur créatif. Il a fondé ID9_AGENCY avec une conviction simple : la majorité des agences complexifient ce qui devrait être clair. Aujourd'hui, il dirige un studio sélectif et senior, centré sur une seule exigence : chaque marque que nous accompagnons doit sortir plus forte, plus claire et plus performante.",
  },
  "ap.timeline": { en: "Timeline", fr: "Chronologie" },
  "ap.timelineH": { en: "Seven years of strategic construction.", fr: "Sept années de construction stratégique." },
  "ap.workWithUs": { en: "Work with us", fr: "Travailler avec nous" },

  // Services page
  "sp.h1": { en: "Twelve disciplines.", fr: "Douze disciplines." },
  "sp.h2": { en: "One integrated studio.", fr: "Un studio intégré." },
  "sp.sub": {
    en: "We don't do hand-offs. Every engagement at ID9 is led by senior practitioners across strategy, design, engineering and growth — together, from day one.",
    fr: "Pas de relais entre équipes. Chaque mission ID9 est menée par des praticiens seniors — stratégie, design, ingénierie, croissance — ensemble, dès le premier jour.",
  },

  // Blog page
  "bp.tag": { en: "Journal", fr: "Journal" },
  "bp.h1": { en: "Field notes on digital excellence,", fr: "Carnets sur l'excellence digitale," },
  "bp.h2": { en: "strategy and growth.", fr: "la stratégie et la croissance." },
  "bp.featured": { en: "Featured", fr: "À la une" },

  // Common
  "common.loading": { en: "Loading\u2026", fr: "Chargement\u2026" },
  "common.signin": { en: "Sign in", fr: "Connexion" },
};

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") return "en";
    try {
      const url = new URL(window.location.href);
      const param = url.searchParams.get("lang");
      if (param === "fr" || param === "en") return param;
    } catch {
      /* ignore */
    }
    return localStorage.getItem("id9_lang") || "en";
  });
  useEffect(() => {
    localStorage.setItem("id9_lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);
  const t = (key) => {
    const entry = DICT[key];
    if (!entry) return key;
    const val = entry[lang];
    if (val !== undefined) return val;
    return entry.en !== undefined ? entry.en : key;
  };
  return (
    <I18nCtx.Provider value={{ lang, setLang, t, toggle: () => setLang((l) => (l === "en" ? "fr" : "en")) }}>
      {children}
    </I18nCtx.Provider>
  );
}

export function useI18n() {
  return useContext(I18nCtx);
}
