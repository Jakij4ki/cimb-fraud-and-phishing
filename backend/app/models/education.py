import uuid
from datetime import datetime
from sqlalchemy import String, Integer, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.core.database import Base

class EducationContent(Base):
    __tablename__ = "education_content"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    content_type: Mapped[str | None] = mapped_column(String(20))
    content_body: Mapped[dict | list] = mapped_column(JSONB, nullable=False)
    difficulty: Mapped[str | None] = mapped_column(String(20))
    order_index: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class QuizResult(Base):
    __tablename__ = "quiz_results"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_session: Mapped[str | None] = mapped_column(String(100))
    content_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("education_content.id"))
    score: Mapped[int | None] = mapped_column(Integer)
    answers: Mapped[dict | list | None] = mapped_column(JSONB)
    completed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class UserBadge(Base):
    __tablename__ = "user_badges"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_session: Mapped[str | None] = mapped_column(String(100))
    badge_type: Mapped[str | None] = mapped_column(String(50))
    earned_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint('user_session', 'badge_type', name='uq_user_session_badge_type'),
    )
