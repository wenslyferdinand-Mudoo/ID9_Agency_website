# ID9_AGENCY — Cahier des charges d'évolution professionnelle
## Brief d'implémentation prioritaire pour Emergent

> **Statut :** spécification de travail — à exécuter après audit du code réel et par lots validables.  
> **Branche documentaire :** `chore/site-professionalization-audit`  
> **Pull request de référence :** #5 — audit et feuille de route.  
> **Application publique actuelle :** https://id9-agency-website.vercel.app  
> **Dépôt :** https://github.com/wenslyferdinand-Mudoo/ID9_Agency_website  
> **CMS :** Sanity, projet `mqrbsugj`, dataset `production`.  
> **Règle absolue :** faire évoluer l'application existante. Ne pas repartir de zéro, ne pas remplacer la direction artistique, ne pas supprimer une fonctionnalité existante sans justification, migration et validation.

---

## 0. Instruction obligatoire à l'agent Emergent

Avant toute modification :

1. Lire intégralement ce document, `docs/PROFESSIONALIZATION_ROADMAP.md`, `docs/SETUP_GUIDE.md`, les éventuels `AGENTS.md` et instructions locales.
2. Examiner la branche de travail et le dernier état de `main`. Vérifier les PR ouvertes, les changements non fusionnés et les éventuels conflits. Ne pas écraser le travail existant.
3. Auditer le code réellement présent : frontend React, backend FastAPI, MongoDB, Sanity Studio, Vercel, tests et configuration. Les chemins indiqués dans ce document sont des points de départ, pas une autorisation à supposer que le code n'a pas évolué.
4. Établir un état initial vérifiable : build, tests, routes, erreurs console/réseau, intégrations, données et captures des pages actuelles.
5. Présenter un plan d'exécution découpé en PR/lots avant les changements sensibles. Traiter une priorité à la fois.
6. Implémenter uniquement après avoir identifié les dépendances et les risques. Mettre à jour ce document et les rapports de tests avec les résultats réels.

**Ne pas considérer le document comme une autorisation de déployer en production, de modifier des secrets, de supprimer des données ou de lancer une migration destructive.**

### Résultat recherché

Faire d'ID9_AGENCY une agence digitale premium crédible et orientée conversion, avec un portfolio éditorial de niveau professionnel, des études de cas complètes, un CMS fiable, une expérience cohérente sur tous les écrans, un socle sécurisé, un SEO propre et une base technique maintenable.

---

## 1. Vision, positionnement et limites créatives

### 1.1 Positionnement à préserver

- Marque : **Impact Digital 9 / ID9_AGENCY**.
- Signature : **Be Impactful. Build Powerful Digital Brands.**
- Positionnement : agence digitale créative et stratégique, avec branding, design, web, applications, marketing et production média.
- Audience : entrepreneurs, PME, marques ambitieuses et organisations recherchant une présence digitale professionnelle.
- Marché : Haïti, Caraïbes, Amérique du Nord, Europe et clients internationaux, uniquement dans la mesure où les références publiées le démontrent.
- Langues du site : français et anglais. Les deux versions doivent rester cohérentes et complètes.

### 1.2 Direction artistique non négociable

Conserver et améliorer l'identité existante :
- univers sombre, premium, éditorial et technologique ;
- palette actuelle et accents orange/violet déjà présents ;
- typographie forte, hiérarchie claire, espaces généreux ;
- animations fluides et maîtrisées, jamais au détriment de la lisibilité, de l'accessibilité ou des performances ;
- cohérence avec l'identité ID9, le logo, les composants et les pages déjà développées.

**Interdictions :**
- ne pas remplacer le design par un template générique ;
- ne pas introduire une nouvelle palette ou une nouvelle identité sans demande ;
- ne pas réécrire l'application dans un autre framework ;
- ne pas supprimer Spline, les animations, le bilinguisme, les pages ou le back-office sans audit et décision explicite ;
- ne pas créer de faux projets, logos clients, avis, certifications, chiffres, KPI ou résultats.

### 1.3 Principes produit

