import math
import logging
from typing import Dict, Optional, Tuple

import numpy as np

from app.schemas.kinematics import SkeletonFrame, Keypoint, TelemetryMetrics

logger = logging.getLogger(__name__)

# Type alias for a 2D coordinate pair
Point2D = Tuple[float, float]

# COCO keypoint labels used by the right-leg kinematic chain
_RIGHT_HIP = "right_hip"
_RIGHT_KNEE = "right_knee"
_RIGHT_ANKLE = "right_ankle"


def calculate_joint_angle(a: Point2D, b: Point2D, c: Point2D) -> float:
    """Calculate the angle at vertex **b** formed by rays b→a and b→c.

    Uses the two-argument arctangent (np.arctan2) of the cross product and
    dot product for numerical stability across all quadrants.

    Args:
        a: Endpoint coordinate (e.g. hip).
        b: Vertex coordinate   (e.g. knee – the joint being measured).
        c: Endpoint coordinate (e.g. ankle).

    Returns:
        Angle in degrees ∈ [0, 180].  Returns 0.0 when any two points
        overlap (degenerate / zero-length vector).
    """
    vec_ba = np.array([a[0] - b[0], a[1] - b[1]], dtype=np.float64)
    vec_bc = np.array([c[0] - b[0], c[1] - b[1]], dtype=np.float64)

    mag_ba = np.linalg.norm(vec_ba)
    mag_bc = np.linalg.norm(vec_bc)

    # Guard: degenerate triangle – overlapping points produce a zero vector
    if mag_ba < 1e-9 or mag_bc < 1e-9:
        logger.debug(
            "Degenerate joint angle: overlapping coordinates detected "
            f"(a={a}, b={b}, c={c}). Returning 0.0°."
        )
        return 0.0

    cross = float(np.cross(vec_ba, vec_bc))
    dot = float(np.dot(vec_ba, vec_bc))

    angle_rad = math.atan2(abs(cross), dot)
    angle_deg = math.degrees(angle_rad)

    return angle_deg


def apply_ema_filter(
    current_val: float,
    previous_val: float,
    alpha: float = 0.4,
) -> float:
    """Smooth noisy YOLO predictions with an Exponential Moving Average.

    EMA formula:  smoothed = α · current  +  (1 − α) · previous

    A lower α value produces heavier smoothing (more weight on history);
    a higher α value tracks the raw signal more closely.

    Args:
        current_val:  The latest raw measurement from the current frame.
        previous_val: The smoothed value carried over from the prior frame.
        alpha:        Smoothing factor in (0, 1].  Default 0.4.

    Returns:
        The EMA-smoothed value.
    """
    return alpha * current_val + (1.0 - alpha) * previous_val


def _keypoint_by_label(
    keypoints: list[Keypoint], label: str
) -> Optional[Keypoint]:
    """Return the first keypoint matching *label*, or None."""
    for kp in keypoints:
        if kp.label == label:
            return kp
    return None


class KinematicEngine:
    """Stateful, frame-over-frame kinematic processor.

    Tracks previous keypoints, joint angles, and timestamps so that
    derived quantities (angular velocity, acceleration) can be computed
    across consecutive frames.
    """

    def __init__(self) -> None:
        self.previous_keypoints: Dict[str, Keypoint] = {}
        self.previous_angles: Dict[str, float] = {}
        self.previous_time: float = 0.0

    def process_frame_kinematics(self, frame: SkeletonFrame) -> TelemetryMetrics:
        """Derive kinematic telemetry from a single skeleton frame.

        Pipeline (right leg):
            1. Extract right_hip, right_knee, right_ankle keypoints.
            2. Compute raw knee angle via ``calculate_joint_angle``.
            3. Smooth the angle with ``apply_ema_filter``.
            4. Derive angular velocity  ω = Δθ / Δt  (deg/s).
            5. Update internal state for the next frame.
            6. Return a ``TelemetryMetrics`` object.

        Args:
            frame: A validated ``SkeletonFrame`` from the pose engine.

        Returns:
            ``TelemetryMetrics`` populated with the smoothed angular
            velocity.  Acceleration and stress_warning are placeholders
            for now.
        """
        hip = _keypoint_by_label(frame.keypoints, _RIGHT_HIP)
        knee = _keypoint_by_label(frame.keypoints, _RIGHT_KNEE)
        ankle = _keypoint_by_label(frame.keypoints, _RIGHT_ANKLE)

        # --- 1. Raw knee angle ------------------------------------------------
        if hip and knee and ankle:
            raw_angle = calculate_joint_angle(
                (hip.x, hip.y),
                (knee.x, knee.y),
                (ankle.x, ankle.y),
            )
        else:
            # Keypoints missing – carry forward the last known angle
            raw_angle = self.previous_angles.get("right_knee", 0.0)

        # --- 2. EMA-smoothed angle --------------------------------------------
        prev_angle = self.previous_angles.get("right_knee", raw_angle)
        smoothed_angle = apply_ema_filter(raw_angle, prev_angle)

        # --- 3. Angular velocity (deg / s) ------------------------------------
        dt = frame.timestamp_ms - self.previous_time  # milliseconds
        if dt > 0:
            angular_velocity = (smoothed_angle - prev_angle) / (dt / 1000.0)
        else:
            angular_velocity = 0.0

        # --- 4. Update state for the next invocation --------------------------
        self.previous_angles["right_knee"] = smoothed_angle
        self.previous_time = frame.timestamp_ms

        if hip:
            self.previous_keypoints[_RIGHT_HIP] = hip
        if knee:
            self.previous_keypoints[_RIGHT_KNEE] = knee
        if ankle:
            self.previous_keypoints[_RIGHT_ANKLE] = ankle

        # --- 5. Build telemetry -----------------------------------------------
        return TelemetryMetrics(
            velocity=angular_velocity,
            acceleration=0.0,
            stress_warning=False,
        )
