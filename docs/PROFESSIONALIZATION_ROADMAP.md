# ID9 Agency — Audit initial et feuille de route de professionnalisation

Date : 2026-11-17  
Branche : `chore/site-professionalization-audit`  
Base auditée : branche `main` au commit `6bd5d5ad9e9e2dfc6d68c7ba5bb91fad0d04ecc2`

## 1. Objectif

Faire évoluer le site ID9 Agency vers une plateforme d'agence digitale premium, structurée, crédible, rapide, accessible, maintenable et orientée conversion. Cette feuille de route ne constitue pas une validation de production. Aucun déploiement ni changement de données Sanity n'a été effectué.

## 2. Périmètre technique confirmé

- Frontend : React 19 / Create React App via CRACO.
- Routing : React Router.
- UI : Tailwind CSS, Radix UI, Framer Motion, Lucide.
- CMS portfolio : Sanity, projet `mqrbsugj`, dataset `production`.
- Hébergement frontend : Vercel.
- Backend historique : FastAPI / MongoDB selon la documentation du dépôt.
- Sanity Studio : dossier `studio/`, schéma `portfolioProject`.
- Routes publiques visibles dans `frontend/src/App.js` : accueil, à propos, services, portfolio, détail projet, blog, détail article, contact.
- Routes admin présentes : login, overview, portfolio, blog, contacts.

## 3. Constats vérifiés dans le code

### 3.1 Portfolio et CMS

1. Le modèle Sanity `studio/schemas/portfolioProject.js` existe déjà et couvre titre, slug, client, catégorie, année, projet mis en avant, résumé, services, outils, image de couverture, galerie, vidéos, étude de cas, résultats et SEO.
2. Le client public Sanity est configuré dans `frontend/src/lib/sanity.js`, avec valeurs de repli pour le project ID et le dataset.
3. Les requêtes GROQ et la normalisation se trouvent dans `frontend/src/lib/portfolio.js`.
4. La page publique réelle est `frontend/src/pages/PortfolioPage.jsx` (et non `PortfolioPreview.jsx`, cité dans une ancienne documentation).
5. La page publique interroge Sanity en premier, puis utilise l'API historique si aucun résultat n'est retourné.
6. L'interface publique définit actuellement les filtres `all`, `branding`, `web`, `app`, `marketing`, `motion`. Le schéma Sanity permet aussi `photo`, mais ce filtre n'est pas proposé dans la page publique.
7. Le schéma Sanity ne propose actuellement que six catégories : branding, web, app, marketing, motion et photo. La taxonomie doit être rationalisée avant d'ajouter les catégories plus fines (flyers, social media, UI/UX, etc.).
8. L'interface d'administration `frontend/src/pages/admin/AdminPortfolio.jsx` utilise l'API FastAPI (`/portfolio`) pour créer, modifier et supprimer les projets, tandis que la page publique lit Sanity en priorité. Cela crée deux chemins de gestion de contenu concurrents et un risque de divergence.
9. La page portfolio actuelle utilise une grille de deux colonnes à partir du breakpoint desktop/tablette, sans pagination ni recherche visible dans le code consulté. L'état vide est un simple message.
10. Les images de couverture sont transformées par Sanity Image URL Builder. Les images doivent néanmoins être vérifiées en conditions réelles (formats, tailles, ratio, textes alternatifs, chargement différé et erreurs).

### 3.2 SEO

- Le domaine canonique a été harmonisé dans le lot P0 sur `https://id9-agency-website.vercel.app` (domaine Vercel temporaire). `id9agency.com` reste le domaine custom futur, non acheté et non attaché à Vercel.
- Le domaine de production communiqué est actuellement `https://id9-agency-website.vercel.app`. Le domaine canonique doit rester aligné sur le domaine réellement choisi et vérifié. Ne pas basculer vers un domaine personnalisé non configuré.
- Les métadonnées dynamiques des pages de détail doivent être vérifiées : titre, description, canonical, Open Graph, Twitter Cards et partage d'image.