1. La preuve par le travail : les projets réels doivent devenir le cœur de la crédibilité.
2. Clarté commerciale : chaque page explique la valeur, les livrables et la prochaine action.
3. Cohérence éditoriale : les projets sont présentés comme des cas de travail, pas comme une accumulation d'images.
4. Mobile-first : aucune fonctionnalité essentielle ne doit être réservée au desktop.
5. Qualité mesurable : tests, accessibilité, performance, SEO et sécurité doivent être vérifiés.
6. Contenu véridique : les champs facultatifs restent absents lorsqu'aucune donnée fiable n'est disponible.

---

## 2. État technique connu — à revalider au démarrage

Le dépôt contient actuellement :
- `frontend/` : React 19, Create React App via CRACO, React Router, Tailwind, Radix UI, Framer Motion et composants Lucide ;
- `backend/` : API FastAPI et MongoDB/Motor ;
- `studio/` : Sanity Studio ;
- `frontend/src/App.js` : routes publiques Home, About, Services, Portfolio, Portfolio Detail, Blog, Blog Detail, Contact et routes admin ;
- `frontend/src/pages/PortfolioPage.jsx` : page portfolio publique ;
- `frontend/src/pages/PortfolioDetailPage.jsx` : page détail projet ;
- `frontend/src/lib/portfolio.js` et `frontend/src/lib/sanity.js` : requêtes et client Sanity ;
- `studio/schemas/portfolioProject.js` : modèle de document projet ;
- `frontend/src/pages/admin/AdminPortfolio.jsx` : ancien parcours d'administration portfolio via API ;
- `frontend/src/components/site/RouteSeo.jsx` : SEO au niveau des routes.

### Incohérences déjà identifiées à vérifier

- Le schéma Sanity autorise `photo`, mais les filtres publics précédemment audités ne l'exposaient pas.
- La page publique lit Sanity en priorité, tandis que l'interface AdminPortfolio utilise l'API FastAPI/MongoDB : risque de double source de vérité.
- Le schéma existant couvre déjà plusieurs éléments d'étude de cas, mais le parcours de publication et le rendu doivent être vérifiés de bout en bout.
- Un domaine canonique était codé en dur sur `id9agency.com`, alors que l'URL Vercel actuellement partagée est `id9-agency-website.vercel.app`. Le domaine officiel doit être confirmé avant de modifier les canonicals.
- Une documentation historique mentionne `PortfolioPreview.jsx` ; la page repérée dans le code audité est `PortfolioPage.jsx`. Toujours vérifier les chemins réels.

Ne pas extrapoler ces constats si la branche de travail contient déjà des corrections.

---

## 3. Architecture cible et gouvernance des données

### 3.1 Sources de vérité

**Portfolio public : Sanity doit devenir la source de vérité éditoriale unique**, après inventaire et migration contrôlée des éventuelles données existantes MongoDB.

- Sanity Studio : création, édition, brouillons, publication, médias, catégories, études de cas et SEO des projets.
- Frontend public : lecture des seuls documents publiés dans Sanity.
- MongoDB/API historique : ne pas supprimer les données ni endpoints portfolio pendant la transition.
- AdminPortfolio historique : décider après audit s'il est remplacé par un accès clair à Sanity Studio ou s'il est adapté pour écrire dans Sanity. Ne jamais conserver deux interfaces qui écrivent dans des bases concurrentes.
- Blog, contacts, authentification et autres modules : conserver leur source actuelle tant qu'une décision et une migration séparées ne sont pas approuvées.

### 3.2 Migration portfolio — protocole obligatoire

1. Inventorier les documents MongoDB et Sanity (identifiants, slugs, catégories, images, doublons).
2. Exporter les données source dans un emplacement sécurisé et non public.
3. Vérifier la possibilité de restaurer cet export.
4. Préparer une correspondance de champs et catégories.
5. Importer en brouillon dans Sanity, avec identifiant source de migration pour assurer l'idempotence.
6. Comparer les volumes, slugs, textes et références média.
7. Valider visuellement chaque lot.
8. Basculer la lecture publique uniquement après validation.
9. Conserver les données historiques en lecture seule pendant une période de vérification.
10. Toute suppression éventuelle nécessite une autorisation explicite et un backup restaurable.

Aucun script de migration ne doit supprimer, écraser ou publier en masse par défaut. Prévoir mode dry-run, journalisation, reprise, déduplication et rollback.

