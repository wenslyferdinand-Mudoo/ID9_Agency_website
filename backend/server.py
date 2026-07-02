from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import re
import uuid
import logging
from datetime import datetime, timezone, timedelta
from typing import List, Optional

import bcrypt
import jwt
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict


# ---------- MongoDB ----------
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]


# ---------- App ----------
app = FastAPI(title="ID9_AGENCY API")
api_router = APIRouter(prefix="/api")


# ---------- Auth utils ----------
JWT_ALGORITHM = "HS256"
JWT_EXPIRES_MIN = 60 * 24 * 7  # 7 days for admin convenience
security = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode(), hashed.encode())
    except Exception:
        return False


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(minutes=JWT_EXPIRES_MIN),
    }
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


async def get_current_admin(creds: Optional[HTTPAuthorizationCredentials] = Depends(security)):
    if creds is None or not creds.credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = creds.credentials
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=401, detail="Admin not found")
    return user


# ---------- Helpers ----------
def slugify(text: str) -> str:
    s = re.sub(r"[^a-zA-Z0-9\s-]", "", text).strip().lower()
    return re.sub(r"[\s_-]+", "-", s)


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# ---------- Models ----------
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    whatsapp: Optional[str] = None
    budget: Optional[str] = None
    service: Optional[str] = None
    deadline: Optional[str] = None
    message: str


