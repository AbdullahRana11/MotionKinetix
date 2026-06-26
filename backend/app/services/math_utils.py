"""
Mathematical Clamping Utilities — Apex Kinematics Engine

All bounding functions for coordinates and scores live here.
These are the single source of truth for mathematical constraints
defined in ALGORITHM_GUIDELINES.md and BACKEND_PRD.md.

Rules:
    - Coordinates (x, y): strictly [0.0, 1.0]
    - DTW similarity scores: strictly [0.0, 100.0]
    - Angles: strictly [0.0, 180.0]
"""

from __future__ import annotations


def clamp_coordinate(val: float) -> float:
    """Clamp a MediaPipe coordinate to the [0.0, 1.0] bounding box.

    Prevents frontend canvas stretching caused by out-of-bounds
    normalized coordinates. Directly implements the function specified
    in ALGORITHM_GUIDELINES.md §2.

    Args:
        val: Raw x or y coordinate from MediaPipe (should be 0–1, but
             can occasionally exceed bounds due to pose estimation noise).

    Returns:
        The value clamped to [0.0, 1.0].
    """
    return max(0.0, min(1.0, float(val)))


def clamp_dtw_score(score: float) -> float:
    """Clamp a DTW similarity score to the [0.0, 100.0] percentage range.

    Enforces the strict mathematical bound mandated in BACKEND_PRD.md §6.1
    and ALGORITHM_GUIDELINES.md §2.  A score of 104% is mathematically
    invalid and must never reach the frontend.

    Args:
        score: Raw similarity percentage before bounding.

    Returns:
        The score clamped to [0.0, 100.0], rounded to 1 decimal place.
    """
    return round(max(0.0, min(100.0, float(score))), 1)


def clamp_angle(angle: float) -> float:
    """Clamp a joint angle to the [0.0, 180.0] degree range.

    Prevents physically impossible angle values from reaching the
    graph_data array.

    Args:
        angle: Raw joint angle in degrees.

    Returns:
        The angle clamped to [0.0, 180.0], rounded to 2 decimal places.
    """
    return round(max(0.0, min(180.0, float(angle))), 2)
