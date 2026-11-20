# Impact Digital 9 Agency — Audit technique senior et plan de remédiation

**Date :** 20 novembre 2026  
**Branche :** audit/site-expert-remediation-2026-11-20  
**Base examinée :** main — 0270127badaed766f7df844f27512b29b71c5912  
**Périmètre :** inventaire du dépôt, frontend React, backend FastAPI, Sanity Studio, configuration Vercel, dépendances, PR ouvertes et déploiements consultables.  
**Méthode :** audit statique. Ce rapport ne remplace pas une recette navigateur, Lighthouse, un audit d'intrusion ou des tests d'intégration Atlas.

## 1. Synthèse exécutive

Le site possède une base visuelle ambitieuse et une architecture déjà constituée : React 19/CRACO, React Router, Tailwind, Radix UI, Framer Motion, Sanity, API FastAPI/MongoDB et Vercel. Il ne faut ni le reconstruire ni remplacer son identité. La priorité est de fiabiliser l'existant, réduire les doubles responsabilités, corriger les incohérences de navigation/SEO, renforcer la sécurité et mesurer les performances avant d'ajouter de nouveaux effets visuels.

**État global : améliorable, mais non qualifié pour une validation de production complète.** Le Preview du HEAD de PR #52 est READY et le workflow Backend Static Validation est SUCCESS. Cela ne démontre ni le bon fonctionnement navigateur de bout en bout, ni l'intégration réelle Atlas/Render, ni les scores Lighthouse, ni la sécurité complète.

## 2. Architecture et périmètre confirmés

- Frontend : React 19, Create React App 5 via CRACO, React Router 7, Tailwind CSS 3, Radix UI, Framer Motion.
- Contenu : Sanity (projet mqrbsugj, dataset production) et données locales de projets fondateurs.
- Backend historique : FastAPI, Motor/PyMongo, MongoDB.
- Hébergement frontend : Vercel, projet id9-agency-website.
- Studio : Sanity Studio dans studio/.
- Routes déclarées dans frontend/src/App.js : accueil, à propos, services, portfolio, détail portfolio, blog, détail blog, contact et administration.
- L'inventaire main compte 177 fichiers suivis. Plusieurs modules sont volumineux : i18n.jsx (~26 KB), PortfolioDetailPage.jsx (~24 KB), services-catalogue.js (~23 KB), Navigation.jsx (~17 KB), ContactPage.jsx (~16 KB).

## 3. Anomalies et risques confirmés

### P0 — Sécurité et intégration backend

1. Le code de main ne contient pas encore les protections présentes dans PR #52. La version main de backend/server.py utilise encore un JWT d'accès de 7 jours et une authentification admin sans session serveur révocable ni rotation refresh. PR #52 apporte des changements importants, mais reste Draft.
2. Le provisionnement et le démarrage backend sont répartis entre plusieurs PR. PR #50, #32 et #52 modifient toutes backend/server.py et/ou .github/workflows/backend-static.yml. Une intégration séquentielle est indispensable pour ne pas perdre les protections de démarrage, de provisionnement administrateur, de validation et de session.
3. Aucune preuve Atlas réelle n'est enregistrée. Le workflow PR #52 est SUCCESS (25 tests passés, 1 ignoré, 5 avertissements selon le corps de PR). Le test ignoré est l'intégration Atlas opt-in, non configurée. Les tests simulés ne prouvent pas le comportement d'un replica set MongoDB réel.
4. Aucun service Render n'a été retourné par la liste du workspace Render consulté. Aucun backend Render staging opérationnel n'est donc confirmé.
5. La séparation des URL API Vercel n'est pas démontrée. La documentation PR #52 signale que REACT_APP_API_URL est ciblée à la fois sur Preview et Production et que sa valeur réelle est masquée. Il faut isoler l'API staging avant les tests navigateur. Aucune variable d'environnement n'a été modifiée pendant cet audit.
6. Le backend ne doit pas être déclaré prêt pour la production. Le gate précédent reste actif : aucun merge de PR #52, aucun déploiement production, aucun accès ou changement de base de production.

