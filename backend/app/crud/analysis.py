"""
Analysis CRUD Operations — Apex Kinematics Engine

Handles persistence and retrieval of analysis results (DTW score,
processed video path, graph_data JSON) as defined in BACKEND_STRUCTURE.md.
"""

import json
import logging
from typing import Optional, List, Dict, Any

from sqlalchemy.orm import Session

from app.models.analysis import AnalysisResult
from app.services.math_utils import clamp_dtw_score

logger = logging.getLogger(__name__)


def save_analysis_result(
    db: Session,
    video_id: str,
    dtw_score: float,
    processed_video_path: str,
    graph_data: List[Dict[str, Any]],
) -> AnalysisResult:
    """Persist an analysis result to the database.

    Applies final clamping on dtw_score before write to guarantee
    the CHECK constraint is never violated.

    Args:
        db: Active SQLAlchemy session.
        video_id: UUID of the processed video.
        dtw_score: Similarity score (will be clamped to [0, 100]).
        processed_video_path: URL path to the generated dual-video.
        graph_data: Frame-by-frame angle data for frontend charting.

    Returns:
        The newly created AnalysisResult ORM instance.
    """
    clamped_score = clamp_dtw_score(dtw_score)

    result = AnalysisResult(
        video_id=video_id,
        dtw_score=clamped_score,
        processed_video_path=processed_video_path,
        graph_json=json.dumps(graph_data),
    )

    db.add(result)
    db.commit()
    db.refresh(result)

    logger.info(
        f"Saved analysis for video {video_id}: "
        f"DTW={clamped_score}, path={processed_video_path}"
    )
    return result


def get_analysis_by_video_id(db: Session, video_id: str) -> Optional[AnalysisResult]:
    """Retrieve the latest analysis result for a given video.

    Returns None if no analysis has been run yet.
    """
    return (
        db.query(AnalysisResult)
        .filter(AnalysisResult.video_id == video_id)
        .order_by(AnalysisResult.created_at.desc())
        .first()
    )
