from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

class ReportListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    ticket_id: str
    status: str
    risk_level: str
    message_type: Optional[str]
    created_at: datetime

class ReportListResponse(BaseModel):
    total: int
    page: int
    limit: int
    data: List[ReportListItem]

class ReportDetailResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    ticket_id: str
    message_text: str
    message_type: Optional[str]
    extracted_urls: List[str]
    extracted_phones: List[str]
    extracted_emails: List[str]
    risk_score: int
    risk_level: str
    explanation_text: Optional[str]
    breakdown: List[Dict[str, Any]]
    typosquatting_alerts: List[Dict[str, Any]]
    status: str
    reporter_name: Optional[str]
    reporter_email: Optional[str]
    evidence_url: Optional[str]
    admin_notes: Optional[str]
    created_at: datetime
    updated_at: datetime

class UpdateReportRequest(BaseModel):
    status: str
    admin_notes: Optional[str] = None

class WhitelistCreate(BaseModel):
    domain: Optional[str] = None
    phone_number: Optional[str] = None
    label: Optional[str] = None
    category: Optional[str] = None

class DashboardStats(BaseModel):
    total_reports: int
    by_status: Dict[str, int]
    by_risk_level: Dict[str, int]
    trend_weekly: List[Dict[str, Any]]
    top_modus: List[Dict[str, Any]]
    top_channel: List[Dict[str, Any]]
    today_danger_count: int
    pending_triage: int = 0
    resolved_this_week: int = 0
