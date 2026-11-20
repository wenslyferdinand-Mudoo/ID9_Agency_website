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


## 8. Première vague de corrections sur la branche d'audit

Les changements suivants sont maintenant présents sur la branche audit, sans toucher à main :

- App.js : ajout d'une route catch-all.
- NotFoundPage.jsx : page 404 bilingue, accessible au clavier et cohérente avec le système visuel ID9.
- RouteSeo.jsx : ajout de noindex,nofollow pour les routes admin et les URL inconnues, avec rétablissement de index,follow sur les routes publiques connues.
- Footer.jsx et i18n.jsx : CTA de signature et libellé Social traduits en français/anglais.
- HomePage.jsx : textes des deux bandeaux marquee et de la typographie cinétique localisés selon la langue active.

**Validation du build :** Vercel Preview est maintenant **READY** sur le HEAD `414a84b9c1904bab6c1a15416d906dee31b78e48` (20 novembre 2026, 15:04 UTC). Le build a donc réussi. Cette preuve confirme la compilation et le déploiement Preview, mais pas la recette visuelle ou fonctionnelle dans un navigateur réel ; aucun test navigateur/Lighthouse n'est revendiqué.

**Limites connues de cette première correction :**
- La page 404 est une 404 applicative côté React. Le fallback SPA Vercel peut encore renvoyer un statut HTTP 200 ; le statut HTTP 404 doit être traité séparément et vérifié.
- robots.txt interdit actuellement le crawl de /admin. Un crawler bloqué ne peut pas lire la balise meta noindex ; prévoir un en-tête X-Robots-Tag ou une stratégie robots cohérente après validation de la configuration Vercel.
- Les routes dynamiques de projet/article restent considérées comme valides par la couche SEO jusqu'à ce que leur page détail confirme si le contenu existe.
- Les traductions ajoutées couvrent les chaînes relevées dans Footer et HomePage, pas encore l'ensemble des textes codés en dur dans toutes les pages et composants.

Ces modifications constituent une première passe ciblée, pas une certification de qualité, sécurité, performance ou production.


- BlogDetailPage.jsx : ajout des métadonnées d'article (title, description, Open Graph, Twitter Card, canonical et JSON-LD BlogPosting) après chargement de l'article, et noindex en cas d'article introuvable/erreur.
- Ajustement du libellé français du CTA footer vers une formulation plus courte, mieux équilibrée typographiquement.

**Limite SEO à conserver :** les métadonnées d'article sont actuellement injectées après hydratation React. Les crawlers et plateformes sociales qui ne rendent pas le JavaScript peuvent encore recevoir les métadonnées génériques de la page blog. Une génération statique/prérendu des articles ou un rendu serveur reste nécessaire pour une prévisualisation sociale robuste.


## 9. Correctif complémentaire : indexation des routes administrateur

L'audit de suivi a révélé une incohérence : `robots.txt` interdisait le crawl de `/admin`, alors que RouteSeo ajoutait `noindex,nofollow` côté client. Un robot respectant robots.txt pouvait donc ne jamais récupérer la page et lire cette directive.

Correction appliquée sur la branche d'audit :
- suppression de `Disallow: /admin` dans `robots.txt` ;
- ajout de l'en-tête HTTP `X-Robots-Tag: noindex, nofollow` pour `/admin` et `/admin/*` dans `vercel.json` ;
- conservation de la directive meta robots côté client comme défense supplémentaire.

Le JSON de `vercel.json` a été parsé avant l'enregistrement. La prise en compte réelle des en-têtes par Vercel reste à vérifier sur le prochain déploiement Preview. Ce correctif SEO n'est pas un contrôle d'accès : l'authentification et les autorisations backend restent obligatoires.


## 10. Vérification de suivi — 20 novembre 2026, 15:05 UTC

### Preview de la PR #53
- État Vercel : **READY**.
- Commit exact : `414a84b9c1904bab6c1a15416d906dee31b78e48`.
- URL Preview : https://id9-agency-website-git-audit-site-expe-52da14-wensly-s-projects.vercel.app
- GitHub check « Vercel Preview Comments » : success, aucun feedback non résolu.
- Cela ne remplace pas les tests navigateur, mobile/tablette/desktop, les tests de liens ni les mesures Lighthouse.

