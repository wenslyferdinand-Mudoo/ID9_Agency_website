# ID9 Agency — Plan d'exécution backend, sécurité et qualité

> **Document de référence opérationnel.** À consulter au début de chaque audit/analyse du dépôt et à mettre à jour après chaque étape validée.
>
> **Règle absolue :** avancer dans l'ordre, conserver les fonctionnalités et l'architecture existantes, prouver chaque résultat par des tests/logs, et ne jamais confondre un build READY avec une API opérationnelle. Aucun accès à la base Production pendant les travaux de staging.

## 1. Ordre d'exécution

| Étape | Travail | Priorité | Critère de sortie |
|---:|---|:---:|---|
| 1 | Provisionner MongoDB Atlas staging | P1 | Cluster/utilisateur dédiés, base isolée, URI stockée comme secret, accès réseau limité et connexion testée. |
| 2 | Créer le backend FastAPI sur Render | P1 | Service staging lié au dépôt et à la branche de sécurisation validée; health endpoint vérifié. |
| 3 | Configurer les secrets et variables Render | P1 | Variables staging minimales présentes, jamais exposées dans Git/logs; aucune valeur Production réutilisée. |
| 4 | Valider les tests MongoDB réels | P1 | Tests Atlas d'index, unicité, concurrence, rotation/révocation des sessions et préservation des données réussis. |
| 5 | Séparer API Preview et Production | P1 | `REACT_APP_API_URL` scindée par environnement; Preview → API staging seulement, Production → API Production seulement. |
| 6 | Valider CORS et les sessions JWT | P1 | Origines exactes autorisées, cookies Secure/HttpOnly/SameSite adaptés, refresh/rotation/replay/logout et rôles validés de bout en bout. |
| 7 | Finaliser les corrections des PR #50 et #52 | P1 | Diff complet relu, CI verte, tests d'intégration réussis, conflits/reviews résolus; décision de merge séparée et explicite. |
| 8 | Corriger les routes et le SEO avec PR #53 | P2 | Routes, redirections, 404 HTTP réelle, canonical, métadonnées statiques et dynamiques testés. |
| 9 | Finaliser la sécurité npm avec PR #54 | P2 | Audit dépendances, changements de versions maîtrisés, tests/build réussis et vulnérabilités restantes documentées. |
| 10 | Réaliser la QA desktop/mobile | P2 | Parcours complets testés sur navigateurs et tailles réelles; anomalies documentées avec preuves. |

## 2. Architecture cible

```text
                         VISITEURS
                             |
                             v
                         VERCEL CDN
                             |
                             v
                    ID9 AGENCY FRONTEND
                             |
                             v
                      FASTAPI BACKEND
                           RENDER
                             |
                   +---------+---------+
                   |                   |
                   v                   v
              MongoDB Atlas        Sanity CMS
              Application          Contenus
              et administration   Portfolio
```

### Environnements strictement indépendants

- **Staging :** Render staging + MongoDB Atlas staging + Vercel Preview.
- **Production :** Render production + MongoDB Production + Vercel Production.
- Aucune URI, base, utilisateur, secret JWT ou donnée Production ne doit être partagé avec staging.
- Les tests d'intégration doivent utiliser exclusivement des données synthétiques et une base staging dédiée.
- Ne jamais exécuter de seed, migration, suppression ou nettoyage global sur une base Production dans le cadre de cette procédure.

## 3. Vercel : protection et configuration API

- Conserver la protection SSO sur les domaines Preview/non personnalisés.
- Ne pas désactiver globalement la protection des Previews pour rendre le site public.
- Pour le site public, configurer et vérifier un domaine de production accessible aux visiteurs, après confirmation du domaine canonique par le propriétaire.
- La variable `REACT_APP_API_URL` a été identifiée comme existante mais sa valeur n'a pas été déchiffrée/validée dans l'audit précédent. Ne jamais publier sa valeur dans un rapport.
- Séparer explicitement les scopes : Preview utilise uniquement l'API staging; Production utilise uniquement l'API Production.
- Ne pas changer canonical, domaines ou alias Vercel sans validation du propriétaire et contrôle SEO préalable.

## 4. État initial et points de contrôle connus

- Dépôt : `wenslyferdinand-Mudoo/ID9_Agency_website`; branche de production : `main`.
- Backend existant : FastAPI, Motor/MongoDB; chemin principal observé : `backend/server.py`.
- Branche de durcissement : `security/backend-hardening-staging`.
- PR #52 : `security(backend): harden API validation, abuse controls and startup`; HEAD documenté : `636704b570cc5b2323a0e9c7b943e455a140ae52`; PR Draft à conserver ouverte jusqu'à validation staging.
- La PR #52 documente le build Render : `pip install -r backend/requirements.txt`.
- La PR #52 documente la commande de démarrage : `cd backend && uvicorn server:app --host 0.0.0.0 --port $PORT`.
- Variables staging documentées : `APP_ENV=staging`, `MONGO_URL`, `DB_NAME` (nom de base de test préfixé `id9_staging_test_`), `JWT_SECRET` (au moins 32 octets aléatoires), `CORS_ORIGINS` (origine exacte HTTPS), éventuellement `ADMIN_EMAIL` et `ADMIN_PASSWORD` pour le premier admin staging.
- Le modèle `backend/.env.example` est non secret. Ne jamais committer de vrais identifiants.
- La PR #52 précise que les tests Atlas sont opt-in et ne sont pas considérés réussis tant que `ID9_ATLAS_STAGING_URI` et `ID9_ATLAS_STAGING_DB` ne sont pas configurés.
- L'application exige `MONGO_URL` et `DB_NAME` au chargement. Sans URI Atlas staging valide, le service Render ne peut pas démarrer correctement.
- Lors de l'inspection du workspace Render, aucun Web Service ID9 n'a été retourné. Cela doit être revérifié avant toute création.
- Aucun hostname backend de production ne doit être déduit ou inventé à partir du code, d'un nom de service ou d'une ancienne conversation.

