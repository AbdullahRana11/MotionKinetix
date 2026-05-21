import math
import logging
from typing import Tuple

import numpy as np

logger = logging.getLogger(__name__)

# Type alias for a 2D coordinate pair
Point2D = Tuple[float, float]


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