### P1 — Conflits de Pull Requests et gouvernance Git

Les PR suivantes sont ouvertes sur main au moment de la vérification :

| PR | Sujet | État GitHub observé | Fichiers partagés / risque |
|---|---|---|---|
| #52 | Durcissement backend et sessions JWT | Draft, mergeable=true, clean | backend/server.py, workflow, frontend/src/lib/api.js |
| #50 | CORS et sécurité du démarrage | ouverte, mergeable=true, unstable | mêmes fichiers backend/workflow que #52 et #32 |
| #32 | Provisionnement admin explicite | Draft, mergeable=false, dirty | backend/server.py, workflow |
| #21 | SEO, routage public et accessibilité | ouverte, mergeable=false, dirty | App.js, RouteSeo.jsx, index HTML, robots, sitemap |
| #34 | SEO dynamique des pages portfolio | Draft, mergeable=false, dirty | index HTML et PortfolioDetailPage.jsx |
| #8 | Proportions des visuels portfolio | Draft, mergeable=false, dirty | PortfolioPage.jsx, PortfolioDetailPage.jsx |
| #7 | Compatibilité de l'URL backend Vercel | Draft, mergeable=false, dirty | frontend/src/lib/api.js |
| #4 | Quality gates et roadmap | ouverte, mergeable=false, dirty | 24 fichiers, dont App, SEO, API, Home, Contact, Portfolio et CSS |

**Constat :** les PR #34, #32, #21, #8, #7 et #4 sont signalées dirty par l'API GitHub. Elles ne doivent pas être fusionnées en l'état. Les intersections de fichiers montrent des conflits potentiels substantiels, notamment #21 ↔ #4, #50 ↔ #52, #32 ↔ #52, #7 ↔ #52, #34 ↔ #21 et #8 ↔ #4. Une intersection de fichiers n'est pas à elle seule une preuve de conflit textuel, mais le statut dirty est une preuve de conflit de fusion avec la base au moment de la lecture.

**Action :** établir une matrice d'intégration, comparer les diffs complets, rebaser/reconstruire une PR consolidée par domaine, puis exécuter CI et Preview. Ne pas fusionner en masse.

### P1 — Routage, navigation et SEO

1. Aucune route catch-all n'est déclarée dans App.js sur main. Une URL inconnue ne dispose pas de page 404 applicative dédiée. La PR #21 propose une page NotFound, mais elle est dirty. Ajouter et tester une route * après réconciliation.
2. Les routes admin ne reçoivent pas explicitement de directive robots noindex dans le code consulté. robots.txt interdit le crawl de /admin, mais cette interdiction ne remplace pas une directive noindex sur les pages sensibles. Ajouter noindex,nofollow côté route et vérifier les réponses HTTP.
3. Le SEO est hybride. RouteSeo.jsx met à jour les métadonnées après hydratation, tandis que generate-seo-pages.mjs génère des pages statiques de projet au build. Il faut valider que chaque slug publié, page détail, canonical, Open Graph, Twitter Card, données structurées et sitemap correspondent au même contenu.
4. Le sitemap statique source ne liste que les pages principales. Le script de build ajoute les projets Sanity et projets locaux ; la requête observée ne récupère pas les articles de blog. Ajouter les articles publiés après validation du modèle et de la pagination.
5. La balise lang du HTML source est en puis mise à jour côté client par RouteSeo. Le comportement doit être vérifié sur le rendu initial et les pages prérendues, notamment pour les lecteurs d'écran et robots.
6. Le domaine canonique reste le domaine Vercel temporaire id9-agency-website.vercel.app. Ne pas le remplacer par id9agency.com avant achat, rattachement et validation DNS/TLS.
7. Un fallback SPA peut renvoyer index.html avec un statut HTTP 200 pour des URL inexistantes. Vérifier les codes HTTP et les règles Vercel de la page 404.

