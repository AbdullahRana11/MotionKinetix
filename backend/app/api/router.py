import uuid
import shutil
from pathlib import Path

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.core.config import settings

router = APIRouter()

ALLOWED_EXTENSIONS = {".mp4", ".mov", ".avi"}


@router.post("/upload-video/")
async def upload_video(file: UploadFile = File(...)):
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

    # 4. Return JSON response containing the new video_id
    return {"video_id": video_id, "status": "success"}
