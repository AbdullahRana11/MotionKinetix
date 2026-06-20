import uuid
import shutil
from pathlib import Path

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, BackgroundTasks
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.crud.video import create_video_record, get_video, get_all_videos
from app.crud.telemetry import get_angular_velocity_series
from app.services.worker import process_video_background
from app.services.dtw_engine import calculate_kinematic_deviation

router = APIRouter()

ALLOWED_EXTENSIONS = {".mp4", ".mov", ".avi"}

@router.get("/videos")
async def get_videos(db: Session = Depends(get_db)):
    """Get all videos for the dashboard."""
    videos = get_all_videos(db)
    return [
        {
            "id": v.id,
            "filename": v.filename,
            "upload_date": v.created_at.isoformat(),
            "status": v.status
        }
        for v in videos
    ]

@router.post("/videos/upload")
async def upload_video(
    background_tasks: BackgroundTasks, 
    file: UploadFile = File(...), 
    db: Session = Depends(get_db)
):
    """
    Production file upload endpoint.
    Validates the file type, generates a secure UUID for storage, 
    and streams the upload to disk to prevent RAM exhaustion.
    """
    # 1. Validate the file extension
    file_ext = Path(file.filename).suffix.lower() if file.filename else ""
    
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid file extension '{file_ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # 2. Generate a secure uuid4 string for the filename
    video_id = str(uuid.uuid4())
    secure_filename = f"{video_id}{file_ext}"
    
    # 3. Save the file chunks using shutil.copyfileobj
    # We use settings.UPLOADS_DIR as defined in our Pydantic Settings class
    file_path = settings.UPLOADS_DIR / secure_filename
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")
    finally:
        # Always close the uploaded file
        file.file.close()

    # 4. Create database record
    db_video = create_video_record(db, video_id=video_id, filename=file.filename)

    # 5. Add worker to background tasks queue
    background_tasks.add_task(process_video_background, video_id=video_id, video_path=str(file_path))

    # 6. Return JSON response notifying client that async processing has started
    return {
        "video_id": video_id, 
        "status": "processing_started", 
        "db_status": db_video.status,
        "message": "Video has been queued for background processing."
    }


@router.get("/videos/{video_id}/status")
async def get_video_status(video_id: str, db: Session = Depends(get_db)):
    """
    Query the processing status of a specific video by its UUID.
    """
    db_video = get_video(db, video_id)
    if not db_video:
        raise HTTPException(status_code=404, detail="Video not found")

    return {
        "video_id": db_video.id,
        "filename": db_video.filename,
        "status": db_video.status,
        "created_at": db_video.created_at
    }


@router.get("/compare/{user_video_id}/{pro_video_id}")
async def compare_videos(user_video_id: str, pro_video_id: str, db: Session = Depends(get_db)):
    """
    Compare a user's attempt against a golden standard using FastDTW.
    """
    user_series = get_angular_velocity_series(db, user_video_id)
    pro_series = get_angular_velocity_series(db, pro_video_id)

    if not user_series:
        raise HTTPException(status_code=404, detail=f"No telemetry found for user video {user_video_id}")
    if not pro_series:
        raise HTTPException(status_code=404, detail=f"No telemetry found for pro video {pro_video_id}")

    # Calculate kinematic deviation
    result = calculate_kinematic_deviation(pro_series, user_series)

    return result

@router.get("/analysis/{video_id}")
async def get_analysis(video_id: str, db: Session = Depends(get_db)):
    """Full analysis endpoint returning video URLs, skeleton keypoints, and telemetry."""
    db_video = get_video(db, video_id)
    if not db_video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    # Find the actual file on disk (stored as {video_id}.{ext})
    actual_file = None
    for ext in [".mp4", ".mov", ".avi"]:
        candidate = settings.UPLOADS_DIR / f"{video_id}{ext}"
        if candidate.exists():
            actual_file = f"{video_id}{ext}"
            break
    
    user_video_path = f"/uploads/{actual_file}" if actual_file else ""

    # Query all telemetry rows for this video, ordered by frame
    from app.models.telemetry import Telemetry
    telemetry_rows = (
        db.query(Telemetry)
        .filter(Telemetry.video_id == video_id)
        .order_by(Telemetry.frame_index.asc())
        .all()
    )

    # Build skeleton_frames: list of { frame_index, timestamp_ms, keypoints: [{x,y,confidence,label}] }
    skeleton_frames = []
    joint_angles = []
    for row in telemetry_rows:
        skeleton_frames.append({
            "frame_index": row.frame_index,
            "timestamp_ms": row.timestamp_ms,
            "keypoints": row.raw_keypoints,  # Already stored as list of dicts
        })
        # Also build legacy joint_angles for the table view
        joint_angles.append({
            "frame": row.frame_index,
            "joint_name": "Angular Velocity",
            "angle": round(row.angular_velocity, 2),
        })

    # Get video FPS from the actual file
    video_fps = 30.0  # Default
    if actual_file:
        import cv2
        cap = cv2.VideoCapture(str(settings.UPLOADS_DIR / actual_file))
        if cap.isOpened():
            video_fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
            cap.release()

    # Calculate a DTW score if telemetry exists
    dtw_score = 0.0
    if telemetry_rows:
        velocities = [r.angular_velocity for r in telemetry_rows]
        avg = sum(velocities) / len(velocities) if velocities else 0
        dtw_score = round(max(0, 100 - avg * 0.1), 1)  # Simple heuristic

    return {
        "reference_video_url": "https://www.w3schools.com/html/mov_bbb.mp4",
        "user_video_url": user_video_path,
        "video_fps": video_fps,
        "dtw_similarity_score": dtw_score,
        "skeleton_frames": skeleton_frames,
        "joint_angles": joint_angles,
    }
