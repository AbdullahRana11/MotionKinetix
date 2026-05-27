import asyncio
import logging
from pathlib import Path

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.core.config import settings
from app.services.pose_engine import PoseExtractionService

logger = logging.getLogger(__name__)

ws_router = APIRouter()


@ws_router.websocket("/ws/telemetry/{video_id}")
async def websocket_endpoint(websocket: WebSocket, video_id: str):
    """
    Real-time telemetry streaming endpoint.

    Accepts a WebSocket connection, locates the uploaded video by its UUID,
    runs YOLOv8 pose extraction frame-by-frame, and streams each serialised
    SkeletonFrame (with embedded TelemetryMetrics) back to the client as JSON.
    """
    await websocket.accept()

    # Locate the video file in the uploads directory
    uploads_dir = settings.UPLOADS_DIR
    video_path: Path | None = None

    for ext in (".mp4", ".mov", ".avi"):
        candidate = uploads_dir / f"{video_id}{ext}"
        if candidate.exists():
            video_path = candidate
            break

    if video_path is None:
        await websocket.send_json({
            "error": f"Video '{video_id}' not found in uploads directory."
        })
        await websocket.close(code=1008)
        return

    try:
        service = PoseExtractionService()

        async for frame in service.extract_frames(str(video_path)):
            await websocket.send_text(frame.model_dump_json())
            await asyncio.sleep(0.01)

        # Signal completion after every frame has been sent
        await websocket.send_json({"status": "complete", "video_id": video_id})
        await websocket.close()

    except WebSocketDisconnect:
        logger.info(f"Client disconnected during telemetry stream for video {video_id}.")

    except Exception as e:
        logger.error(f"Unexpected error during telemetry stream: {e}", exc_info=True)
        try:
            await websocket.send_json({"error": str(e)})
            await websocket.close(code=1011)
        except RuntimeError:
            # Connection already closed – nothing more we can do
            pass
