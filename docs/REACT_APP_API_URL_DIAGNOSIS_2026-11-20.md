# ID9 — Diagnostic de l'URL API de production

**Date :** 20 novembre 2026  
**Projet Vercel :** `id9-agency-website`  
**Variable concernée :** `REACT_APP_API_URL`  
**Domaine frontend :** `https://id9-agency-website.vercel.app`

## Résultat vérifié

La variable `REACT_APP_API_URL` existe dans le projet Vercel et cible les environnements Preview et Production. Elle est de type `sensitive` ; l'API Vercel renvoie sa métadonnée mais ne restitue pas sa valeur déchiffrée.

Pour éviter toute supposition, le bundle JavaScript public du site de production a été inspecté depuis un environnement réseau Vercel. Le code compilé contient la valeur suivante :

```text
https://xxx
```

Le frontend construit donc actuellement son API base URL comme `https://xxx/api`.

Une vérification réseau depuis le même environnement a tenté `https://xxx/` et `https://xxx/api/`. Les deux tentatives ont échoué avec une erreur DNS `ENOTFOUND`. **Le hostname configuré est donc `xxx`, et ce n'est pas un hostname d'API publiquement résolvable.**

## Conséquence fonctionnelle

- Le frontend ne dispose pas d'une adresse backend publique valide via `REACT_APP_API_URL`.
- Les appels Axios dirigés vers l'API (dont la soumission du formulaire de contact) ne peuvent pas atteindre un serveur à cette adresse.
- La présence de `backend/server.py` dans GitHub ne prouve pas qu'un serveur FastAPI est déployé.
- Le fait qu'un compte Render et des clés API Render aient été créés ne prouve pas qu'un Web Service ID9 y a été déployé. Aucun hostname de service ID9 n'a été confirmé dans les éléments Gmail consultés.

## Limites de la vérification

La valeur sensible n'a pas été lue directement depuis le gestionnaire de secrets Vercel. Le hostname a été extrait du bundle frontend de production, où les variables `REACT_APP_*` sont incorporées au build et deviennent publiques. Aucun secret backend n'a été extrait ni affiché.

Aucun test de base de données, authentification ou écriture de contact n'a été exécuté contre un backend de production, car aucun endpoint réel n'est identifié.

## Actions requises avant de reconnecter le formulaire

1. Identifier ou créer un hébergement backend FastAPI réel (par exemple Render ou Railway).
2. Confirmer le hostname du service et vérifier son endpoint de santé `/api/`.
3. Confirmer la base MongoDB et ses sauvegardes avant toute connexion.
4. Configurer les variables backend dans le gestionnaire de secrets de l'hébergeur ; ne jamais les placer dans le frontend.
5. Configurer `CORS_ORIGINS` avec le domaine Vercel et une origine Preview contrôlée, sans wildcard.
6. Déployer d'abord sur staging avec une base jetable.
7. Vérifier health check, CORS, formulaire de contact, notifications et administration.
8. Remplacer `REACT_APP_API_URL` dans Vercel par l'URL HTTPS réelle, puis reconstruire Preview et Production après validation.

**Interdiction de mise en production :** ne pas remplacer `https://xxx` par un hostname deviné, ne pas connecter la base de production avant les tests staging et ne pas supprimer les données historiques.
