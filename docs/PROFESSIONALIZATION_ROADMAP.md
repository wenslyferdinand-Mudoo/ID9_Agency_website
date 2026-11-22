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
| P0.1 | Atlas + Render Staging | Authentification, permissions, URI, runtime, démarrage, health checks, tests Atlas | **EN COURS — BLOQUÉ** | Déploiement `dep-dc0ad7k9v7es73b4rpig` en `update_failed`; logs du 2026-11-20 à 20:00 UTC : Atlas `bad auth`, code 8000, startup failed. Le déploiement utilise encore le commit `b3faa66` (antérieur au pin `.python-version` présent sur la tête PR #52 `1c71c15`) ; Python 3.14.10 observé ne prouve donc pas l'échec du pin. Aucun nouveau déploiement tant que l'auth Atlas n'est pas corrigée. |
| P0.2 | Vercel environnements | Séparation stricte API Preview / Production / Development | **EN COURS — BLOQUÉ** | Audit non sensible du 2026-11-20 : une seule entrée `REACT_APP_API_URL` existe et cible simultanément `preview` + `production`. Valeur masquée (type sensitive), donc l'API réellement ciblée par chaque environnement n'est pas vérifiable sans déchiffrer. Aucun changement effectué ; séparation à appliquer seulement après confirmation sécurisée de l'URL Staging et de l'URL Production. |
| P0.3 | Backend PR | Consolider #50, #52, #32 sans conflit ni perte | **EN COURS — AUDIT** | #52 contient déjà les protections CORS, le contrôle du seed et le provisioning admin explicite, mais les branches #50/#32/#52 ont divergé et touchent les mêmes fichiers (backend/server.py, workflow CI). #32 est non mergeable ; #50 a un statut Vercel failure ; #52 Vercel success. Aucun merge effectué. Reste à prouver la couverture de tests du provisioning admin et résoudre l'ordre de consolidation. |
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
| P0.1-c | Aligner le runtime Python entre Render et CI et vérifier la compatibilité Motor/PyMongo | **VALIDÉ (CI)** | Commit `c37ab8f`; `.python-version=3.12.16`, workflow lit le fichier ; run #44811200708 SUCCESS, installation Motor 3.3.1/PyMongo 4.5.0 réussie, 25 passed, 1 skipped (Atlas absent), 5 warnings. Render doit encore adopter le pin lors d'un déploiement Staging contrôlé. |
| P0.1-d | Confirmer le démarrage et le ping MongoDB Atlas | **BLOQUÉ** | Nouveau déploiement Staging réussi, ping MongoDB réussi, processus Uvicorn stable et réponse HTTP valide. |
| P0.1-e | Définir des endpoints de santé live/ready adaptés et configurer le health check Render | **EN COURS — CODE VALIDÉ, CONFIG RENDER EN ATTENTE** | `GET /health/live` et `GET /health/ready` ajoutés et couverts par CI (#44811359124 : 28 passed, 1 skipped). Le healthCheckPath Render n'est pas encore configuré ; le connecteur Render disponible ne propose pas d'action update service. |
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


### 2026-11-20 — P0.1-c — Alignement du runtime Python (implémentation en attente de CI)

- Statut : **EN COURS — CI EN COURS ; PAS ENCORE VALIDÉ**
- Branche / PR : `security/backend-hardening-staging` / PR #52 (reste Draft).
- Commit : `c37ab8f22322f7372326002aeea1b05a22aff45e`.
- Fichiers modifiés : `.python-version` (nouveau, `3.12.16`) ; `.github/workflows/backend-static.yml` (utilise `python-version-file`).
- Justification : Render utilisait 3.14.10 alors que CI ciblait la série 3.12. Python.org publie 3.12.16 le 25 octobre 2026 ; Render prend en charge le pin via `.python-version` à la racine. Références : https://www.python.org/downloads/release/python-31216/ et https://render.com/docs/python-version.
- Contrôles exécutés : inspection du workflow, du fichier de dépendances et du test Atlas sur la branche PR #52 ; déclenchement GitHub Actions run `44811200708`.
- Résultats observés : run `44811200708` était `in_progress` au dernier contrôle. Aucun déploiement Render déclenché ; AutoDeploy reste désactivé.
- Risques / limites : le pin n'est pas encore effectif sur le service Render avant un déploiement contrôlé. Les versions Motor 3.3.1 et PyMongo 4.5.0 sont toujours épinglées dans `backend/requirements.txt` ; leur compatibilité opérationnelle complète n'est pas encore certifiée. Le problème d'authentification Atlas code 8000 reste bloquant.
- Prochaine étape : attendre le résultat CI ; si succès, planifier le déploiement Staging uniquement après vérification sécurisée de l'utilisateur/URI Atlas. Ne pas lancer les tests d'intégration ni le déploiement tant que l'authentification n'est pas résolue.



### 2026-11-20 — P0.1-c — Runtime Python et dépendances validés en CI

- Statut : **VALIDÉ (CI uniquement)**.
- Branche / PR : `security/backend-hardening-staging` / PR #52 (Draft conservé).
- Commit : `c37ab8f22322f7372326002aeea1b05a22aff45e`.
- Fichiers : `.python-version` = `3.12.16` ; `.github/workflows/backend-static.yml` lit ce fichier via `python-version-file`.
- Run GitHub Actions : [#44811200708](https://github.com/wenslyferdinand-Mudoo/ID9_Agency_website/actions/runs/44811200708), conclusion **SUCCESS**.
- Étapes : checkout, setup Python 3.12.16, compileall, installation dépendances et tests réussis.
- Résultat : **25 passed, 1 skipped, 5 warnings**. Motor 3.3.1 et PyMongo 4.5.0 s'installent ensemble sur Python 3.12.16 et les tests unitaires/HTTP sélectionnés passent.
- Limite : les variables `ID9_ATLAS_STAGING_URI` et `ID9_ATLAS_STAGING_DB` sont vides dans le run ; le test Atlas a été **skipped**. Cela ne valide ni l'authentification Atlas ni le démarrage Render.
- Render : aucun nouveau déploiement déclenché ; AutoDeploy désactivé. Le service tourne encore sur le dernier déploiement en échec connu.
- Prochaine étape : P0.1-a/b (vérification sécurisée de l'utilisateur et de l'URI Atlas) avant tout déploiement contrôlé. P0.1-d/e/f restent non validés.



### 2026-11-20 — P0.1-e — Endpoints de santé ajoutés et tests réussis

- Statut : **EN COURS — endpoints validés en CI ; configuration Render en attente**.
- Branche / PR : `security/backend-hardening-staging` / PR #52 (Draft conservé).
- Commits : `9d5903aa7bc649ef1245e04c697a0db22db82eb9` (endpoints), `1c71c15ee4f934cd6cab6658d0e7356a73c6313f` (tests).
- Fichiers modifiés : `backend/server.py`, `backend/tests/test_mongo_initialization_unit.py`.
- Endpoints ajoutés : `GET /health/live` (liveness indépendante de MongoDB) et `GET /health/ready` (ping MongoDB, 503 générique si indisponible). Routes masquées du schéma OpenAPI ; aucun détail de connexion renvoyé au client.
- CI : run [#44811359124](https://github.com/wenslyferdinand-Mudoo/ID9_Agency_website/actions/runs/44811359124) **SUCCESS**, 28 passed, 1 skipped, 5 warnings.
- Le test Atlas est toujours skipped car les deux variables d'intégration ne sont pas définies dans GitHub Actions. Aucune preuve de connexion Atlas réelle.
- Limite : le connecteur Render disponible permet la lecture du service et des déploiements, mais ne propose pas d'action de mise à jour de configuration du service ; le health check path n'a donc pas été modifié. Le service ne démarre toujours pas tant que l'authentification Atlas échoue.
- Prochaine étape : résoudre P0.1-a/b (identité/permissions et URI Atlas) par le canal sécurisé, puis déployer Staging contrôlé, configurer `/health/ready` comme health check Render et valider les réponses live/ready.



### 2026-11-20 — P0.1 / P0.2 — Contrôle Render et inventaire Vercel non sensible

- Statut P0.1 : **EN COURS — BLOQUÉ** ; P0.2 : **EN COURS — BLOQUÉ, audit initial réalisé**.
- Branche / PR documentation : `docs/id9-professionalization-execution-plan` / PR #55 (Draft).
- Branche / PR backend : `security/backend-hardening-staging` / PR #52 (Draft), tête `1c71c15ee4f934cd6cab6658d0e7356a73c6313f`.
- Render : le service `id9-backend-staging` est toujours sur la branche attendue, AutoDeploy désactivé, healthCheckPath vide. Les cinq derniers déploiements sont en échec. Le dernier déploiement `dep-dc0ad7k9v7es73b4rpig` a utilisé le commit `b3faa66daa92c60030a6e4d8b454e62541787c6b`, qui est antérieur aux commits du pin Python et des health endpoints de la tête PR #52. Les logs de ce déploiement montrent Python 3.14.10 et l'échec Atlas `bad auth`, code 8000.
- Interprétation : le Python 3.14.10 observé correspond à l'ancien commit déployé ; il ne permet pas de conclure que Render ignore le fichier `.python-version`. Selon la documentation Render, ce fichier doit être à la racine du dépôt et est pris en compte au prochain build. Le pin 3.12.16 reste à vérifier sur un déploiement contrôlé, qui demeure interdit tant que l'auth Atlas n'est pas résolue.
- Vercel : projet `id9-agency-website`, framework Create React App, Node 22.x. Inventaire des variables effectué avec `decrypt=false`. Une seule entrée `REACT_APP_API_URL` est enregistrée avec les cibles `preview` et `production`. La valeur est de type sensitive et n'a pas été déchiffrée. La séparation des environnements n'est donc pas démontrée.
- Décision P0.2 : aucune modification de variable, aucun redéploiement. Il faut d'abord confirmer par canal sécurisé quelle URL publique est l'API Staging et quelle URL est Production ; ensuite créer des valeurs distinctes Preview/Production et contrôler le résultat sans exposer les secrets.
- Contrôles : lecture Render service + 5 derniers déploiements + logs d'application ; lecture métadonnées PR #52/#55 et branche backend ; lecture métadonnées Vercel avec `decrypt=false`.
- Résultat sécurité : aucun secret déchiffré ou affiché ; aucune variable, donnée, configuration Render ou déploiement modifié ; aucun merge.
- Références techniques : Render, « Setting Your Python Version » (consulté le 2026-11-20), https://render.com/docs/python-version ; Vercel, « Environment Variables » (documentation officielle), https://vercel.com/docs/environment-variables.
- Prochaine étape : faire confirmer l'authentification de `id9_staging_app` dans Atlas et mettre à jour `MONGO_URL` via Render UI ; en parallèle, obtenir la correspondance sûre entre API Staging et API Production avant tout changement Vercel.

### 2026-11-20 — P0.3 — Audit initial de consolidation des PR backend

- Statut : **EN COURS — AUDIT, aucune consolidation/merge exécutée**.
- PR examinées : #50 (ouverte, non Draft, mergeable=true), #32 (ouverte, Draft, mergeable=false), #52 (ouverte, Draft, mergeable=true).
- PR #50 : 3 fichiers modifiés ; protections CORS sans wildcard, désactivation du seed démo automatique, test de sécurité startup. Son commit a un statut Vercel **failure**.
- PR #32 : 4 fichiers modifiés ; suppression des identifiants admin par défaut, arrêt de la rotation implicite du mot de passe, documentation et test admin. Sa branche est non mergeable et son commit a un statut Vercel **success**.
- PR #52 : 12 fichiers modifiés ; implémente également le CORS explicite, le seed démo opt-in et le provisioning admin explicite, en plus de l'authentification par sessions, des contrôles d'abus, des index et des probes de santé. Son commit a un statut Vercel **success**.
- Chevauchements confirmés : backend/server.py et .github/workflows/backend-static.yml sont modifiés dans les trois PR ; #50 ajoute également backend/tests/test_startup_safety_unit.py, #32 ajoute backend/tests/test_admin_provisioning_unit.py, tandis que #52 possède son propre ensemble de tests backend. Le CORS de #52 autorise les credentials (allow_credentials=True) pour le cookie refresh ; le changement #50 avait False. Il ne faut donc pas cherry-pick/merger #50 tel quel sur #52 sans préserver le flux de session.
- Comparaison Git : #50 vs #52 = branches divergées (38 commits d'avance côté #52, 3 commits côté #50) ; #32 vs #52 = branches divergées (57 commits d'avance côté #52, 7 commits côté #32). Les commits de chaque PR ne sont pas des ancêtres directs de la tête #52.
- Vérification source sur la tête #52 : seed_admin() applique déjà la règle de #32 (pas de compte admin par défaut, pas de changement du mot de passe existant, création initiale uniquement si les deux variables sont définies). La logique est donc présente, mais la couverture de test spécifique de #32 doit être comparée aux tests de #52 avant d'écarter le test dédié.
- Décision : ne pas merger #50 ou #32 séparément ; cela introduirait des conflits/risques de régression. #52 est le candidat de consolidation, mais reste Draft et bloqué par P0.1/P0.2 et par la validation des tests réels. Aucune modification de code réalisée dans cette passe.
- Prochaine étape : comparer les tests admin/startup de #32/#50 aux tests déjà présents sur #52, puis ajouter uniquement les cas manquants sur #52 et exécuter CI. Ne pas fusionner les PR.

### 2026-11-20 — P0.3 — Couverture startup complétée sur la branche #52 (CI en attente)

- Statut : **EN COURS — MODIFICATION COMMITÉE, CI EN ATTENTE**.
- Branche / PR : security/backend-hardening-staging / PR #52 (Draft maintenu).
- Commit : 76fb3322c2238d4bc8dc05ce696c3b0e15c6adcd.
- Fichier ajouté : backend/tests/test_startup_safety_unit.py (tests des origines CORS, refus wildcard, désactivation du seed en production et opt-in explicite en développement).
- Fichier modifié : .github/workflows/backend-static.yml ; le test startup safety est maintenant inclus dans la commande pytest. Le workflow contient également le test_admin_provisioning_unit.py, présent dans la branche et couvrant configuration incomplète, préservation du compte existant et création initiale explicite.
- CI déclenchée automatiquement : run 44812717913, Backend Static Validation, event push, statut **in_progress** au dernier contrôle. Aucun résultat de test n'est encore revendiqué.
- Aucun merge, aucun déploiement Render, aucune modification Production ou de données.
- Prochaine étape : vérifier le résultat complet du run 44812717913 ; corriger toute régression avant de poursuivre la consolidation PR #50/#32/#52.


---

## 11. Revue de consolidation des PR — 2026-11-22

Cette mise à jour remplace les états antérieurs uniquement pour les PR et commits explicitement vérifiés ci-dessous. Un contrôle Vercel Preview réussi ne remplace pas les tests fonctionnels, l'intégration Staging ou une revue de sécurité.

### 11.1 P0 — Backend et validation API

| PR | État observé au 2026-11-22 | Décision technique |
|---|---|---|
| #50 | Ouverte, non Draft, `mergeable_state=dirty`; contrôles Python isolés et Preview verts sur son HEAD | Ne pas merger séparément : ses protections CORS et seed sont déjà présentes dans #52, avec une politique CORS différente à préserver. |
| #52 | Ouverte, Draft, `mergeable_state=dirty`; contrôles Python isolés verts sur son HEAD | Branche candidate de consolidation : contient CORS explicite, seed opt-in, provisioning admin explicite, sessions, limites de débit, validation Pydantic, index et health checks. Reste à réconcilier avec main et à valider en Staging. |
| #66 | Ouverte, Draft, cible `security/backend-hardening-staging`; Preview vert, aucun contrôle backend dédié observé sur son HEAD | Dépendance conservée vers #52. Le trim/rejet des champs whitespace-only complète les bornes de validation de #52 ; exiger une exécution backend CI sur la tête #66 avant validation. |
| #32 | Ouverte, Draft, `mergeable_state=dirty`; contrôles Python isolés et Preview verts | Ne pas merger séparément : la logique de provisioning explicite est déjà présente dans #52. Comparer et transférer uniquement les cas de test manquants, sans perdre la couverture admin dédiée. |
| #61 | Ouverte, Draft, `mergeable_state=dirty`; contrôles Python isolés et Preview verts | Garder comme référence de règles métier contact, mais réconcilier les limites/normalisations avec #52 et #66 pour éviter trois implémentations concurrentes. |

**Contrôles source effectués :** sur la branche #52, `seed_admin()` n'utilise pas d'identifiants par défaut et ne modifie pas le mot de passe d'un administrateur existant ; les champs Contact ont des longueurs bornées ; le rate limiting MongoDB est présent ; le middleware CORS utilise une liste explicite et autorise les credentials pour les sessions. Le code de #66 ajoute `field_validator` sur `name` et `message` et nettoie les champs facultatifs.

**Blocages P0 :**
- Les branches #50, #52, #32, #61 touchent des fichiers backend communs et certaines sont non mergeables ; aucune fusion automatique.
- #52 reste bloquée par la recette Atlas/Render Staging : authentification, démarrage, health checks, persistance et tests isolés non démontrés.
- #66 doit obtenir un workflow backend passant sur son propre HEAD ou un résultat équivalent explicitement rattaché à ce commit.
- Aucun test ne doit écrire en MongoDB Production ; les tests Atlas doivent rester limités à une base de test autorisée et isolée.

### 11.2 P1 — Portfolio et navigation accessible

| PR | État observé | Décision |
|---|---|---|
| #69 | Ouverte, Draft, `mergeable_state=clean`; tests frontend, build production, backend isolé et Preview verts ; Preview READY | Implémentation de référence à retenir pour la résolution Sanity → API historique → projets fondateur. |
| #62 | Ouverte, Draft, `mergeable_state=dirty`; tests frontend et Preview verts | Doublon fonctionnel de #69. Ne pas fusionner les deux ; comparer les différences restantes puis fermer #62 uniquement après confirmation que #69 conserve tous les cas de test utiles. |
| #67 | Ouverte, Draft, `mergeable_state=dirty`; Preview verte, exécution CI clavier à confirmer | Conserver le périmètre dédié navigation mobile ; résoudre les conflits puis exécuter tests clavier, focus, Escape, Tab/Shift+Tab et recette mobile. |

### 11.3 P1 — Consolidation SEO et routing

| PR | État observé | Décision |
|---|---|---|
| #73 | Ouverte, Draft, `mergeable_state=clean`; tous les contrôles CI du HEAD `179c9d5` verts ; Preview Vercel READY | Branche de référence pour le prerender SEO des routes publiques et des détails portfolio. |
| #34 | Ouverte, Draft, `mergeable_state=dirty`; Preview verte uniquement | Ne pas intégrer en bloc : ses métadonnées client-side de détail portfolio recouvrent une partie de #73. Vérifier les comportements complémentaires avant extraction ciblée. |
| #21 | Ouverte, non Draft, `mergeable_state=dirty`; Preview verte uniquement | Conserver les fonctionnalités uniques (redirection /journal, 404, noindex admin/inconnu, normalisation) et les réconcilier avec #73 ; ne pas fusionner les deux branches telles quelles. |

**Recette Preview #73 effectuée :**
- Déploiement Preview du commit `179c9d5` : **READY**.
- Routes `/`, `/about`, `/services`, `/portfolio`, `/blog`, `/contact` : réponse HTTP 200 et titres/canoniques propres à chaque route.
- `/sitemap.xml` : réponse HTTP 200, XML valide visuellement, six routes statiques et entrées portfolio observées.
- `/portfolio/mudoo` : réponse HTTP 200, canonical absolu, Open Graph, Twitter Card et JSON-LD CreativeWork présents.
- Limite : recette HTTP/HTML uniquement ; pas une recette navigateur complète, pas de validation des parcours JS, pas d'audit Lighthouse ni de test crawler externe. Les en-têtes CORS observés sur la réponse sitemap sont `access-control-allow-origin: *` ; ne pas confondre ce header de ressource publique Vercel avec la politique CORS de l'API backend.

### 11.4 P2 — Dépendances, UX, médias et API frontend

| PR | État observé | Décision |
|---|---|---|
| #54 | Ouverte, Draft, `mergeable_state=unstable`, aucun check-run attaché au HEAD consulté | Refaire `npm ci`, `npm audit`, tests et build sur le lockfile candidat ; aucune fusion sur la seule base d'un ancien run documenté dans la description. |
| #53 | Ouverte, Draft, `mergeable_state=dirty`; build React/Sanity SEO vert | Audit utile mais recouvre #21, #34, #73 et #8 sur RouteSeo, vercel.json, pages portfolio et 404. Extraire les corrections uniques après comparaison des diffs. |
| #8 | Ouverte, Draft, `mergeable_state=dirty`; Preview verte uniquement | Garder le correctif de proportions d'images comme périmètre distinct ; valider visuellement les cartes et galeries sur mobile/tablette/desktop. |
| #7 | Ouverte, Draft, `mergeable_state=dirty`; Preview verte uniquement | La compatibilité URL API est à comparer avec #4 et #52 ; valider une vraie réponse JSON d'API avant adoption. |
| #55 | Ouverte, Draft, `mergeable_state=clean`; Preview verte | Cette PR reste le registre documentaire et doit être actualisée à chaque lot. |
| #4 | Ouverte, non Draft, `mergeable_state=dirty`; tests backend et build frontend verts | PR transversale ancienne qui recouvre workflows, Vercel, API et SEO ; ne pas merger sans découpage et réconciliation avec les PR ciblées plus récentes. |

### 11.5 Ordre d'exécution ajusté

1. **P0-A — #52 + #66 + #61 :** établir une seule base backend, intégrer les validations whitespace-only et les règles métier Contact, compléter la couverture admin issue de #32, puis résoudre les conflits avec main.
2. **P0-B — Staging :** valider secrets par canal sécurisé, Atlas, démarrage, sessions, rate limits, persistance et health checks ; aucun déploiement Production.
3. **P1-A — #69 :** retenir une seule implémentation de résolution portfolio ; fermer le doublon #62 seulement après comparaison complète.
4. **P1-B — #67 :** résoudre les conflits et valider les interactions clavier et tactiles.
5. **P1-C — #73 + fonctionnalités uniques de #21/#34 :** garder le prerender comme base, intégrer uniquement redirection, 404/noindex et détails SEO manquants après tests dédiés.
6. **P2-A — #54 :** audit npm reproductible, sans `--force`, sans mise à niveau majeure non justifiée.
7. **P2-B — #53/#8/#7/#4 :** extraire les corrections uniques, supprimer les modifications redondantes, valider médias, configuration API, UX et qualité.
8. **P2-C — #55 :** tenir le registre à jour avec commits, runs, Previews et limites exactes.

### 11.6 Politique de fusion

Aucune PR de ce lot n'est considérée comme prête à fusionner sur la seule base d'un statut Preview vert. Une fusion exige : HEAD vérifié, branche sans conflit, Draft levé après revue, checks requis verts sur le HEAD exact, tests adaptés, recette fonctionnelle et absence de risque de perte de données. Les dépendances backend/Atlas et les PR SEO/UX qui se chevauchent doivent être consolidées dans l'ordre indiqué. Aucun merge Production n'est exécuté dans cette mise à jour.


### 2026-11-22 — P1 — Doublon portfolio fermé et défaut de routing identifié sur Preview #73

- Statut : **#62 FERMÉ COMME DOUBLON ; #69 CONSERVÉ ; #73 À COMPLÉTER AVANT SORTIE DU DRAFT**.
- PR #62 : fermée sans merge le 2026-11-22 après comparaison de `portfolio-resolution.js` et des tests avec #69. La branche #69 ajoute des validations plus strictes (slug/titre obligatoires, correspondance exacte du slug demandé, rejet des tableaux et enregistrements malformés), attend le fallback fondateur asynchrone et couvre également la fusion des sources de listing. #69 possède des tests/build frontend verts et une Preview READY. Aucun code ou contenu CMS supprimé.
- PR #73 : HEAD `179c9d5d1c10cde2cef64d3cf557612a3311b69f`, contrôles CI verts, Preview READY. La recette HTTP confirme les routes publiques statiques et les pages projet générées.
- Défaut reproduit sur Preview #73 : `/journal` et `/this-route-should-404` renvoient tous deux HTTP 200 avec le document HTML d'accueil et son canonical `/`. Le fallback SPA ne distingue donc pas les routes inconnues et l'ancien chemin journal n'est pas redirigé côté serveur.
- Décision : intégrer sélectivement les fonctionnalités uniques de #21 (redirection permanente `/journal → /blog`, page 404 et `noindex` des routes admin/inconnues) dans le socle #73, sans remplacer aveuglément le RouteSeo existant : la logique SEO actuelle de détail projet doit continuer à préserver les titres, descriptions, images et JSON-LD pré-rendus.
- Limite : une page 404 côté React et un `noindex` après hydratation ne garantissent pas à eux seuls un véritable statut HTTP 404 pour les URL inconnues. La configuration Vercel doit être testée pour distinguer routes publiques valides, détails blog, détails portfolio générés et routes inconnues ; ne pas déclarer ce point résolu tant que le code HTTP 404 est vérifié.
- Contrôle des en-têtes : le sitemap public a renvoyé `access-control-allow-origin: *` ; c'est une réponse d'asset public servie par Vercel et non la configuration CORS du backend FastAPI.
- Prochaine étape : traiter la redirection et le rendu 404 dans une modification ciblée de #73, avec tests de routing/SEO et nouvelle recette HTTP des routes connues et inconnues. Garder #21 ouvert jusqu'à extraction et validation de toutes ses fonctionnalités uniques.


### 2026-11-22 — P0 — Régression métier contact à résoudre avant consolidation backend

- Statut : **BLOQUÉ — réconciliation fonctionnelle requise**.
- Comparaison source effectuée entre `main`, #52 et #61 : `main` et #61 conservent `send_contact_email()` et le flux de notification Resend après persistance du brief ; la tête #52 a supprimé ce mécanisme et `submit_contact()` se limite à insérer le document MongoDB puis renvoyer la réponse.
- Conséquence : intégrer #52 tel quel pourrait préserver le stockage des briefs mais supprimer l'e-mail de notification attendu par l'équipe ID9. Le changement n'est pas couvert par les tests de validation Pydantic.
- #61 apporte également `str_strip_whitespace=True`, des limites de longueur sur les champs obligatoires/facultatifs, ainsi que des tests dédiés. #66 apporte le rejet explicite des champs obligatoires composés uniquement d'espaces et le nettoyage des champs facultatifs, mais son test backend n'a pas encore été observé sur le HEAD de #66.
- Décision : ne pas fermer #61 et ne pas intégrer #52 sans rétablir ou remplacer explicitement le flux de notification, conserver le rate limiting MongoDB de #52, ajouter des tests d'endpoint pour succès Resend, indisponibilité Resend, persistance du brief et statut de notification, puis aligner le message frontend pour éviter les soumissions en double lorsqu'un brief est déjà sauvegardé.
- Point métier à trancher dans l'implémentation : lorsque l'enregistrement MongoDB réussit mais que Resend échoue, le backend doit signaler clairement que le brief est sauvegardé et que seule la notification a échoué. Ne pas répondre par un échec ambigu qui incite à renvoyer le même brief sans mécanisme d'idempotence.
- Aucune donnée, aucun secret, aucune variable Render ou service Resend n'a été modifié pendant cet audit.


### 2026-11-22 — P0 — Audit npm complet de la tête utilisée par Preview #73

- Statut : **BLOQUÉ — vulnérabilités critiques et élevées à traiter**.
- Source : artefact GitHub Actions `frontend-npm-audit-reports` du run `45081326472`, HEAD `ef47def90a267033bb99dc17b66372fb69b65f5c`, rapports `npm-audit-full.json` et `npm-audit-production.json`.
- Audit complet : **53 vulnérabilités** — 2 critiques, 31 élevées, 9 modérées, 11 faibles.
- Audit `--omit=dev` : **52 vulnérabilités** — 2 critiques, 31 élevées, 8 modérées, 11 faibles. Ces chiffres indiquent que la majorité des alertes n'est pas limitée aux dépendances de développement.
- Les deux alertes critiques concernent les dépendances transitives `proxy-addr` et `shell-quote`. Les alertes élevées incluent notamment `axios`, `postcss`, `react-router-dom`, `react-scripts`, ainsi que des dépendances de la chaîne CRA/SVGR/Webpack.
- Le workflow d'audit est explicitement **informatif** et ne fait pas échouer la CI lorsqu'il détecte des vulnérabilités. Un statut CI vert ne signifie donc pas « dépendances sûres ».
- Décision : reclasser PR #54 de P2 en **P0 sécurité**. Vérifier son lockfile candidat sur son HEAD actuel avec `npm ci`, audit complet + production, tests et build. Prioriser l'élimination des deux critiques et des alertes élevées corrigibles sans migration majeure ; isoler les dépendances CRA nécessitant une migration architecturale distincte.
- Ne pas utiliser `npm audit fix --force`. Ne pas fusionner #54 avant d'avoir une comparaison chiffrée avant/après sur les mêmes commandes, une revue des changements transitifs et un build/test complet.
- Limite : l'artefact analysé correspond au lockfile de la branche #73 (héritée de main), pas au lockfile de la branche #54. Le nombre de vulnérabilités restant après les modifications #54 n'est donc pas encore établi.


### 2026-11-22 — Mise à jour après consolidation P0 et correction du routing

#### P0 — Backend

- PR #74 créée depuis le HEAD actuel de `main` (base `951cf176`) pour remplacer la branche #52 fortement divergente (43 commits en avance / 47 en retard).
- PR #74 est **Draft**, mergeable sur la base actuelle, sans conflit déclaré.
- La logique #52 a été transposée dans une branche propre : CORS explicite, sessions/refresh, provisioning admin, seed opt-in, rate limiting, validations, indexes, startup/health checks, tests, et variables Staging.
- La notification Resend a été restaurée avec persistance avant envoi, exécution dans un worker thread, timeout 15 s, `email_status=sent|failed`, HTTP 202 si le brief est sauvegardé mais l'e-mail échoue, et avertissement frontend évitant une resoumission ambiguë.
- Le workflow exact du HEAD #74 `4eb4638` : **43 passed, 1 skipped, 5 warnings** pour le backend ; le test Atlas est skipped faute de secrets/variables Staging. Les tests frontend sont verts ; le build production est encore en cours au moment de cette mise à jour. Le contrôle de pins d'actions est vert.
- #61 et #66 sont fermées comme doublons après intégration de leurs validations/tests et préservation du roadmap commercial dans #55.
- #50 et #32 restent ouvertes temporairement comme branches de référence. Elles ne doivent pas être fusionnées indépendamment ; leurs protections CORS/seed et provisioning admin sont incluses dans #74. Les fermer après validation complète de #74.
- #52 reste ouverte jusqu'à la validation du nouveau PR #74, puis sera fermée comme branche supersédée. Aucun merge ni déploiement Staging/Production.

#### P1 — Portfolio et SEO

- #62 est fermée comme doublon de #69 ; #69 est conservée comme implémentation de référence, avec validations et couverture de tests plus complètes.
- PR #73 : HEAD `07c1258`, tous les checks GitHub (frontend tests/build, tests backend isolés, pins d'actions, audit workflow) sont verts.
- #73 intègre la redirection permanente `/journal → /blog`, la page 404 bilingue, `noindex` pour admin/inconnu après hydratation, et un endpoint Vercel `/api/not-found` renvoyant HTTP 404 pour les routes non reconnues.
- Le test unitaire confirme le fallback vers la fonction 404, mais le statut HTTP réel n'a pas encore été vérifié sur une Preview correspondant au HEAD `07c1258`.
- Dernière Preview Vercel READY observée : commit `53c2b4b`, antérieur à l'endpoint 404. Les commits plus récents n'ont pas reçu de nouvelle Preview.
- Une tentative explicite de créer une Preview via l'API Vercel a été refusée : quota `api-deployments-free-per-day` supérieur à 100, `retryAfter=86400`. Ne pas réessayer avant la levée du quota ou une action du propriétaire du compte. Aucun déploiement Production n'a été tenté.
- Le statut HTTP 404 reste donc **non validé en conditions Vercel**. Garder #73 Draft jusqu'à une Preview sur le HEAD actuel et vérifier `/this-route-should-404` retourne bien 404, `/journal` redirige vers `/blog`, les routes statiques/projets restent 200, et les routes admin portent `X-Robots-Tag: noindex, nofollow`.

#### P0 — Dépendances npm

- L'audit du lockfile de la branche #73 (héritée de main) indique 53 vulnérabilités au total, dont 2 critiques et 31 élevées ; `--omit=dev` en indique 52, dont les mêmes 2 critiques et 31 élevées.
- Le workflow d'audit est informatif et ne bloque pas la CI. Le vert des checks ne signifie pas que les dépendances sont exemptes de vulnérabilités.
- #54 reste à auditer sur son propre HEAD ; ses versions candidates semblent corriger les ranges critiques `proxy-addr` et `shell-quote`, mais le résultat exact de l'audit après modification n'est pas encore établi. Aucun merge de #54 avant audit complet, tests et build.

#### État de consolidation des PR

- Fermées comme doublons intégrés ou supersédés : **#61, #62, #66**.
- PR actives de référence pour les lots en cours : **#69 (portfolio), #73 (SEO/routing), #74 (backend sécurité)**.
- PR #50, #32 et #52 : à fermer comme doublons seulement après validation complète du lot #74.
- PR #21 et #34 restent ouvertes jusqu'à extraction et vérification de toutes leurs fonctionnalités SEO uniques ; ne pas fusionner leurs branches en bloc.


### 2026-11-22 — Clôture des branches P0 redondantes

Après comparaison et transfert des fonctionnalités, les PR suivantes sont maintenant fermées **sans merge** :

- **#50** — protections CORS et seed : intégrées dans #74.
- **#32** — provisioning explicite admin : intégré dans #74 ; les améliorations de guide ont été préservées dans `docs/SETUP_GUIDE.md` sur #55.
- **#52** — branche de sécurité ancienne, 47 commits derrière main : remplacée par la branche propre #74.
- **#61** — règles métier contact et Resend : réintégrées dans #74 ; roadmap commercial préservé sur #55.
- **#66** — normalisation whitespace : réintégrée dans #74.
- **#62** — doublon portfolio : remplacé par #69.

PR #74 reste l'unique branche de référence backend sécurité. Le HEAD actuel est `0f3b9465cf4c2bc679a8d27073a6814e03ed5337`; les tests backend sont verts, les contrôles d'actions sont verts, et le build frontend est en cours après la mise à jour documentaire. PR #74 reste Draft jusqu'à la validation complète de ce HEAD et des gates Staging.

Les PR #69 et #73 restent Draft. #69 conserve la résolution portfolio de référence. #73 a des checks GitHub verts sur `07c1258`, mais la Preview READY disponible est encore sur `53c2b4b`, donc antérieure au fallback HTTP 404. Une nouvelle Preview n'a pas pu être créée car Vercel a renvoyé le quota `api-deployments-free-per-day` (>100, délai annoncé 24 h). Le statut HTTP 404 réel reste à valider dès que le quota le permettra.

Le nombre de PR ouvertes a été réduit en fermant les doublons ; aucun code n'a été fusionné vers main et aucun déploiement Production n'a été déclenché.
