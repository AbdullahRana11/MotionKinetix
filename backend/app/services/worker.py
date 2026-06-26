"""
Background Worker — Apex Kinematics Engine

Orchestrates the complete video processing pipeline:
    1. Updates video status to 'processing'
    2. Runs the OpenCV dual-video pipeline (video_processor.py)
    3. Runs DTW comparison against golden standard (if available)
    4. Stores analysis results in the database
    5. Falls back to legacy YOLO pipeline for telemetry insertion
    6. Updates video status to 'completed' or 'failed'

Implements DATA_FLOW.md §2 (The Analytics Pipeline).
"""

import json
import logging
import asyncio
from pathlib import Path

from app.core.database import SessionLocal
from app.core.config import settings
from app.services.pose_engine import PoseExtractionService
from app.services.video_processor import process_video_to_dual
from app.services.dtw_engine import calculate_kinematic_deviation
from app.services.math_utils import clamp_dtw_score
from app.crud.telemetry import bulk_insert_telemetry
from app.crud.video import update_video_status

logger = logging.getLogger(__name__)


async def _consume_frames(service: PoseExtractionService, video_path: str):
    """
    Helper coroutine to consume the async generator and return all frames.
    """
    frames = []
    async for frame in service.extract_frames(video_path):
        frames.append(frame)
    return frames


def _find_golden_standard_velocities(db) -> list[float]:
    """Locate a golden standard video and return its angular velocity series.

    Searches for any video marked as is_golden_standard=True in the database.
    Returns an empty list if none exists (DTW comparison will be skipped).
    """
    from app.models.video import Video
    from app.crud.telemetry import get_angular_velocity_series

    golden = db.query(Video).filter(Video.is_golden_standard == True).first()
    if golden is None:
        return []
    return get_angular_velocity_series(db, golden.id)


def process_video_background(video_id: str, video_path: str):
    """
    Background worker function that processes a video end-to-end.
    
    Pipeline (implements DATA_FLOW.md §2 Happy Path):
        1. Updates video status to 'processing'
        2. Runs the OpenCV dual-video pipeline (MediaPipe + cv2.VideoWriter)
        3. Calculates DTW similarity against golden standard
        4. Saves analysis_results to DB (graph_data, processed_video_path, dtw_score)
        5. Also runs legacy YOLO pipeline for backward-compatible telemetry rows
        6. Updates video status to 'completed' or 'failed'
    """
    db = SessionLocal()
    
    try:
        logger.info(f"Starting background processing for video: {video_id}")
        update_video_status(db, video_id, "processing")

        # ── Phase 2: OpenCV Dual-Video Pipeline ──────────────────────────────────
        logger.info(f"Running OpenCV dual-video pipeline for {video_id}...")
        pipeline_result = process_video_to_dual(video_id, video_path)

        if pipeline_result["status"] == "FAILED_NO_SUBJECT":
            # DATA_FLOW.md Error State: No Person Detected
            update_video_status(db, video_id, "FAILED_NO_SUBJECT")
            logger.warning(f"No subject detected in video {video_id}. Marking as failed.")
            return

        # ── Phase 1: DTW Comparison ──────────────────────────────────────────────
        dtw_score = 0.0
        angular_velocities = pipeline_result.get("angular_velocities", [])

        # Try to compare against a golden standard
        pro_velocities = _find_golden_standard_velocities(db)
        if pro_velocities and angular_velocities:
            logger.info(f"Running DTW comparison for {video_id}...")
            dtw_result = calculate_kinematic_deviation(pro_velocities, angular_velocities)
            dtw_score = dtw_result["similarity_score"]
        else:
            # No golden standard available — use a bounded heuristic
            if angular_velocities:
                avg_vel = sum(abs(v) for v in angular_velocities) / len(angular_velocities)
                dtw_score = clamp_dtw_score(100.0 - avg_vel * 0.1)
            logger.info(f"No golden standard found. Using heuristic DTW score: {dtw_score}")

        # ── Save analysis results to database ────────────────────────────────────
        from app.models.telemetry import Telemetry as TelemetryModel
        from app.crud.analysis import save_analysis_result

        save_analysis_result(
            db=db,
            video_id=video_id,
            dtw_score=dtw_score,
            processed_video_path=pipeline_result["processed_video_path"],
            graph_data=pipeline_result["graph_data"],
        )

        # ── Legacy: YOLO-based telemetry for backward compatibility ──────────────
        logger.info(f"Running legacy YOLO extraction for {video_id}...")
        try:
            service = PoseExtractionService()
            collected_frames = asyncio.run(_consume_frames(service, video_path))
            logger.info(
                f"Legacy extraction complete for {video_id}. "
                f"Bulk inserting {len(collected_frames)} frames."
            )
            bulk_insert_telemetry(db, video_id, collected_frames)
        except Exception as legacy_err:
            logger.warning(
                f"Legacy YOLO extraction failed for {video_id} (non-fatal): {legacy_err}"
            )

        update_video_status(db, video_id, "completed")
        logger.info(f"Background processing successfully completed for video: {video_id}")

    except Exception as e:
        logger.error(f"Critical error during background processing for video {video_id}: {e}", exc_info=True)
        try:
            update_video_status(db, video_id, "failed")
        except Exception as rollback_err:
            logger.error(f"Failed to update status to 'failed' for video {video_id}: {rollback_err}")
            
    finally:
        db.close()
