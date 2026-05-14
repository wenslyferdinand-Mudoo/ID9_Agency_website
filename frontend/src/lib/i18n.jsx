import { createContext, useContext, useEffect, useState } from "react";

const I18nCtx = createContext(null);

// Translation dictionary. Keys are dotted paths. Missing key falls back to English.
const DICT = {
  // Nav
  "nav.home": { en: "Home", fr: "Accueil" },
  "nav.about": { en: "About", fr: "À propos" },
  "nav.services": { en: "Services", fr: "Services" },
  "nav.portfolio": { en: "Work", fr: "Projets" },
  "nav.blog": { en: "Journal", fr: "Journal" },
  "nav.contact": { en: "Contact", fr: "Contact" },
  "nav.cta": { en: "Start a project", fr: "Démarrer un projet" },

  // Hero
  "hero.badge": { en: "New clients · 2026 roster open", fr: "Nouveaux clients · agenda 2026 ouvert" },
  "hero.h1.line1": { en: "Be Impactful.", fr: "Soyez Impactant." },
  "hero.h1.line2": { en: "Build", fr: "Bâtissez des" },
  "hero.h1.line3": { en: "Powerful", fr: "Marques" },
  "hero.h1.line4": { en: "Digital Brands.", fr: "Inoubliables." },
  "hero.sub": {
    en: "ID9_AGENCY transforms ambitious ideas into premium digital ecosystems — branding, web, marketing & media production engineered for visibility, credibility and growth.",
    fr: "ID9_AGENCY transforme les idées ambitieuses en écosystèmes numériques haut de gamme — branding, web, marketing et production média conçus pour la visibilité, la crédibilité et la croissance.",
  },
  "hero.cta.quote": { en: "Get a free quote", fr: "Devis gratuit" },
  "hero.cta.whatsapp": { en: "WhatsApp us", fr: "Nous écrire sur WhatsApp" },
  "hero.trust": { en: "Trusted by ambitious brands worldwide", fr: "La confiance de marques ambitieuses dans le monde" },

  // About preview
  "about.tag": { en: "(01) — About", fr: "(01) — À propos" },
  "about.h2": {
    en: "A studio for ambitious founders, premium brands and serious operators.",
    fr: "Un studio pour les fondateurs ambitieux, les marques premium et les opérateurs sérieux.",
  },
  "about.body": {
    en: "Since 2018, ID9_AGENCY has been quietly building the digital ecosystems behind some of the most distinctive brands across the Caribbean, North America and Europe. We obsess over craft, strategy and outcomes — not deliverables.",
    fr: "Depuis 2018, ID9_AGENCY construit discrètement les écosystèmes numériques de marques distinctives à travers la Caraïbe, l'Amérique du Nord et l'Europe. Nous sommes obsédés par l'artisanat, la stratégie et les résultats — pas par les livrables.",
  },
  "about.vision.k": { en: "Vision", fr: "Vision" },
  "about.vision.v": {
    en: "A world where every ambitious brand has an undeniable digital presence.",
    fr: "Un monde où chaque marque ambitieuse possède une présence numérique indéniable.",
  },
  "about.mission.k": { en: "Mission", fr: "Mission" },
  "about.mission.v": {
    en: "Engineer premium digital ecosystems that compound credibility and growth.",
    fr: "Concevoir des écosystèmes numériques premium qui composent crédibilité et croissance.",
  },
  "about.values.k": { en: "Values", fr: "Valeurs" },
  "about.values.v": {
    en: "Craft. Clarity. Speed. Integrity. Long-term thinking.",
    fr: "Artisanat. Clarté. Vitesse. Intégrité. Pensée long terme.",
  },
  "about.cta": { en: "The full ID9 story", fr: "L'histoire complète d'ID9" },

  // Services
  "svc.tag": { en: "(02) — Services", fr: "(02) — Services" },
  "svc.h1": { en: "Twelve disciplines.", fr: "Douze disciplines." },
  "svc.h2": { en: "One studio.", fr: "Un seul studio." },
  "svc.sub": {
    en: "We operate as a single integrated studio — strategy, design, build, motion and growth — so your brand moves in lockstep instead of fighting handoffs.",
    fr: "Nous opérons comme un studio unique et intégré — stratégie, design, développement, motion et croissance — pour que votre marque avance en parfaite cohérence.",
  },
  "svc.explore": { en: "Explore", fr: "Découvrir" },

  // Portfolio
  "wk.tag": { en: "(03) — Selected Work", fr: "(03) — Projets sélectionnés" },
  "wk.h1": { en: "Brands we made", fr: "Des marques rendues" },
  "wk.h2": { en: "undeniable.", fr: "indéniables." },
  "wk.viewAll": { en: "View all work", fr: "Voir tous les projets" },
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
  "wk.allBack": { en: "All work", fr: "Tous les projets" },
  "wk.deserveCraft": {
    en: "Have a brief that deserves this level of craft?",
    fr: "Avez-vous un projet qui mérite ce niveau d'artisanat ?",
  },
  "wk.startProject": { en: "Start a project", fr: "Démarrer un projet" },

  // Process
  "pr.tag": { en: "(04) — Process", fr: "(04) — Processus" },
  "pr.h1": { en: "Six moves.", fr: "Six mouvements." },
  "pr.h2": { en: "One arc.", fr: "Un seul arc." },
  "pr.sub": {
    en: "A clear, repeatable arc that takes you from ambiguous ambition to compounding outcome — without the agency drama.",
    fr: "Un arc clair et reproductible qui vous emmène de l'ambition floue au résultat composé — sans le drame d'agence.",
  },
  "pr.discover": { en: "Discover", fr: "Découverte" },
  "pr.strategy": { en: "Strategy", fr: "Stratégie" },
  "pr.design": { en: "Design", fr: "Design" },
  "pr.develop": { en: "Develop", fr: "Développement" },
  "pr.launch": { en: "Launch", fr: "Lancement" },
  "pr.scale": { en: "Scale", fr: "Croissance" },
  "pr.discoverV": { en: "Deep audits, strategy sprints and positioning workshops with founders.", fr: "Audits approfondis, sprints stratégiques et ateliers de positionnement avec les fondateurs." },
  "pr.strategyV": { en: "Brand narrative, customer journey, technical and growth blueprint.", fr: "Narratif de marque, parcours client, plan technique et de croissance." },
  "pr.designV": { en: "Editorial visual systems, identity, UX and motion language.", fr: "Systèmes visuels éditoriaux, identité, UX et langage motion." },
  "pr.developV": { en: "Premium engineering — performant, accessible, scalable.", fr: "Ingénierie premium — performante, accessible, scalable." },
  "pr.launchV": { en: "Cinematic launch, paid media activation and content rollout.", fr: "Lancement cinématique, activation média payant et déploiement de contenu." },
  "pr.scaleV": { en: "Iterate, optimise, compound. Long-term partnership mode.", fr: "Itérer, optimiser, composer. Mode partenariat long terme." },

  // Why
  "why.tag": { en: "(05) — Why ID9", fr: "(05) — Pourquoi ID9" },
  "why.h1": { en: "Built for founders who refuse forgettable.", fr: "Conçu pour les fondateurs qui refusent l'oubliable." },
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
  "fc.h1.c": { en: "truly impacts?", fr: "marque vraiment ?" },
  "fc.sub": {
    en: "One call. One studio. One arc — from ambiguous ambition to compounding outcome.",
    fr: "Un appel. Un studio. Un arc — de l'ambition floue au résultat composé.",
  },
  "fc.launch": { en: "Launch my project", fr: "Lancer mon projet" },
  "fc.wa": { en: "WhatsApp ID9", fr: "WhatsApp ID9" },

  // Footer
  "ft.h2": { en: "Let's build something undeniable.", fr: "Bâtissons quelque chose d'indéniable." },
  "ft.pages": { en: "Pages", fr: "Pages" },
  "ft.svc": { en: "Services", fr: "Services" },
  "ft.contact": { en: "Contact", fr: "Contact" },
  "ft.rights": { en: "All rights reserved.", fr: "Tous droits réservés." },
  "ft.crafted": { en: "Crafted with obsession in", fr: "Conçu avec obsession à" },
  "ft.worldwide": { en: "Available worldwide.", fr: "Disponible dans le monde entier." },

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
  "co.submitting": { en: "Sending…", fr: "Envoi…" },
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
  "ap.h1": { en: "A studio built around craft, clarity and consequence.", fr: "Un studio construit autour de l'artisanat, la clarté et la conséquence." },
  "ap.body": {
    en: "Since 2018, ID9_AGENCY has been quietly shaping the digital ecosystems behind some of the most distinctive brands in the Caribbean, North America and Europe. We work as a single integrated studio — strategy, design, build, motion and growth — so your brand moves in lockstep instead of fighting handoffs.",
    fr: "Depuis 2018, ID9_AGENCY façonne discrètement les écosystèmes numériques de marques distinctives à travers la Caraïbe, l'Amérique du Nord et l'Europe. Nous travaillons comme un studio unique et intégré — stratégie, design, développement, motion et croissance — pour que votre marque avance en parfaite cohérence.",
  },
  "ap.founderRole": { en: "Founder · Creative Director", fr: "Fondateur · Directeur créatif" },
  "ap.founderNote": { en: "Founder note", fr: "Note du fondateur" },
  "ap.founderQuote": {
    en: "\"Impact always starts with an idea — but it only becomes real when craft, strategy and timing collide.\"",
    fr: "« L'impact commence toujours par une idée — mais il ne devient réel que lorsque l'artisanat, la stratégie et le timing se rencontrent. »",
  },
  "ap.founderBio": {
    en: "Wensly is a designer, entrepreneur, digital strategist and creative director. He started ID9 because he was tired of agencies that talked premium but delivered template. Today he leads a small, senior studio committed to a single promise: every brand we touch leaves visibly stronger than we found it.",
    fr: "Wensly est designer, entrepreneur, stratège digital et directeur créatif. Il a fondé ID9 parce qu'il en avait assez des agences qui parlaient premium mais livraient des templates. Aujourd'hui, il dirige un studio compact et senior animé d'une seule promesse : chaque marque que nous touchons repart visiblement plus forte.",
  },
  "ap.timeline": { en: "Timeline", fr: "Chronologie" },
  "ap.timelineH": { en: "Seven years of compounding craft.", fr: "Sept années d'artisanat composé." },
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
  "bp.h1": { en: "Field notes on craft,", fr: "Carnets sur l'artisanat," },
  "bp.h2": { en: "strategy and growth.", fr: "la stratégie et la croissance." },
  "bp.featured": { en: "Featured", fr: "À la une" },

  // Common
  "common.loading": { en: "Loading…", fr: "Chargement…" },
  "common.signin": { en: "Sign in", fr: "Connexion" },
};

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") return "en";
    // URL param takes priority for testing: ?lang=fr
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
    return entry[lang] || entry.en || key;
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
