# ID9_AGENCY — Roadmap d'amélioration complète

> **Statut :** plan de travail initial, à exécuter par lots et à valider par preuves.  
> **Périmètre :** application React, API FastAPI, MongoDB, Sanity CMS, back-office et déploiement Vercel.  
> **Règle de conduite :** renforcer l'existant. Ne pas réécrire une fonctionnalité déjà opérationnelle sans démontrer un défaut, un risque ou un gain mesurable.

## 1. État initial observé

L'audit du dépôt a confirmé les éléments suivants :

- Frontend React 19 / Create React App avec CRACO, dossier `frontend/`.
- API FastAPI dans `backend/server.py`, Motor/MongoDB, routes d'authentification, contact, portfolio, blog et services.
- Studio Sanity dans `studio/`.
- Déploiement Vercel associé au dépôt, projet `id9-agency-website`, domaine `id9-agency-website.vercel.app`.
- Le jeu de tests existant `backend/tests/test_id9_backend.py` utilise `requests` et vise par défaut une ancienne Preview distante. Il crée et supprime des données de contact, portfolio et blog : **il ne doit pas être exécuté en CI**.
- Le backend possède une initialisation qui crée un administrateur et synchronise son mot de passe avec la variable d'environnement au démarrage.
- Des valeurs de repli faibles existent dans la configuration d'administration et CORS (`admin123` et `*`). Elles doivent être éliminées avant toute mise en production sécurisée.
- Le secret JWT est lu depuis l'environnement. Sa présence, son entropie et sa rotation doivent être contrôlées.
- Les routes publiques de détail des articles doivent être vérifiées pour empêcher l'exposition de brouillons.
- Le frontend conserve le jeton d'administration dans `localStorage` : évaluer le risque XSS et concevoir une migration de session adaptée à l'architecture avant de modifier le mécanisme.
- Les tests historiques disponibles ne sont pas une preuve de l'état actuel et ne remplacent pas une suite isolée.

Cet état est une photographie du code consulté, pas une certification de sécurité ni une validation fonctionnelle complète.

## 2. Principes d'exécution

1. **Audit avant modification :** cartographier les routes, composants, modèles, flux de données et intégrations.
2. **Pas de régression :** tests de caractérisation avant les changements sensibles.
3. **Données protégées :** aucun test sur production, aucun nettoyage de base réelle, aucune migration destructive.
4. **Séparation des environnements :** bases distinctes local / CI / staging / production et secrets distincts.
5. **Changements atomiques :** une branche et une PR par chantier cohérent.
6. **Preuves obligatoires :** CI verte, tests reproductibles, logs et captures pertinentes avant validation.
7. **Aucune publication automatique en production depuis une branche de travail.**
8. **Pas de faux indicateurs :** ne pas afficher de KPI, témoignage, résultat client ou certification non vérifiable.

## 3. Priorités

| Priorité | Chantier | Résultat attendu | Critère de sortie |
|---|---|---|---|
| P0 | CI et tests isolés | Contrôle automatique sur chaque PR | Backend tests + frontend build verts |
| P0 | Sécurité backend | Auth, secrets, CORS, permissions, validation | Matrice de tests sécurité verte |
| P0 | Protection des données | Environnements, sauvegardes, restauration | Restauration documentée et testée |
| P1 | Fiabilité API | Contrats, erreurs, pagination, observabilité | Contrats documentés et tests |
| P1 | Authentification frontend | Session sûre, expiration, déconnexion | Tests XSS/session et parcours validés |
| P1 | Contact / CRM | Capture fiable et suivi commercial | Parcours de bout en bout validé |
| P1 | Portfolio / Sanity | Source de vérité, fallback explicite | Données cohérentes et cas d'erreur gérés |
| P2 | UX et accessibilité | Parcours cohérents, clavier, mobile | Audit WCAG 2.2 AA documenté |
| P2 | SEO | Métadonnées, sitemap, canonical, schema | Contrôle de toutes les routes publiques |
| P2 | Performance | Images, JS, animations, Core Web Vitals | Budgets définis et mesurés |
| P2 | Blog éditorial | Recherche, catégories, pagination, partage | Parcours éditorial complet |
| P3 | Analytics | Mesure respectueuse de la vie privée | Événements documentés et vérifiés |

