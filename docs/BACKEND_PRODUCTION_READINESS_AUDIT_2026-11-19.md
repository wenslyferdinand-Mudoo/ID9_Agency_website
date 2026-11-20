# ID9_AGENCY — Audit backend et préparation à la production

**Date :** 19 novembre 2026  
**Base examinée :** branche `main`, état consulté le 19 novembre 2026  
**Périmètre :** lecture statique du backend FastAPI, dépendances, tests et documentation du dépôt.  
**Statut :** audit initial — non équivalent à une recette runtime ou à une validation de sécurité indépendante.

## 1. Résumé exécutif

Le dépôt contient un backend Python/FastAPI autonome dans `backend/`. Il utilise MongoDB via Motor, expose des routes sous le préfixe `/api`, authentifie les administrateurs avec JWT et bcrypt, et fournit des fonctionnalités de contact, portfolio, blog et services.

Le frontend est déployé séparément sur Vercel. Sanity est utilisé côté frontend comme CMS éditorial, notamment pour le portfolio. Aucun hébergement backend de production ni aucune instance MongoDB de production n'ont été confirmés dans le cadre de cet audit. La présence de code dans GitHub ne prouve pas qu'un service est déployé.

**Décision : ne pas publier le backend en l'état.** Corriger d'abord les risques P0, isoler les tests et établir un environnement de staging avec une base jetable.

## 2. Architecture observée

- `frontend/` : React, déploiement Vercel connu.
- `backend/server.py` : application FastAPI, routes et initialisation MongoDB.
- `backend/requirements.txt` : dépendances Python.
- `studio/` : Sanity Studio.
- MongoDB : connexion exigée par `MONGO_URL`, base sélectionnée par `DB_NAME`.
- API : préfixe `/api`; serveur ASGI démarré avec Uvicorn.

Responsabilités proposées, à confirmer avant migration :
- Sanity : contenu éditorial et portfolio public, après validation du parcours de publication.
- MongoDB : utilisateurs administrateurs, demandes de contact et données historiques nécessaires.
- FastAPI : authentification admin, gestion des contacts et fonctions qui doivent rester transactionnelles côté serveur.
- Vercel : frontend uniquement.

Ne supprimer aucun ancien endpoint ni aucune collection avant inventaire des consommateurs, export de sauvegarde et validation de non-régression.

## 3. Constats de sécurité et fiabilité

### P0 — Bloquants avant publication

1. **Provisionnement administrateur par défaut.** Dans l'état de `main` consulté, `seed_admin()` utilise des valeurs de repli si `ADMIN_EMAIL` ou `ADMIN_PASSWORD` ne sont pas définis. La fonction peut également remplacer le hash du mot de passe d'un compte existant au démarrage lorsque la valeur fournie diffère. Cela rend le démarrage capable de modifier les accès administrateur sans procédure explicite.
2. **CORS permissif par défaut.** `allow_origins` utilise `*` lorsque `CORS_ORIGINS` est absent. La production doit échouer de manière sûre si la liste d'origines n'est pas configurée, et n'autoriser que les origines réellement utilisées.
3. **Tests historiques dangereux.** `backend/tests/test_id9_backend.py` contient une URL distante de repli, des identifiants de test intégrés au code et des tests qui créent, modifient puis suppriment des enregistrements. Ils ne doivent jamais viser un backend partagé ou la production. Il faut rendre la cible explicite et exiger une base jetable pour les tests mutatifs.
4. **Données de démonstration au démarrage.** `on_startup()` appelle `seed_admin()` et `seed_content()`. Le seed de contenu peut insérer des projets et articles prédéfinis dans la base au démarrage. Il faut séparer migrations/initialisation de développement et démarrage normal de production, sans supprimer les données déjà présentes.

### P1 — À traiter avant ouverture publique

5. **Articles non publiés.** La route publique de détail `GET /api/blog/{slug}` doit appliquer le même filtre de publication que la liste publique. Sinon, un brouillon connu par son slug peut être récupéré.
6. **Protection contre les abus.** Aucun rate limiting applicatif n'a été confirmé sur la connexion ou les formulaires publics. Ajouter une limitation distribuée ou au niveau du proxy/WAF, avec réponses et journaux appropriés.
7. **Durée de vie du JWT.** Le code fixe actuellement une durée de validité de sept jours. Réévaluer cette durée, la révocation, la rotation de secret et le comportement à la déconnexion.
8. **Stockage du token côté navigateur.** Le frontend conserve le token admin dans `localStorage`. C'est exposé en cas de XSS. Une évolution vers cookie HttpOnly/Secure/SameSite demanderait une conception CORS/CSRF complète ; ne pas changer le mécanisme sans tests de bout en bout.
9. **Cohérence portfolio.** L'administration historique écrit dans MongoDB tandis que le site public privilégie Sanity. Maintenir deux sources modifiables est une source de divergence. Choisir une source de vérité après inventaire et sauvegarde.
10. **Contrôle des seeds et index.** Les erreurs de création d'index sont actuellement interceptées et journalisées comme avertissement avant de poursuivre. Définir les index requis, contrôler les échecs réellement bloquants et documenter le comportement de démarrage.

