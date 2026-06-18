import uuid
import shutil
from pathlib import Path

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, BackgroundTasks
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.crud.video import create_video_record
from app.services.worker import process_video_background

router = APIRouter()

ALLOWED_EXTENSIONS = {".mp4", ".mov", ".avi"}


@router.post("/upload-video/")
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