### P1 — Portfolio et modèle éditorial

1. Trois sources sont combinées dans le portfolio public : Sanity, API MongoDB historique et données locales founder-projects.js. PortfolioPage.jsx exécute les lectures Sanity et API en parallèle, puis fusionne et déduplique les listes. La page détail suit aussi un fallback Sanity → projets locaux → API. Cette transition protège les contenus existants, mais crée des chemins de vérité concurrents, des coûts réseau et des risques de divergence.
2. L'administration du portfolio et la lecture publique ne sont pas unifiées. Le Studio Sanity existe, mais l'administration historique écrit via l'API. La migration vers Sanity comme source éditoriale unique doit être planifiée, exportée, comparée et approuvée avant de désactiver les anciennes écritures.
3. La taxonomie est hétérogène entre valeurs historiques et filtres UI. Le Studio utilise notamment web, app, motion, photo, tandis que l'interface propose web-design, app-development, motion-design, photography et graphic-design. Une normalisation centrale existe dans le frontend, mais elle doit être couverte par des tests sur tous les anciens documents.
4. Les champs résultats/KPI, témoignages, logos clients, liens externes et images doivent avoir une preuve de propriété/autorisation. Ne pas publier de chiffres ou citations non validés.
5. Les proportions des œuvres doivent être préservées par type de média. Une règle uniforme cover peut rogner des affiches, cartes, logos et compositions. La PR #8 contient une correction proposée mais est dirty ; elle doit être intégrée sans perdre les autres améliorations.
6. Les images raster les plus lourdes détectées comprennent un mockup AKYA ~2,34 MB, un flyer ~2,04 MB et une carte de programme ~1,29 MB. Optimiser en AVIF/WebP et fournir des tailles responsive après validation visuelle ; conserver les originaux et les ratios.

### P1 — Localisation et cohérence de marque

1. Le site dispose d'un système FR/EN, mais des chaînes visibles restent codées en anglais dans des composants communs. Exemples relevés : CTA principal du footer (“Let's build something undeniable.”), libellé “Social”, plusieurs éléments marquee et les lignes de typographie cinétique de l'accueil. Le parcours français doit être intégralement localisé.
2. La marque officielle doit rester exactement Impact Digital 9 Agency dans les deux langues. Les noms de produits, projets et clients doivent rester cohérents avec les données approuvées.
3. Les témoignages sont codés en dur dans Testimonials.jsx. Le dépôt ne contient pas, à côté de ces citations, de référence d'autorisation ou de preuve éditoriale. Vérifier l'accord de publication et l'exactitude de chaque citation/attribution avant de les considérer comme preuve sociale.
4. Vérifier les coordonnées et liens externes (email, WhatsApp, Instagram, Facebook, TikTok) sur chaque surface du site ; la présence d'une URL dans le code ne prouve pas qu'elle fonctionne ou qu'elle est officielle.

### P2 — Performance et expérience

1. Le projet combine plusieurs moteurs d'animation : Framer Motion, Three.js, Spline, Lenis et animations CSS. Le hero 3D est déjà chargé de façon différée et désactivé sur mobile, faible bande passante et reduced motion ; sa boucle Three.js s'arrête hors viewport et lorsque l'onglet est masqué. Ne pas réécrire ce mécanisme sans mesure.
2. La page d'accueil assemble de nombreuses sections et animations. Mesurer LCP, INP, CLS, poids JS initial, temps de blocage et coût GPU sur Android milieu de gamme avant d'ajouter de nouveaux effets.
3. Le projet utilise CRA/CRACO et react-scripts 5.0.1 avec React 19 et plusieurs bibliothèques modernes. Le build Preview est READY, mais la compatibilité et la maintenance de la toolchain doivent être évaluées avant toute migration majeure.
4. Des images de projet lourdes sont versionnées dans le dépôt. Générer des dérivés optimisés, lazy-load les images hors écran, fournir width/height, srcSet/tailles Sanity et alt text éditorial.
5. Les animations doivent respecter prefers-reduced-motion, éviter les changements de layout et ne pas bloquer l'interaction. Les composants interactifs doivent être testés au clavier et au tactile.
6. Aucun test frontend *.test.* ou suite navigateur n'apparaît dans l'inventaire main. Le seul workflow versionné observé sur main est le workflow backend statique. Ajouter des tests de composants et parcours E2E (navigation, langue, portfolio, formulaire, auth admin).