### P2 — Maintenabilité

11. **Dépendances.** `requirements.txt` mélange dépendances runtime, outils de développement et bibliothèques potentiellement inutilisées (par exemple pandas, numpy, boto3, jq, typer et emergentintegrations). Ne rien retirer sur la seule base du nom : rechercher les imports et exécuter les tests/build avant de produire un fichier runtime minimal.
12. **Observabilité.** Ajouter logs structurés, identifiant de requête, masquage des données personnelles et surveillance des erreurs sans journaliser les tokens, mots de passe ou URI MongoDB.
13. **Validation des entrées.** Revoir limites de taille, longueurs maximales, normalisation et validation métier pour les contacts, articles et projets.
14. **Cycle de vie MongoDB.** Préférer un cycle de vie FastAPI explicite pour initialiser/fermer le client, tester la disponibilité de la base et gérer les erreurs transitoires.

## 4. Variables d'environnement attendues

| Variable | Usage | Traitement |
|---|---|---|
| `MONGO_URL` | URI MongoDB | Secret, jamais dans Git ou frontend |
| `DB_NAME` | Nom de la base | Configuration serveur |
| `JWT_SECRET` | Signature JWT | Secret fort, généré aléatoirement |
| `ADMIN_EMAIL` | Compte admin initial | Secret/config serveur |
| `ADMIN_PASSWORD` | Provisionnement initial uniquement | Secret, jamais journalisé |
| `CORS_ORIGINS` | Liste d'origines frontend autorisées | Liste explicite, sans wildcard |
| `PORT` | Port fourni par la plateforme | Variable d'exécution |

Les variables de staging et de production doivent être distinctes. Ne jamais copier une URI ou un mot de passe dans un ticket, un commit ou un message de diagnostic. Le frontend ne reçoit que l'URL publique de l'API et les paramètres Sanity explicitement publics.

## 5. Architecture d'hébergement recommandée

Cible proposée, pas une infrastructure actuellement confirmée :

- Frontend : Vercel (conserver le déploiement existant).
- Backend : service Python compatible ASGI, par exemple Railway ou Render, connecté au dépôt GitHub avec racine `backend/`.
- Base : MongoDB Atlas avec utilisateur applicatif dédié, TLS, sauvegardes et accès réseau restreint selon les capacités du fournisseur.
- CMS : Sanity conservé pour le contenu éditorial.
- Source de code : GitHub.

Railway est une option pragmatique pour démarrer, mais le choix final dépendra du coût, de la région disponible, des sauvegardes, des limites de ressources, du support des logs et de la capacité de restauration. Aucun compte, plan, projet ou coût n'a été vérifié.

Commande de démarrage candidate à valider dans le fournisseur :
`uvicorn server:app --host 0.0.0.0 --port $PORT`

Ne pas connecter le service à une base de production avant d'avoir terminé les tests sur staging.

## 6. Plan de remédiation séquencé

