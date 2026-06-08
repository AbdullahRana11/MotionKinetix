from sqlalchemy import Column, Integer, String, Float, JSON, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class Telemetry(Base):
    __tablename__ = "telemetry"

    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(String, ForeignKey("videos.id"), nullable=False, index=True)
    frame_index = Column(Integer, nullable=False)
    timestamp_ms = Column(Float, nullable=False)
    angular_velocity = Column(Float, nullable=False)
    raw_keypoints = Column(JSON, nullable=False)

    video = relationship("Video", back_populates="telemetry_data")
