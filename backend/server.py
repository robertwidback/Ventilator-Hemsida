from fastapi import FastAPI, APIRouter
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
from datetime import datetime, timezone
import resend

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


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