### 3.3 Modèle de contenu Sanity

Évaluer et faire évoluer le schéma existant sans casser les documents déjà publiés.

**Champs principaux**
- titre, slug unique, client (facultatif), secteur, année ;
- catégorie principale stable et tags secondaires ;
- résumé de carte court ;
- services livrés et outils (facultatif) ;
- projet vedette, ordre éditorial ;
- statut de publication natif Sanity.

**Médias**
- image de couverture obligatoire pour publication ;
- galerie ordonnée, image ou média selon les besoins réels ;
- texte alternatif descriptif par image ;
- légende facultative ;
- hotspot/cadrage ;
- vidéo uniquement via sources autorisées et intégration sécurisée ;
- image Open Graph dédiée ou fallback sur la couverture.

**Étude de cas**
- contexte / présentation ;
- défi ou objectif ;
- rôle exact d'ID9 et périmètre livré ;
- approche et stratégie ;
- direction créative ;
- exécution / solution ;
- livrables ;
- résultat ou impact, uniquement si vérifiable ;
- témoignage, uniquement avec autorisation du client ;
- crédits et partenaires, si pertinents.

**SEO**
- SEO title ;
- meta description ;
- image de partage ;
- slug propre ;
- alt text et métadonnées d'image.

Les champs Challenge, Strategy, Outcome, KPI et Testimonial doivent rester facultatifs. Ne pas afficher des sections vides. Ne jamais transformer une hypothèse en résultat client.

### 3.4 Taxonomie du portfolio

Proposer une taxonomie simple et cohérente, puis migrer les anciennes valeurs avec une table de correspondance :

1. Branding & Visual Identity
2. Graphic Design & Advertising
3. Social Media & Content
4. Web Design & Digital Experiences
5. UI/UX & Applications
6. Photography & Media Production
7. Motion Design

Les sous-types deviennent des tags : logo, brand guidelines, packaging, flyer, poster, campaign, social post, e-commerce, landing page, mobile app, product UI, portrait, event, etc.

Règles :
- filtres visibles générés depuis une taxonomie maîtrisée ;
- une catégorie « All / Tous » ;
- compteur facultatif si fiable ;
- catégories sans projets : ne pas proposer un filtre inutile ou présenter un état vide élégant et contextuel ;
- normalisation des anciennes valeurs sans perte d'information ;
- recherche et tri uniquement si utiles au volume réel.

---

## 4. Expérience Portfolio — priorité produit majeure

### 4.1 Page liste `/portfolio`

Créer une expérience éditoriale premium, inspirée des bonnes pratiques de studios créatifs, sans reproduire le design d'un concurrent.

Contenu attendu :
- en-tête avec titre fort, courte proposition de valeur et contexte ;
- filtres par catégorie ;
- grille responsive avec cartes cohérentes ;
- image de couverture haute qualité, ratio maîtrisé ;
- nom du projet, catégorie, client si autorisé, année et résumé ;
- état loading avec skeletons ;
- état vide global et état vide de filtre ;
- état erreur avec action de réessai ;
- pagination ou « load more » si le volume le justifie ;
- navigation clavier et focus visible ;
- transitions sobres et respect de `prefers-reduced-motion`.

Comportements :
- filtre accessible et utilisable au clavier ;
- état du filtre partageable via URL si approprié ;
- éviter de recharger toutes les données à chaque clic si le cache actuel peut être réutilisé ;
- images lazy-load hors viewport, dimensions réservées pour éviter le layout shift ;
- alt text issu du CMS ; alt vide uniquement pour les images décoratives ;
- liens de carte vers le slug stable du projet ;
- erreurs Sanity visibles en mode utilisateur, détails techniques seulement en logs contrôlés.

### 4.2 Page détail `/portfolio/:slug`

Chaque projet doit pouvoir devenir une étude de cas autonome.

Structure recommandée :
1. Hero : titre, catégorie, client/année si autorisés, image principale.
2. Résumé et rôle d'ID9.
3. Informations projet : services, secteur, période, outils si utiles.
4. Contexte et défi.
5. Approche / stratégie.
6. Direction créative et exécution.
7. Galerie immersive avec légendes et navigation accessible.
8. Résultats vérifiables et témoignage autorisé, si disponibles.
9. Projets similaires ou suivants/précédents.
10. CTA vers Contact / démarrage de projet.

