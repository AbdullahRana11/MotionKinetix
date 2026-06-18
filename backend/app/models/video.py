import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class Video(Base):
    __tablename__ = "videos"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    filename = Column(String, nullable=False)
    status = Column(String, default="pending")
    is_golden_standard = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    owner_id = Column(String, ForeignKey("users.id"))

    telemetry_data = relationship("Telemetry", back_populates="video", cascade="all, delete-orphan")
    owner = relationship("User", back_populates="videos")
