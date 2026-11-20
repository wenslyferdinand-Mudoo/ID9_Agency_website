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


---

# 10. Plan d'exécution contrôlé — suivi anti-doublon

Dernière mise à jour : 2026-11-20  
Branche de suivi : `docs/id9-professionalization-execution-plan`  
Référence de départ : `main@0270127badaed766f7df844f27512b29b71c5912`

## Règles de gouvernance obligatoires

1. Ce fichier est le registre unique de progression pour la professionnalisation du site. Avant chaque intervention, consulter ce registre, les PR ouvertes, les commits et les fichiers concernés.
2. Ne jamais refaire une tâche marquée **VALIDÉE** sans nouveau défaut reproductible ou régression documentée.
3. Une tâche n'est **VALIDÉE** qu'après preuve vérifiable : commit/PR, résultat CI, test d'intégration, réponse HTTP, capture/recette navigateur ou vérification de configuration non sensible. Une modification de code seule ne suffit pas.
4. Mettre à jour ce fichier dans la même branche/PR que chaque lot de travail, en indiquant statut, date, commit, fichiers touchés, tests exécutés, résultat, limites et tâche suivante.
5. Ne jamais pousser directement sur `main`. Travailler sur une branche dédiée et utiliser des PR ciblées. Réutiliser les PR existantes lorsqu'elles couvrent déjà le même périmètre ; ne pas créer une PR concurrente qui modifie les mêmes fichiers sans nécessité.
6. Aucun merge automatique, aucune publication Production, aucun changement des données MongoDB Production ou du dataset Sanity Production sans demande explicite supplémentaire et validation préalable.
7. Ne jamais afficher, récupérer dans les logs, inscrire dans Git ou transmettre les secrets. Ne jamais demander une URI MongoDB complète ou un mot de passe dans le chat.
8. Les tests Atlas doivent être limités à une base Staging dont le nom commence par `id9_staging_test_`. Les tests doivent nettoyer uniquement leurs propres documents ; aucune suppression de collection ou de base.
9. Avant toute modification de données, de CMS, de schéma ou de migration : sauvegarde/export vérifié, inventaire, stratégie de retour arrière et tests.
10. Après chaque phase, arrêter si un critère de sécurité ou d'acceptation échoue. Documenter le blocage et ne pas passer à la phase dépendante.

## Tableau de bord d'avancement

Légende : **À FAIRE** = non commencé ; **EN COURS** = intervention active ; **BLOQUÉ** = dépendance ou preuve manquante ; **VALIDÉ** = critères et preuves vérifiés. Les statuts ne doivent jamais être déduits d'une simple modification de fichier.

| ID | Phase | Livrable | Statut au 2026-11-20 | Preuve / remarque |
|---|---|---|---|---|
| P0.1 | Atlas + Render Staging | Authentification, permissions, URI, runtime, démarrage, health checks, tests Atlas | **EN COURS — BLOQUÉ** | Déploiement `dep-dc0ad7k9v7es73b4rpig` en `update_failed`; logs du 2026-11-20 à 20:00 UTC : Atlas `bad auth`, code 8000, startup failed. Python Render 3.14.10 contre CI 3.12. Aucune preuve de ping Atlas réussi. |
| P0.2 | Vercel environnements | Séparation stricte API Preview / Production / Development | **À FAIRE** | L'audit a constaté `REACT_APP_API_URL` ciblée Preview + Production ; valeur non déchiffrée et cible effective à confirmer. |
| P0.3 | Backend PR | Consolider #50, #52, #32 sans conflit ni perte | **À FAIRE** | PR #50 ouverte, #52 Draft, #32 Draft. Pas de merge autorisé dans ce chantier. |
| P1.1 | Site UX / SEO | Finaliser les corrections existantes | **EN COURS** | PR #53 Draft ; contrôler son CI, Preview, diff et tests navigateur avant de la considérer terminée. |
| P1.2 | Dépendances frontend | Réduire les vulnérabilités sans mises à jour forcées | **EN COURS** | PR #54 Draft ; état rapporté : 35 vulnérabilités restantes, 0 critique. Refaire un audit npm à partir du lockfile actuel avant validation. |
| P1.3 | Portfolio / Sanity | Une source de vérité, modèle éditorial, administration cohérente | **À FAIRE** | Audit initial existant dans ce fichier ; aucune migration de données autorisée sans export et comparaison. |
| P1.4 | Parcours fonctionnels | Formulaires, authentification admin, administration, contact | **À FAIRE** | Tests E2E et contrôles réseau à établir. |
| P1.5 | WCAG / SEO | Audits mesurés et corrections vérifiées | **À FAIRE** | Scores Lighthouse/WCAG non mesurés ; ne pas annoncer de scores sans exécution. |
| P2.1 | Performance | Images, JS, fonts, Core Web Vitals | **À FAIRE** | Tailles d'images identifiées dans l'audit ; mesures terrain manquantes. |
| P2.2 | Direction artistique | Cohérence responsive et finition premium | **À FAIRE** | Ne pas remplacer l'identité visuelle existante ; procéder par corrections ciblées. |
| P2.3 | Domaine / observabilité | Domaine personnalisé, monitoring, alertes et procédures | **À FAIRE** | Domaine personnalisé non confirmé/configuré ; ne pas changer le canonical avant vérification DNS et Vercel. |

## P0.1 — Procédure détaillée : MongoDB Atlas et Render Staging

### État de départ factuel

