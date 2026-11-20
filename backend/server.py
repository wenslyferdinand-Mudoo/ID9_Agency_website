from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import re
import uuid
import logging
import hashlib
from datetime import datetime, timezone, timedelta
from typing import List, Optional

import bcrypt
import jwt
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ReturnDocument
from pydantic import BaseModel, Field, EmailStr, ConfigDict


# ---------- MongoDB ----------
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=5000)
db = client[os.environ['DB_NAME']]


# ---------- App ----------
app = FastAPI(title="ID9_AGENCY API")
api_router = APIRouter(prefix="/api")


# ---------- Auth utils ----------
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRES_MIN = 15
REFRESH_TOKEN_EXPIRES_DAYS = 30
AUTH_COOKIE_NAME = "id9_refresh"
security = HTTPBearer(auto_error=False)


def _jwt_secret() -> str:
    secret = os.environ.get("JWT_SECRET", "")
    if len(secret.encode("utf-8")) < 32:
        raise RuntimeError("JWT_SECRET must contain at least 32 bytes.")
    return secret


def _token_hash(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode(), hashed.encode())
    except Exception:
        return False


def _issue_session_tokens(user: dict, session_id: str) -> tuple[str, str, str, datetime]:
    now = datetime.now(timezone.utc)
    refresh_jti = str(uuid.uuid4())
    refresh_exp = now + timedelta(days=REFRESH_TOKEN_EXPIRES_DAYS)
    common = {"sub": user["id"], "email": user["email"], "sid": session_id}
    access = jwt.encode(
        {**common, "jti": str(uuid.uuid4()), "type": "access",
         "iat": now, "exp": now + timedelta(minutes=ACCESS_TOKEN_EXPIRES_MIN)},
        _jwt_secret(), algorithm=JWT_ALGORITHM,
    )
    refresh = jwt.encode(
        {**common, "jti": refresh_jti, "type": "refresh", "iat": now, "exp": refresh_exp},
        _jwt_secret(), algorithm=JWT_ALGORITHM,
    )
    return access, refresh, _token_hash(refresh_jti), refresh_exp


def _set_refresh_cookie(response: Response, token: str) -> None:
    production = os.environ.get("APP_ENV", "production").strip().lower() != "development"
    response.set_cookie(
        key=AUTH_COOKIE_NAME, value=token, httponly=True, secure=production,
        samesite="none" if production else "lax", path="/api/auth",
        max_age=REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60,
    )


def _clear_refresh_cookie(response: Response) -> None:
    production = os.environ.get("APP_ENV", "production").strip().lower() != "development"
    response.delete_cookie(
        key=AUTH_COOKIE_NAME, path="/api/auth", secure=production,
        httponly=True, samesite="none" if production else "lax",
    )


async def get_current_admin(creds: Optional[HTTPAuthorizationCredentials] = Depends(security)):
    if creds is None or not creds.credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(
            creds.credentials, _jwt_secret(), algorithms=[JWT_ALGORITHM],
            options={"require": ["exp", "sub", "type", "sid", "jti"]},
        )
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    now = datetime.now(timezone.utc)
    session = await db.auth_sessions.find_one({
        "id": payload["sid"], "user_id": payload["sub"], "revoked": False,
        "expires_at": {"$gt": now},
    })
    if not session:
        raise HTTPException(status_code=401, detail="Session expired or revoked")
    user = await db.users.find_one(
        {"id": payload["sub"]}, {"_id": 0, "password_hash": 0}
    )
    if not user:
        raise HTTPException(status_code=401, detail="Account unavailable")
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Administrator access required")
    return user


async def _revoke_session(session_id: str) -> None:
    await db.auth_sessions.update_one(
        {"id": session_id, "revoked": False},
        {"$set": {"revoked": True, "revoked_at": datetime.now(timezone.utc)}},
    )