### Lot A — Confinement des risques et tests
- Revoir et terminer la correction du provisionnement admin (PR #32).
- Corriger le fallback CORS wildcard.
- Isoler les tests d'intégration et supprimer les valeurs d'accès codées en dur (PR #33).
- Interdire toute cible distante implicite et tout test mutatif sans opt-in explicite.
- Ajouter des tests unitaires de provisioning : variables absentes, création initiale, compte existant préservé.
- Ajouter tests de visibilité des articles publiés/non publiés.
- Ajouter un backend de test avec MongoDB jetable.

### Lot B — Initialisation et intégrité des données
- Inventorier collections, documents, index et volumes avant tout changement.
- Exporter et vérifier une sauvegarde avant migration.
- Retirer les seeds de contenu du démarrage normal après avoir prévu un mécanisme explicite d'initialisation/migration.
- Ne jamais écraser ou supprimer les données existantes.
- Prévoir procédure de restauration et test de restauration.

### Lot C — Robustesse API
- Rate limiting sur login et endpoints publics.
- Limites de payload, validation, erreurs uniformes et logs structurés.
- Vérification de la configuration JWT et des erreurs de base.
- Contrôle des autorisations pour chaque endpoint admin.
- Tests de non-régression des contrats API utilisés par le frontend.

### Lot D — Déploiement staging
- Créer un service backend staging séparé.
- Créer une base MongoDB staging jetable, sans données réelles.
- Injecter les variables par le gestionnaire de secrets du fournisseur.
- Vérifier health check, logs, CORS, authentification et routes publiques.
- Connecter une Preview Vercel à l'API staging.
- Tester contact, login, admin, blog et portfolio sans toucher à la production.

### Lot E — Publication contrôlée
- Revue des PR, checks CI et Preview.
- Sauvegarde MongoDB et preuve de restauration.
- Vérification finale des secrets et des domaines.
- Déploiement progressif, smoke tests, monitoring et rollback documenté.
- Accord explicite du propriétaire avant toute bascule production.

## 7. Matrice de tests minimale

| Domaine | Cas exigés |
|---|---|
| Configuration | Échec sûr si variables critiques absentes |
| Provisionnement admin | Création initiale ; compte existant non modifié ; aucun mot de passe par défaut |
| Auth | Identifiants invalides ; token expiré ; utilisateur non-admin ; accès sans token |
| CORS | Origine frontend autorisée ; origine inconnue refusée |
| Blog | Liste publiée ; détail publié ; brouillon inaccessible publiquement |
| Contacts | Validation ; création ; lecture admin ; protection contre spam |
| Portfolio | CRUD admin isolé ; lecture publique ; pas de divergence non documentée |
| MongoDB | indisponibilité ; index ; reconnexion ; restauration |
| Sécurité | pas de secrets dans bundle, logs, réponses ou dépôt |
| Frontend | contact, connexion admin, navigation FR/EN et erreurs API |

Tous les tests mutatifs doivent utiliser exclusivement une base de test jetable.

## 8. Ce qui n'a PAS été vérifié

- Existence et état d'un backend hébergé.
- Valeur effective de l'URL API configurée dans Vercel.
- Existence, région, plan et sauvegardes d'une base MongoDB réelle.
- Présence et qualité des secrets dans le fournisseur.
- Tests runtime HTTP, charge, CORS ou authentification.
- Restauration réelle d'une sauvegarde.
- Build backend reproductible dans un environnement propre.
- Dépendances réellement importées par tout le backend.
- État actuel du dataset Sanity et des données historiques MongoDB.

## 9. Règles de préservation

- Ne pas supprimer de fonctionnalité, endpoint, collection ou document sur la base de cet audit seul.
- Ne pas lancer de migration ni seed sur une base réelle.
- Ne pas modifier les secrets ou variables Vercel.
- Ne pas déployer en production.
- Toute correction runtime doit être petite, testée, revue et livrée par PR.
- Les changements de comportement doivent être rétrocompatibles ou accompagnés d'un plan de migration et de rollback.
- Une PR verte ou un build Preview réussi ne constitue pas à lui seul une validation fonctionnelle.

## 10. Références du dépôt examinées

- `backend/server.py`
- `backend/requirements.txt`
- `backend/tests/test_id9_backend.py`
- `docs/SETUP_GUIDE.md`
- `docs/PROFESSIONALIZATION_ROADMAP.md`
- Pull requests #32 (provisionnement admin) et #33 (isolation des tests), encore à valider avant fusion au moment de l'audit.

**Conclusion :** le backend peut être hébergé indépendamment du frontend, mais la publication doit attendre les corrections P0, l'isolation des tests et une validation staging. Cet audit ne modifie aucune fonctionnalité du site.


## 11. Revue ciblée des PR backend existantes (19 novembre 2026)

### PR #32 — provisionnement administrateur
- Le changement de `seed_admin()` est dans la bonne direction : plus de compte par défaut et pas de réinitialisation du mot de passe d'un compte existant.
- La documentation de cette branche recommande des origines CORS explicites, mais le code runtime de `backend/server.py` conserve encore le fallback `CORS_ORIGINS='*'`. La PR ne ferme donc pas à elle seule le risque CORS.
- Aucun test unitaire dédié au provisionnement (variables absentes, première création, compte existant préservé) n'a été constaté dans le diff consulté.
- La branche est divergente par rapport à `main` (4 commits en avance, 2 en retard lors de la comparaison). Ne pas fusionner avant rebase/résolution, revue du diff actualisé et tests ciblés.

### PR #33 — isolation des tests
- Le retrait de l'URL distante par défaut et des identifiants intégrés est une amélioration nécessaire.
- Les opérations mutatives sont conditionnées par `ID9_TEST_ALLOW_MUTATIONS=true`, ce qui réduit les risques.
- Toutefois, le garde-fou ne prouve pas que la base distante est jetable : une URL de production pourrait encore être sélectionnée si les opt-ins distants et mutatifs sont activés. Ajouter une vérification explicite d'environnement/base de test et interdire les hôtes/domaines de production connus.
- `test_login_invalid` utilise `ADMIN_EMAIL`, qui peut être vide. Dans ce cas, le schéma EmailStr peut rejeter la requête en 422 au lieu du 401 attendu ; le test doit utiliser une adresse de test syntaxiquement valide.
- Aucun test n'a été exécuté dans cet audit. La PR reste à valider sur une base MongoDB jetable et avec des secrets CI dédiés.
- La branche est divergente par rapport à `main` (4 commits en avance, 2 en retard lors de la comparaison). Ne pas fusionner avant rebase/résolution et nouvelle validation.

**Décision sur les PR #32 et #33 :** ne pas fusionner dans leur état observé. Elles contiennent des améliorations utiles, mais des critères de sécurité et de validation restent ouverts. Cette conclusion ne remet pas en cause leur objectif ; elle empêche simplement de considérer les risques comme résolus trop tôt.
