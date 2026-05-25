from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class Keypoint(BaseModel):
    model_config = ConfigDict(extra="forbid")

    x: float
    y: float
    confidence: float
    label: str


class TelemetryMetrics(BaseModel):
    model_config = ConfigDict(extra="forbid")

    velocity: float
    acceleration: float
    stress_warning: bool = False


class SkeletonFrame(BaseModel):
    model_config = ConfigDict(extra="forbid")

    frame_index: int
    timestamp_ms: float
    keypoints: List[Keypoint]
    telemetry: Optional[TelemetryMetrics] = None