Règles :
- masquer les sections sans contenu ;
- ne pas présenter les livrables comme des résultats business ;
- galerie responsive, zoom/lightbox accessible, fermeture clavier, focus management ;
- images optimisées et alt text ;
- page 404 propre pour slug absent ou document non publié ;
- canonical, Open Graph, Twitter metadata et partage spécifiques au projet ;
- liens retour vers portfolio et navigation projet précédent/suivant.

### 4.3 Accueil — preuve sociale et projets vedettes

- Conserver le hero et l'animation existants après correction des éventuels défauts.
- Présenter une sélection de projets réellement publiés et marqués Featured dans Sanity.
- Les cartes renvoient vers les études de cas.
- La bande de logos clients/partenaires ne doit afficher que des collaborations réelles, autorisées et correctement nommées.
- Ajouter un lien visible vers tous les projets.
- Si aucun projet vedette n'est publié, afficher une alternative éditoriale qui ne prétend pas montrer des réalisations inexistantes.

---

## 5. Évolution des autres pages

### 5.1 Home
- proposition de valeur claire et concise en FR/EN ;
- CTA primaire (démarrer un projet / devis) et secondaire (voir les projets) ;
- projets vedettes réels ;
- aperçu des expertises ;
- méthode ID9 en six étapes déjà présente : Input, Strategy, Design, Engineering, Launch, Growth ;
- preuves, logos et témoignages uniquement vérifiés ;
- section finale de conversion.

### 5.2 About
- histoire et positionnement d'ID9 ;
- vision, mission et valeurs ;
- présentation du fondateur et des collaborateurs uniquement selon les faits confirmés ;
- méthodologie et différenciation ;
- CTA vers contact et portfolio.

### 5.3 Services
- organiser les offres en familles compréhensibles ;
- pour chaque service : problème traité, valeur, livrables, processus et CTA ;
- distinguer clairement design, stratégie, production et développement ;
- ne pas promettre de capacité non disponible ;
- éviter les répétitions et les descriptions génériques ;
- relier les services à des études de cas pertinentes lorsqu'elles existent.

### 5.4 Journal / Blog
- conserver le module existant ;
- vérifier listing, détail, catégories, auteur, date, lecture, SEO et partage ;
- distinguer brouillons et articles publiés côté API ;
- rechercher, filtrer ou paginer seulement si le contenu le justifie ;
- ne pas migrer le blog vers Sanity dans ce chantier sans audit séparé.

### 5.5 Contact
- formulaire accessible, validation côté client ET serveur ;
- confirmation claire après envoi et message d'erreur exploitable ;
- états loading/success/error ;
- anti-spam et limitation de débit côté serveur ;
- protection contre double soumission ;
- consentement et politique de confidentialité adaptés ;
- CTA WhatsApp et autres coordonnées vérifiés ;
- ne jamais exposer les contacts soumis dans une réponse publique.

### 5.6 Navigation et footer
- navigation desktop et mobile cohérente ;
- état actif, focus visible, menu mobile accessible ;
- liens réseaux sociaux vérifiés ;
- coordonnées exactes et cohérentes ;
- liens légaux et politique de confidentialité à compléter avec les informations réelles de l'entreprise ;
- aucune adresse physique inventée.

---

## 6. Back-office, CMS et sécurité

### 6.1 Sanity Studio
- vérifier les permissions membres et rôles ;
- conserver les identifiants du projet non sensibles côté client ;
- aucun token Sanity avec droits d'écriture dans le bundle frontend ;
- si une écriture serveur est requise, utiliser un secret uniquement dans l'environnement serveur ;
- validation des champs requis, slugs uniques et champs média ;
- workflow Draft → Review → Published à formaliser ;
- guider les contributeurs avec descriptions, exemples et champs clairement groupés ;
- éviter la suppression définitive : préférer dépublication/archivage si le modèle le permet.