class Contact(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    email: str
    whatsapp: Optional[str] = None
    budget: Optional[str] = None
    service: Optional[str] = None
    deadline: Optional[str] = None
    message: str
    created_at: str
    read: bool = False


class PortfolioCreate(BaseModel):
    title: str
    category: str  # branding | web | app | marketing | motion | photo
    client: Optional[str] = None
    year: Optional[str] = None
    sector: Optional[str] = None
    summary: str
    description: Optional[str] = None
    cover_image: str
    gallery: List[str] = []
    services: List[str] = []
    tools: List[str] = []
    challenge: Optional[str] = None
    approach: Optional[str] = None
    strategy: Optional[str] = None
    solution: Optional[str] = None
    outcome: Optional[str] = None
    kpis: List[dict] = []
    testimonial: Optional[str] = None
    featured: bool = False


class PortfolioItem(PortfolioCreate):
    id: str
    slug: str
    created_at: str


class BlogCreate(BaseModel):
    title: str
    category: str
    excerpt: str
    content: str
    cover_image: str
    author: str = "ID9 Editorial"
    read_time: str = "5 min read"
    published: bool = True
    featured: bool = False


class BlogPost(BlogCreate):
    id: str
    slug: str
    created_at: str


# ---------- Public endpoints ----------
@api_router.get("/")
async def root():
    return {"message": "ID9_AGENCY API", "status": "ok"}


@api_router.post("/auth/login", response_model=LoginResponse)
async def login(data: LoginRequest):
    email = data.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(user["id"], user["email"])
    safe_user = {"id": user["id"], "email": user["email"], "name": user.get("name"), "role": user.get("role")}
    return LoginResponse(access_token=token, user=safe_user)


@api_router.get("/auth/me")
async def me(current=Depends(get_current_admin)):
    return current


@api_router.post("/contact", response_model=Contact)
async def submit_contact(data: ContactCreate):
    doc = {
        "id": str(uuid.uuid4()),
        **data.model_dump(),
        "created_at": utc_now_iso(),
        "read": False,
    }
    await db.contacts.insert_one(doc.copy())
    return Contact(**doc)


@api_router.get("/contact", response_model=List[Contact])
async def list_contacts(current=Depends(get_current_admin)):
    items = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return items


@api_router.patch("/contact/{contact_id}/read")
async def mark_read(contact_id: str, current=Depends(get_current_admin)):
    res = await db.contacts.update_one({"id": contact_id}, {"$set": {"read": True}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"ok": True}


@api_router.delete("/contact/{contact_id}")
async def delete_contact(contact_id: str, current=Depends(get_current_admin)):
    res = await db.contacts.delete_one({"id": contact_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"ok": True}


# ---------- Portfolio ----------
@api_router.get("/portfolio", response_model=List[PortfolioItem])
async def list_portfolio(category: Optional[str] = None, featured: Optional[bool] = None):
    q: dict = {}
    if category and category != "all":
        q["category"] = category
    if featured is not None:
        q["featured"] = featured
    items = await db.portfolio.find(q, {"_id": 0}).sort("created_at", -1).to_list(200)
    return items


@api_router.get("/portfolio/{slug}", response_model=PortfolioItem)
async def get_portfolio(slug: str):
    item = await db.portfolio.find_one({"slug": slug}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Portfolio item not found")
    return item


@api_router.post("/portfolio", response_model=PortfolioItem)
async def create_portfolio(data: PortfolioCreate, current=Depends(get_current_admin)):
    doc = {
        "id": str(uuid.uuid4()),
        "slug": slugify(data.title) + "-" + uuid.uuid4().hex[:6],
        **data.model_dump(),
        "created_at": utc_now_iso(),
    }
    await db.portfolio.insert_one(doc.copy())
    return doc


@api_router.put("/portfolio/{item_id}", response_model=PortfolioItem)
async def update_portfolio(item_id: str, data: PortfolioCreate, current=Depends(get_current_admin)):
    existing = await db.portfolio.find_one({"id": item_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Not found")
    update = data.model_dump()
    await db.portfolio.update_one({"id": item_id}, {"$set": update})
    existing.update(update)
    return existing


@api_router.delete("/portfolio/{item_id}")
async def delete_portfolio(item_id: str, current=Depends(get_current_admin)):
    res = await db.portfolio.delete_one({"id": item_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"ok": True}


# ---------- Blog ----------
@api_router.get("/blog", response_model=List[BlogPost])
async def list_blog(category: Optional[str] = None):
    q: dict = {"published": True}
    if category and category != "all":
        q["category"] = category
    items = await db.blog.find(q, {"_id": 0}).sort("created_at", -1).to_list(200)
    return items


@api_router.get("/blog/{slug}", response_model=BlogPost)
async def get_blog(slug: str):
    item = await db.blog.find_one({"slug": slug}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return item


@api_router.post("/blog", response_model=BlogPost)
async def create_blog(data: BlogCreate, current=Depends(get_current_admin)):
    doc = {
        "id": str(uuid.uuid4()),
        "slug": slugify(data.title) + "-" + uuid.uuid4().hex[:6],
        **data.model_dump(),
        "created_at": utc_now_iso(),
    }
    await db.blog.insert_one(doc.copy())
    return doc


@api_router.put("/blog/{item_id}", response_model=BlogPost)
async def update_blog(item_id: str, data: BlogCreate, current=Depends(get_current_admin)):
    existing = await db.blog.find_one({"id": item_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Not found")
    update = data.model_dump()
    await db.blog.update_one({"id": item_id}, {"$set": update})
    existing.update(update)
    return existing


@api_router.delete("/blog/{item_id}")
async def delete_blog(item_id: str, current=Depends(get_current_admin)):
    res = await db.blog.delete_one({"id": item_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"ok": True}


# ---------- Services (static) ----------
SERVICES = [
    {"slug": "branding", "title": "Branding & Identity", "title_fr": "Branding & Identité", "icon": "Sparkles", "desc": "Memorable logos, identity systems and brand guidelines that command authority.", "desc_fr": "Logos mémorables, systèmes d'identité et chartes graphiques qui imposent l'autorité.", "deliverables": ["Logo system", "Brand guidelines", "Visual identity", "Brand strategy"], "deliverables_fr": ["Système de logo", "Charte graphique", "Identité visuelle", "Stratégie de marque"]},
    {"slug": "web", "title": "Web Development", "title_fr": "Développement Web", "icon": "Globe", "desc": "Premium, cinematic, conversion-driven websites built on modern stacks.", "desc_fr": "Sites web premium, cinématiques et orientés conversion, bâtis sur des stacks modernes.", "deliverables": ["Marketing site", "E-commerce", "Web app", "Performance audit"], "deliverables_fr": ["Site vitrine", "E-commerce", "Application web", "Audit de performance"]},
    {"slug": "app", "title": "App Development", "title_fr": "Développement d'Applications", "icon": "Smartphone", "desc": "Native-grade mobile and web apps with sharp UX and motion.", "desc_fr": "Applications mobiles et web de qualité native avec UX et animations soignées.", "deliverables": ["iOS / Android", "PWA", "Backend API", "Launch support"], "deliverables_fr": ["iOS / Android", "PWA", "API backend", "Accompagnement au lancement"]},
    {"slug": "uiux", "title": "UI / UX Design", "title_fr": "Design UI / UX", "icon": "Layers", "desc": "Interfaces that feel inevitable. Research, wireframes, prototypes, design systems.", "desc_fr": "Des interfaces qui semblent évidentes. Recherche, wireframes, prototypes, design systems.", "deliverables": ["Wireframes", "Hi-fi UI", "Design system", "Usability testing"], "deliverables_fr": ["Wireframes", "UI haute fidélité", "Design system", "Tests d'utilisabilité"]},
    {"slug": "marketing", "title": "Digital Marketing", "title_fr": "Marketing Digital", "icon": "Target", "desc": "Performance marketing that turns ambition into measurable growth.", "desc_fr": "Marketing de performance qui transforme l'ambition en croissance mesurable.", "deliverables": ["Paid media", "Content strategy", "Funnels", "Analytics"], "deliverables_fr": ["Media payants", "Stratégie de contenu", "Tunnels de conversion", "Analytics"]},
    {"slug": "seo", "title": "SEO", "title_fr": "Référencement (SEO)", "icon": "Search", "desc": "Technical, on-page and off-page SEO frameworks for compound visibility.", "desc_fr": "Frameworks SEO technique, on-page et off-page pour une visibilité qui se cumule.", "deliverables": ["Audit", "Keyword strategy", "On-page", "Link building"], "deliverables_fr": ["Audit", "Stratégie de mots-clés", "Optimisation on-page", "Netlinking"]},
    {"slug": "motion", "title": "Motion Design", "title_fr": "Motion Design", "icon": "Zap", "desc": "Cinematic motion that elevates brands and storytelling.", "desc_fr": "Animations cinématiques qui subliment marques et storytelling.", "deliverables": ["Logo animation", "Explainer", "UI motion", "Social loops"], "deliverables_fr": ["Animation de logo", "Vidéo explicative", "Animations UI", "Loops sociaux"]},
    {"slug": "video", "title": "Video Production", "title_fr": "Production Vidéo", "icon": "Video", "desc": "Concept, direction, shoot, edit. Stories that move people.", "desc_fr": "Concept, réalisation, tournage, montage. Des histoires qui émeuvent.", "deliverables": ["Brand film", "Commercial", "Documentary", "Reels"], "deliverables_fr": ["Film de marque", "Publicité", "Documentaire", "Reels"]},
    {"slug": "photography", "title": "Photography", "title_fr": "Photographie", "icon": "Camera", "desc": "Editorial photography for products, fashion, lifestyle and corporate.", "desc_fr": "Photographie éditoriale pour produits, mode, lifestyle et corporate.", "deliverables": ["Product", "Editorial", "Lookbook", "Headshots"], "deliverables_fr": ["Produit", "Éditorial", "Lookbook", "Portraits pro"]},
    {"slug": "artist-management", "title": "Artist Management", "title_fr": "Gestion d'Artistes", "icon": "Music", "desc": "Strategic management for artists and creators ready to scale.", "desc_fr": "Management stratégique pour artistes et créateurs prêts à passer à l'échelle.", "deliverables": ["Brand positioning", "Release strategy", "Press", "Tour ops"], "deliverables_fr": ["Positionnement de marque", "Stratégie de sortie", "Presse", "Organisation de tournée"]},
    {"slug": "funnels", "title": "Funnels & CRO", "title_fr": "Tunnels & CRO", "icon": "GitBranch", "desc": "Conversion funnels engineered to compound revenue.", "desc_fr": "Tunnels de conversion conçus pour faire grandir le chiffre d'affaires.", "deliverables": ["Funnel mapping", "Landing pages", "A/B testing", "Email"], "deliverables_fr": ["Cartographie de tunnel", "Landing pages", "Tests A/B", "Emailing"]},
    {"slug": "ai", "title": "AI Solutions", "title_fr": "Solutions IA", "icon": "Brain", "desc": "Custom AI agents, automations and integrations for ambitious teams.", "desc_fr": "Agents IA sur mesure, automatisations et intégrations pour équipes ambitieuses.", "deliverables": ["Chat agents", "Automations", "Custom GPTs", "RAG systems"], "deliverables_fr": ["Agents conversationnels", "Automatisations", "GPTs personnalisés", "Systèmes RAG"]},
]


@api_router.get("/services")
async def list_services():
    return SERVICES


@api_router.get("/services/{slug}")
async def get_service(slug: str):
    for s in SERVICES:
        if s["slug"] == slug:
            return s
    raise HTTPException(status_code=404, detail="Service not found")


# ---------- Seed data ----------
PORTFOLIO_SEED = [
    {
        "title": "Akya Dance Company — Cultural Identity Reborn",
        "category": "branding",
        "client": "Akya Dance Company",
        "sector": "Culture · Dance",
        "year": "2022",
        "summary": "Branding complet pour une compagnie de danse haïtienne — identité visuelle, cartes de visite, flyers, program cards.",
        "description": "Akya Dance Company, dirigée par Markenley Georges (CDMG — Centre de Danse Markenley Georges), avait besoin d'une identité visuelle capable de porter sa vision artistique au-delà de Pétion-Ville. Nous avons construit un système complet — du logo aux supports événementiels — pour transformer chaque représentation en moment de marque mémorable.",
        "cover_image": "/projects/akya/flyer-janvier-2023.jpg",
        "gallery": [
            "/projects/akya/business-card-flat.jpg",
            "/projects/akya/business-card-mockup.jpg",
            "/projects/akya/program-card.jpg",
            "/projects/akya/flyer-juin-2022.jpg",
            "/projects/akya/flyer-janvier-2023.jpg",
        ],
        "services": ["Branding", "Business Card Design", "Flyer Design", "Program Card"],
        "tools": ["Adobe Photoshop", "Adobe Illustrator"],
        "challenge": "Akya Dance était reconnue localement pour la qualité artistique de ses spectacles, mais souffrait d'une identité visuelle dispersée. Chaque flyer, chaque carte, chaque support utilisait des styles différents — affaiblissant la perception de marque et compliquant la promotion des événements en folklore haïtien.",
        "approach": "Nous avons abordé Akya comme une marque culturelle premium : ancrée dans la tradition haïtienne (couleurs terre, bordeaux, ocre) mais portée par un langage moderne. Sessions stratégiques avec Markenley Georges pour comprendre l'âme de la compagnie, puis création d'un système graphique cohérent déclinable sur tous les supports.",
        "strategy": "Une identité double : élégante en B2B (cartes de visite, communication officielle) et expressive en B2C (flyers, program cards) — toujours reconnaissable au premier coup d'œil. Photographie chorégraphique mise en valeur, typographie scriptée pour l'émotion, blocs solides pour l'information.",
        "solution": "Logo Markenley Georges + monogramme CDMG, charte chromatique signature (jaune solaire / vert profond / bordeaux), business cards recto-verso, flyers événementiels (audition juin 2022, spectacle Cri de la Liberté janvier 2023), program cards et tickets numérotés.",
        "outcome": "Akya Dance dispose désormais d'une identité cohérente qui amplifie chaque communication et renforce le positionnement de Markenley Georges comme figure de la danse contemporaine haïtienne.",
        "kpis": [
            {"label": "Supports créés", "value": "12+"},
            {"label": "Événements promus", "value": "4"},
            {"label": "Cohérence visuelle", "value": "100%"},
            {"label": "Année de partenariat", "value": "2022"},
        ],
        "testimonial": "ID9 a compris notre âme artistique et l'a traduite en une identité visuelle dont nous sommes fiers à chaque représentation.",
        "featured": True,
    },
]


BLOG_SEED = [
    {
        "title": "Why Premium Brands Win in Saturated Markets",
        "category": "Branding",
        "excerpt": "Cheap competes on price. Premium competes on meaning. Here is the playbook we use with every ID9 client.",
        "content": "## The premium gap\n\nIn every category, the middle is collapsing. Customers either trade down to commodity prices or trade up to brands that feel undeniable.\n\nAt ID9 we help ambitious founders build the second kind.\n\n## Three principles\n\n1. **Clarity beats cleverness.** A premium brand says one thing and says it sharp.\n2. **Story beats specs.** People buy futures, not features.\n3. **Craft beats quantity.** One unforgettable touchpoint > ten forgettable ones.\n\n## How we apply this\n\nEvery branding engagement at ID9 starts with a positioning sprint — 5 days, founder + strategist + designer in the same room (digital or physical). By day five you have a sharpened narrative, a moodboard direction, and three brand concepts.\n\nThen we build.",
        "cover_image": "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1600&q=80",
        "author": "Wensly Ferdinand",
        "read_time": "6 min read",
        "published": True,
        "featured": True,
    },
    {
        "title": "The Anatomy of a Cinematic Hero Section",
        "category": "Web Design",
        "excerpt": "Eight design moves we use to make a homepage feel like a film opening — and convert at the same time.",
        "content": "## Why hero sections matter\n\nFirst three seconds = entire impression.\n\n## Eight moves\n\n1. **Asymmetric layout.** Centered = forgettable.\n2. **One sharp promise.** Not three.\n3. **Subtle motion.** A floating orb, a parallax shift.\n4. **Editorial typography.** Tight tracking. Heavy weight.\n5. **Real CTA, not 'Learn More'.**\n6. **Trust strip below the fold.**\n7. **No carousel. Ever.**\n8. **Performance budget.** Cinematic must not equal slow.",
        "cover_image": "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1600&q=80",
        "author": "ID9 Studio",
        "read_time": "8 min read",
        "published": True,
        "featured": False,
    },
    {
        "title": "SEO for Creative Agencies in 2025",
        "category": "SEO",
        "excerpt": "How we rank ID9 and our clients in competitive creative markets using a content-and-craft approach.",
        "content": "## The shift\n\nGoogle rewards depth, originality and brand signals more than ever.\n\n## What works\n\n- Deep, opinionated long-form\n- Case studies with real numbers\n- Programmatic SEO done right (not spam)\n- E-E-A-T: experience, expertise, authority, trust\n\n## What we do at ID9\n\nWe combine technical SEO, editorial content and brand work into one motion. Most agencies still treat them as separate disciplines.",
        "cover_image": "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=1600&q=80",
        "author": "ID9 Editorial",
        "read_time": "5 min read",
        "published": True,
        "featured": False,
    },
    {
        "title": "Building a Lead Magnet That Actually Converts",
        "category": "Marketing",
        "excerpt": "The exact framework we use to turn cold traffic into qualified strategy calls — without a single discount.",
        "content": "## The myth\n\nLead magnets fail when they are generic. 'Download our free guide' is not an offer — it is noise.\n\n## The framework\n\n1. **Specificity** — name the exact outcome.\n2. **Urgency** — make it feel time-bound.\n3. **Credibility** — proof, names, numbers.\n4. **Frictionless** — one field max.\n5. **Sharp follow-up** — automation that feels human.\n\n## Example\n\nFor a SaaS client we replaced 'Free demo' with '15-min growth audit — booked in under 60 seconds'. Conversion went from 1.1% to 4.7%.",
        "cover_image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
        "author": "Wensly Ferdinand",
        "read_time": "7 min read",
        "published": True,
        "featured": False,
    },
]


async def seed_admin():
    email = os.environ.get("ADMIN_EMAIL", "admin@id9agency.com").lower()
    password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": email,
            "password_hash": hash_password(password),
            "name": "ID9 Admin",
            "role": "admin",
            "created_at": utc_now_iso(),
        })
        logger.info(f"[seed] admin created: {email}")
    else:
        # Keep password in sync with .env (idempotent)
        if not verify_password(password, existing["password_hash"]):
            await db.users.update_one({"email": email}, {"$set": {"password_hash": hash_password(password)}})
            logger.info(f"[seed] admin password updated: {email}")


async def seed_content():
    # Portfolio
    for item in PORTFOLIO_SEED:
        existing = await db.portfolio.find_one({"title": item["title"]})
        if existing is None:
            doc = {
                "id": str(uuid.uuid4()),
                "slug": slugify(item["title"]),
                **item,
                "created_at": utc_now_iso(),
            }
            await db.portfolio.insert_one(doc)
    # Blog
    for post in BLOG_SEED:
        existing = await db.blog.find_one({"title": post["title"]})
        if existing is None:
            doc = {
                "id": str(uuid.uuid4()),
                "slug": slugify(post["title"]),
                **post,
                "created_at": utc_now_iso(),
            }
            await db.blog.insert_one(doc)


# ---------- App setup ----------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=False,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def on_startup():
    try:
        await db.users.create_index("email", unique=True)
        await db.portfolio.create_index("slug", unique=True)
        await db.blog.create_index("slug", unique=True)
    except Exception as e:
        logger.warning(f"[startup] index creation: {e}")
    await seed_admin()
    await seed_content()
    logger.info("ID9 backend ready.")


@app.on_event("shutdown")
async def on_shutdown():
    client.close()
