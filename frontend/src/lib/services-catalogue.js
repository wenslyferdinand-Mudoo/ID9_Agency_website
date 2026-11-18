import {
  Sparkles, Globe, Smartphone, Layers, Target, Search, Zap, Video, Camera,
  Music, GitBranch, Brain, PenTool, Package, Printer, Box, Share2, GraduationCap,
} from "lucide-react";

export const SERVICE_ICONS = {
  Sparkles, Globe, Smartphone, Layers, Target, Search, Zap, Video, Camera,
  Music, GitBranch, Brain, PenTool, Package, Printer, Box, Share2, GraduationCap,
};

export const SERVICE_CATALOGUE = [
  {
    slug: "branding", title: "Branding & Identity", title_fr: "Branding & identité",
    icon: "Sparkles",
    desc: "Memorable logos, identity systems and brand guidelines that build recognition and trust.",
    desc_fr: "Logos mémorables, systèmes d’identité et chartes graphiques pour construire une marque reconnaissable et crédible.",
    deliverables: ["Logo system", "Brand guidelines", "Visual identity", "Brand strategy"],
    deliverables_fr: ["Système de logo", "Charte graphique", "Identité visuelle", "Stratégie de marque"],
  },
  {
    slug: "graphic-design", title: "Graphic Design & Advertising", title_fr: "Design graphique & publicité",
    icon: "PenTool",
    desc: "Creative visual assets for campaigns, promotions, corporate communication and print.",
    desc_fr: "Création de supports visuels pour les campagnes, promotions, communications institutionnelles et impressions.",
    deliverables: ["Flyers & posters", "Brochures", "Business stationery", "Advertising creatives"],
    deliverables_fr: ["Flyers & affiches", "Brochures", "Papeterie professionnelle", "Visuels publicitaires"],
  },
  {
    slug: "packaging", title: "Packaging & Product Labels", title_fr: "Packaging & étiquettes produits",
    icon: "Package",
    desc: "Product labels and packaging concepts designed to make products clear, distinctive and shelf-ready.",
    desc_fr: "Étiquettes et concepts d’emballage conçus pour rendre les produits distinctifs, lisibles et prêts à être présentés.",
    deliverables: ["Product labels", "Packaging design", "Label systems", "Product mockups"],
    deliverables_fr: ["Étiquettes produits", "Design d’emballage", "Systèmes d’étiquetage", "Mockups produits"],
  },
  {
    slug: "web", title: "Web Design & Development", title_fr: "Web design & développement",
    icon: "Globe",
    desc: "Professional, responsive websites and e-commerce experiences built around clarity and conversion.",
    desc_fr: "Sites web professionnels, adaptatifs et expériences e-commerce conçus pour la clarté et la conversion.",
    deliverables: ["Corporate websites", "E-commerce", "Landing pages", "Website optimization"],
    deliverables_fr: ["Sites institutionnels", "E-commerce", "Landing pages", "Optimisation de sites"],
  },
  {
    slug: "app", title: "App Development", title_fr: "Développement d’applications",
    icon: "Smartphone",
    desc: "Mobile and web application projects with focused user experience and product design.",
    desc_fr: "Projets d’applications mobiles et web avec une expérience utilisateur et une conception produit soignées.",
    deliverables: ["Product concept", "Mobile UI", "Web app interfaces", "Launch support"],
    deliverables_fr: ["Concept produit", "Interfaces mobiles", "Interfaces web app", "Accompagnement au lancement"],
  },
  {
    slug: "uiux", title: "UI / UX Design", title_fr: "Design UI / UX",
    icon: "Layers",
    desc: "User-focused interfaces, wireframes, prototypes and reusable design systems.",
    desc_fr: "Interfaces centrées sur l’utilisateur, wireframes, prototypes et systèmes de design réutilisables.",
    deliverables: ["Wireframes", "High-fidelity UI", "Prototypes", "Design systems"],
    deliverables_fr: ["Wireframes", "Interfaces haute fidélité", "Prototypes", "Design systems"],
  },
  {
    slug: "motion", title: "Motion Design", title_fr: "Motion design",
    icon: "Zap",
    desc: "Motion graphics and animated brand assets that strengthen visual storytelling.",
    desc_fr: "Animations graphiques et éléments de marque animés pour renforcer le storytelling visuel.",
    deliverables: ["Logo animation", "Motion graphics", "Social loops", "Explainer visuals"],
    deliverables_fr: ["Animation de logo", "Motion graphics", "Animations pour réseaux sociaux", "Visuels explicatifs"],
  },
  {
    slug: "3d-visualization", title: "3D & Product Visualization", title_fr: "3D & visualisation produit",
    icon: "Box",
    desc: "Three-dimensional logo, product and packaging mockups for polished presentations.",
    desc_fr: "Mockups tridimensionnels de logos, produits et emballages pour des présentations soignées.",
    deliverables: ["3D logo mockups", "Product rendering", "Packaging visualization", "Presentation mockups"],
    deliverables_fr: ["Mockups de logos 3D", "Rendu produit", "Visualisation packaging", "Mockups de présentation"],
  },
  {
    slug: "photography", title: "Photography", title_fr: "Photographie",
    icon: "Camera",
    desc: "Commercial and editorial photography for products, people, brands and campaigns.",
    desc_fr: "Photographie commerciale et éditoriale pour les produits, les personnes, les marques et les campagnes.",
    deliverables: ["Product photography", "Portraits", "Editorial photography", "Campaign visuals"],
    deliverables_fr: ["Photographie produit", "Portraits", "Photographie éditoriale", "Visuels de campagne"],
  },
  {
    slug: "video", title: "Video Production", title_fr: "Production vidéo",
    icon: "Video",
    desc: "Video concepts and production for brand stories, promotional content and digital campaigns.",
    desc_fr: "Conception et production vidéo pour les histoires de marque, contenus promotionnels et campagnes digitales.",
    deliverables: ["Promotional videos", "Brand films", "Video editing", "Short-form content"],
    deliverables_fr: ["Vidéos promotionnelles", "Films de marque", "Montage vidéo", "Formats courts"],
  },
  {
    slug: "marketing", title: "Digital Marketing", title_fr: "Marketing digital",
    icon: "Target",
    desc: "Digital campaign planning and creative execution focused on measurable business objectives.",
    desc_fr: "Planification de campagnes digitales et création orientées vers des objectifs commerciaux mesurables.",
    deliverables: ["Campaign creatives", "Content strategy", "Paid media assets", "Performance reporting"],
    deliverables_fr: ["Créations de campagne", "Stratégie de contenu", "Supports publicitaires", "Rapports de performance"],
  },
  {
    slug: "social-media", title: "Social Media & Content", title_fr: "Réseaux sociaux & contenu",
    icon: "Share2",
    desc: "Consistent social media content, visual planning and community communication for brands.",
    desc_fr: "Contenus cohérents pour les réseaux sociaux, planification visuelle et communication communautaire des marques.",
    deliverables: ["Content calendars", "Social media design", "Community management", "Campaign assets"],
    deliverables_fr: ["Calendriers éditoriaux", "Design pour réseaux sociaux", "Community management", "Supports de campagne"],
  },
  {
    slug: "print-personalization", title: "Printing & Personalization", title_fr: "Impression & personnalisation",
    icon: "Printer",
    desc: "Print-ready artwork and personalized communication materials for businesses and events.",
    desc_fr: "Fichiers prêts à imprimer et supports de communication personnalisés pour les entreprises et événements.",
    deliverables: ["Print preparation", "Promotional materials", "Branded merchandise", "Event materials"],
    deliverables_fr: ["Préparation à l’impression", "Supports promotionnels", "Objets personnalisés", "Supports événementiels"],
  },
  {
    slug: "seo", title: "SEO", title_fr: "Référencement naturel (SEO)",
    icon: "Search",
    desc: "Search visibility foundations through technical, on-page and content optimization.",
    desc_fr: "Fondations de visibilité sur les moteurs de recherche grâce aux optimisations techniques, éditoriales et on-page.",
    deliverables: ["SEO audit", "Keyword research", "On-page optimization", "Content recommendations"],
    deliverables_fr: ["Audit SEO", "Recherche de mots-clés", "Optimisation on-page", "Recommandations éditoriales"],
  },
  {
    slug: "funnels", title: "Funnels & Conversion", title_fr: "Tunnels & conversion",
    icon: "GitBranch",
    desc: "Conversion-focused landing pages and customer journeys designed to reduce friction.",
    desc_fr: "Landing pages et parcours clients orientés conversion pour réduire les points de friction.",
    deliverables: ["Funnel mapping", "Landing pages", "Conversion review", "Email journeys"],
    deliverables_fr: ["Cartographie de tunnel", "Landing pages", "Analyse de conversion", "Parcours e-mail"],
  },
  {
    slug: "ai", title: "AI-assisted Creative Workflows", title_fr: "Workflows créatifs assistés par l’IA",
    icon: "Brain",
    desc: "Practical AI-assisted workflows and creative process automation for content and design teams.",
    desc_fr: "Workflows pratiques assistés par l’IA et automatisation de processus créatifs pour les équipes contenu et design.",
    deliverables: ["AI workflow consulting", "Creative automation", "Content workflows", "Team enablement"],
    deliverables_fr: ["Conseil en workflows IA", "Automatisation créative", "Workflows de contenu", "Accompagnement d’équipe"],
  },
  {
    slug: "artist-management", title: "Artist & Creative Management", title_fr: "Management artistique",
    icon: "Music",
    desc: "Positioning and strategic support for artists and creative projects.",
    desc_fr: "Positionnement et accompagnement stratégique pour les artistes et projets créatifs.",
    deliverables: ["Artist positioning", "Image strategy", "Release planning", "Creative coordination"],
    deliverables_fr: ["Positionnement artistique", "Stratégie d’image", "Planification de sorties", "Coordination créative"],
  },
  {
    slug: "training", title: "Creative & Digital Training", title_fr: "Formation créative & digitale",
    icon: "GraduationCap",
    desc: "Practical training in graphic design, digital tools and AI-assisted creative workflows.",
    desc_fr: "Formations pratiques en design graphique, outils digitaux et workflows créatifs assistés par l’IA.",
    deliverables: ["Graphic design training", "Digital skills", "AI for creatives", "Workflow coaching"],
    deliverables_fr: ["Formation en design graphique", "Compétences digitales", "IA pour créatifs", "Accompagnement workflow"],
  },
];

export function mergeServices(remoteServices) {
  const merged = new Map(SERVICE_CATALOGUE.map((service) => [service.slug, service]));
  if (Array.isArray(remoteServices)) {
    remoteServices.forEach((service) => {
      if (service && service.slug && !merged.has(service.slug)) {
        merged.set(service.slug, service);
      }
    });
  }
  return Array.from(merged.values());
}