### 6.2 Backend et authentification
Auditer avant toute modification :
- secret JWT robuste, configuration obligatoire en production ;
- aucun mot de passe ou secret de secours dans le code ;
- ne jamais synchroniser/réinitialiser le mot de passe admin silencieusement au démarrage ;
- matrice route × rôle × permission ;
- expiration, révocation ou stratégie de rotation des sessions ;
- validation stricte des entrées ;
- CORS limité aux origines réellement utilisées ;
- rate limiting sur login et formulaire contact ;
- réponses d'erreur sans stack trace ni détails internes ;
- sécurité des brouillons d'articles et des routes de détail ;
- protection XSS, CSRF selon le mécanisme de session retenu ;
- logs sans tokens, mots de passe, données personnelles ou secrets.

Le token admin précédemment observé dans localStorage doit faire l'objet d'une analyse XSS et d'une décision documentée. Ne pas migrer vers des cookies sans concevoir les attributs Secure/HttpOnly/SameSite, CSRF, CORS et le flux complet.

### 6.3 Configuration et secrets
- inventorier les variables nécessaires par environnement ;
- distinguer variables publiques React `REACT_APP_*` et secrets backend ;
- ne jamais committer `.env`, token, clé privée, credentials ou dump de données ;
- maintenir des fichiers `.env.example` sans valeurs sensibles ;
- vérifier les variables Vercel Preview et Production sans imprimer leurs valeurs secrètes ;
- ne pas demander au propriétaire de publier un secret dans un ticket ou dans les logs.

### 6.4 En-têtes et dépendances
- HTTPS obligatoire ;
- CSP d'abord en Report-Only, puis enforcement après validation ;
- vérifier HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy et frame-ancestors selon le besoin ;
- analyser les dépendances et lockfiles ;
- mises à jour groupées avec revue de compatibilité ;
- aucune désactivation de sécurité pour faire passer un build.

---

## 7. Design system, accessibilité et responsive

### 7.1 Design system
- inventorier les tokens couleurs, typographie, espacements, rayons, ombres et breakpoints existants ;
- réutiliser les composants existants avant d'en créer de nouveaux ;
- définir les états hover, focus, active, disabled, loading et error ;
- uniformiser boutons, cartes, champs, badges, modales, filtres et CTA ;
- éviter les styles dupliqués et les exceptions arbitraires.

### 7.2 Responsive
Tester au minimum :
- petit mobile : 320–375 px ;
- mobile standard : 390–430 px ;
- tablette : 768–1024 px ;
- laptop : 1280–1440 px ;
- desktop large : 1600 px et plus.

Aucune barre de défilement horizontale non intentionnelle. Textes lisibles, images cadrées, boutons utilisables au toucher, menus accessibles.

### 7.3 Accessibilité
Cible : WCAG 2.2 AA pour les parcours essentiels, dans la mesure compatible avec le produit.
- structure sémantique et hiérarchie des titres ;
- contraste des textes et composants ;
- navigation clavier complète ;
- focus visible et ordre logique ;
- labels explicites et erreurs associées aux champs ;
- alt text significatifs ;
- annonces d'état pour les formulaires ;
- réduction des animations via `prefers-reduced-motion` ;
- lightbox, menu et dialogues accessibles.

---

## 8. SEO, performance et mesure

### 8.1 SEO
- confirmer le domaine canonique avec le propriétaire avant toute bascule ;
- un canonical absolu et cohérent par page ;
- titres et descriptions uniques pour les pages publiques ;
- metadata par projet et article ;
- Open Graph et Twitter Cards ;
- sitemap à jour et robots.txt cohérent ;
- données structurées pertinentes seulement si elles représentent réellement l'entreprise et les pages ;
- liens internes entre services, projets et articles ;
- 404 et redirections propres ;
- vérifier l'indexabilité des routes React et la stratégie de rendu/prérendu avant d'affirmer que le SEO est complet.

### 8.2 Performance
Mesurer avant et après :
- Core Web Vitals (LCP, INP, CLS) ;
- poids des images et formats modernes ;
- lazy loading des images non critiques ;
- chargement différé des routes et composants lourds ;
- Spline/WebGL non bloquant, fallback visuel robuste ;
- animations optimisées ;
- cache et requêtes Sanity ;
- éviter les bibliothèques supplémentaires sans bénéfice mesurable.

Ne pas retirer l'expérience 3D uniquement pour gagner un score ; mesurer, optimiser et prévoir un fallback fiable.

