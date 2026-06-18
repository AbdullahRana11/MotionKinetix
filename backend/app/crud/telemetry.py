from sqlalchemy.orm import Session

from app.models.telemetry import Telemetry
from app.schemas.kinematics import SkeletonFrame, TelemetryMetrics


def bulk_insert_telemetry(db: Session, video_id: str, frames_data: list[SkeletonFrame]):
    """
    Perform a high-performance bulk insert of telemetry data for an entire video.
    Uses bulk_insert_mappings to bypass ORM instantiation overhead.
    """
    mappings_list = []

    for frame in frames_data:
        # Extract angular velocity from the optional telemetry field, default to 0.0 if not present
        velocity = frame.telemetry.velocity if frame.telemetry else 0.0

        # Serialize keypoints to a list of dicts for the SQLAlchemy JSON column
        keypoints_dict_list = [kp.model_dump() for kp in frame.keypoints]

        mappings_list.append({
            "video_id": video_id,
            "frame_index": frame.frame_index,
            "timestamp_ms": frame.timestamp_ms,
            "angular_velocity": velocity,
            "raw_keypoints": keypoints_dict_list
        })

    # Execute a fast bulk insert in a single transaction
    if mappings_list:
        db.bulk_insert_mappings(Telemetry, mappings_list)
        db.commit()


def get_angular_velocity_series(db: Session, video_id: str) -> list[float]:
    """
    Retrieve the ordered angular velocity time series for a specific video.
    Returns a flat list of floats representing the sequence over time.
    """
    results = (
        db.query(Telemetry.angular_velocity)
        .filter(Telemetry.video_id == video_id)
        .order_by(Telemetry.frame_index.asc())
        .all()
    )
    
    # results is a list of tuples like: [(0.0,), (145.2,), (142.1,), ...]
    # Flatten it into a list of floats
    return [row[0] for row in results]
