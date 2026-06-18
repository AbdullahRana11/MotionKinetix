import numpy as np
from fastdtw import fastdtw
from scipy.spatial import distance


def calculate_kinematic_deviation(pro_telemetry: list[float], user_telemetry: list[float]) -> dict:
    """
    Compare two kinematic telemetry sequences using Fast Dynamic Time Warping (FastDTW).
    
    Args:
        pro_telemetry: Array of angular velocities from the Golden Standard.
        user_telemetry: Array of angular velocities from the user's attempt.
        
    Returns:
        dict containing:
            - similarity_score: Normalized percentage (0.0 to 100.0) where 100 is a perfect match.
            - raw_distance: The raw Euclidean DTW distance.
            - alignment_path: The warping path mapping indices between the two sequences.
    """
    pro_arr = np.array(pro_telemetry, dtype=np.float64)
    user_arr = np.array(user_telemetry, dtype=np.float64)

    # Calculate raw distance and optimal alignment path using absolute difference
    raw_distance, alignment_path = fastdtw(pro_arr, user_arr, dist=lambda x, y: abs(x - y))

    # Normalization heuristic:
    # A raw distance of 0 means perfect alignment (100%).
    # We define a "max acceptable" error threshold based on the sequence lengths and a variance factor.
    # We'll use a conservative scaling factor for normalization.
    max_expected_distance = max(len(pro_arr), len(user_arr)) * 100.0
    
    if raw_distance == 0:
        similarity_score = 100.0
    elif raw_distance > max_expected_distance:
        similarity_score = 0.0
    else:
        # Scale to a percentage
        similarity_score = 100.0 * (1.0 - (raw_distance / max_expected_distance))
        
    # Ensure it's bounded between 0 and 100
    similarity_score = max(0.0, min(100.0, float(similarity_score)))

    return {
        "similarity_score": round(similarity_score, 2),
        "raw_distance": float(raw_distance),
        "alignment_path": alignment_path
    }