### 8.3 Analytics
- inventorier GA4 et les événements actuels ;
- définir événements : clic CTA, démarrage formulaire, envoi réussi, clic WhatsApp, consultation projet ;
- exclure données personnelles, emails, messages et tokens des événements ;
- documenter le consentement et les obligations applicables ;
- ne pas inventer de chiffres de trafic ou de conversion.

---

## 9. Sécurité de livraison et qualité logicielle

### 9.1 Workflow Git
- une branche par lot cohérent ;
- PR descriptive, petite et révisable ;
- pas de push direct sur main ;
- pas de merge automatique sans validation ;
- pas de déploiement production depuis une branche de travail ;
- previews Vercel pour chaque PR si disponibles ;
- inspecter les diffs avant commit ;
- aucun fichier généré, dump ou secret dans les commits.

### 9.2 Tests minimums
**Frontend**
- rendu de chaque route ;
- navigation desktop/mobile ;
- filtres portfolio ;
- affichage 0/1/n projets ;
- page détail valide, slug absent, projet non publié ;
- états loading/error/retry ;
- formulaire contact : validation, succès, échec, double clic ;
- FR/EN et persistance du choix de langue ;
- auth admin et routes protégées.

**Backend**
- 401/403/404/422 ;
- rôles et permissions ;
- login invalide, token expiré/invalide ;
- limites de débit ;
- validation et taille des payloads ;
- protection des articles non publiés ;
- contact anti-spam ;
- CORS selon origines configurées.

**CMS / migration**
- lecture des seuls projets publiés ;
- slug unique ;
- images manquantes ;
- document incomplet ;
- migration dry-run et idempotence ;
- comparaison avant/après ;
- rollback/restauration testés.

**Qualité**
- install reproductible depuis lockfile ;
- tests sans base de production ni API réelle ;
- build de production ;
- aucune erreur console bloquante ;
- liens et routes directes ;
- audit responsive et accessibilité.

Ne jamais utiliser `|| true`, désactiver des tests ou masquer une erreur pour obtenir une CI verte.

### 9.3 Preuves de validation
Chaque PR doit contenir :
- résumé du changement ;
- fichiers/composants touchés ;
- tests exécutés et résultat exact ;
- captures desktop/mobile si UI ;
- URL Preview si disponible ;
- risques connus et points non vérifiés ;
- plan de rollback pour toute migration/configuration ;
- confirmation qu'aucune donnée ni secret de production n'a été altéré.

---

## 10. Plan d'exécution — lots et critères de sortie

| Lot | Priorité | Périmètre | Condition de sortie |
|---|---|---|---|
| L0 | Bloquant | Audit runtime, état initial, secrets, branches, CI, inventaire données | Rapport factuel, build/test baseline, risques classés |
| L1 | Critique | Unifier le flux Portfolio/Sanity, stratégie de migration, taxonomie | Source de vérité validée, aucun projet perdu, publication maîtrisée |
| L2 | Critique | Portfolio listing, filtres, états, cartes, responsive | 0/1/n projets testés, filtres corrects, aucune régression |
| L3 | Critique | Détail projet et case studies, galerie, SEO dynamique | Cas complets et incomplets rendus proprement, 404 correcte |
| L4 | Élevée | Home, services, About, preuves et CTA | Contenu véridique, navigation et conversion testées |
| L5 | Élevée | Blog, contact, admin, sécurité et accessibilité | Parcours critiques et permissions testés |
| L6 | Élevée | SEO global, performance, analytics, documentation release | Mesures avant/après, critères documentés |
| L7 | Finale | Recette complète et préparation production | Validation propriétaire explicite, rollback prêt |

**Ordre impératif :** L0 avant L1 ; L1 avant le basculement du portfolio ; L2/L3 avant les embellissements secondaires. Ne pas démarrer plusieurs chantiers majeurs simultanément.

### Définition de « terminé »
Un lot est terminé uniquement lorsque :
- les critères de sortie sont vérifiés ;
- les tests passent sans être neutralisés ;
- les données sont préservées ;
- le rendu a été vérifié dans une Preview ;
- les erreurs et limites restantes sont documentées ;
- le propriétaire peut accepter ou refuser la PR en connaissance de cause.

