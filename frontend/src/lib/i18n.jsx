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
  "hero.badge": { en: "Impact Digital 9 Agency · Haiti", fr: "Impact Digital 9 Agency · Haïti" },
  "hero.h1.line1a": { en: "Impact", fr: "Impact" },
  "hero.h1.line1b": { en: "Digital 9.", fr: "Digital 9." },
  "hero.h1.line2": { en: "Creative &", fr: "Agence créative" },
  "hero.h1.line3": { en: "Digital Agency", fr: "et digitale" },
  "hero.h1.line4": { en: "Strategy · Design · Digital experiences.", fr: "Stratégie · Design · Expériences digitales." },
  "hero.sub": {
    en: "Impact Digital 9 is a creative and digital agency based in Haiti. We connect brand strategy, graphic design, digital experiences, marketing, photography and content production to help businesses communicate clearly and grow with impact.",
    fr: "Impact Digital 9 est une agence créative et digitale basée en Haïti. Nous réunissons stratégie de marque, design graphique, expériences numériques, marketing, photographie et production de contenus pour aider les entreprises à communiquer clairement et à développer leur impact.",
  },
  "hero.cta.quote": { en: "Free Quote", fr: "Devis gratuit" },
  "hero.cta.whatsapp": { en: "Message Us on WhatsApp", fr: "Nous écrire sur WhatsApp" },
  "hero.trust": { en: "Selected brands & creative projects", fr: "Marques et projets créatifs sélectionnés" },

  // About preview
  "about.tag": { en: "(01) — About", fr: "(01) — À propos" },
  "about.h2": {
    en: "A creative and digital agency connecting brands, design and technology.",
    fr: "Une agence créative et digitale qui relie les marques, le design et la technologie.",
  },
  "about.body": {
    en: "Founded on 1 May 2018, Impact Digital 9 brings together creative direction, graphic design, brand identity, marketing campaigns, photography, content creation and digital services. Based in Haiti and operating online, the agency combines multidisciplinary expertise with AI-assisted creative workflows.",
    fr: "Fondée le 1er mai 2018, Impact Digital 9 réunit direction créative, design graphique, identité de marque, campagnes marketing, photographie, création de contenus et services digitaux. Basée en Haïti et opérant en ligne, l’agence associe expertise multidisciplinaire et outils d’IA au service de la création.",
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
  "wk.socialProof": { en: "Explore more work", fr: "Découvrir davantage de réalisations" },
  "wk.instagram": { en: "View Instagram", fr: "Voir Instagram" },
  "wk.catalog": { en: "WhatsApp catalogue", fr: "Catalogue WhatsApp" },
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

  // Process — System Architecture Flow
  "pr.tag": { en: "(04) — System Architecture", fr: "(04) — Architecture Système" },
  "pr.h1": { en: "Six layers.", fr: "Six couches." },
  "pr.h2": { en: "One system.", fr: "Un seul système." },
  "pr.sub": {
    en: "Not a process. An engineered production architecture that converts intent into measurable digital infrastructure — without friction, improvisation, or the \u201Cagency effect.\u201D",
    fr: "Pas un processus. Une architecture de production conçue qui convertit l'intention en infrastructure digitale mesurable — sans friction, sans improvisation, sans «\u00A0effet agence\u00A0».",
  },
  "pr.discover": { en: "Input Layer", fr: "Couche d'Entrée" },
  "pr.strategy": { en: "Strategy Layer", fr: "Couche Stratégie" },
  "pr.design": { en: "Design Layer", fr: "Couche Design" },
  "pr.develop": { en: "Engineering Layer", fr: "Couche Ingénierie" },
  "pr.launch": { en: "Launch Layer", fr: "Couche Lancement" },
  "pr.scale": { en: "Growth Layer", fr: "Couche Croissance" },
  "pr.discoverV": {
    en: "Founder workshops, business audits, market diagnostic, and competitive mapping. Output: a clarified strategic brief defining what must exist.",
    fr: "Ateliers fondateurs, audits business, diagnostic marché et cartographie concurrentielle. Livrable : un brief stratégique clarifié définissant ce qui doit exister.",
  },
  "pr.strategyV": {
    en: "Brand architecture, narrative system, positioning, user journey design, and growth model. Output: a strategic operating system, not a slide deck.",
    fr: "Architecture de marque, système narratif, positionnement, parcours utilisateur et modèle de croissance. Livrable : un système d'exploitation stratégique, pas un PDF.",
  },
  "pr.designV": {
    en: "Visual identity system, design tokens, UI/UX patterns, and motion language. Output: a coherent design system shippable across every surface.",
    fr: "Système d'identité visuelle, design tokens, patterns UI/UX et langage motion. Livrable : un design system cohérent déployable sur chaque surface.",
  },
  "pr.developV": {
    en: "Performance-first engineering, scalable architecture, integrations, and infrastructure. Output: a production-grade product, not a prototype.",
    fr: "Ingénierie performance-first, architecture scalable, intégrations et infrastructure. Livrable : un produit en qualité production, pas un prototype.",
  },
  "pr.launchV": {
    en: "Orchestrated rollout, paid activation, media assets, PR sequencing. Output: a launch event — not a publication. Day-1 traction by design.",
    fr: "Déploiement orchestré, activation payante, supports médias, séquencement RP. Livrable : un événement de lancement — pas une publication. Traction dès le jour 1.",
  },
  "pr.scaleV": {
    en: "Compounding optimization, CRO, product iteration, performance marketing. Output: a perpetual growth engine — partnership over project.",
    fr: "Optimisation cumulative, CRO, itération produit, marketing performance. Livrable : un moteur de croissance perpétuel — partenariat plutôt que projet.",
  },
  "pr.purpose": { en: "Purpose", fr: "Finalité" },
  "pr.output": { en: "Output", fr: "Livrable" },
  "pr.impact": { en: "Impact", fr: "Impact" },
  "pr.impact01": { en: "Strategic clarity from day one.", fr: "Clarté stratégique dès le jour 1." },
  "pr.impact02": { en: "Decisions become repeatable systems.", fr: "Les décisions deviennent des systèmes reproductibles." },
  "pr.impact03": { en: "Perception shifts from local to premium.", fr: "La perception passe de locale à premium." },
  "pr.impact04": { en: "Scale without rebuilding.", fr: "Échelle sans tout reconstruire." },
  "pr.impact05": { en: "Day-1 traction, not vanity launches.", fr: "Traction dès le jour 1, pas un lancement gadget." },
  "pr.impact06": { en: "Compounding value, not flat invoices.", fr: "Valeur cumulative, pas des factures plates." },

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

  // Founder Authority (editorial section)
  "fa.tag": { en: "The founder · Impact Digital 9", fr: "Le fondateur · Impact Digital 9" },
  "fa.eyebrow": { en: "Leadership & creative direction", fr: "Leadership & direction créative" },
  "fa.h1": { en: "Creative thinking.", fr: "La pensée créative." },
  "fa.h2": { en: "Disciplined execution.", fr: "L’exécution disciplinée." },
  "fa.h3": { en: "Digital impact.", fr: "L’impact digital." },
  "fa.body1": {
    en: "Wensly Ferdinand founded Impact Digital 9 in 2018 and leads its creative vision. His multidisciplinary background in graphic design, brand identity, marketing, photography and content production informs the agency’s integrated approach.",
    fr: "Wensly Ferdinand a fondé Impact Digital 9 en 2018 et en dirige la vision créative. Son expérience multidisciplinaire en design graphique, identité de marque, marketing, photographie et production de contenus nourrit l’approche intégrée de l’agence.",
  },
  "fa.body2": {
    en: "Since 2021, he has also shared his expertise through professional training. At ID9, he applies structured creative methods and AI-assisted workflows to support content production and help brands build a coherent digital presence.",
    fr: "Depuis 2021, il partage également son expertise à travers la formation professionnelle. Chez ID9, il mobilise des méthodes créatives structurées et des processus assistés par l’IA pour soutenir la production de contenus et aider les marques à construire une présence digitale cohérente.",
  },
  "fa.pillar1.k": { en: "Belief", fr: "Conviction" },
  "fa.pillar1.v": {
    en: "Premium is not a price. It's an operating system.",
    fr: "Le premium n'est pas un prix. C'est un système d'exploitation.",
  },
  "fa.pillar2.k": { en: "Standard", fr: "Standard" },
  "fa.pillar2.v": {
    en: "If it can't be measured, it can't be claimed.",
    fr: "Si ce n'est pas mesurable, ce n'est pas affirmable.",
  },
  "fa.pillar3.k": { en: "Method", fr: "Méthode" },
  "fa.pillar3.v": {
    en: "Strategy precedes design. Design precedes code. Code precedes scale.",
    fr: "La stratégie précède le design. Le design précède le code. Le code précède l'échelle.",
  },
  "fa.pillar4.k": { en: "Refusal", fr: "Refus" },
  "fa.pillar4.v": {
    en: "We do not produce decoration disguised as branding.",
    fr: "Nous ne produisons pas de la décoration déguisée en branding.",
  },
  "fa.signature": { en: "Wensly Ferdinand", fr: "Wensly Ferdinand" },
  "fa.role": {
    en: "Founder · Creative Director",
    fr: "Fondateur · Directeur créatif",
  },
  "fa.cta": { en: "Discover our story", fr: "Découvrir notre histoire" },
  "fa.cta2": { en: "Talk to the studio", fr: "Parler au studio" },

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
  "ap.tag": { en: "The agency · Our story", fr: "L’agence · Notre histoire" },
  "ap.h1": {
    en: "One agency. Connected creative and digital expertise.",
    fr: "Une agence. Des expertises créatives et digitales réunies.",
  },
  "ap.body": {
    en: "Impact Digital 9 Agency was founded on 1 May 2018 to bring creative and digital disciplines together under one agency. Based in Haiti and operating online, ID9 supports brands through graphic design, brand identity, marketing, photography, content creation and digital experiences.",
    fr: "Impact Digital 9 Agency a été fondée le 1er mai 2018 afin de réunir plusieurs disciplines créatives et digitales au sein d’une même agence. Basée en Haïti et opérant en ligne, ID9 accompagne les marques en design graphique, identité de marque, marketing, photographie, création de contenus et expériences numériques.",
  },
  "ap.founderRole": { en: "Founder · Graphic Designer · Creative & Digital Manager", fr: "Fondateur · Graphiste · Creative & Digital Manager" },
  "ap.founderNote": { en: "Meet the founder", fr: "Rencontrer le fondateur" },
  "ap.founderQuote": {
    en: "A multidisciplinary creative practice grounded in design, curiosity and disciplined execution.",
    fr: "Une pratique créative multidisciplinaire fondée sur le design, la curiosité et une exécution disciplinée.",
  },
  "ap.founderBio": {
    en: "Wensly has worked as an independent designer since 2015 and has been a trainer since 2021. His work spans graphic design, brand identity, marketing campaigns, photography, content creation and creative/digital management. He also uses AI tools to support content production and streamline creative workflows. He founded Impact Digital 9 on 1 May 2018.",
    fr: "Wensly exerce comme designer indépendant depuis 2015 et comme formateur depuis 2021. Son travail couvre le design graphique, l’identité de marque, les campagnes marketing, la photographie, la création de contenus et la gestion créative et digitale. Il utilise également des outils d’IA pour soutenir la production de contenus et optimiser les processus créatifs. Il a fondé Impact Digital 9 le 1er mai 2018.",
  },
  "ap.timeline": { en: "Timeline", fr: "Chronologie" },
  "ap.timelineH": { en: "A path shaped by practice, teaching and entrepreneurship.", fr: "Un parcours façonné par la pratique, la formation et l’entrepreneuriat." },
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
