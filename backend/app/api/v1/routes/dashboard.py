from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from app.schemas.admin import DashboardStats
from app.models.admin import AdminUser
from app.api.deps import get_db, get_current_admin
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/stats", response_model=DashboardStats)
async def get_stats(
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    from app.models.report import Report
    
    # Total reports
    total_res = await db.execute(select(func.count()).select_from(Report))
    total_reports = total_res.scalar() or 0
    
    # By Status
    status_res = await db.execute(select(Report.status, func.count()).group_by(Report.status))
    by_status = {s: c for s, c in status_res.all()}
    
    # By Risk Level
    risk_res = await db.execute(select(Report.risk_level, func.count()).group_by(Report.risk_level))
    by_risk_level = {r: c for r, c in risk_res.all()}
    
    # Pending Triage
    pending_triage = by_status.get("submitted", 0) + by_status.get("in_review", 0)
    
    # Danger Today
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    danger_today_res = await db.execute(
        select(func.count()).select_from(Report)
        .where(Report.risk_level == 'danger', Report.created_at >= today)
    )
    today_danger_count = danger_today_res.scalar() or 0
    
    # Resolved This Week
    one_week_ago = datetime.utcnow() - timedelta(days=7)
    resolved_week_res = await db.execute(
        select(func.count()).select_from(Report)
        .where(
            or_(Report.status == 'closed', Report.status == 'mitigated'),
            Report.created_at >= one_week_ago
        )
    )
    resolved_this_week = resolved_week_res.scalar() or 0
    
    # Top Channel
    channel_res = await db.execute(
        select(Report.message_type, func.count())
        .group_by(Report.message_type)
        .order_by(func.count().desc())
        .limit(5)
    )
    top_channel = [{"name": ch or "Unknown", "count": c} for ch, c in channel_res.all()]
    
    # Trend Weekly (last 28 days -> 4 weeks)
    four_weeks_ago = datetime.utcnow() - timedelta(days=28)
    recent_res = await db.execute(
        select(Report.created_at, Report.risk_level)
        .where(Report.created_at >= four_weeks_ago)
    )
    recent_reports = recent_res.all()
    
    trend_weekly = [
        {"name": "Minggu 1", "phishing": 0, "malware": 0, "spam": 0},
        {"name": "Minggu 2", "phishing": 0, "malware": 0, "spam": 0},
        {"name": "Minggu 3", "phishing": 0, "malware": 0, "spam": 0},
        {"name": "Minggu 4", "phishing": 0, "malware": 0, "spam": 0},
    ]
    
    now = datetime.utcnow()
    for dt, risk in recent_reports:
        days_diff = (now - dt).days
        week_idx = 3 - (days_diff // 7) # 0-6 days ago = idx 3 (Minggu 4), etc.
        if 0 <= week_idx <= 3:
            if risk == "danger":
                trend_weekly[week_idx]["phishing"] += 1
            elif risk == "warning":
                trend_weekly[week_idx]["spam"] += 1
            else:
                trend_weekly[week_idx]["malware"] += 1

    top_modus = []
    
    return DashboardStats(
        total_reports=total_reports,
        by_status=by_status,
        by_risk_level=by_risk_level,
        trend_weekly=trend_weekly,
        top_modus=top_modus,
        top_channel=top_channel,
        today_danger_count=today_danger_count,
        pending_triage=pending_triage,
        resolved_this_week=resolved_this_week
    )
