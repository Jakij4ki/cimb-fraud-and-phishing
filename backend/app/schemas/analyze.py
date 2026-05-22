from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class AnalyzeRequest(BaseModel):
    message_text: str = Field(..., max_length=5000)
    message_type: str

class ComponentResult(BaseModel):
    value: str
    is_whitelisted: bool
    label: Optional[str] = None

class TyposquattingAlertSchema(BaseModel):
    suspicious_domain: str
    similar_to: str
    distance: int
    suggestion: str
    explanation_id: str

class BreakdownItem(BaseModel):
    component: str
    points: int
    reason_id: str

class AnalyzeResponse(BaseModel):
    risk_score: int
    risk_level: str
    explanation: str
    breakdown: List[BreakdownItem]
    typosquatting_alerts: List[TyposquattingAlertSchema]
    components: Dict[str, List[ComponentResult]]
    processing_time_ms: float
