# Plan d’audit et de sécurisation — Impact Digital 9 Agency Website

**Portée connue à confirmer dans le code :** site React 19/CRA/CRACO et Tailwind, intégrations Sanity, API FastAPI et MongoDB/Motor, déploiement Vercel. Le site présente les services de l’agence et peut recevoir des demandes de contact/devis.

## Priorités spécifiques

### P0 — Backend, formulaires et données
- Cartographier toutes les routes FastAPI, fonctions Vercel, accès MongoDB et mutations Sanity.
- Authentifier et autoriser les opérations non publiques; aucune confiance dans les contrôles frontend.
- Valider côté serveur formulaires, e-mails, URLs, champs libres et payloads; limiter taille, fréquence et spam.
- Utiliser des requêtes MongoDB sûres; empêcher NoSQL injection, opérateurs contrôlés par l’utilisateur et mass assignment.
- Vérifier les permissions MongoDB et Sanity par rôle, dataset et environnement.

### P1 — Secrets et intégrations
- Déplacer les secrets API et identifiants MongoDB/Sanity côté serveur et Vercel Environment Variables.
- Vérifier qu’aucun secret privé ne se trouve dans les bundles, sourcemaps, commits ou logs.
- Distinguer clés publiques de navigateur et secrets privés; restreindre les clés publiques par origine/domaine si le fournisseur le permet.
- Protéger les webhooks et intégrations tierces par signature et validation.

### P1 — Frontend et plateforme
- Prévenir XSS : échappement React, assainissement du contenu CMS riche, interdiction d’injection HTML non contrôlée.
- Configurer CSP, HSTS, frame-ancestors, nosniff, Referrer-Policy et Permissions-Policy.
- Restreindre CORS aux origines réelles; appliquer CSRF si cookies d’authentification.
- Vérifier routes admin/CMS, redirections, téléchargements, upload média, headers et paramètres Vercel.
- Désactiver erreurs détaillées/debug en production; sécuriser les logs et données de prospects.

## Tests exigés
Tests API et formulaires, NoSQL injection, XSS stocké/réfléchi, spam/rate limits, CORS, CSP, headers, contrôle d’accès, upload, secrets frontend/sourcemaps, dépendances npm/Python, configuration Vercel et Sanity.

## Garde-fous
Ne pas casser le référencement, les formulaires, les animations, le rendu responsive ni le contenu Sanity. Préserver les parcours commerciaux. Aucun secret détecté ne doit être reproduit dans le rapport; signaler le fournisseur et l’emplacement, puis demander rotation si nécessaire.

## Livrables
Cartographie frontend/backend/CMS; constats P0–P3; corrections en PR; tests et résultats; liste des réglages Vercel/Sanity/MongoDB à effectuer manuellement; rapport corrigé/testé/non vérifié.