### Backend — PR #52
- GitHub Actions « Backend Static Validation » : **success** au SHA `825241f5e210c65cc9e62c874fb4143d6d8bd1ac`, run `44756055357`.
- Une exécution antérieure au SHA `1feae79365883ed593789f3ccff9cef97dbfde87` a échoué parce que les fixtures utilisaient `admin@example.test`, rejeté par EmailStr comme domaine réservé. Le test fixture utilise désormais `admin@example.com` et le run au HEAD actuel est réussi.
- La suite Atlas reste opt-in et n'est pas une preuve d'intégration Atlas tant que les secrets et l'environnement staging ne sont pas configurés.
- Vercel Preview de la PR #52 : **READY** au SHA `825241f5e210c65cc9e62c874fb4143d6d8bd1ac`.
- Render workspace : aucun service n'est actuellement listé. Aucun backend Render staging n'est donc confirmé.

### Décision
La compilation frontend de la PR #53 et les tests backend isolés de la PR #52 sont réussis sur leurs SHA respectifs. La validation de bout en bout reste incomplète. Les deux PR restent ouvertes et en Draft ; aucun merge ni déploiement production n'est autorisé par cette vérification.


## 11. Vérification complémentaire — liens des projets fondateurs

Une revue ciblée des données de portfolio a révélé que l'entrée Mudoo contenait deux propriétés `externalLinks` dans le même objet JavaScript. La seconde écrasait silencieusement la première. L'URL officielle de Mudoo était également mal orthographiée dans ces deux blocs (`wensl-s-projects` au lieu de `wensly-s-projects`).

Correction appliquée sur la branche de la PR #53 :
- URL officielle corrigée dans les données du projet Mudoo.
- Propriété `externalLinks` redondante supprimée ; une seule définition explicite reste.
- Aucun contenu Sanity, aucune donnée backend et aucun environnement de production modifiés.

À revalider : build Preview du nouveau HEAD, puis navigation réelle du lien depuis la fiche Mudoo sur mobile et desktop. Cette correction de code n'est pas encore une preuve de validation visuelle.

## 12. Correctifs complémentaires — navigation SEO SPA

Après relecture du code de la branche, trois défauts de cohérence ont été corrigés :

1. **Métadonnées résiduelles sur les études de cas :** lors d'une navigation client vers un détail portfolio, les balises pouvaient conserver le titre/description de la page précédente pendant la requête Sanity. Un jeu de métadonnées de secours est désormais appliqué immédiatement.
2. **JSON-LD résiduel :** le script `CreativeWork` d'un projet précédent pouvait rester dans le DOM après navigation SPA. Le script de l'étude de cas est maintenant retiré au changement de route avant de charger les données suivantes.
3. **Articles de blog :** le script `BlogPosting` est maintenant supprimé à la sortie de la page ou au changement d'article, afin d'éviter de présenter un article précédent sur une autre route.
4. **Portfolio indisponible :** lorsque les fallbacks Sanity, données fondatrices et API n'aboutissent pas, la page détail est marquée `noindex,nofollow` et reçoit un titre explicite d'indisponibilité.

Ces modifications sont limitées au frontend et ne changent ni le contenu Sanity, ni MongoDB, ni les variables d'environnement.

**Validation en cours :** le nouveau HEAD `7a4b542e6a8fa80a615078fde1d81ec0a7306bfc` possède un déploiement Vercel Preview identifié `dpl_HSFAtWKggosGqcQEF1TTseBCPGtn`, encore **QUEUED** au dernier contrôle. Aucun test navigateur visuel ni Lighthouse n'est disponible dans cette session. La validation reste donc partielle.

## 13. Portfolio SEO ownership and CMS image accessibility

Two additional cross-layer issues were addressed:

- **Duplicate Sanity request:** both the route-level SEO component and the portfolio detail page independently fetched the same Sanity project. Route-level SEO now provides only immediate fallback metadata; the detail page owns the final metadata and `CreativeWork` JSON-LD after the existing Sanity → founder-project → API fallback resolves. This removes a redundant CMS lookup and keeps metadata aligned with the content actually rendered.
- **Cover image alternative text:** the Sanity portfolio schema now supports optional alt text for cover images. The frontend normalizer propagates that field to portfolio cards, homepage project previews and detail pages, with a project-title fallback for existing documents that have not yet been enriched. No CMS documents were edited.

**Validation remains pending:** these changes are committed to the audit branch and await the latest Vercel Preview build. No claim of visual or accessibility-audit completion is made before browser/Lighthouse checks.


## 14. Vérification CI, audit des dépendances et CMS — 20 novembre 2026

