import uuid
from datetime import datetime
from sqlalchemy import String, Integer, Boolean, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base

class WhitelistURL(Base):
    __tablename__ = "whitelist_urls"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    domain: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    label: Mapped[str | None] = mapped_column(String(100))
    category: Mapped[str | None] = mapped_column(String(50))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class WhitelistPhone(Base):
    __tablename__ = "whitelist_phones"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    phone_number: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    label: Mapped[str | None] = mapped_column(String(100))
    phone_type: Mapped[str | None] = mapped_column(String(50))
    institution: Mapped[str | None] = mapped_column(String(100))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class RiskKeyword(Base):
    __tablename__ = "risk_keywords"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    keyword: Mapped[str] = mapped_column(String(200), unique=True, nullable=False)
    category: Mapped[str | None] = mapped_column(String(50), index=True)
    risk_weight: Mapped[int] = mapped_column(Integer, default=3)
    description: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