---

## 4. Chantier P0 — Qualité logicielle et CI

### Déjà installé dans cette branche

- Workflow GitHub Actions déclenché sur les Pull Requests et les pushes sur `main`.
- Service MongoDB isolé pour les tests API.
- Tests backend locaux utilisant FastAPI `TestClient` et HTTPX, sans serveur distant.
- Vérification de build du frontend.
- Permissions GitHub minimales en lecture seule et concurrence par branche.

### À compléter

- Migrer progressivement les tests de `test_id9_backend.py` vers des tests locaux isolés. Ne pas lancer l'ancienne suite distante dans le workflow.
- Ajouter des fixtures et une base dédiée par exécution.
- Ajouter les tests des erreurs 401/403/404/422, des rôles, des tokens expirés, de la validation et des règles de publication.
- Ajouter tests frontend ciblés pour navigation, formulaire contact, authentification admin et états de chargement/erreur.
- Ajouter lint et typage seulement après configuration réelle et correction des erreurs existantes ; ne pas utiliser `|| true`.
- Publier rapports de couverture comme artefacts, puis définir un seuil progressif basé sur une baseline réelle.
- Épingler les versions des Actions tierces à des SHA vérifiés et activer Dependabot pour les dépendances GitHub Actions.

**Critère :** toute PR doit échouer clairement si une suite échoue ou si le build ne passe pas. Aucun test ne contacte une Preview, une base de production ou un compte réel.

## 5. Chantier P0 — Sécurité backend

### Authentification et secrets

- Supprimer tout mot de passe administrateur de secours connu ou prévisible.
- Refuser le démarrage en environnement production si `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` ou les paramètres obligatoires sont absents ou invalides.
- Ne jamais réinitialiser silencieusement le mot de passe d'un administrateur existant à chaque démarrage. Prévoir une procédure explicite de rotation.
- Générer un secret JWT aléatoire d'au moins 256 bits, le stocker dans le gestionnaire de secrets de l'hébergeur et documenter sa rotation.
- Réévaluer la durée de vie des tokens, ajouter révocation/rotation si nécessaire et gérer proprement expiration et déconnexion.
- Ne jamais placer de secret backend dans le bundle React ou dans Git.

### Autorisations et API

- Construire une matrice route × rôle × permission et tester chaque endpoint d'écriture.
- Vérifier l'accès aux brouillons : les routes publiques de détail doivent retourner 404 pour un article non publié.
- Appliquer des limites de taille et de longueur aux champs Pydantic ; normaliser les emails et les champs texte.
- Ajouter rate limiting sur login et contact, avec stockage partagé adapté à l'hébergement.
- Ajouter protection anti-spam au formulaire de contact (honeypot / challenge selon le niveau de risque) et validation serveur.
- Définir CORS à partir d'une liste explicite d'origines autorisées ; refuser `*` en production.
- Ajouter des en-têtes de sécurité adaptés au frontend et vérifier CSP en mode report-only avant enforcement.
- Uniformiser les réponses d'erreur sans divulguer stack traces, secrets, détails MongoDB ou données personnelles.
- Vérifier les dépendances et traiter les vulnérabilités avec revue d'impact.

### Sessions frontend

- Le token admin est actuellement stocké dans `localStorage`. Évaluer une session via cookie HttpOnly, Secure, SameSite et protection CSRF, ou documenter les risques résiduels si l'architecture ne le permet pas.
- Ajouter expiration de session, gestion 401, déconnexion effective et protection des routes admin.
- Échapper / assainir les contenus riches du CMS avant rendu ; vérifier les usages de HTML brut et les dépendances d'affichage.

**Critère :** tests de permissions, de sessions, de CORS, de rate limiting, d'accès aux brouillons et de validation passent avant tout déploiement.

## 6. Chantier P0 — Données, MongoDB et continuité