# ---------- Helpers ----------
def slugify(text: str) -> str:
    s = re.sub(r"[^a-zA-Z0-9\s-]", "", text).strip().lower()
    return re.sub(r"[\s_-]+", "-", s)


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# ---------- Models ----------
class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class ContactCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    whatsapp: Optional[str] = Field(default=None, max_length=40)
    budget: Optional[str] = Field(default=None, max_length=80)
    service: Optional[str] = Field(default=None, max_length=120)
    deadline: Optional[str] = Field(default=None, max_length=80)
    message: str = Field(min_length=10, max_length=5000)


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
    title: str = Field(min_length=2, max_length=160)
    category: str = Field(min_length=2, max_length=40)
    client: Optional[str] = Field(default=None, max_length=160)
    year: Optional[str] = Field(default=None, max_length=12)
    sector: Optional[str] = Field(default=None, max_length=120)
    summary: str = Field(min_length=5, max_length=2000)
    description: Optional[str] = Field(default=None, max_length=12000)
    cover_image: str = Field(min_length=1, max_length=2048)
    gallery: List[str] = Field(default_factory=list, max_length=40)
    services: List[str] = Field(default_factory=list, max_length=30)
    tools: List[str] = Field(default_factory=list, max_length=30)
    challenge: Optional[str] = Field(default=None, max_length=5000)
    approach: Optional[str] = Field(default=None, max_length=5000)
    strategy: Optional[str] = Field(default=None, max_length=5000)
    solution: Optional[str] = Field(default=None, max_length=5000)
    outcome: Optional[str] = Field(default=None, max_length=5000)
    kpis: List[dict] = Field(default_factory=list, max_length=30)
    testimonial: Optional[str] = Field(default=None, max_length=3000)
    featured: bool = False


class PortfolioItem(PortfolioCreate):
    id: str
    slug: str
    created_at: str


class BlogCreate(BaseModel):
    title: str = Field(min_length=3, max_length=180)
    category: str = Field(min_length=2, max_length=80)
    excerpt: str = Field(min_length=5, max_length=1200)
    content: str = Field(min_length=1, max_length=30000)
    cover_image: str = Field(min_length=1, max_length=2048)
    author: str = Field(default="ID9 Editorial", max_length=120)
    read_time: str = Field(default="5 min read", max_length=40)
    published: bool = True
    featured: bool = False


class BlogPost(BlogCreate):
    id: str
    slug: str
    created_at: str


# ---------- Abuse protection ----------
async def enforce_rate_limit(request: Request, action: str, limit: int, window_seconds: int):
    # MongoDB-backed fixed windows work across multiple Render instances and restarts.
    client_host = request.client.host if request.client else "unknown"
    now = datetime.now(timezone.utc)
    bucket = int(now.timestamp()) // window_seconds
    key = f"{action}:{client_host}:{bucket}"
    expires_at = datetime.fromtimestamp((bucket + 2) * window_seconds, timezone.utc)
    record = await db.rate_limits.find_one_and_update(
        {"_id": key},
        {"$inc": {"count": 1}, "$setOnInsert": {"expires_at": expires_at}},
        upsert=True,
        return_document=ReturnDocument.AFTER,
    )
    if record and record.get("count", 0) > limit:
        raise HTTPException(
            status_code=429,
            detail="Too many requests. Please try again later.",
            headers={"Retry-After": str(window_seconds)},
        )


# ---------- Public endpoints ----------
@api_router.get("/")
async def root():
    return {"message": "ID9_AGENCY API", "status": "ok"}


