from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime

class ReportCreate(BaseModel):
    message_text: str
    message_type: str
    risk_score: int
    risk_level: str
    explanation: str
    breakdown: List[Dict[str, Any]]
    reporter_name: Optional[str] = None
    reporter_email: Optional[str] = None
    additional_notes: Optional[str] = None

class ReportResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    ticket_id: str
    status: str
    created_at: datetime

class TicketStatusResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    ticket_id: str
    status: str
    risk_level: str
    created_at: datetime
    updated_at: datetime
    public_message: str