### P2 — En-têtes, dépendances et exploitation

1. frontend/vercel.json configure actuellement X-Content-Type-Options, Referrer-Policy et X-Frame-Options. Il manque une politique documentée et testée pour CSP, HSTS et Permissions-Policy. Ne pas publier une CSP restrictive sans inventorier Sanity, Google Fonts, Spline, WhatsApp et les autres origines autorisées.
2. Le cache immuable est appliqué aux ressources statiques et à certaines extensions d'image. Vérifier le cache réel des assets, les noms hashés, les médias Sanity et les documents HTML.
3. Le corps de PR #52 rapporte 53 vulnérabilités npm (11 low, 9 moderate, 31 high, 2 critical) issues d'un build précédent. Ce chiffre n'a pas été recalculé pendant cet audit. Exécuter npm audit --json, identifier les dépendances directes/transitives, confirmer les chemins exploitables et appliquer des mises à jour ciblées sans --force.
4. Ajouter Dependabot ou Renovate, un audit périodique des dépendances Python, des règles de secrets, un contrôle de bundle et des rapports d'accessibilité/performance en CI.
5. Les logs de production doivent être structurés, sans données personnelles des prospects ni tokens. Prévoir alertes d'erreurs frontend/API et procédure de restauration.

## 4. Plan d'action priorisé

### Phase 0 — Stabilisation Git et baseline (P0)
- Geler les merges non essentiels pendant l'intégration.
- Établir une matrice des PR #50/#52/#32 et #21/#34/#8/#7/#4.
- Comparer les diffs et conserver les meilleures corrections, sans écraser les branches de travail.
- Vérifier CI, build Vercel Preview et historique de déploiement sur chaque HEAD consolidé.
- Documenter les variables d'environnement par cible sans afficher leurs valeurs.

**Acceptation :** une seule trajectoire de fusion par domaine, aucune PR dirty ignorée, aucun commit non vérifié.

### Phase 1 — Sécurité backend et environnements isolés (P0)
- Consolider le durcissement API, le provisionnement administrateur, les limites d'entrée, CORS et cycle de vie JWT.
- Provisionner explicitement un backend Render staging et une base Atlas staging dédiée, avec utilisateur et secrets séparés.
- Configurer GitHub Actions secrets/variables directement dans les interfaces sécurisées, jamais dans le code ou le chat.
- Séparer l'URL API Preview de Production.
- Exécuter les tests Atlas réels, tests d'auth navigateur, rotation, replay, révocation, rôle, CORS, rate limit et scénarios de compromission.

**Acceptation :** preuves Atlas et navigateur archivées, CI verte, aucune dépendance à la base de production.

### Phase 2 — Qualité fonctionnelle et accessibilité (P1)
- Ajouter une route 404 accessible et une directive noindex sur l'administration.
- Tester les liens, routes directes, états loading/empty/error, formulaire contact et navigation mobile.
- Corriger la localisation FR/EN des éléments communs.
- Vérifier focus, labels, contrastes, alt text, ordre de tabulation et reduced motion.
- Confirmer les témoignages et preuves de projets avec validation éditoriale.

