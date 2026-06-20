from typing import Optional

from sqlalchemy.orm import Session

from app.models.video import Video


def create_video_record(db: Session, video_id: str, filename: str) -> Video:
    """Create a new video record with status 'pending'."""
    db_video = Video(id=video_id, filename=filename, status="pending")
    db.add(db_video)
    db.commit()
    db.refresh(db_video)
    return db_video


def get_video(db: Session, video_id: str) -> Optional[Video]:
    """Retrieve a video record by its ID."""
    return db.query(Video).filter(Video.id == video_id).first()


def update_video_status(db: Session, video_id: str, new_status: str) -> Optional[Video]:
    """Update the processing status of a video."""
    db_video = get_video(db, video_id)
    if db_video:
        db_video.status = new_status
        db.commit()
        db.refresh(db_video)
    return db_video

def get_all_videos(db: Session) -> list[Video]:
    """Retrieve all video records."""
    return db.query(Video).order_by(Video.created_at.desc()).all()
