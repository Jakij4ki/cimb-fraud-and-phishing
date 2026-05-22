from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.admin import DashboardStats
from app.models.admin import AdminUser
from app.api.deps import get_db, get_current_admin

router = APIRouter()

@router.get("/stats", response_model=DashboardStats)
async def get_stats(
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    return DashboardStats(
        total_reports=100,
        by_status={"submitted": 50, "resolved": 50},
        by_risk_level={"safe": 20, "warning": 30, "danger": 50},
        trend_weekly=[],
        top_modus=[],
        top_channel=[],
        today_danger_count=5
    )