### 3.3 Architecture et qualité

- Le projet contient à la fois un CMS Sanity et un backend FastAPI/MongoDB historique. La responsabilité de chaque source de données doit être clarifiée avant toute suppression ou migration.
- Le dépôt utilise React Scripts 5 / CRACO avec React 19 : la compatibilité de l'ensemble des dépendances doit être couverte par un build reproductible.
- L'accès public au portfolio ne doit jamais dépendre d'une clé API Sanity privée. Seules les variables publiques non sensibles doivent être exposées dans le bundle client.
- Les journaux de configuration dans `sanity.js` affichent le project ID et dataset dans la console. Ces valeurs ne sont pas des secrets, mais ces logs sont inutiles en production et devraient être retirés ou protégés par un mode debug.
- Les pages, formulaires, liens, menus mobiles, langues FR/EN, états de chargement et états d'erreur doivent être testés sur desktop et mobile.

## 4. Décisions d'architecture recommandées

### Source de vérité du portfolio

Recommandation : faire de Sanity l'unique source de vérité pour les projets du portfolio public et leur contenu éditorial.

- Sanity Studio gère les projets, médias, catégories, SEO et publication.
- Le frontend public lit exclusivement les projets publiés dans Sanity.
- Ne pas continuer à écrire simultanément dans MongoDB et Sanity.
- Garder l'ancien module admin/API en lecture seule ou le retirer uniquement après inventaire des données, export/backup, plan de migration et validation explicite.
- Ne jamais supprimer les données historiques sans sauvegarde vérifiée et comparaison des enregistrements.

### Taxonomie

Commencer par des catégories principales stables et des tags secondaires. Proposition :

- Branding & Identité visuelle
- Design graphique & Publicité
- Réseaux sociaux & Contenu
- Web & Expériences digitales
- UI/UX & Applications
- Photographie & Production média
- Motion Design

Les sous-types (flyers, affiches, logos, packaging, campagnes, etc.) doivent être des tags ou sous-catégories, pas des filtres principaux redondants.

### Modèle éditorial de projet

Conserver les champs existants et prévoir, après vérification de compatibilité :
- titre, slug, client (optionnel/confidentiel), année, catégorie, tags ;
- résumé court, description et services ;
- image de couverture, galerie ordonnée, alt text et légendes ;
- étude de cas facultative : contexte, défi, approche, solution, résultat ;
- projet vedette, ordre manuel, statut de publication ;
- SEO title, SEO description et image de partage.

Ne jamais inventer de KPI, témoignage ou résultat client. Ces champs doivent rester facultatifs et être publiés uniquement s'ils sont documentés et autorisés.

## 5. Feuille de route priorisée

### P0 — Fiabilité et sécurité avant toute refonte

- Vérifier le build de production et les tests existants.
- Vérifier toutes les variables Vercel (production et preview) et les CORS Sanity.
- Vérifier le comportement réel du portfolio avec 0, 1 et plusieurs projets publiés.
- Confirmer l'URL canonique officielle.
- Vérifier les erreurs console/réseau, les liens morts et les routes directes.
- Vérifier que les secrets backend ne sont jamais exposés au frontend.
- Produire un inventaire des données MongoDB et Sanity avant toute migration.

Critère d'acceptation : build reproductible, aucune erreur bloquante, aucune fuite de secret, aucune perte de données.

### P1 — Unifier le CMS et le portfolio

- Sanity devient la source de vérité.
- Aligner catégories, filtres et valeurs du schéma.
- Ajouter une vraie gestion des états loading / empty / error.
- Ajouter image de secours, alt text, lazy loading, dimensions et optimisation.
- Ajouter recherche, tri et pagination/infinite loading si le volume le justifie.
- Vérifier les pages détail et les métadonnées par projet.
- Fournir une procédure d'import des images et de publication.

Critère d'acceptation : un projet publié dans Sanity apparaît sur le site sans changement de code ni redéploiement, et un projet non publié n'est pas visible publiquement.