### Frontend et génération SEO
- Workflow GitHub `Frontend Build Validation` : **SUCCESS** au SHA `ddc0b87111e0d5660b1ae7e2ec7f19899f4e009a`, run `44764779565`.
- `npm ci` et `npm run vercel-build` réussis ; la génération SEO a produit 8 routes portfolio publiées depuis le dataset Sanity.
- Le build reste marqué **Compiled with warnings** : classes Tailwind ambiguës (`duration-[1200ms]`, `duration-[1500ms]`, valeurs `ease-[cubic-bezier(...)]`), avertissements de dépendances obsolètes et conflit de peer dependency ESLint.

### Audit npm — état mesuré
- Graphe complet : **53 vulnérabilités** — 2 critical, 31 high, 9 moderate, 11 low.
- Graphe après `npm audit --omit=dev` : **52 vulnérabilités** — 2 critical, 31 high, 8 moderate, 11 low. Cela décrit le graphe de dépendances classées comme production dans le manifeste ; cela ne signifie pas que chaque paquet est embarqué dans le JavaScript navigateur.
- Critiques transitives identifiées : `proxy-addr@2.0.7` via `express@4.22.2` (risque d'usurpation IP dans le traitement des sous-réseaux IPv4-mapped IPv6) et `shell-quote@1.9.0` via `launch-editor` / `react-dev-utils` (injection de commande dans le quoting).
- Dépendances directes à risque élevé relevées : `axios@1.18.1`, `react-router-dom@7.18.1`, `zod@3.25.76`, `postcss@8.5.16` et `react-scripts@5.0.1`.
- La chaîne CRA/CRACO est un facteur structurel : plusieurs correctifs npm exigent des changements majeurs. Aucun `npm audit fix --force` ni changement de dépendance n'a été appliqué. Les correctifs compatibles sont en cours d'analyse isolée avant toute mise à jour.


- Un dry-run `npm audit fix --dry-run` a identifié 32 mises à jour compatibles, dont `axios 1.18.1 → 1.21.1`, `react-router-dom 7.18.1 → 7.18.6`, `postcss 8.5.16 → 8.5.33`, `proxy-addr 2.0.7 → 2.0.8` et `shell-quote 1.9.0 → 1.12.0`. Aucun correctif n'a été appliqué à ce stade.
- La branche isolée `security/frontend-deps-auditfix-2026-11-20` a appliqué les correctifs compatibles sans `--force`. Le run `44767221287` a réussi : `npm ci` initial, `npm audit fix`, second `npm ci` propre et `npm run vercel-build` sont tous verts. Le lockfile validé est commité (`59bd371`) et proposé dans la PR #54, maintenue en Draft. Le graphe passe de 53 à **35 vulnérabilités, 0 critical** (17 high, 7 moderate, 11 low).
- Les vulnérabilités Zod et la dette structurelle CRA/CRACO nécessitent une analyse séparée : Zod exige une migration majeure vers v4, et plusieurs alertes React Scripts n'ont pas de correctif compatible dans CRA 5.

### Sanity Studio
- Le schéma `portfolioProject` prend désormais en charge le texte alternatif de la couverture et le frontend consomme cette valeur avec un fallback sur le titre.
- Le build du Studio Sanity a réussi dans le run `44765834255` au SHA `f563b6decefc9f5feb06bcd37fa0eeb5e49e7ecd`. Un `studio/package-lock.json` a été généré comme artefact de validation, mais n'est pas encore commité.
- Aucun document du dataset `production` n'a été édité et aucun déploiement du Studio n'a été effectué.

### Vercel et infrastructure
- Le Preview Vercel du HEAD actuel n'a pas pu être créé : l'API a renvoyé **402 / api-deployments-free-per-day**, limite de plus de 100 déploiements sur 24 h. Aucun changement de plan/facturation n'a été effectué.
- Un build Preview intermédiaire a échoué sur une expression régulière invalide dans `RouteSeo.jsx`; les commits suivants contiennent le correctif et le build GitHub frontend au SHA `ddc0b87` est vert. Le dernier HEAD reste sans Preview Vercel.
- Aucun service Render n'est listé ; l'URI Atlas staging manque. Aucun accès à MongoDB Production.

### Décision
PR #53 et PR #52 restent en Draft. Aucun merge dans `main), aucune promotion Production, aucune modification des données Sanity ou MongoDB. Le site n'est pas certifié prêt pour la production tant que les dépendances critiques, le Preview visuel, le backend Atlas/Render staging et les tests de bout en bout ne sont pas validés.
