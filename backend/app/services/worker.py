import logging
import asyncio

from app.core.database import SessionLocal
from app.services.pose_engine import PoseExtractionService
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


def process_video_background(video_id: str, video_path: str):
    """
    Background worker function that processes a video end-to-end.
    
    1. Updates video status to 'processing'
    2. Runs the PoseExtractionService (YOLOv8 + kinematics)
    3. Bulk inserts all generated telemetry into the database
    4. Updates video status to 'completed' or 'failed'
    """
    # Open a fresh database session for this background task
    db = SessionLocal()
    
    try:
        logger.info(f"Starting background processing for video: {video_id}")
        update_video_status(db, video_id, "processing")

        service = PoseExtractionService()
        
        # Because the extraction service yields via an async generator, 
        # we run it within the asyncio event loop and collect all frames.
        collected_frames = asyncio.run(_consume_frames(service, video_path))
        
        logger.info(f"Extraction complete for video {video_id}. Bulk inserting {len(collected_frames)} frames.")
        bulk_insert_telemetry(db, video_id, collected_frames)
        
        update_video_status(db, video_id, "completed")
        logger.info(f"Background processing successfully completed for video: {video_id}")

    except Exception as e:
        logger.error(f"Critical error during background processing for video {video_id}: {e}", exc_info=True)
        # Flip the status to failed so the client knows it crashed
        try:
            update_video_status(db, video_id, "failed")
        except Exception as rollback_err:
            logger.error(f"Failed to update status to 'failed' for video {video_id}: {rollback_err}")
            
    finally:
        # Ensure the database connection is returned to the pool
        db.close()
