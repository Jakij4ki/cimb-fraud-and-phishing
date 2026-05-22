import uuid
from datetime import datetime
from sqlalchemy import String, Integer, DateTime, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, ARRAY, JSONB
from app.core.database import Base

class Report(Base):
    __tablename__ = "reports"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ticket_id: Mapped[str] = mapped_column(String(20), unique=True, nullable=False, index=True)
    message_text: Mapped[str] = mapped_column(Text, nullable=False)
    message_type: Mapped[str | None] = mapped_column(String(20))
    extracted_urls: Mapped[list[str] | None] = mapped_column(ARRAY(Text), default=list)
    extracted_phones: Mapped[list[str] | None] = mapped_column(ARRAY(Text), default=list)
    extracted_emails: Mapped[list[str] | None] = mapped_column(ARRAY(Text), default=list)
    risk_score: Mapped[int] = mapped_column(Integer, default=0)
    risk_level: Mapped[str | None] = mapped_column(String(20), index=True)
    explanation_text: Mapped[str | None] = mapped_column(Text)
    breakdown: Mapped[dict | list | None] = mapped_column(JSONB, default=list)
    typosquatting_alerts: Mapped[dict | list | None] = mapped_column(JSONB, default=list)
    status: Mapped[str] = mapped_column(String(30), default='submitted', index=True)
    reporter_name: Mapped[str | None] = mapped_column(String(100))
    reporter_email: Mapped[str | None] = mapped_column(String(200))
    evidence_url: Mapped[str | None] = mapped_column(Text)
    admin_notes: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    actions = relationship("ReportAction", back_populates="report", cascade="all, delete-orphan")

class ReportAction(Base):
    __tablename__ = "report_actions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    report_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("reports.id", ondelete="CASCADE"), index=True)
    admin_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("admin_users.id"), index=True)
    action_type: Mapped[str | None] = mapped_column(String(50))
    notes: Mapped[str | None] = mapped_column(Text)
    ip_address: Mapped[str | None] = mapped_column(String(45))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    report = relationship("Report", back_populates="actions")

class ThreatAnalytic(Base):
    __tablename__ = "threat_analytics"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    report_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("reports.id"))
    modus_type: Mapped[str | None] = mapped_column(String(50), index=True)
    channel: Mapped[str | None] = mapped_column(String(20), index=True)
    week_number: Mapped[int | None] = mapped_column(Integer, index=True)
    year: Mapped[int | None] = mapped_column(Integer, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