## 5. Garde-fous avant création/déploiement Render

**Ne pas créer ni lancer un service Render tant que les éléments suivants ne sont pas disponibles :**
1. URI MongoDB Atlas staging dédiée et vérifiée.
2. Nom de base staging isolé, par exemple `id9_staging_test_<suffixe>`.
3. Secret JWT staging nouvellement généré et stocké de manière sécurisée.
4. Origine exacte de la Preview Vercel à autoriser dans CORS.
5. Confirmation que la branche source contient le backend durci attendu et que le build/start command correspondent à la structure réelle du dépôt.

La création d'un Web Service Render déclenche normalement un premier build/déploiement. Créer le service sans les variables MongoDB requises conduirait à un démarrage en échec. Ne pas contourner ce garde-fou avec des valeurs fictives, une base Production ou un secret temporaire.

## 6. Sécurité et validation obligatoires

- CORS : aucune origine wildcard; autoriser seulement les origines HTTPS exactes nécessaires. Ne pas utiliser `allow_origins=["*"]` avec des credentials.
- JWT : secret aléatoire fort; access token court; refresh token HttpOnly/Secure; rotation, détection de replay, révocation et durée absolue validées.
- Admin : provisioning explicite, rôle revérifié côté serveur; aucun mot de passe par défaut ni réinitialisation implicite au démarrage.
- Données : validation serveur des chaînes vides/blanches, tailles, formats et champs; rate limiting atomique partagé entre instances.
- MongoDB : ping et index requis au démarrage; erreurs d'index non masquées; sauvegardes et droits minimaux; aucune opération destructive non approuvée.
- Frontend : retirer progressivement le bearer token de `localStorage` seulement après validation complète du nouveau cycle de session et compatibilité de migration; ne pas casser les sessions administrateur existantes sans plan de transition.
- Secrets : ne jamais afficher, copier dans un commit, joindre à un commentaire GitHub ou inclure dans les rapports.
- Sanity : lecture seule pendant l'audit; ne pas modifier documents, schémas, dataset ou paramètres sans autorisation distincte.

## 7. Protocole d'audit à chaque analyse

Au début de chaque analyse du dépôt :
1. Lire ce document et relever l'étape active, les critères non satisfaits et les preuves attendues.
2. Vérifier le HEAD de `main`, la branche de sécurisation, toutes les PR pertinentes (#50, #52, #53, #54 et nouvelles PR), leurs diffs, checks, reviews, conflits et Preview.
3. Vérifier les services Render, leurs événements/logs et variables sans révéler les secrets.
4. Vérifier les environnements Vercel, les scopes des variables, les déploiements et la protection SSO.
5. Vérifier l'état Atlas staging et les tests réels, sans accéder à MongoDB Production.
6. N'exécuter que les actions autorisées par l'étape et les critères de sécurité.
7. Mettre à jour le statut ci-dessous avec date, commit, preuves/liens, résultat et prochaine action.
8. Signaler explicitement les tests non exécutés ou données inaccessibles; ne jamais présumer un succès.

## 8. Journal d'avancement

| Étape | Statut initial | Preuve / commentaire |
|---:|---|---|
| 1. MongoDB Atlas staging | **BLOQUÉE — à provisionner** | URI staging et DB isolée non confirmées. |
| 2. Backend FastAPI Render | **EN ATTENTE** | Aucun service identifié lors du dernier inventaire. Ne pas créer avant étape 1. |
| 3. Secrets/variables Render | **EN ATTENTE** | À configurer après création du service; aucun secret dans Git. |
| 4. Tests MongoDB réels | **NON VÉRIFIÉS** | Tests Atlas précédemment ignorés faute de variables staging. |
| 5. Séparation API Preview/Production | **EN ATTENTE** | `REACT_APP_API_URL` doit être séparée par environnement. |
| 6. CORS et sessions JWT | **EN ATTENTE DE STAGING** | Implémentation candidate dans PR #52; validation E2E requise. |
| 7. PR #50 et #52 | **À FINALISER** | PR #52 reste Draft; aucune fusion implicite. |
| 8. PR #53 SEO/routage | **EN ATTENTE** | Revue et validation fonctionnelle requises. |
| 9. PR #54 npm | **EN ATTENTE** | Revue dépendances, tests et audit résiduel requis. |
| 10. QA desktop/mobile | **EN ATTENTE** | Aucune QA complète ne doit être déclarée sans exécution réelle. |

### Dernière mise à jour

- Date : 2026-11-20.
- Document de pilotage : créé sur la branche `docs/id9-backend-execution-plan`.
- Étape active : **1 — provisionner MongoDB Atlas staging**.
- Prochaine action : confirmer l'accès Atlas et provisionner une base staging dédiée; ensuite seulement, créer le Web Service Render.
- Règle de livraison : aucun merge, déploiement Production, changement de domaine, écriture Sanity ou modification destructive sans autorisation explicite distincte.
