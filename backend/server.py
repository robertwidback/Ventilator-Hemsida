from fastapi import FastAPI, APIRouter, Request, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
import uuid
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime, timezone, timedelta
import resend
import bcrypt
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
CONTACT_RECIPIENT_EMAIL = os.environ.get('CONTACT_RECIPIENT_EMAIL', 'info@ventilator.se')
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

JWT_SECRET = os.environ['JWT_SECRET']
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', '')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', '')
JWT_ALGORITHM = "HS256"


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_token(email: str) -> str:
    payload = {"sub": email, "exp": datetime.now(timezone.utc) + timedelta(hours=12)}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def require_admin(request: Request):
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Inte inloggad")
    try:
        jwt.decode(auth[7:], JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Ogiltig eller utgången inloggning")


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class NewsPost(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    preamble: str = Field(default="", max_length=600)
    body: str = Field(min_length=5, max_length=20000)
    image_url: Optional[str] = Field(default=None, max_length=600)
    date: str = Field(default_factory=lambda: datetime.now(timezone.utc).date().isoformat())
    published: bool = True


class JobPost(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    category: str = Field(default="", max_length=100)
    location: str = Field(default="Stockholm", max_length=100)
    employment_type: str = Field(default="Heltid", max_length=100)
    preamble: str = Field(default="", max_length=600)
    body: str = Field(min_length=5, max_length=20000)
    date: str = Field(default_factory=lambda: datetime.now(timezone.utc).date().isoformat())
    published: bool = True


SEED_JOBS = [
    {
        "title": "Servicetekniker",
        "category": "Ventilation",
        "location": "Stockholm",
        "employment_type": "Heltid",
        "preamble": "Vi söker erfarna ventilationstekniker som vill bli en del av vårt serviceteam i Stockholm.",
        "body": "Vill du ta nästa steg i din karriär? Ventilator söker nu erfarna servicetekniker inom ventilation till vår serviceavdelning i Stockholm.\n\nOm rollen\nSom servicetekniker hos oss arbetar du självständigt med service och underhåll av ventilationsanläggningar hos våra kunder. Arbetet omfattar bland annat ronderingar, filterbyten, felsökning, injustering och mindre ombyggnationer.\n\nVi söker dig som\n- Har flera års erfarenhet av ventilationsservice\n- Arbetar självständigt och tar stort eget ansvar\n- Har god servicekänsla och gillar kundkontakt\n- Har B-körkort\n\nVi erbjuder\n- Ett stabilt företag med anor sedan 1931\n- Kollektivavtal och bra anställningsvillkor\n- Servicebil och moderna arbetsverktyg\n- Stora möjligheter till utveckling inom företaget\n\nAnsök redan idag – urval sker löpande!",
        "date": "2026-01-15",
    },
]


SEED_NEWS = [
    {
        "title": "Ny kund, nytt projekt!",
        "date": "2026-03-17",
        "preamble": "Ventilator får äran att utföra ombyggnadsprojektet inom Norrgårdens äldreboende i Sollentuna.",
        "image_url": "https://ventilator.se/wp-content/uploads/sites/2/2026/03/Skarmbild-2026-03-17-153821-3-720x480.jpg",
        "body": "Ventilator får äran att utföra ombyggnadsprojektet inom Norrgårdens äldreboende i Sollentuna.\n\nProjektet handlades upp på LOU och omfattar en funktionsentreprenad enligt ABT06. Beställaren är Sollentuna Kommunfastigheter (SKAB) som ingår i Sollentuna kommunkoncern.\n\nProjektet omfattar ombyggnation och energieffektivisering i två huskroppar där två större FTX-aggregat ska bytas ut mot nya effektiva anläggningar. Vidare innefattar projektet nytt system för luftburen värme samt byte av takfläktar. Ventilator utför detta som en totalentreprenad och har fullt samordningsansvar.\n\nDet här projektet är extra glädjande då det innebär startskottet på ett nytt samarbete mellan Ventilator och SKAB. Det här blir det första projektet parterna genomför tillsammans!",
    },
    {
        "title": "Tallbohov – Ett energibesparingsprojekt via ventilationen!",
        "date": "2025-01-30",
        "preamble": "Ventilator har fått ett nytt energibesparingsuppdrag av Hemsö. Målet är att förbättra ventilationen och samtidigt minska energiförbrukningen på Tallbohovs vård- och omsorgsboende.",
        "image_url": "https://ventilator.se/wp-content/uploads/sites/2/2025/01/Tallbohov-720x418.jpg",
        "body": "Ventilator har fått ett nytt energibesparingsuppdrag av Hemsö. Målet är att förbättra ventilationen och samtidigt minska energiförbrukningen på Tallbohovs vård- och omsorgsboende i Jakobsberg utanför Stockholm. I uppdraget ingår också att uppgradera Tallbohovs brandskydd. Uppdraget är ett ROT-projekt, vilket innebär att äldre ventilationsaggregat byts ut mot mer funktionella och energieffektiva alternativ.\n\nTallbohovs vård- och omsorgsboende består av åtta avdelningar om totalt 92 lägenheter. Varje avdelning har en gemensam matsal och ett vardagsrum.\n\nI projektet tas två äldre ventilationsaggregat bort och ersätts med ett nytt motströmsaggregat som återvinner energi från den varma utluften – energi som i sin tur värmer upp tilluften. Resultatet blir bättre inomhusluft med minskade uppvärmningskostnader.\n\n– Vi tar bort två äldre aggregat och ersätter dem med ett nytt ventilationsaggregat med bra återvinning av energi. Vi tackar Hemsö för förtroendet, säger Oscar Bojnäs, servicechef på Ventilator.\n\nProjektet är planerat att starta under det första kvartalet 2025 och beräknas vara klart inom åtta till tio veckor.",
    },
    {
        "title": "Ny servicechef till Ventilator!",
        "date": "2025-01-30",
        "preamble": "Ventilators nya servicechef Oscar Bojnäs har bred kompetens och stor erfarenhet efter många år i branschen.",
        "image_url": "https://ventilator.se/wp-content/uploads/sites/2/2025/01/IMG_0238-720x480.jpg",
        "body": "Oscar Bojnäs är erfaren inom ventilation med många år i branschen. Oscar började sin karriär 2013 som montör och har sedan dess arbetat sig upp genom hela yrkeskedjan, från montör via injustering och OVK-besiktningsman till projektledare. I sin roll som servicechef har han stor nytta av den breda erfarenheten. Oscar kommer senast från Gunnar Karlsen i Sverige AB, där han bland annat arbetade tillsammans med Ventilators nuvarande VD, Robert Widbäck.\n\nHur ska en bra servicechef vara?\n– Jag tror på att vara lyhörd, engagerad och tillgänglig för både kunder och medarbetare. Som servicechef handlar det om att vara där för att stödja och utveckla, både teamet och verksamheten.\n\nHur ser serviceavdelningen ut idag?\n– Den består av montörer som uteslutande arbetar med serviceuppdrag och inte är involverade i entreprenadprojekt. Det gör att de kan fokusera helt på att leverera högkvalitativ service till våra kunder. Det är grundläggande för att bygga långsiktiga och bra kundrelationer.\n\nVad är ditt mål med serviceavdelningen?\n– Målet är att tillsammans med Robert Widbäck utveckla och förbättra organisationen. Vi vill bygga en serviceenhet som är effektiv, flexibel och snabb men också proaktiv för att möta kundernas behov på bästa sätt.\n\nHur ser serviceverksamheten ut om tre år?\n– Vi växer och ökar stadigt vår omsättning med god lönsamhet i fokus.",
    },
    {
        "title": "Ramavtal med Vallentuna Kommun, Telge AB och Järfälla Hus!",
        "date": "2025-01-30",
        "preamble": "Under hösten och vintern har Ventilator framgångsrikt vunnit tre ramavtal med viktiga kommunala aktörer i Stockholmsregionen.",
        "image_url": "https://ventilator.se/wp-content/uploads/sites/2/2025/01/Skarmavbild-2025-01-23-kl.-07.30.26-720x480.png",
        "body": "Under hösten och vintern har Ventilator framgångsrikt vunnit tre ramavtal med viktiga kommunala aktörer i Stockholmsregionen. Ventilator har tecknat avtal med Vallentuna Kommun, Telge AB och Järfälla Hus. Sedan tidigare har företaget också samarbeten med Stockholm Stad och Ekerö Kommun.\n\n– Det är ett viktigt steg för Ventilator att etablera långsiktiga och stabila relationer med slutbeställaren. I det här fallet är vi stolta över att få möjligheten att leverera våra tjänster till en rad offentliga byggnader, bostäder och andra kommunala projekt. Vi ser fram emot att ta fram lösningar som bidrar till att göra byggnader hållbara och energieffektiva, säger Robert Widbäck, VD på Ventilator.",
    },
]

app = FastAPI()
api_router = APIRouter(prefix="/api")

logger = logging.getLogger(__name__)


class ContactRequest(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=40)
    message: str = Field(min_length=5, max_length=5000)


@api_router.get("/")
async def root():
    return {"message": "Ventilator API"}


@api_router.post("/contact")
async def submit_contact(req: ContactRequest):
    doc = {
        "id": str(uuid.uuid4()),
        **req.model_dump(),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    await db.contact_messages.insert_one(doc)

    email_sent = False
    if RESEND_API_KEY:
        html = f"""
        <table style="font-family:Arial,sans-serif;max-width:560px;width:100%;border-collapse:collapse">
          <tr><td style="background:#005087;color:#fff;padding:16px 24px;font-size:18px;font-weight:bold">Nytt meddelande från ventilator.se</td></tr>
          <tr><td style="padding:24px;border:1px solid #e2e8f0">
            <p style="margin:0 0 8px"><strong>Namn:</strong> {req.name}</p>
            <p style="margin:0 0 8px"><strong>E-post:</strong> {req.email}</p>
            <p style="margin:0 0 16px"><strong>Telefon:</strong> {req.phone or '–'}</p>
            <p style="margin:0 0 4px"><strong>Meddelande:</strong></p>
            <p style="margin:0;white-space:pre-line">{req.message}</p>
          </td></tr>
        </table>"""
        params = {
            "from": SENDER_EMAIL,
            "to": [CONTACT_RECIPIENT_EMAIL],
            "subject": f"Kontaktformulär – {req.name}",
            "html": html,
            "reply_to": req.email,
        }
        try:
            await asyncio.to_thread(resend.Emails.send, params)
            email_sent = True
        except Exception as e:
            logger.error(f"Resend failed: {e}")

    return {"status": "success", "email_sent": email_sent}


def serialize_post(doc):
    return {
        "id": doc["id"],
        "title": doc["title"],
        "preamble": doc.get("preamble", ""),
        "body": doc["body"],
        "image_url": doc.get("image_url"),
        "date": doc.get("date", ""),
        "published": doc.get("published", True),
        "created_at": doc.get("created_at", ""),
    }


@api_router.post("/auth/login")
async def login(req: LoginRequest):
    if req.email.lower() != ADMIN_EMAIL.lower() or not req.password:
        raise HTTPException(status_code=401, detail="Fel e-post eller lösenord")
    admin = await db.users.find_one({"email": ADMIN_EMAIL})
    if not admin or not verify_password(req.password, admin["password_hash"]):
        raise HTTPException(status_code=401, detail="Fel e-post eller lösenord")
    return {"token": create_token(ADMIN_EMAIL), "email": ADMIN_EMAIL}


@api_router.get("/news")
async def list_news():
    posts = await db.news.find({"published": True}).sort("date", -1).to_list(200)
    return [serialize_post(p) for p in posts]


@api_router.get("/news/{news_id}")
async def get_news(news_id: str):
    post = await db.news.find_one({"id": news_id, "published": True})
    if not post:
        raise HTTPException(status_code=404, detail="Nyheten hittades inte")
    return serialize_post(post)


def serialize_job(doc):
    return {
        "id": doc["id"],
        "title": doc["title"],
        "category": doc.get("category", ""),
        "location": doc.get("location", ""),
        "employment_type": doc.get("employment_type", ""),
        "preamble": doc.get("preamble", ""),
        "body": doc["body"],
        "date": doc.get("date", ""),
        "published": doc.get("published", True),
        "created_at": doc.get("created_at", ""),
    }


@api_router.get("/jobs")
async def list_jobs():
    jobs = await db.jobs.find({"published": True}).sort("date", -1).to_list(200)
    return [serialize_job(j) for j in jobs]


@api_router.get("/jobs/{job_id}")
async def get_job(job_id: str):
    job = await db.jobs.find_one({"id": job_id, "published": True})
    if not job:
        raise HTTPException(status_code=404, detail="Tjänsten hittades inte")
    return serialize_job(job)


@api_router.get("/admin/jobs")
async def admin_list_jobs(request: Request):
    await require_admin(request)
    jobs = await db.jobs.find().sort("date", -1).to_list(500)
    return [serialize_job(j) for j in jobs]


@api_router.post("/admin/jobs", status_code=201)
async def admin_create_job(job: JobPost, request: Request):
    await require_admin(request)
    doc = {"id": str(uuid.uuid4()), **job.model_dump(), "created_at": datetime.now(timezone.utc).isoformat()}
    await db.jobs.insert_one(doc)
    return serialize_job(doc)


@api_router.put("/admin/jobs/{job_id}")
async def admin_update_job(job_id: str, job: JobPost, request: Request):
    await require_admin(request)
    result = await db.jobs.update_one({"id": job_id}, {"$set": job.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Tjänsten hittades inte")
    updated = await db.jobs.find_one({"id": job_id})
    return serialize_job(updated)


@api_router.delete("/admin/jobs/{job_id}", status_code=204)
async def admin_delete_job(job_id: str, request: Request):
    await require_admin(request)
    result = await db.jobs.delete_one({"id": job_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Tjänsten hittades inte")


@api_router.get("/admin/news")
async def admin_list_news(request: Request):
    await require_admin(request)
    posts = await db.news.find().sort("date", -1).to_list(500)
    return [serialize_post(p) for p in posts]


@api_router.post("/admin/news", status_code=201)
async def admin_create_news(post: NewsPost, request: Request):
    await require_admin(request)
    doc = {"id": str(uuid.uuid4()), **post.model_dump(), "created_at": datetime.now(timezone.utc).isoformat()}
    await db.news.insert_one(doc)
    return serialize_post(doc)


@api_router.put("/admin/news/{news_id}")
async def admin_update_news(news_id: str, post: NewsPost, request: Request):
    await require_admin(request)
    result = await db.news.update_one({"id": news_id}, {"$set": post.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Nyheten hittades inte")
    updated = await db.news.find_one({"id": news_id})
    return serialize_post(updated)


@api_router.delete("/admin/news/{news_id}", status_code=204)
async def admin_delete_news(news_id: str, request: Request):
    await require_admin(request)
    result = await db.news.delete_one({"id": news_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Nyheten hittades inte")


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)


@app.on_event("startup")
async def seed_data():
    if ADMIN_EMAIL and ADMIN_PASSWORD:
        hashed = bcrypt.hashpw(ADMIN_PASSWORD.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        existing = await db.users.find_one({"email": ADMIN_EMAIL})
        if existing is None:
            await db.users.insert_one({"email": ADMIN_EMAIL, "password_hash": hashed, "role": "admin"})
        elif not verify_password(ADMIN_PASSWORD, existing["password_hash"]):
            await db.users.update_one({"email": ADMIN_EMAIL}, {"$set": {"password_hash": hashed}})
    if await db.news.count_documents({}) == 0:
        now = datetime.now(timezone.utc).isoformat()
        await db.news.insert_many([
            {"id": str(uuid.uuid4()), **item, "published": True, "created_at": now}
            for item in SEED_NEWS
        ])
    if await db.jobs.count_documents({}) == 0:
        now = datetime.now(timezone.utc).isoformat()
        await db.jobs.insert_many([
            {"id": str(uuid.uuid4()), **item, "published": True, "created_at": now}
            for item in SEED_JOBS
        ])


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
