"""
AnalysisResult ORM Model — Apex Kinematics Engine

Implements BACKEND_STRUCTURE.md §1 — analysis_results table.

| Column               | Type         | Constraints                                  |
|----------------------|--------------|----------------------------------------------|
| id                   | VARCHAR(36)  | PRIMARY KEY                                  |
| video_id             | VARCHAR(36)  | FK → videos(id) ON DELETE CASCADE            |
| dtw_score            | FLOAT        | CHECK(dtw_score >= 0 AND dtw_score <= 100)   |
| processed_video_path | VARCHAR(255) | NOT NULL                                     |
| graph_json           | TEXT         | NOT NULL (serialized graph_data array)       |
| created_at           | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP                    |
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, String, Float, Text, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship

from app.core.database import Base


class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    __table_args__ = (
        CheckConstraint("dtw_score >= 0 AND dtw_score <= 100", name="ck_analysis_dtw_score_bounds"),
    )

    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        index=True,
    )
    video_id = Column(
        String(36),
        ForeignKey("videos.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    dtw_score = Column(Float, nullable=False)
    processed_video_path = Column(String(255), nullable=False)
    graph_json = Column(Text, nullable=False)
    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
    )

    video = relationship("Video", backref="analysis_results")
