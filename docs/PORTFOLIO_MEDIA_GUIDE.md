# ID9 Portfolio — publication des réalisations

Le site lit en priorité les projets publiés dans Sanity (projet mqrbsugj / dataset production). Les projets Sanity sont normalisés par frontend/src/lib/portfolio.js, puis affichés sur la page Portfolio et dans la sélection de la page d'accueil.

## Ajouter une réalisation

1. Ouvrir le Sanity Studio du projet ID9 (ou le lancer localement depuis le dépôt).
2. Créer un document **Portfolio Project**.
3. Renseigner au minimum :
   - **Project Title** : nom public du projet ;
   - **URL Slug** : généré depuis le titre, puis vérifier qu'il est unique ;
   - **Category** : branding, web, app, marketing, motion ou photo ;
   - **Short Summary** : résumé public court ;
   - **Cover Image** : visuel principal obligatoire.
4. Ajouter les visuels secondaires dans **Gallery**. Ajouter un texte alternatif descriptif pour chaque image.
5. Compléter, si possible, le client, l'année, les services, les outils, le contexte, le défi, l'approche, la solution et les résultats.
6. Activer **Featured project** pour les projets qui doivent apparaître dans la sélection de la page d'accueil.
7. Cliquer sur **Publish**. Un brouillon non publié n'apparaît pas sur le site.

## Recommandations médias

- Couverture : format paysage 4:3 ou 16:10, idéalement 1600 px de large minimum.
- Galerie : exporter les images en WebP ou JPEG optimisé, sans texte illisible après recadrage mobile.
- Préférer des captures et visuels originaux appartenant à ID9 ou utilisés avec autorisation.
- Ajouter un alt text qui décrit le contenu réel de l'image, sans mots-clés artificiels.
- Ne pas publier de données personnelles, maquettes confidentielles ou résultats clients non autorisés.

Les images Sanity sont transformées via le CDN Sanity (format automatique et qualité 82). La page publique affiche un état éditorial si aucun projet n'est publié ; elle ne fabrique pas de fausses réalisations.

## Lancer le Studio localement

Depuis la racine du dépôt :

    cd studio
    npm install
    npm run dev

Le Studio utilise le projet Sanity et le dataset configurés dans studio/sanity.config.js. Les identifiants de projet/dataset sont des paramètres publics ; un token d'écriture ne doit jamais être ajouté au frontend ni commité dans Git.

## Animation Spline de l'accueil

Le composant frontend/src/components/site/Hero3D.jsx charge Spline uniquement lorsque REACT_APP_SPLINE_SCENE_URL est défini. Sans cette variable, le site utilise la scène Three.js intégrée ; un arrière-plan animé CSS reste également visible si WebGL est indisponible.

Pour restaurer la scène Spline originale dans Vercel, récupérer son URL publique scene.splinecode depuis Spline et définir REACT_APP_SPLINE_SCENE_URL dans les variables d'environnement Preview (puis Production après validation). Ne pas remplacer cette URL par un lien d'édition privé ou un lien de partage non compatible.
