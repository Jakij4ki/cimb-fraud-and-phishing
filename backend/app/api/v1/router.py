from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db
from app.schemas.report import TicketStatusResponse

from app.api.v1.routes import analyze, report, admin, dashboard, education

api_router = APIRouter()

api_router.include_router(analyze.router, tags=["Analyze"])
api_router.include_router(report.router, prefix="/report", tags=["Report"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(education.router, prefix="/education", tags=["Education"])

@api_router.get('/ticket/{ticket_id}', response_model=TicketStatusResponse, tags=["Public Ticket"])
async def get_ticket_status_public(ticket_id: str, db: AsyncSession = Depends(get_db)):
    # Reuse logic from the old route
    return await report.get_ticket(ticket_id=ticket_id, db=db)
