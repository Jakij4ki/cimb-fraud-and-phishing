import logging
import random
from datetime import datetime
from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.schemas.report import ReportCreate, ReportResponse, TicketStatusResponse
from app.models.report import Report, ThreatAnalytic
from app.api.deps import get_db, limiter

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/", response_model=ReportResponse)
@limiter.limit("5/minute")
async def create_report(
    request: Request,
    payload: ReportCreate,
    db: AsyncSession = Depends(get_db)
):
    # Generate ticket_id: PG-{YEAR}-{random 5 digit}
    year = datetime.now().year
    rand_id = f"{random.randint(10000, 99999)}"
    ticket_id = f"PG-{year}-{rand_id}"
    
    new_report = Report(
        ticket_id=ticket_id,
        message_text=payload.message_text,
        message_type=payload.message_type,
        risk_score=payload.risk_score,
        risk_level=payload.risk_level,
        explanation_text=payload.explanation,
        breakdown=payload.breakdown,
        reporter_name=payload.reporter_name,
        reporter_email=payload.reporter_email,
        admin_notes=payload.additional_notes,
        status="submitted"
    )
    
    db.add(new_report)
    await db.flush() 
    
    modus = "phishing" if payload.risk_level == "danger" else "unknown"
    threat = ThreatAnalytic(
        report_id=new_report.id,
        modus_type=modus,
        channel=payload.message_type,
        week_number=datetime.now().isocalendar()[1],
        year=year
    )
    db.add(threat)
    await db.commit()
    
    return ReportResponse(
        ticket_id=ticket_id,
        status="submitted",
        created_at=new_report.created_at
    )

@router.get("/ticket/{ticket_id}", response_model=TicketStatusResponse)
async def get_ticket(ticket_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Report).where(Report.ticket_id == ticket_id)
    res = await db.execute(stmt)
    report = res.scalar_one_or_none()
    
    if not report:
        raise HTTPException(status_code=404, detail="Ticket not found")
        
    messages = {
        "submitted": "Laporan sedang dalam antrean untuk diproses.",
        "in_progress": "Laporan sedang diinvestigasi oleh tim analis.",
        "resolved": "Laporan telah selesai diinvestigasi dan ditindaklanjuti.",
        "rejected": "Laporan tidak valid atau tidak ditemukan indikasi penipuan."
    }
    
    return TicketStatusResponse(
        ticket_id=report.ticket_id,
        status=report.status,
        risk_level=report.risk_level or "unknown",
        created_at=report.created_at,
        updated_at=report.updated_at,
        public_message=messages.get(report.status, "Status laporan sedang diperbarui.")
    )