- Service Render : `id9-backend-staging`, ID `srv-dc08tkg8v5cc738uetm0`.
- Branche de service : `security/backend-hardening-staging`.
- URL Staging : `https://id9-backend-staging.onrender.com`.
- Déploiement récent : `dep-dc0ad7k9v7es73b4rpig`, commit `b3faa66daa92c60030a6e4d8b454e62541787c6b`, statut `update_failed`.
- Dernier message bloquant : `pymongo.errors.OperationFailure: bad auth : authentication failed`, code Atlas 8000, suivi de `Application startup failed` et absence de port ouvert.
- Runtime Render observé : Python 3.14.10. Workflow GitHub observé : Python 3.12.
- Sur la branche #52, `backend/requirements.txt` fixe Motor 3.3.1 et PyMongo 4.5.0 ; aucun fichier `.python-version` n'existe à la racine.
- Le test `backend/tests/test_atlas_staging_integration.py` existe sur la branche #52, pas sur `main`. Il exige `ID9_ATLAS_STAGING_URI` et `ID9_ATLAS_STAGING_DB`, refuse les bases qui ne commencent pas par `id9_staging_test_` et nettoie les documents de test qu'il crée.

### Sous-étapes et critères de sortie

| Sous-ID | Action | Statut | Critère de validation |
|---|---|---|---|
| P0.1-a | Confirmer l'utilisateur Atlas applicatif Staging et ses rôles, sans afficher de secret | **BLOQUÉ** | Vérification Atlas prouvant l'utilisateur applicatif attendu et les droits limités aux bases Staging nécessaires. |
| P0.1-b | Vérifier la construction de `MONGO_URL` : nom utilisateur, encodage URL du mot de passe, hôte/cluster, nom de base, `authSource` | **BLOQUÉ** | Validation côté service par diagnostic sans valeur secrète et ping réussi ; ne jamais imprimer l'URI. |
| P0.1-c | Aligner le runtime Python entre Render et CI et vérifier la compatibilité Motor/PyMongo | **À FAIRE** | Version unique définie dans un fichier versionné à la racine, workflow CI qui lit ce fichier, installation et tests réussis. Choisir la version après vérification de compatibilité ; aucune modification de variable Render secrète. |
| P0.1-d | Confirmer le démarrage et le ping MongoDB Atlas | **BLOQUÉ** | Nouveau déploiement Staging réussi, ping MongoDB réussi, processus Uvicorn stable et réponse HTTP valide. |
| P0.1-e | Définir des endpoints de santé live/ready adaptés et configurer le health check Render | **À FAIRE** | Endpoints définis sans fuite d'informations ; readiness vérifie la dépendance requise ; tests HTTP réussis avant configuration Render. |
| P0.1-f | Exécuter les tests Atlas d'intégration sur la base isolée | **BLOQUÉ** | Ping préalable confirmé, base `id9_staging_test_*`, tests passants, nettoyage vérifié et absence d'impact hors données de test. |

**Règle de blocage P0.1 :** tant que P0.1-a/b/d ne sont pas vérifiés et que le ping Atlas n'est pas réussi, ne pas exécuter les tests d'intégration qui écrivent en base, ne pas modifier les données, ne pas déclencher un nouveau déploiement à répétition et ne pas prétendre que Staging est opérationnel. La correction d'un secret/identifiant doit être effectuée dans Atlas/Render par un canal sécurisé ; l'assistant ne doit jamais demander ni révéler sa valeur.

### Déroulement d'exécution de toutes les phases

Pour chaque phase :
1. Lire ce tableau et l'état GitHub actuel (branches, commits, PR, checks).
2. Identifier les corrections déjà présentes dans les PR ouvertes et les commits récents.
3. Choisir une seule PR/branche cible pour le périmètre ; éviter les changements concurrents.
4. Implémenter le lot minimal nécessaire.
5. Exécuter les contrôles statiques, tests unitaires, tests d'intégration et vérifications Preview adaptés.
6. Contrôler le diff, les secrets, les régressions, les effets de bord et le statut de CI.
7. Mettre à jour le statut ici avec les références exactes.
8. Passer à l'étape suivante uniquement lorsque les critères de sortie sont démontrés.

## Journal d'exécution

### 2026-11-20 — Initialisation du registre

- Réutilisation du fichier existant `docs/PROFESSIONALIZATION_ROADMAP.md` : aucun second fichier de roadmap créé.
- Relecture des PR ouvertes : #54, #53, #52, #50, #34, #32, #21, #8, #7 et #4.
- Relecture du service Render Staging, des cinq derniers déploiements et des logs les plus récents.
- Confirmation du blocage Atlas `bad auth` / code 8000 ; le dernier déploiement est en échec.
- Confirmation du décalage Python Render 3.14.10 / GitHub Actions 3.12 et absence de fichier de version Python racine.
- Vérification du code de test Atlas sur la branche #52 : tests opt-in et garde-fou `id9_staging_test_*`.
- Aucun secret consulté ou exposé ; aucune variable Render/Atlas modifiée ; aucune base ni donnée touchée ; aucun déploiement déclenché.
- **Prochaine action :** traiter P0.1-c (alignement Python reproductible) sur une branche dédiée, puis demander une validation sécurisée de l'identité/URI Atlas si le ping échoue toujours. P0.1-a/b/d restent bloquées par l'authentification.

### Format obligatoire de mise à jour après chaque intervention

```md
### YYYY-MM-DD — [ID de tâche] — [résultat]
- Statut : À FAIRE / EN COURS / BLOQUÉ / VALIDÉ
- Branche / PR :
- Commit :
- Fichiers modifiés :
- Contrôles exécutés :
- Résultats observés :
- Risques / limites :
- Prochaine étape :
```