- Documenter les collections, schémas, index et relations logiques.
- Définir clairement la source de vérité du portfolio et du contenu éditorial entre MongoDB et Sanity ; documenter les règles de priorité et de fallback.
- Vérifier les index uniques et les opérations idempotentes de seed.
- Séparer les bases de test, staging et production ; interdire l'accès CI aux URI de production.
- Mettre en place sauvegardes automatiques chiffrées, rétention et contrôle d'accès.
- Documenter une procédure de restauration et réaliser un exercice sur une base non-production.
- Toute migration doit avoir sauvegarde préalable, stratégie de rollback, vérification d'intégrité et tests sur copie anonymisée.
- Définir politique de conservation et suppression des demandes de contact, accès et export des données.

**Critère :** une restauration testée est documentée ; aucune migration sans plan de retour arrière.

## 7. Chantier P1 — API et architecture backend

- Séparer progressivement routes, schémas, services, dépôts de données et configuration, sans refonte globale.
- Ajouter configuration typée et validation au démarrage.
- Documenter OpenAPI : formats, pagination, filtres, erreurs, authentification.
- Ajouter pagination sur contacts, portfolio et blog plutôt que dépendre de limites fixes.
- Ajouter tri, filtres validés et recherche avec limites de requête.
- Définir timeouts, retry borné et gestion des erreurs pour les services externes.
- Ajouter logs structurés avec identifiant de requête ; exclure mots de passe, tokens et données sensibles.
- Ajouter endpoint de readiness distinct du health check simple.
- Ajouter tests de concurrence et d'idempotence sur les opérations critiques.

## 8. Chantier P1 — Contact, conversion et CRM

- Relier le formulaire aux validations serveur et états UI : envoi, succès, erreur, nouvelle tentative.
- Ajouter accusé de réception uniquement si le service email est effectivement configuré.
- Ajouter notifications internes fiables avec retry et journalisation.
- Ajouter statut commercial, assignation, notes internes, tags et historique des changements.
- Ajouter recherche, filtres, pagination et export CSV avec permissions.
- Ajouter anti-spam, limitation de fréquence et identifiant de soumission pour éviter les doublons.
- Ajouter politique de confidentialité claire au formulaire et durée de conservation.

**Critère :** test E2E d'une demande jusqu'à sa prise en charge par un utilisateur autorisé.

## 9. Chantier P1 — Portfolio et Sanity CMS

- Définir si Sanity ou MongoDB est la source canonique, puis supprimer les ambiguïtés de synchronisation.
- Définir fallback explicite en cas d'indisponibilité CMS ; ne pas afficher silencieusement des contenus périmés sans indication de monitoring.
- Vérifier les schémas Sanity, champs requis, slugs uniques, références et validation des images.
- Ajouter pagination, filtres, états vides et gestion d'erreur.
- Structurer chaque étude de cas : contexte, problème, rôle, approche, livrables et résultats vérifiables.
- Optimiser images (formats modernes, dimensions, lazy loading, alt text).
- Ajouter liens internes entre services, portfolio et contact.
- Ne publier aucun témoignage, logo client ou métrique sans autorisation et preuve.

## 10. Chantier P1 — Blog

- Distinguer brouillon, programmé et publié dans les règles API et CMS.
- Protéger strictement les brouillons sur les endpoints publics.
- Ajouter pagination, catégories, tags, recherche, temps de lecture et articles associés.
- Ajouter aperçu de partage social, canonical, Open Graph et données structurées Article.
- Gérer les images avec alt text et optimisation.
- Ajouter workflow éditorial : auteur, relecture, publication, mise à jour et date de dernière modification.

## 11. Chantier P2 — UX/UI et accessibilité

- Conserver le système visuel et les composants existants ; établir un inventaire avant toute refonte.
- Vérifier responsive mobile/tablette/desktop sur les pages principales et le back-office.
- Corriger hiérarchie des titres, labels associés aux champs, messages d'erreur et navigation clavier.
- Contrôler contrastes, focus visible, zones tactiles et alternatives textuelles.
- Respecter `prefers-reduced-motion` pour animations, transitions et effets de défilement.
- Tester les composants interactifs avec clavier et lecteur d'écran.
- Uniformiser les états loading, empty, error, success et disabled.
- Éviter les doubles H1 et les liens/boutons sans nom accessible.

