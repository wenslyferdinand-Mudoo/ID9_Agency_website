# ID9_AGENCY — Guide de Setup & Déploiement

Guide complet pour faire tourner ce projet localement (Windsurf / VS Code), gérer le CMS Sanity, et déployer sur Vercel.

> **Public** : non-développeurs et développeurs. Suivez les sections dans l'ordre.

---

## 📁 1. Structure du projet

```
id9-agency/
├── backend/                    # API FastAPI (Python)
│   ├── server.py               # Toutes les routes /api/*
│   ├── requirements.txt        # Dépendances Python
│   └── .env                    # Config locale (MongoDB, JWT, Admin)
│
├── frontend/                   # Site public + admin (React 19 + CRA)
│   ├── src/
│   │   ├── components/site/    # Nav, Footer, Preloader, Cursor…
│   │   ├── components/sections/# Hero, Services, Portfolio, CTA…
│   │   ├── components/ui/      # shadcn/ui (Button, Card, Dialog…)
│   │   ├── pages/              # Home, About, Services, Portfolio, Blog, Contact, Admin/*
│   │   ├── lib/i18n.jsx        # Dictionnaire FR/EN
│   │   ├── lib/sanity.js       # Client Sanity CMS
│   │   └── lib/api.js          # Axios wrapper → REACT_APP_BACKEND_URL
│   ├── public/                 # sitemap.xml, robots.txt, favicon.svg
│   ├── .env                    # REACT_APP_BACKEND_URL, Spline, Sanity
│   ├── .nvmrc                  # Node 20 (LTS)
│   ├── .npmrc                  # legacy-peer-deps pour compat
│   ├── package.json            # Deps + scripts + engines
│   ├── vercel.json             # Config déploiement Vercel
│   └── craco.config.js         # Config webpack étendue
│
├── studio/                     # Sanity Studio (CMS)
│   ├── schemas/                # Modèles de contenu (portfolioProject…)
│   ├── sanity.config.js        # Config du studio (projectId=mqrbsugj)
│   └── package.json
│
├── docs/                       # Documentation (vous êtes ici)
└── memory/                     # PRD, changelog interne
```

---

## 🔧 2. Prérequis (à installer une seule fois)

| Outil | Version | Vérification | Lien |
|---|---|---|---|
| **Node.js** | ≥ 20 LTS (< 23) | `node -v` | https://nodejs.org/ (télécharger LTS) |
| **npm** | ≥ 10 | `npm -v` | Inclus avec Node |
| **Yarn** (recommandé) | 1.22+ | `yarn -v` | `npm install -g yarn` |
| **Python** | ≥ 3.10 | `python3 -V` | https://python.org |
| **MongoDB** | ≥ 6 | `mongod --version` | https://www.mongodb.com/try/download/community — OU utilisez [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratuit, en ligne) |
| **Git** | ≥ 2.30 | `git --version` | https://git-scm.com |
| **Windsurf** ou **VS Code** | latest | — | https://windsurf.com / https://code.visualstudio.com |

> ⚠️ **Node 24 n'est PAS supporté.** Le fichier `.nvmrc` force Node 20 automatiquement si vous utilisez `nvm`.

---

## 🚀 3. Installation locale (Windsurf / VS Code)

### 3.1 Cloner le projet

```bash
git clone <votre-url-github> id9-agency
cd id9-agency
```

### 3.2 Configurer les variables d'environnement

