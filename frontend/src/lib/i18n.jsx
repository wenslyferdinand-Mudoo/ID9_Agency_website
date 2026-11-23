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
    en: "Impact Digital 9 Agency is an independent creative and digital agency based in Haiti. We connect brand strategy, visual identity, design, digital experiences and media production to help organizations communicate with clarity and build a consistent presence.",
    fr: "Impact Digital 9 Agency est une agence créative et digitale indépendante basée en Haïti. Nous relions stratégie de marque, identité visuelle, design, expériences numériques et production média pour aider les organisations à communiquer avec clarté et à construire une présence cohérente.",
  },
  "hero.cta.quote": { en: "Free Quote", fr: "Devis gratuit" },
  "hero.cta.whatsapp": { en: "Message Us on WhatsApp", fr: "Nous écrire sur WhatsApp" },
  "hero.trust": { en: "Selected brands & creative projects", fr: "Marques et projets créatifs sélectionnés" },

  // About preview
  "about.tag": { en: "(01) — About", fr: "(01) — À propos" },
  "about.h2": {
    en: "A creative and digital partner bringing brand strategy, design and technology together.",
    fr: "Un partenaire créatif et numérique qui fait converger la stratégie de marque, le design et la technologie.",
  },
  "about.body": {
    en: "Founded on 1 May 2018, Impact Digital 9 Agency brings strategy, creative direction and digital production together. Based in Haiti, the agency supports organizations with brand identity, graphic design, marketing communication, photography, content production and digital experiences—aligning each deliverable with a clear purpose.",
    fr: "Fondée le 1er mai 2018, Impact Digital 9 Agency réunit stratégie, direction créative et production digitale. Basée en Haïti, l’agence accompagne les organisations en identité de marque, design graphique, communication marketing, photographie, production de contenus et expériences numériques, en donnant à chaque livrable un objectif clair.",
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
  "svc.h1": { en: "Connected expertise.", fr: "Des expertises complémentaires." },
  "svc.h2": { en: "One coherent approach.", fr: "Une approche cohérente." },
  "svc.sub": {
    en: "From brand strategy and design to digital experiences, motion and marketing, our services are designed to work together. We align each deliverable with the brief, the audience and the role it must play—so every touchpoint contributes to a more consistent brand experience.",
    fr: "De la stratégie de marque au design, en passant par les expériences numériques, le motion design et le marketing, nos services sont conçus pour fonctionner ensemble. Chaque livrable répond au brief, au public visé et à un objectif précis afin de renforcer la cohérence de l’expérience de marque.",
  },
  "svc.explore": { en: "Explore", fr: "Découvrir" },

  // Portfolio
  "wk.socialProof": { en: "Explore more work", fr: "Découvrir davantage de réalisations" },
  "wk.instagram": { en: "View Instagram", fr: "Voir Instagram" },
  "wk.catalog": { en: "WhatsApp catalogue", fr: "Catalogue WhatsApp" },
  "wk.tag": { en: "(03) — Selected Projects", fr: "(03) — Projets sélectionnés" },
  "wk.h1": { en: "Ideas shaped into", fr: "Des idées transformées en" },
  "wk.h1.pre": { en: "Projects that", fr: "Des projets qui" },
  "wk.h1.hl": { en: "shape ideas", fr: "donnent forme" },
  "wk.h1.post": { en: "and strengthen", fr: "aux idées et" },
  "wk.h2": { en: "brands.", fr: "renforcent les marques." },
  "wk.viewAll": { en: "View all Projects", fr: "Voir tous les projets" },
  "wk.filters.all": { en: "All", fr: "Tous" },
  "wk.filters.branding": { en: "Branding", fr: "Branding" },
  "wk.filters.web": { en: "Web", fr: "Web" },
  "wk.filters.app": { en: "App", fr: "App" },
  "wk.filters.marketing": { en: "Marketing", fr: "Marketing" },
  "wk.filters.motion": { en: "Motion", fr: "Motion" },
  "wk.empty": { en: "No projects are published in this category yet.", fr: "Aucun projet n’est encore publié dans cette catégorie." },
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
    en: "A structured six-stage approach that moves a project from discovery to strategy, design, development, launch and continuous improvement. Each stage creates the clarity and inputs needed for the next.",
    fr: "Une approche structurée en six étapes : découverte, stratégie, design, développement, lancement et amélioration continue. Chaque étape apporte la clarté et les éléments nécessaires à la suivante.",
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
  "why.r2.v": { en: "We define clear objectives and agree on how progress will be evaluated.", fr: "Nous définissons des objectifs clairs et convenons de la manière d’évaluer les progrès." },
  "why.r3.k": { en: "Fast delivery", fr: "Livraison rapide" },
  "why.r3.v": { en: "A direct, considered workflow with clear communication at every stage.", fr: "Un processus direct et structuré, avec une communication claire à chaque étape." },
  "why.r4.k": { en: "Transparent communication", fr: "Communication transparente" },
  "why.r4.v": { en: "Defined points of contact, documented decisions and regular progress updates.", fr: "Des interlocuteurs identifiés, des décisions documentées et des points d’avancement réguliers." },
  "why.r5.k": { en: "Scalable solutions", fr: "Solutions évolutives" },
  "why.r5.v": { en: "Built so your next 10x stage doesn't require rebuilding everything.", fr: "Conçu pour que votre prochain palier 10x ne demande pas de tout reconstruire." },
  "why.r6.k": { en: "Premium creativity", fr: "Créativité premium" },
  "why.r6.v": { en: "We design the brand you wish existed in your category.", fr: "Nous concevons la marque que vous auriez aimé voir exister dans votre secteur." },

  // Testimonials
  "ts.tag": { en: "(06) — Testimonials", fr: "(06) — Témoignages" },
  "ts.h1": { en: "Perspectives from our collaborations.", fr: "Les retours de nos collaborations." },

  // Founder Authority (editorial section)
  "fa.tag": { en: "The founder · ID9 Agency", fr: "Le fondateur · ID9 Agency" },
  "fa.eyebrow": { en: "Leadership & creative direction", fr: "Leadership & direction créative" },
  "fa.h1": { en: "Creative thinking.", fr: "La pensée créative." },
  "fa.h2": { en: "Disciplined execution.", fr: "L’exécution disciplinée." },
  "fa.h3": { en: "Digital impact.", fr: "L’impact digital." },
  "fa.body1": {
    en: "Wensly Ferdinand founded Impact Digital 9 Agency in 2018 and leads its creative vision. His multidisciplinary background in graphic design, brand identity, marketing, photography and content production informs the agency’s integrated approach.",
    fr: "Wensly Ferdinand a fondé Impact Digital 9 Agency en 2018 et en dirige la vision créative. Son expérience multidisciplinaire en design graphique, identité de marque, marketing, photographie et production de contenus nourrit l’approche intégrée de l’agence.",
  },
  "fa.body2": {
    en: "He brings a multidisciplinary perspective to the agency’s creative direction, combining structured design methods, visual storytelling and carefully selected AI-assisted workflows to support purposeful content and coherent digital experiences.",
    fr: "Il apporte à la direction créative de l’agence une approche multidisciplinaire qui associe méthodes de design structurées, narration visuelle et processus assistés par l’IA, afin de produire des contenus pertinents et des expériences numériques cohérentes.",
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
    en: "A focused 15-minute conversation to understand your priorities and identify practical next steps for your brand, digital presence or upcoming launch. If the project is a fit, we can discuss a clear path forward.",
    fr: "Un échange ciblé de 15 minutes pour comprendre vos priorités et identifier des pistes d’action concrètes pour votre marque, votre présence digitale ou votre prochain lancement. Si le projet correspond à notre champ d’intervention, nous pourrons définir ensemble la suite.",
  },
  "lm.b1": { en: "Free digital audit of your current brand & site", fr: "Audit digital gratuit de votre marque et site actuels" },
  "lm.b2": { en: "3 concrete growth recommendations", fr: "3 recommandations concrètes de croissance" },
  "lm.b3": { en: "A practical conversation, with no obligation to proceed", fr: "Un échange concret, sans obligation de poursuivre" },
  "lm.book": { en: "Book my session", fr: "Réserver ma session" },
  "lm.wa": { en: "WhatsApp now", fr: "WhatsApp maintenant" },

  // Training community
  "tr.tag": { en: "Learning · Community", fr: "Apprentissage · Communauté" },
  "tr.h2": { en: "Learn. Create. Move forward.", fr: "Apprendre. Créer. Progresser." },
  "tr.body": {
    en: "Develop your skills and explore new opportunities in the digital and creative fields. Join our community to discover training initiatives, exchange ideas and keep learning alongside other creatives.",
    fr: "Développez vos compétences et explorez de nouvelles opportunités dans les univers du numérique et de la création. Rejoignez notre communauté pour découvrir les initiatives de formation, échanger des idées et continuer à apprendre avec d’autres passionnés.",
  },
  "tr.cta": { en: "Join the WhatsApp group", fr: "Rejoindre le groupe WhatsApp" },

  // Final CTA
  "fc.h1.a": { en: "Ready to build", fr: "Prêt à bâtir" },
  "fc.h1.b": { en: "a brand that", fr: "une marque qui" },
  "fc.h1.c": { en: "redefines its market?", fr: "redéfinit son marché ?" },
  "fc.sub": {
    en: "A clear brief deserves thoughtful strategy and disciplined execution. Tell us what you are building; we will help you identify the right creative and digital priorities for the next stage.",
    fr: "Un brief clair mérite une stratégie réfléchie et une exécution rigoureuse. Présentez-nous votre projet : nous vous aiderons à identifier les priorités créatives et digitales les plus pertinentes pour la prochaine étape.",
  },
  "fc.launch": { en: "Launch My Project", fr: "Lancer mon projet" },
  "fc.wa": { en: "WhatsApp ID9", fr: "WhatsApp ID9" },

  // Footer
  "ft.h2": { en: "Let’s make your next move count.", fr: "Donnons de la portée à votre prochain projet." },
  "ft.pages": { en: "Pages", fr: "Pages" },
  "ft.about": {
    en: "Impact Digital 9 Agency connects strategy, brand identity, design, marketing communication, photography and digital production to create coherent brand experiences.",
    fr: "Impact Digital 9 Agency relie stratégie, identité de marque, design, communication marketing, photographie et production digitale pour créer des expériences de marque cohérentes.",
  },
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
    en: "Founded on 1 May 2018, Impact Digital 9 Agency brings creative and digital disciplines together to help organizations build clear identities and communicate consistently. Based in Haiti, ID9 Agency works across graphic design, brand identity, marketing, photography, content creation and digital experiences.",
    fr: "Fondée le 1er mai 2018, Impact Digital 9 Agency réunit des expertises créatives et digitales pour aider les organisations à construire une identité claire et à communiquer avec cohérence. Basée en Haïti, ID9 Agency intervient en design graphique, identité de marque, marketing, photographie, création de contenus et expériences numériques.",
  },
  "ap.founderRole": { en: "Founder · Graphic Designer · Creative & Digital Manager", fr: "Fondateur · Graphiste · Creative & Digital Manager" },
  "ap.founderNote": { en: "Meet the founder", fr: "Rencontrer le fondateur" },
  "ap.founderQuote": {
    en: "A multidisciplinary creative practice grounded in design, curiosity and disciplined execution.",
    fr: "Une pratique créative multidisciplinaire fondée sur le design, la curiosité et une exécution disciplinée.",
  },
  "ap.founderBio": {
    en: "Working independently in design since 2015, Wensly brings experience in graphic design, brand identity, marketing campaigns, photography, content creation and creative/digital management. He founded Impact Digital 9 Agency on 1 May 2018 and guides its creative direction, using AI tools selectively to support production workflows.",
    fr: "Actif comme designer indépendant depuis 2015, Wensly possède une expérience en design graphique, identité de marque, campagnes marketing, photographie, création de contenus et gestion créative et digitale. Il a fondé Impact Digital 9 Agency le 1er mai 2018 et en guide la direction créative, en utilisant certains outils d’IA pour soutenir les processus de production.",
  },
  "ap.timeline": { en: "Timeline", fr: "Chronologie" },
  "ap.timelineH": { en: "A path shaped by creative practice and entrepreneurship.", fr: "Un parcours façonné par la pratique créative et l’entrepreneuriat." },
  "ap.workWithUs": { en: "Work with us", fr: "Travailler avec nous" },
  "about.exploreServices": { en: "Explore our services", fr: "Découvrir nos services" },
  "about.founderApproach": {
    en: "The agency combines strategic thinking with hands-on creative execution. Each engagement is shaped around the brief, the audience, the available resources and the outcomes that matter.",
    fr: "L’agence associe réflexion stratégique et exécution créative concrète. Chaque collaboration est construite autour du brief, du public, des ressources disponibles et des résultats recherchés.",
  },
  "about.experienceLabel": { en: "Selected experience indicators", fr: "Quelques indicateurs d’expérience" },
  "about.principlesEyebrow": { en: "How we think", fr: "Notre approche" },
  "about.principlesTitle": { en: "Clear thinking. Intentional design. Responsible delivery.", fr: "Une réflexion claire. Un design intentionnel. Une exécution responsable." },
  "about.principlesIntro": {
    en: "Good creative work is not decoration. It connects business intent, audience needs and a consistent brand experience.",
    fr: "Un travail créatif pertinent ne se limite pas à l’esthétique. Il relie les objectifs de l’organisation, les besoins du public et une expérience de marque cohérente.",
  },
  "about.principle1.title": { en: "Strategy before execution", fr: "La stratégie avant l’exécution" },
  "about.principle1.body": {
    en: "We clarify the objective, audience and message before selecting a visual or digital direction.",
    fr: "Nous clarifions l’objectif, le public et le message avant de définir une direction visuelle ou digitale.",
  },
  "about.principle2.title": { en: "Connected disciplines", fr: "Des expertises complémentaires" },
  "about.principle2.body": {
    en: "Branding, design, content and digital experiences are considered as parts of one coherent system.",
    fr: "Le branding, le design, le contenu et les expériences numériques sont pensés comme les composantes d’un même système.",
  },
  "about.principle3.title": { en: "Craft and consistency", fr: "Exigence et cohérence" },
  "about.principle3.body": {
    en: "We value clear communication, careful production and consistency across every relevant touchpoint.",
    fr: "Nous privilégions une communication claire, une production soignée et une cohérence sur chaque point de contact pertinent.",
  },
  "about.principle4.title": { en: "Practical innovation", fr: "Innovation utile" },
  "about.principle4.body": {
    en: "We adopt tools and emerging technologies when they improve quality, efficiency or the experience—not for novelty alone.",
    fr: "Nous adoptons les outils et technologies émergentes lorsqu’ils améliorent la qualité, l’efficacité ou l’expérience, et non pour suivre une tendance.",
  },
  "about.disciplinesEyebrow": { en: "What we bring together", fr: "Nos domaines d’intervention" },
  "about.disciplinesTitle": { en: "A connected creative and digital practice.", fr: "Une pratique créative et digitale intégrée." },
  "about.disciplinesIntro": {
    en: "ID9 brings complementary capabilities together and can shape the right combination around each project. The scope is defined transparently before delivery.",
    fr: "ID9 réunit des compétences complémentaires et compose une réponse adaptée à chaque projet. Le périmètre de la mission est défini avec transparence avant la réalisation.",
  },
  "about.discipline1.title": { en: "Brand identity & graphic design", fr: "Identité de marque & design graphique" },
  "about.discipline1.body": {
    en: "Visual identities, brand assets and communication materials designed for recognition and consistency.",
    fr: "Identités visuelles, supports de marque et outils de communication conçus pour renforcer la reconnaissance et la cohérence.",
  },
  "about.discipline2.title": { en: "Digital experiences", fr: "Expériences digitales" },
  "about.discipline2.body": {
    en: "Website and digital product design focused on clarity, usability and a credible online presence.",
    fr: "Conception de sites web et de produits digitaux axée sur la clarté, l’utilisabilité et une présence en ligne crédible.",
  },
  "about.discipline3.title": { en: "Marketing & content", fr: "Marketing & création de contenu" },
  "about.discipline3.body": {
    en: "Campaign concepts and content production that help organizations communicate with purpose.",
    fr: "Concepts de campagnes et production de contenus pour aider les organisations à communiquer avec intention.",
  },
  "about.discipline4.title": { en: "Photography & training", fr: "Photographie & formation" },
  "about.discipline4.body": {
    en: "Visual storytelling and practical knowledge sharing across creative and digital workflows.",
    fr: "Narration visuelle et transmission de compétences pratiques autour des processus créatifs et digitaux.",
  },

  // Services page
  "sp.h1": { en: "Connected expertise.", fr: "Des expertises complémentaires." },
  "sp.h2": { en: "One coherent approach.", fr: "Une approche cohérente." },
  "sp.sub": {
    en: "Our services are designed to work as a connected system. We bring the right creative and digital disciplines around each brief, maintain a clear line of communication and keep decisions aligned with the project’s objectives.",
    fr: "Nos services sont conçus pour fonctionner comme un ensemble cohérent. Nous mobilisons les expertises créatives et digitales adaptées à chaque brief, assurons une communication claire et veillons à aligner les décisions sur les objectifs du projet.",
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
