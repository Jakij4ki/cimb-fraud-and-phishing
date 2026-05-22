from fastapi import APIRouter
from app.api.v1.routes import analyze, report, admin, dashboard, education

api_router = APIRouter()

api_router.include_router(analyze.router, tags=["Analyze"])
api_router.include_router(report.router, prefix="/report", tags=["Report"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(education.router, prefix="/education", tags=["Education"])
