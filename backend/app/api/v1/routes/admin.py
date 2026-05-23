from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.schemas.admin import LoginRequest, TokenResponse, ReportListResponse, ReportDetailResponse, UpdateReportRequest, WhitelistCreate
from app.models.admin import AdminUser
from app.models.report import Report
from app.models.whitelist import WhitelistURL, WhitelistPhone
from app.core.security import verify_password, create_access_token
from app.core.audit import log_action
from app.api.deps import get_db, get_current_admin, get_client_ip, limiter
from datetime import datetime
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/auth/login", response_model=TokenResponse)
@limiter.limit("5/minute")
async def login(
    request: Request,
    payload: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    ip_address = get_client_ip(request)
    stmt = select(AdminUser).where(AdminUser.username == payload.username)
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()
    
    error_msg = "Username atau password tidak valid"
    
    if not user:
        logger.warning(f"Failed login attempt for user: {payload.username} from IP: {ip_address}")
        raise HTTPException(status_code=401, detail=error_msg)
        
    if not verify_password(payload.password, user.hashed_password):
        logger.warning(f"Failed login attempt for user: {payload.username} from IP: {ip_address}")
        raise HTTPException(status_code=401, detail=error_msg)
        
    user.last_login = datetime.utcnow()
    await db.commit()
    
    logger.info(f"Successful login for user: {payload.username} from IP: {ip_address}")
    
    access_token = create_access_token(data={"sub": user.username})
    return TokenResponse(access_token=access_token, token_type="bearer")

@router.get("/reports", response_model=ReportListResponse)
async def list_reports(
    status: str = None,
    risk_level: str = None,
    date_from: str = None,
    date_to: str = None,
    page: int = 1,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    offset = (page - 1) * limit
    stmt = select(Report).order_by(Report.created_at.desc())
    count_stmt = select(func.count()).select_from(Report)
    
    if status:
        stmt = stmt.where(Report.status == status)
        count_stmt = count_stmt.where(Report.status == status)
    if risk_level:
        stmt = stmt.where(Report.risk_level == risk_level)
        count_stmt = count_stmt.where(Report.risk_level == risk_level)
        
    total_res = await db.execute(count_stmt)
    total = total_res.scalar()
    
    stmt = stmt.offset(offset).limit(limit)
    res = await db.execute(stmt)
    reports = res.scalars().all()
    
    return ReportListResponse(
        total=total,
        page=page,
        limit=limit,
        data=reports
    )

@router.get("/reports/{id}", response_model=ReportDetailResponse)
async def get_report_detail(
    id: str,
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    stmt = select(Report).where(Report.id == id)
    res = await db.execute(stmt)
    report = res.scalar_one_or_none()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

@router.patch("/reports/{id}")
async def update_report(
    id: str,
    request: Request,
    payload: UpdateReportRequest,
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    stmt = select(Report).where(Report.id == id)
    res = await db.execute(stmt)
    report = res.scalar_one_or_none()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
        
    report.status = payload.status
    if payload.admin_notes:
        report.admin_notes = payload.admin_notes
        
    await log_action(
        db=db,
        action_type="UPDATE_REPORT_STATUS",
        admin_id=admin.id,
        report_id=report.id,
        notes=f"Changed status to {payload.status}. Notes: {payload.admin_notes}",
        ip_address=get_client_ip(request)
    )
    
    await db.commit()
    return {"message": "Report updated successfully"}
    
@router.get("/whitelist")
async def get_whitelist(db: AsyncSession = Depends(get_db), admin: AdminUser = Depends(get_current_admin)):
    urls_res = await db.execute(select(WhitelistURL))
    phones_res = await db.execute(select(WhitelistPhone))
    
    return {
        "urls": urls_res.scalars().all(),
        "phones": phones_res.scalars().all()
    }

@router.post("/whitelist")
async def add_whitelist(request: Request, db: AsyncSession = Depends(get_db), admin: AdminUser = Depends(get_current_admin)):
    data = await request.json()
    item_type = data.get("type", "").lower()
    value = data.get("value")
    label = data.get("label")
    category = data.get("category")
    is_active = data.get("is_active", True)
    
    if item_type == "url":
        new_item = WhitelistURL(
            domain=value,
            label=label,
            category=category,
            is_active=is_active
        )
    elif item_type == "phone":
        new_item = WhitelistPhone(
            phone_number=value,
            label=label,
            institution=category,
            is_active=is_active
        )
    else:
        raise HTTPException(status_code=400, detail="Invalid type")
        
    db.add(new_item)
    await db.commit()
    return {"message": "Whitelist added successfully"}

@router.delete("/whitelist/{id}")
async def delete_whitelist(id: str, type: str, db: AsyncSession = Depends(get_db), admin: AdminUser = Depends(get_current_admin)):
    if type.lower() == "url":
        stmt = select(WhitelistURL).where(WhitelistURL.id == id)
    elif type.lower() == "phone":
        stmt = select(WhitelistPhone).where(WhitelistPhone.id == id)
    else:
        raise HTTPException(status_code=400, detail="Invalid type")
        
    res = await db.execute(stmt)
    item = res.scalar_one_or_none()
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
        
    await db.delete(item)
    await db.commit()
    return {"message": "Whitelist deleted successfully"}
