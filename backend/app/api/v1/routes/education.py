from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Dict, Any
from app.models.education import EducationContent, QuizResult
from app.api.deps import get_db
import uuid

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
    # Hardcoded correct answers based on frontend quizQuestions.js
    # Q1: idx 1, Q2: idx 2, Q3: idx 2, Q4: idx 2, Q5: idx 2
    correct_answers = {
        "1": 1,
        "2": 2,
        "3": 2,
        "4": 2,
        "5": 2
    }
    
    correct_count = 0
    total_questions = len(correct_answers)
    
    for q_id, ans in payload.answers.items():
        expected = correct_answers.get(str(q_id))
        if expected is not None and int(ans) == expected:
            correct_count += 1
            
    score = int((correct_count / total_questions) * 100)
    
    badges = []
    if score == 100:
        badges.append("expert")
        
    content_uuid = None
    try:
        content_uuid = uuid.UUID(payload.content_id)
    except:
        pass
        
    quiz_result = QuizResult(
        user_session=payload.user_session,
        content_id=content_uuid,
        score=score,
        answers=payload.answers
    )
    db.add(quiz_result)
    await db.commit()
    
    return {
        "score": score,
        "correct_count": correct_count,
        "total_questions": total_questions,
        "earned_badges": badges
    }