**`backend/.env`** — créer ce fichier (copier `backend/.env.example` s'il existe) :

```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="id9_local"
CORS_ORIGINS="*"
JWT_SECRET="changez-moi-avec-une-chaine-aleatoire-longue-64-caracteres"
ADMIN_EMAIL="admin@id9agency.com"
ADMIN_PASSWORD="ID9_Admin_2025!"
```

> 💡 Si vous utilisez **MongoDB Atlas**, remplacez `MONGO_URL` par votre URI Atlas :
> `mongodb+srv://user:pass@cluster.mongodb.net/id9_local?retryWrites=true&w=majority`

**`frontend/.env`** :

```env
REACT_APP_BACKEND_URL=http://localhost:8001
REACT_APP_SPLINE_SCENE_URL=https://prod.spline.design/ULqGLBLb7PZFYV8w/scene.splinecode
REACT_APP_SANITY_PROJECT_ID=mqrbsugj
REACT_APP_SANITY_DATASET=production
REACT_APP_SANITY_API_VERSION=2024-01-01
```

### 3.3 Installer les dépendances

```bash
# Backend Python
cd backend
python3 -m venv venv
source venv/bin/activate      # macOS/Linux
# .\venv\Scripts\activate     # Windows PowerShell
pip install -r requirements.txt

# Frontend React
cd ../frontend
yarn install                  # OU : npm install
```

### 3.4 Démarrer le projet

**Terminal 1 — MongoDB** (si local, pas Atlas) :
```bash
mongod --dbpath /votre/chemin/data
```

**Terminal 2 — Backend** :
```bash
cd backend
source venv/bin/activate
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```
✅ API disponible sur http://localhost:8001/api/services

**Terminal 3 — Frontend** :
```bash
cd frontend
yarn start                    # OU : npm start
```
✅ Site disponible sur http://localhost:3000

**Terminal 4 (optionnel) — Sanity Studio** :
```bash
cd studio
yarn install
yarn dev
```
✅ Studio disponible sur http://localhost:3333

---

## 🎨 4. Sanity CMS — gestion du portfolio

Le portfolio est géré via **Sanity**, un CMS headless. Vous pouvez ajouter/modifier/supprimer des projets sans toucher au code.

### 4.1 Accéder au Studio

- **En ligne** (recommandé) : Sanity héberge gratuitement votre studio. Depuis `studio/` :
  ```bash
  cd studio
  yarn deploy
  ```
  → Choisissez un hostname (ex: `id9-agency`). Le studio sera accessible à `https://id9-agency.sanity.studio`.

- **En local** :
  ```bash
  cd studio
  yarn dev
  ```
  → http://localhost:3333

### 4.2 Créer votre premier projet

1. Ouvrir le Studio (URL ci-dessus).
2. Se connecter avec le compte Google/GitHub associé à votre projet Sanity (`mqrbsugj`).
3. Cliquer **Portfolio Project** → **Create new**.
4. Remplir :
   - **Title** : ex "Akya Dance Company"
   - **Slug** : cliquer "Generate" (ex `akya-dance`)
   - **Category** : Branding / Web / App…
   - **Client**, **Year**, **Services**
   - **Cover Image** : glisser une image
   - **Gallery**, **Challenge**, **Strategy**, **Process**, **Result**, **Metrics**
5. **Publish** (bouton en bas).

Le projet apparaît instantanément sur https://votre-site.com/portfolio et /portfolio/[slug].

### 4.3 Inviter des collaborateurs

Sanity Manage → https://www.sanity.io/manage/personal/project/mqrbsugj
→ **Members** → **Invite** → entrez leur email.

### 4.4 Références importantes

| Fichier | Rôle |
|---|---|
| `studio/schemas/portfolioProject.js` | Structure d'un projet (champs, validation) |
| `frontend/src/lib/sanity.js` | Client de lecture (site public) |
| `frontend/src/pages/PortfolioPreview.jsx` | Requête GROQ pour la liste |
| `frontend/src/pages/PortfolioDetailPage.jsx` | Requête GROQ pour un projet |

---

## 🌐 5. Déploiement sur Vercel

### 5.1 Prérequis

- Un compte **GitHub** (gratuit) : https://github.com/join
- Un compte **Vercel** (gratuit) : https://vercel.com/signup (connectez-vous avec GitHub)

### 5.2 Pousser le code sur GitHub

```bash
git init
git add .
git commit -m "Initial commit ID9_AGENCY"
git branch -M main
git remote add origin https://github.com/VOTRE-USER/id9-agency.git
git push -u origin main
```

### 5.3 Importer sur Vercel

1. https://vercel.com/new
2. Cliquer **Import** à côté de votre repo GitHub `id9-agency`.
3. **Root Directory** → cliquer **Edit** → sélectionner `frontend`.
   > ⚠️ Étape critique : Vercel doit pointer sur le sous-dossier `frontend/`, pas la racine.
4. **Framework Preset** : Create React App (auto-détecté).
5. **Build & Development Settings** : laissez les valeurs par défaut (`vercel.json` gère tout).
6. **Environment Variables** — ajoutez :

   | Nom | Valeur |
   |---|---|
   | `REACT_APP_BACKEND_URL` | URL publique de votre backend (voir 5.4) |
   | `REACT_APP_SPLINE_SCENE_URL` | `https://prod.spline.design/ULqGLBLb7PZFYV8w/scene.splinecode` |
   | `REACT_APP_SANITY_PROJECT_ID` | `mqrbsugj` |
   | `REACT_APP_SANITY_DATASET` | `production` |

7. Cliquer **Deploy**. Le build prend ~3 minutes.
8. Vercel vous donne une URL du type `https://id9-agency.vercel.app`. Vous pouvez y attacher votre nom de domaine dans **Settings → Domains**.

### 5.4 Déployer aussi le backend FastAPI

Vercel **ne supporte pas FastAPI nativement** (fonctions serverless limitées). Options recommandées :

| Solution | Prix | Facilité |
|---|---|---|
| **Railway** | Gratuit 5$/mois puis payant | ⭐⭐⭐⭐⭐ — recommandé |
| **Render** | Gratuit avec sleep | ⭐⭐⭐⭐ |
| **Fly.io** | Gratuit limité | ⭐⭐⭐ |
| **DigitalOcean App Platform** | 5$/mois minimum | ⭐⭐⭐⭐ |

**Exemple Railway** :
1. https://railway.app → **New Project** → **Deploy from GitHub** → sélectionner votre repo.
2. **Root Directory** = `backend`.
3. **Start Command** : `uvicorn server:app --host 0.0.0.0 --port $PORT`.
4. **Variables** : ajouter `MONGO_URL`, `DB_NAME`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CORS_ORIGINS=https://id9-agency.vercel.app`.
5. **Add MongoDB** (plugin Railway) → copiez l'URI dans `MONGO_URL`.
6. Après déploiement, Railway vous donne une URL du type `https://id9-backend.up.railway.app`.
7. Retournez sur Vercel → **Settings → Environment Variables** → mettez à jour `REACT_APP_BACKEND_URL` avec cette URL.
8. Vercel → **Deployments** → **Redeploy** le dernier build.

---

## 🛠️ 6. Commandes utiles

```bash
# Frontend
cd frontend
yarn start                       # dev server
yarn build                       # build production local
yarn vercel-build                # build exactement comme Vercel (CI=false)
CI=true yarn vercel-build        # simuler l'environnement Vercel

# Backend
cd backend
uvicorn server:app --reload      # dev
uvicorn server:app --port 8001   # prod local

# Tests backend
cd backend && pytest tests/ -v

# Sanity Studio
cd studio
yarn dev                         # local
yarn deploy                      # hébergé Sanity
yarn build                       # build statique

# Nettoyage complet (en cas de problème dépendances)
cd frontend
rm -rf node_modules package-lock.json yarn.lock build
yarn install                     # OU : npm install
```

---

## 🐞 7. Dépannage

### Le build Vercel échoue avec `Cannot find module 'ajv/dist/compile/codegen'`
✅ **Déjà corrigé** dans ce projet. Vérifiez :
- `package.json` contient `"ajv": "^8.17.1"` dans `dependencies`.
- `.nvmrc` contient `20`.
- `vercel.json` déclare `installCommand: "yarn install --frozen-lockfile"`.

### `npm install` très lent ou échoue
- Utilisez plutôt **yarn** : `yarn install`.
- Ou nettoyez : `rm -rf node_modules package-lock.json && npm install`.

### Le frontend ne peut pas se connecter au backend
- Vérifiez `REACT_APP_BACKEND_URL` dans `frontend/.env` (pas de `/` final).
- Vérifiez que le backend tourne sur le port indiqué (8001 par défaut).
- Vérifiez `CORS_ORIGINS` dans `backend/.env` inclut votre origine frontend.

### Le portfolio est vide en production
- Confirmez que vous avez publié des projets dans Sanity Studio (bouton "Publish").
- Vérifiez `REACT_APP_SANITY_PROJECT_ID` et `REACT_APP_SANITY_DATASET` dans les env vars Vercel.
- Ouvrez la console navigateur (F12) — regardez les erreurs réseau.

### Erreur "MongoDB connection failed"
- Vérifiez que MongoDB tourne (`mongod` en local, ou statut Atlas en ligne).
- Testez l'URI : `mongo "$MONGO_URL"` doit se connecter.

---

## 🔐 8. Sécurité — checklist avant production

- [ ] **Changer `JWT_SECRET`** dans `backend/.env` (chaîne aléatoire 64+ car).
- [ ] **Changer `ADMIN_PASSWORD`** (12+ caractères, mix majuscule/chiffre/symbole).
- [ ] **Restreindre `CORS_ORIGINS`** à votre domaine (ex: `https://id9agency.com`, pas `*`).
- [ ] **MongoDB Atlas** avec IP whitelisting (pas 0.0.0.0/0 en prod).
- [ ] **HTTPS activé** partout (Vercel et Railway le font par défaut).
- [ ] **Aucun `.env` commité** dans Git (déjà dans `.gitignore`).

---

## 📚 9. Ressources

- **Sanity docs** : https://www.sanity.io/docs
- **Vercel docs** : https://vercel.com/docs
- **Railway docs** : https://docs.railway.app
- **FastAPI docs** : https://fastapi.tiangolo.com
- **React (CRA + craco)** : https://create-react-app.dev / https://craco.js.org
- **Tailwind CSS** : https://tailwindcss.com/docs
- **Framer Motion** : https://www.framer.com/motion

---

## ✅ 10. Récap 30 secondes

```bash
# Chaque jour :
cd id9-agency

# Terminal 1
cd backend && source venv/bin/activate && uvicorn server:app --reload --port 8001

# Terminal 2
cd frontend && yarn start

# Pour publier des projets portfolio :
# → https://id9-agency.sanity.studio (ou http://localhost:3333)

# Pour déployer :
git add . && git commit -m "update" && git push
# → Vercel redéploie automatiquement le frontend
# → Railway redéploie automatiquement le backend
```

**Bravo. Vous êtes autonome. 🚀**
