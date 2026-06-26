"""
Analysis Response Schema — Apex Kinematics Engine

Defines the exact JSON shape the frontend requires as specified
in BACKEND_STRUCTURE.md §2.

Response (200):
{
    "analysis_id": "uuid",
    "dtw_similarity_score": 94.2,
    "processed_video_url": "http://localhost:8000/processed/processed_uuid.mp4",
    "graph_data": [
        { "axis_x_frame": 1, "axis_y_angle": 45.2 }
    ]
}

Validation:
    - dtw_similarity_score must not exceed 100.
    - processed_video_url must point to the actual user file, NEVER mov_bbb.mp4.
"""

from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator


class GraphDataPoint(BaseModel):
    """A single point in the graph_data time-series array.

    ALGORITHM_GUIDELINES.md §2 — Graphing Matrix format.
    """
    model_config = ConfigDict(extra="forbid")

    axis_x_frame: int = Field(ge=0, description="Frame index (0-based)")
    axis_y_angle: float = Field(ge=0.0, le=180.0, description="Joint angle in degrees")


class KeypointResponse(BaseModel):
    """A single keypoint from the skeleton frame."""
    model_config = ConfigDict(extra="forbid")

    x: float = Field(ge=0.0, le=1.0, description="Clamped X coordinate")
    y: float = Field(ge=0.0, le=1.0, description="Clamped Y coordinate")
    confidence: float = Field(ge=0.0, le=1.0, description="Detection confidence")
    label: str


class SkeletonFrameResponse(BaseModel):
    """Per-frame skeleton data for Canvas overlay rendering."""
    model_config = ConfigDict(extra="forbid")

    frame_index: int
    timestamp_ms: float
    keypoints: List[KeypointResponse]


class JointAngleResponse(BaseModel):
    """Legacy joint angle entry for the table view."""
    model_config = ConfigDict(extra="forbid")

    frame: int
    joint_name: str
    angle: float


class AnalysisResponse(BaseModel):
    """Full analysis response — BACKEND_STRUCTURE.md §2 compliant.

    Guarantees:
        - dtw_similarity_score ∈ [0.0, 100.0]
        - processed_video_url never contains 'mov_bbb.mp4'
        - graph_data follows the exact {axis_x_frame, axis_y_angle} shape
    """
    model_config = ConfigDict(extra="allow")

    analysis_id: str
    dtw_similarity_score: float = Field(ge=0.0, le=100.0)
    processed_video_url: str
    user_video_url: str = ""
    video_fps: float = 30.0
    graph_data: List[GraphDataPoint] = []
    skeleton_frames: list = []
    joint_angles: list = []

    @field_validator("processed_video_url")
    @classmethod
    def validate_no_dummy_url(cls, v: str) -> str:
        """BACKEND_STRUCTURE.md: processed_video_url must NEVER be mov_bbb.mp4."""
        if "mov_bbb.mp4" in v:
            raise ValueError(
                "processed_video_url contains the banned dummy URL 'mov_bbb.mp4'. "
                "This must point to the actual user-generated dual-video."
            )
        return v
