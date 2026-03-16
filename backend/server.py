from fastapi import FastAPI, APIRouter, HTTPException, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import hashlib
import asyncio
import resend


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Admin password
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'falcon2024admin')

# Resend email configuration
RESEND_API_KEY = os.environ.get('RESEND_API_KEY')
NOTIFICATION_EMAIL = os.environ.get('NOTIFICATION_EMAIL', 'abbesalem977@gmail.com')
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Lead capture models
class LeadCreate(BaseModel):
    name: str
    email: EmailStr
    business_name: Optional[str] = None
    website_url: Optional[str] = None
    message: Optional[str] = None
    project_type: Optional[str] = None
    preferred_contact: Optional[str] = None
    phone: Optional[str] = None

class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    business_name: Optional[str] = None
    website_url: Optional[str] = None
    message: Optional[str] = None
    project_type: Optional[str] = None
    preferred_contact: Optional[str] = None
    phone: Optional[str] = None
    status: str = "new"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AdminLogin(BaseModel):
    password: str

class AdminLoginResponse(BaseModel):
    success: bool
    token: str = None

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# Email notification function
async def send_lead_notification(lead: Lead):
    """Send email notification when a new lead is created"""
    if not RESEND_API_KEY:
        logger.warning("RESEND_API_KEY not configured, skipping email notification")
        return
    
    project_type_text = "New Website" if lead.project_type == "new_website" else "Redesign / Fix" if lead.project_type == "fix_existing" else lead.project_type or "Not specified"
    contact_method = lead.preferred_contact or "Not specified"
    
    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #0f172a; padding: 20px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🦅 New Lead Received!</h1>
        </div>
        <div style="background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #0f172a; margin-top: 0;">Contact Information</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; width: 140px;">Name:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: bold;">{lead.name}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Email:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #0f172a;">{lead.email}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Phone:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #0f172a;">{lead.phone or 'Not provided'}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Business:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #0f172a;">{lead.business_name or 'Not provided'}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Website:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #0f172a;">{lead.website_url or 'Not provided'}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Project Type:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #3b82f6; font-weight: bold;">{project_type_text}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Prefers:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #0f172a;">{contact_method.capitalize()}</td>
                </tr>
            </table>
            
            {f'<div style="margin-top: 20px; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #3b82f6;"><strong>Message:</strong><br/><p style="margin: 10px 0 0 0; color: #475569;">{lead.message}</p></div>' if lead.message else ''}
            
            <div style="margin-top: 20px; padding: 15px; background: #0f172a; border-radius: 8px; text-align: center;">
                <a href="https://falcon-studio.preview.emergentagent.com/admin" style="color: white; text-decoration: none; font-weight: bold;">View in Admin Dashboard →</a>
            </div>
        </div>
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 20px;">
            Falcon Web Studio - Lead Notification
        </p>
    </div>
    """
    
    params = {
        "from": "Falcon Web Studio <onboarding@resend.dev>",
        "to": [NOTIFICATION_EMAIL],
        "subject": f"🦅 New Lead: {lead.name} - {project_type_text}",
        "html": html_content
    }
    
    try:
        email = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Notification email sent for lead: {lead.email}, email_id: {email.get('id')}")
    except Exception as e:
        logger.error(f"Failed to send notification email: {str(e)}")

# Lead capture endpoints
@api_router.post("/leads", response_model=Lead)
async def create_lead(input: LeadCreate):
    """Create a new lead from the website preview request form"""
    lead_dict = input.model_dump()
    lead_obj = Lead(**lead_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = lead_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.leads.insert_one(doc)
    logger.info(f"New lead created: {lead_obj.email}")
    
    # Send email notification (non-blocking)
    asyncio.create_task(send_lead_notification(lead_obj))
    
    return lead_obj

@api_router.get("/leads", response_model=List[Lead])
async def get_leads(x_admin_token: str = Header(None)):
    """Get all leads (password protected)"""
    # Verify admin token
    expected_token = hashlib.sha256(ADMIN_PASSWORD.encode()).hexdigest()
    if x_admin_token != expected_token:
        raise HTTPException(status_code=401, detail="Unauthorized - Invalid admin token")
    
    leads = await db.leads.find({}, {"_id": 0}).to_list(1000)
    
    for lead in leads:
        if isinstance(lead.get('created_at'), str):
            lead['created_at'] = datetime.fromisoformat(lead['created_at'])
    
    return leads

@api_router.post("/admin/login", response_model=AdminLoginResponse)
async def admin_login(login: AdminLogin):
    """Admin login to get access token"""
    if login.password == ADMIN_PASSWORD:
        token = hashlib.sha256(ADMIN_PASSWORD.encode()).hexdigest()
        return {"success": True, "token": token}
    raise HTTPException(status_code=401, detail="Invalid password")

@api_router.delete("/leads/{lead_id}")
async def delete_lead(lead_id: str, x_admin_token: str = Header(None)):
    """Delete a lead (password protected)"""
    expected_token = hashlib.sha256(ADMIN_PASSWORD.encode()).hexdigest()
    if x_admin_token != expected_token:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    result = await db.leads.delete_one({"id": lead_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"message": "Lead deleted"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()