**Critère :** audit WCAG 2.2 AA avec liste de défauts, corrections et preuves.

## 12. Chantier P2 — SEO et découvrabilité

- Vérifier title, description, canonical, Open Graph et Twitter Cards pour chaque route indexable.
- Générer un sitemap à partir des routes publiques et contenus publiés ; exclure admin, brouillons et routes non canoniques.
- Vérifier que les domaines du sitemap et des canonical correspondent aux domaines réellement validés.
- Vérifier robots.txt, redirections, 404 et URL avec/sans slash.
- Ajouter données structurées Organization, WebSite, Service, Article et Breadcrumb lorsque pertinentes et conformes au contenu réel.
- Ajouter pages de partage social cohérentes et images Open Graph.
- Mesurer indexabilité et erreurs dans Google Search Console après publication.

## 13. Chantier P2 — Performance et fiabilité frontend

- Mesurer bundle initial, poids des images, scripts tiers et temps de chargement avant optimisation.
- Charger à la demande les pages et composants lourds.
- Optimiser images (WebP/AVIF si compatible), tailles responsive et chargement différé.
- Réduire le coût des animations, effets 3D, Spline et bibliothèques non essentielles.
- Contrôler Core Web Vitals sur mobile réel et pages principales.
- Ajouter gestion globale des erreurs React et fallback des composants non critiques.
- Vérifier cache, compression et headers sans casser les mises à jour de contenu.

**Critère :** baseline Lighthouse / Web Vitals avant-après et budgets convenus.

## 14. Chantier P2 — Analytics et mesure

- Définir les événements utiles : CTA, formulaire démarré/envoyé, clic WhatsApp/email, consultation étude de cas.
- Éviter toute collecte de données personnelles non nécessaire.
- Documenter consentement, durée de conservation et accès.
- Séparer environnements preview et production ; exclure trafic de test.
- Définir un tableau de bord simple : acquisition, conversion contact, pages portfolio consultées.
- Vérifier les événements en environnement de test avant activation en production.

## 15. Chantier P3 — Exploitation et gouvernance

- Ajouter Dependabot pour npm, pip et GitHub Actions.
- Documenter releases, versioning, rollback frontend et backend.
- Définir responsables, accès minimaux et rotation des secrets.
- Configurer alertes sur erreurs API, disponibilité, échecs de sauvegarde et déploiements.
- Ajouter runbooks : incident, restauration, rotation secret, rollback, indisponibilité CMS.
- Faire une revue trimestrielle des permissions GitHub, Vercel, MongoDB et Sanity.

## 16. Séquence recommandée

1. Faire passer la CI initiale et stabiliser les tests isolés.
2. Fermer les risques P0 d'authentification, secrets, CORS et accès aux brouillons.
3. Valider sauvegarde et restauration.
4. Clarifier la source de vérité MongoDB / Sanity.
5. Renforcer le formulaire contact et les permissions CRM.
6. Améliorer API, pagination et observabilité.
7. Corriger accessibilité et responsive.
8. Finaliser SEO et performance sur mesures réelles.
9. Ajouter analytics et runbooks d'exploitation.

## 17. Definition of Done pour chaque PR

- [ ] Objectif, périmètre et risques explicités.
- [ ] Aucun secret ou donnée personnelle ajouté au dépôt.
- [ ] Aucun changement inutile à une fonctionnalité existante.
- [ ] Tests automatisés locaux ajoutés ou adaptés.
- [ ] CI backend verte.
- [ ] Build frontend vert si le frontend est concerné.
- [ ] Tests manuels documentés pour les parcours qui ne sont pas automatisables.
- [ ] Accessibilité et responsive vérifiés si interface modifiée.
- [ ] Documentation et variables d'environnement mises à jour.
- [ ] Aucune base réelle utilisée pour les tests.
- [ ] Aucun merge ni déploiement production sans validation explicite.

---

**Important :** cette roadmap ne signifie pas que tous les chantiers sont déjà réalisés. Seuls les fichiers et contrôles effectivement présents dans la branche peuvent être considérés comme installés.
