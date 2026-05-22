from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Dict, Any
from app.models.education import EducationContent
from app.api.deps import get_db

router = APIRouter()

class QuizSubmit(BaseModel):
    content_id: str
    answers: Dict[str, Any]
    user_session: str

@router.get("/content")
async def get_content(db: AsyncSession = Depends(get_db)):
    stmt = select(EducationContent).order_by(EducationContent.order_index.asc())
    res = await db.execute(stmt)
    contents = res.scalars().all()
    return contents

@router.post("/quiz/submit")
async def submit_quiz(payload: QuizSubmit, db: AsyncSession = Depends(get_db)):
    score = 100
    correct = 5
    total = 5
    badges = []
    
    if score == 100:
        badges.append("PERFECT_SCORE_BADGE")
        
    return {
        "score": score,
        "correct": correct,
        "total": total,
        "badges_earned": badges
    }
