from typing import List
from pydantic import BaseModel, ConfigDict


class Keypoint(BaseModel):
    model_config = ConfigDict(extra="forbid")

    x: float
    y: float
    confidence: float
    label: str


class SkeletonFrame(BaseModel):
    model_config = ConfigDict(extra="forbid")

    frame_index: int
    timestamp_ms: float
    keypoints: List[Keypoint]


class TelemetryMetrics(BaseModel):
    model_config = ConfigDict(extra="forbid")

    velocity: float
    acceleration: float
    stress_warning: bool = False