### P2 — Qualité visuelle et expérience utilisateur

- Renforcer la hiérarchie typographique et l'espacement sans casser l'identité existante.
- Créer une grille éditoriale cohérente avec des ratios d'images maîtrisés.
- Ajouter des transitions sobres, respectueuses de `prefers-reduced-motion`.
- Vérifier navigation clavier, focus visible, contrastes, labels et alt text.
- Optimiser mobile, tablette et grands écrans.
- Vérifier les CTA et le parcours vers Contact / WhatsApp / Instagram.

Critère d'acceptation : expérience cohérente, lisible et utilisable sur mobile, tablette et desktop.

### P3 — Professionnalisation de l'ensemble du site

- Accueil : proposition de valeur claire, services principaux, preuves vérifiables, projets vedettes et CTA.
- Services : pages/sections structurées par offre, livrables, processus et CTA.
- À propos : positionnement, méthode, équipe/fondateur, valeurs et informations factuelles.
- Blog : catégories, recherche, pagination, auteurs, dates, SEO et états vides.
- Contact : formulaire validé, feedback utilisateur, anti-spam et coordonnées cohérentes.
- Navigation/footer : liens cohérents, réseaux sociaux, coordonnées, mentions légales et politique de confidentialité adaptées à l'activité.
- SEO : sitemap, robots, canonical, Open Graph, données structurées pertinentes et performance.
- Analytics : événements de conversion et consentement/notice appropriés selon les outils réellement utilisés.

### P4 — Exploitation et gouvernance

- Documentation des environnements et procédures de publication.
- Workflow Git avec branches, pull requests, CI et preview deployments.
- Tests unitaires, composants et parcours critiques.
- Monitoring des erreurs frontend/backend.
- Sauvegardes et procédure de restauration CMS/données.
- Checklist de release et rollback.

## 6. Plan d'import du catalogue WhatsApp et d'Instagram

Les liens seuls ne garantissent pas l'accès aux fichiers originaux ni l'autorisation de les importer automatiquement.

Processus recommandé :
1. Collecter les créations originales ou les exports autorisés.
2. Dédupliquer et sélectionner les réalisations représentatives.
3. Regrouper les fichiers par projet, pas seulement par publication.
4. Définir pour chaque projet un titre, une catégorie, une année et une courte description vérifiable.
5. Préparer couverture + galerie, avec images optimisées et textes alternatifs.
6. Importer les médias dans Sanity Assets.
7. Créer les documents portfolio en brouillon.
8. Vérifier droits d'utilisation, confidentialité client et autorisation de publication.
9. Publier après validation visuelle.

Ne pas aspirer automatiquement Instagram ni contourner ses contrôles d'accès. Ne pas utiliser des images de clients ou de tiers sans autorisation de publication.

## 7. Protocole de livraison

- Toute modification doit se faire sur une branche dédiée.
- Aucun push direct sur `main`.
- Aucun déploiement de production depuis ce chantier.
- Créer une Preview Vercel et vérifier les pages concernées.
- Exécuter build, lint/tests disponibles et tests manuels responsive.
- Examiner les diffs et les éventuelles régressions.
- Ouvrir une PR documentée.
- Fusionner uniquement après validation des critères d'acceptation.

## 8. Éléments restant à vérifier

Cette première passe est une lecture statique du dépôt et de la documentation. Les points suivants ne sont pas encore validés :
- état réel des documents dans le dataset Sanity ;
- configuration CORS actuelle du projet Sanity ;
- valeurs et scopes des variables d'environnement Vercel ;
- état du backend public et de sa base MongoDB ;
- build/test en environnement propre ;
- rendu interactif réel dans un navigateur ;
- droits et disponibilité des images du catalogue WhatsApp et d'Instagram.

## 9. Prochaine action technique

Réaliser l'audit runtime (Preview Vercel, Sanity, routes, console/réseau, responsive) puis traiter P0 avant de commencer les améliorations fonctionnelles et visuelles P1/P2.