---

## 11. Gestion des visuels et des références de projets

Les réalisations doivent provenir des fichiers originaux ID9 ou de ressources dont les droits de publication sont confirmés.

Flux recommandé :
1. collecter les exports originaux (pas de capture compressée si l'original existe) ;
2. regrouper les visuels par projet ;
3. éliminer les doublons et versions obsolètes ;
4. sélectionner une couverture et une galerie cohérente ;
5. préparer les formats responsive et les alt texts ;
6. renseigner le contexte factuel ;
7. créer les projets en brouillon Sanity ;
8. contrôler rendu desktop/mobile ;
9. vérifier droits client, confidentialité et autorisation ;
10. publier après approbation.

Ne pas aspirer automatiquement Instagram, WhatsApp ou des sites tiers. Ne pas contourner des contrôles d'accès. Les liens de réseaux sociaux ne remplacent pas les fichiers originaux. Si un média ou une autorisation manque, laisser le projet en brouillon et demander le fichier au propriétaire.

---

## 12. Livrables attendus d'Emergent

1. Rapport d'audit runtime initial et matrice des risques.
2. Schéma d'architecture cible avec responsabilités Sanity / API / MongoDB.
3. Plan de migration portfolio avec dry-run, backup, vérification et rollback.
4. Portfolio liste fonctionnel et responsive.
5. Pages détail de projet / case studies alimentées par Sanity.
6. Workflow de publication Sanity documenté.
7. Améliorations des autres pages selon les lots validés.
8. Tests automatisés et résultats reproductibles.
9. Rapport sécurité, accessibilité, SEO et performance.
10. Captures avant/après et URL Preview.
11. Documentation maintenue : README, setup, portfolio publishing, variables d'environnement, release et rollback.
12. Liste claire des tâches non terminées et des décisions qui exigent l'accord du propriétaire.

---

## 13. Décisions qui nécessitent une confirmation du propriétaire

Ne pas deviner :
- domaine canonique final (domaine Vercel ou domaine personnalisé vérifié) ;
- autorisation de publier le nom/logo de chaque client ;
- droits d'utilisation des images et témoignages ;
- KPI et résultats réels ;
- quelles données historiques MongoDB doivent être conservées ;
- coordonnées légales, adresse, politique de confidentialité et mentions obligatoires ;
- activation de services tiers payants ou changement de plan ;
- toute migration destructive ou déploiement production.

Quand l'information manque, documenter « à confirmer » et conserver un comportement sûr.

---

## 14. Message de démarrage prêt à transmettre à Emergent

> **Mission :** améliorer professionnellement le site ID9_AGENCY existant en suivant strictement `docs/EMERGENT_IMPLEMENTATION_BRIEF.md` et `docs/PROFESSIONALIZATION_ROADMAP.md`.
>
> Ne reconstruis pas le site. Préserve React, FastAPI, MongoDB, Sanity, Vercel, les routes, le bilinguisme, la direction artistique sombre premium, les animations et les fonctionnalités opérationnelles. Commence par auditer le code et les PR/branches actuelles. N'assume pas qu'un constat ancien est toujours vrai.
>
> Travaille par lots, une priorité à la fois, sur une branche dédiée. Avant de coder, fournis l'état initial, les risques, les fichiers concernés, la stratégie de test et le plan de rollback. Priorité au portfolio : établir Sanity comme source de vérité après inventaire/backup/migration vérifiée, puis construire une page Projects éditoriale, des filtres fiables, des cartes de qualité et des pages case study détaillées. Ne publie jamais de faux projets, KPI, témoignages ou visuels.
>
> Sécurité : aucune clé privée dans le frontend ou Git, aucun test sur production, aucune suppression de données, aucune migration destructive, aucun push direct sur main et aucun déploiement production sans accord explicite. Ne neutralise aucun test. Utilise une Preview Vercel et fournis les preuves de validation.
>
> Si une décision dépend d'une donnée inconnue (domaine officiel, droits médias, données client, secrets ou contenu), arrête cette partie, documente le point et demande confirmation. Mets à jour les documents et ouvre des PR petites et vérifiables. N'annonce pas un lot terminé sans tests et preuves.
