"""
FastDTW Similarity Engine — Apex Kinematics

Implements the exact DTW score formula from ALGORITHM_GUIDELINES.md §2:
    similarity_score = 100.0 * (1.0 - (dtw_distance / max_possible_distance))
    clamped_score = max(0.0, min(100.0, round(similarity_score, 1)))

All scores are strictly bounded to [0.0, 100.0].
A score of 104% is MATHEMATICALLY INVALID and will never be returned.
"""

import numpy as np
from fastdtw import fastdtw
from scipy.spatial import distance

from app.services.math_utils import clamp_dtw_score


def calculate_kinematic_deviation(pro_telemetry: list[float], user_telemetry: list[float]) -> dict:
    """
    Compare two kinematic telemetry sequences using Fast Dynamic Time Warping (FastDTW).
    
    Implements ALGORITHM_GUIDELINES.md §2 — DTW Score Calculation.

    Args:
        pro_telemetry: Array of angular velocities from the Golden Standard.
        user_telemetry: Array of angular velocities from the user's attempt.
        
    Returns:
        dict containing:
            - similarity_score: Clamped percentage [0.0, 100.0] where 100.0 is a perfect match.
            - raw_distance: The raw DTW distance value.
            - alignment_path: The warping path mapping indices between the two sequences.
    """
    pro_arr = np.array(pro_telemetry, dtype=np.float64)
    user_arr = np.array(user_telemetry, dtype=np.float64)

    # Calculate raw distance and optimal alignment path using absolute difference
    raw_distance, alignment_path = fastdtw(pro_arr, user_arr, dist=lambda x, y: abs(x - y))

    # ALGORITHM_GUIDELINES.md §2 — max_possible_distance is a pre-calculated
    # constant based on worst-case pose. We use the sequence length × maximum
    # plausible angular velocity delta as a conservative upper bound.
    max_possible_distance = max(len(pro_arr), len(user_arr)) * 100.0

    # Apply the EXACT formula from ALGORITHM_GUIDELINES.md:
    #   similarity_score = 100.0 * (1.0 - (dtw_distance / max_possible_distance))
    #   clamped_score = max(0.0, min(100.0, round(similarity_score, 1)))
    if max_possible_distance == 0:
        similarity_score = 100.0
    else:
        similarity_score = 100.0 * (1.0 - (raw_distance / max_possible_distance))

    # Strict clamping via centralized utility — BACKEND_PRD.md §6.1
    clamped_score = clamp_dtw_score(similarity_score)

    return {
        "similarity_score": clamped_score,
        "raw_distance": float(raw_distance),
        "alignment_path": alignment_path
    }