@api_router.post("/auth/login", response_model=LoginResponse)
async def login(data: LoginRequest, request: Request, response: Response):
    await enforce_rate_limit(request, "login", limit=10, window_seconds=300)
    email = data.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(data.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Administrator access required")

    session_id = str(uuid.uuid4())
    access, refresh, refresh_hash, refresh_exp = _issue_session_tokens(user, session_id)
    await db.auth_sessions.insert_one({
        "id": session_id, "user_id": user["id"], "refresh_jti_hash": refresh_hash,
        "revoked": False, "created_at": datetime.now(timezone.utc),
        "last_used_at": datetime.now(timezone.utc), "expires_at": refresh_exp,
    })
    _set_refresh_cookie(response, refresh)
    safe_user = {"id": user["id"], "email": user["email"], "name": user.get("name"), "role": user.get("role")}
    return LoginResponse(access_token=access, user=safe_user)


@api_router.post("/auth/refresh", response_model=LoginResponse)
async def refresh_session(request: Request, response: Response):
    refresh_token = request.cookies.get(AUTH_COOKIE_NAME)
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh session missing")
    try:
        payload = jwt.decode(
            refresh_token, _jwt_secret(), algorithms=[JWT_ALGORITHM],
            options={"require": ["exp", "sub", "type", "sid", "jti"]},
        )
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh session expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    now = datetime.now(timezone.utc)
    current = await db.auth_sessions.find_one({
        "id": payload["sid"], "user_id": payload["sub"], "revoked": False,
        "expires_at": {"$gt": now},
    })
    if not current:
        raise HTTPException(status_code=401, detail="Session expired or revoked")

    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not user or user.get("role") != "admin":
        await _revoke_session(payload["sid"])
        raise HTTPException(status_code=401, detail="Account unavailable")

    access, rotated_refresh, next_hash, next_exp = _issue_session_tokens(user, payload["sid"])
    rotated = await db.auth_sessions.find_one_and_update(
        {"id": payload["sid"], "user_id": payload["sub"], "revoked": False,
         "refresh_jti_hash": _token_hash(payload["jti"]), "expires_at": {"$gt": now}},
        {"$set": {"refresh_jti_hash": next_hash, "last_used_at": now, "expires_at": next_exp}},
        return_document=ReturnDocument.AFTER,
    )
    if not rotated:
        # A previously rotated refresh token was replayed. Revoke the whole session.
        await _revoke_session(payload["sid"])
        raise HTTPException(status_code=401, detail="Refresh token reuse detected; session revoked")

    _set_refresh_cookie(response, rotated_refresh)
    safe_user = {"id": user["id"], "email": user["email"], "name": user.get("name"), "role": user.get("role")}
    return LoginResponse(access_token=access, user=safe_user)


@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    token = request.cookies.get(AUTH_COOKIE_NAME)
    if token:
        try:
            payload = jwt.decode(
                token, _jwt_secret(), algorithms=[JWT_ALGORITHM],
                options={"verify_exp": False, "require": ["sub", "type", "sid", "jti"]},
            )
            if payload.get("type") == "refresh":
                await _revoke_session(payload["sid"])
        except jwt.InvalidTokenError:
            pass
    _clear_refresh_cookie(response)
    return {"ok": True}


@api_router.get("/auth/me")
async def me(current=Depends(get_current_admin)):
    return current


@api_router.post("/contact", response_model=Contact)
async def submit_contact(data: ContactCreate, request: Request):
    await enforce_rate_limit(request, "contact", limit=5, window_seconds=600)
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
    item = await db.blog.find_one({"slug": slug, "published": True}, {"_id": 0})
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
    # Provisioning is explicit: never create a default administrator or rotate
    # an existing password as a side effect of application startup.
    email = os.environ.get("ADMIN_EMAIL", "").strip().lower()
    password = os.environ.get("ADMIN_PASSWORD", "")

    if not email or not password:
        logger.warning(
            "[security] ADMIN_EMAIL / ADMIN_PASSWORD are not both configured; "
            "automatic admin provisioning skipped."
        )
        return

    existing = await db.users.find_one({"email": email})
    if existing is not None:
        logger.info("[security] configured admin account already exists; credentials unchanged.")
        return

    await db.users.insert_one({
        "id": str(uuid.uuid4()),
        "email": email,
        "password_hash": hash_password(password),
        "name": "ID9 Admin",
        "role": "admin",
        "created_at": utc_now_iso(),
    })
    logger.info("[security] initial admin account provisioned from environment configuration.")


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

def get_allowed_origins() -> list[str]:
    raw_origins = os.environ.get(
        "CORS_ORIGINS",
        "https://id9-agency-website.vercel.app",
    )
    origins = [origin.strip().rstrip("/") for origin in raw_origins.split(",") if origin.strip()]
    if not origins or "*" in origins:
        raise RuntimeError("CORS_ORIGINS must contain explicit trusted origins; wildcard CORS is disabled.")
    return origins


def should_seed_demo_content() -> bool:
    app_env = os.environ.get("APP_ENV", "production").strip().lower()
    seed_flag = os.environ.get("SEED_DEMO_CONTENT", "").strip().lower()
    return app_env != "production" and seed_flag in {"1", "true", "yes"}


app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=get_allowed_origins(),
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def on_startup():
    # Fail fast in staging/production if MongoDB is unavailable or required indexes
    # cannot be established. No collections or existing documents are dropped.
    await db.command("ping")
    await db.users.create_index("email", unique=True)
    await db.portfolio.create_index("slug", unique=True)
    await db.blog.create_index("slug", unique=True)
    await db.rate_limits.create_index("expires_at", expireAfterSeconds=0)
    await db.auth_sessions.create_index("id", unique=True)
    await db.auth_sessions.create_index("expires_at", expireAfterSeconds=0)
    await seed_admin()
    if should_seed_demo_content():
        await seed_content()
        logger.warning("[startup] demo content seed explicitly enabled outside production.")
    else:
        logger.info("[startup] demo content seeding skipped; existing records are preserved.")
    logger.info("ID9 backend ready.")


@app.on_event("shutdown")
async def on_shutdown():
    client.close()