**Acceptation :** aucun parcours critique cassé sur mobile/desktop, navigation clavier utilisable, FR/EN cohérent.

### Phase 3 — CMS et SEO (P1)
- Formaliser Sanity comme source éditoriale cible, conserver les données Mongo historiques jusqu'à inventaire et migration validée.
- Unifier la normalisation des catégories et tester les anciennes valeurs.
- Corriger les ratios média, alt text, captions, états vides et erreurs CMS.
- Réconcilier métadonnées, pages prérendues, canonicals, données structurées, sitemap projets et articles.
- Tester partage social et indexation sur les URL publiques.

**Acceptation :** chaque projet publié a une page détaillée indexable, un canonical unique et des médias accessibles ; aucun brouillon public.

### Phase 4 — Performance et direction artistique (P2)
- Établir un baseline Lighthouse mobile/desktop et Web Vitals terrain.
- Optimiser les cinq plus grandes images, les fontes, le code splitting et les dépendances lourdes.
- Ajuster les animations selon leur coût réel : transitions courtes, motion design hiérarchisé, pause hors écran, reduced motion, fallback sans WebGL.
- Raffiner le système typographique, la grille, les espacements, la hiérarchie des CTA et les états interactifs sans dénaturer le langage orange/violet/noir de ID9.
- Refaire les captures visuelles aux breakpoints 360, 390, 768, 1024 et 1440 px.

**Acceptation cible :** Lighthouse mobile/desktop ≥ 90 en Performance, Accessibility, Best Practices et SEO lorsque mesurable ; LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 sur les pages représentatives. Ce sont des objectifs, pas des résultats constatés.

### Phase 5 — Observabilité et gouvernance (P2)
- Ajouter tests E2E et smoke tests après chaque Preview.
- Mettre en place monitoring frontend/API, suivi des formulaires et alertes.
- Documenter sauvegarde/restauration Mongo, publication Sanity et rollback Vercel.
- Maintenir une revue régulière des dépendances, permissions et secrets.

## 5. État plateforme vérifié

- PR #52 : ouverte, Draft, mergeable clean, HEAD 825241f5e210c65cc9e62c874fb4143d6d8bd1ac.
- GitHub Actions sur ce HEAD : Backend Static Validation SUCCESS.
- Vercel Preview correspondant au HEAD #52 : READY, URL https://id9-agency-website-o4z8e704e-wensly-s-projects.vercel.app.
- Render : la liste du workspace consulté a retourné zéro service ; staging non confirmé.
- Gmail : un message Google confirme une connexion “Se connecter avec Google” à Render le 20 novembre ; cela ne prouve pas qu'un service Render a été créé.
- MongoDB Atlas : aucune preuve de cluster staging et de tests réels dans les éléments consultés.
- L'ouverture HTTP du site public renvoie une coquille SPA qui demande l'activation de JavaScript ; cette lecture seule ne permet pas une inspection visuelle réelle.

## 6. Limites de l'audit

Ce rapport est fondé sur l'arbre Git, les fichiers sources, les métadonnées PR, le résultat CI, l'état des déploiements Vercel, la liste de services Render et les emails pertinents consultés. Restent à exécuter : tests navigateur sur vrais appareils, Lighthouse, axe-core/WCAG, vérification de tous les liens externes, analyse npm/Python à jour, tests XSS/CSRF/NoSQL injection, vérification des secrets dans l'historique et les bundles, tests API contre staging Atlas/Render, vérification DNS/TLS et audit des données CMS.

## 7. Règles de livraison

- Préserver toutes les routes, fonctionnalités, contenus et intégrations existants.
- Aucun changement destructif MongoDB ou Sanity.
- Aucun secret dans les commits ou rapports.
- Aucun merge vers main et aucun déploiement production sans validation distincte.
- Chaque correctif doit avoir une preuve : test, log, capture ou résultat reproductible.
- Ne pas déclarer un critère validé sur la base d'une simulation.
