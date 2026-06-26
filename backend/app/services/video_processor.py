"""
OpenCV Dual-Video Pipeline — Apex Kinematics Engine

Implements the side-by-side video generation as specified in:
    - ALGORITHM_GUIDELINES.md §3 (OpenCV Processing Layout)
    - DATA_FLOW.md §2 (The Analytics Pipeline, Step 6)
    - BACKEND_PRD.md §6.3 (OpenCV Side-by-Side Video Generation)

Pipeline:
    1. Read each frame from the raw uploaded video via cv2.VideoCapture.
    2. Run MediaPipe PoseLandmarker (Tasks API) to extract 33 normalized landmarks.
    3. Clamp all coordinates to [0.0, 1.0] via math_utils.clamp_coordinate.
    4. Resize the original frame to 640×480.
    5. Draw skeleton connections on a black 640×480 frame.
    6. np.hstack the two frames into a 1280×480 combined frame.
    7. Write to storage/processed_cache/processed_{video_id}.mp4.
    8. Build graph_data and compute angular velocities along the way.

Uses the MediaPipe Tasks Python API (>=0.10.18) with PoseLandmarker.
"""

from __future__ import annotations

import logging
import math
from pathlib import Path
from typing import List, Dict, Any, Tuple, Optional

import cv2
import numpy as np
import mediapipe as mp

from mediapipe.tasks.python import BaseOptions
from mediapipe.tasks.python.vision import (
    PoseLandmarker,
    PoseLandmarkerOptions,
    PoseLandmarksConnections,
    RunningMode,
)

from app.services.math_utils import clamp_coordinate, clamp_dtw_score, clamp_angle
from app.core.config import settings

logger = logging.getLogger(__name__)

# ── Model path resolution ─────────────────────────────────────────────────────
# The .task model file lives in the backend root directory
_BACKEND_ROOT = Path(__file__).resolve().parents[2]
_MODEL_PATH = _BACKEND_ROOT / "pose_landmarker_lite.task"

# Target dimensions per the ALGORITHM_GUIDELINES.md §3
FRAME_WIDTH = 640
FRAME_HEIGHT = 480

# Pose connections from MediaPipe Tasks API
POSE_CONNECTIONS = PoseLandmarksConnections.POSE_LANDMARKS

# Key landmark indices (MediaPipe 33-landmark schema)
LANDMARK_RIGHT_HIP = 24
LANDMARK_RIGHT_KNEE = 26
LANDMARK_RIGHT_ANKLE = 28

# MediaPipe 33-landmark label mapping
MEDIAPIPE_LABELS = [
    "nose", "left_eye_inner", "left_eye", "left_eye_outer",
    "right_eye_inner", "right_eye", "right_eye_outer",
    "left_ear", "right_ear", "mouth_left", "mouth_right",
    "left_shoulder", "right_shoulder", "left_elbow", "right_elbow",
    "left_wrist", "right_wrist", "left_pinky", "right_pinky",
    "left_index", "right_index", "left_thumb", "right_thumb",
    "left_hip", "right_hip", "left_knee", "right_knee",
    "left_ankle", "right_ankle", "left_heel", "right_heel",
    "left_foot_index", "right_foot_index"
]


def _calculate_angle(a: Tuple[float, float], b: Tuple[float, float], c: Tuple[float, float]) -> float:
    """Calculate angle at vertex b formed by rays b→a and b→c.

    Uses arctan2 for numerical stability. Returns degrees in [0, 180].
    """
    vec_ba = np.array([a[0] - b[0], a[1] - b[1]], dtype=np.float64)
    vec_bc = np.array([c[0] - b[0], c[1] - b[1]], dtype=np.float64)

    mag_ba = np.linalg.norm(vec_ba)
    mag_bc = np.linalg.norm(vec_bc)

    if mag_ba < 1e-9 or mag_bc < 1e-9:
        return 0.0

    cross = float(np.cross(vec_ba, vec_bc))
    dot = float(np.dot(vec_ba, vec_bc))

    angle_rad = math.atan2(abs(cross), dot)
    angle_deg = math.degrees(angle_rad)

    return clamp_angle(angle_deg)


def _draw_skeleton_on_black(
    landmarks_list,
    frame_width: int = FRAME_WIDTH,
    frame_height: int = FRAME_HEIGHT,
) -> np.ndarray:
    """Draw MediaPipe pose landmarks on a black background frame.

    Per ALGORITHM_GUIDELINES.md §3:
        skeleton_frame = np.zeros((480, 640, 3), dtype=np.uint8)

    Args:
        landmarks_list: List of NormalizedLandmark from PoseLandmarker result.
        frame_width: Width of the skeleton frame.
        frame_height: Height of the skeleton frame.

    Returns:
        A BGR numpy array of the skeleton drawn on a black background.
    """
    skeleton_frame = np.zeros((frame_height, frame_width, 3), dtype=np.uint8)

    if not landmarks_list:
        return skeleton_frame

    # Draw connections (bones) first, then landmarks (joints) on top
    for connection in POSE_CONNECTIONS:
        start_idx = connection.start
        end_idx = connection.end

        if start_idx >= len(landmarks_list) or end_idx >= len(landmarks_list):
            continue

        start = landmarks_list[start_idx]
        end = landmarks_list[end_idx]

        # Clamp coordinates before pixel conversion
        start_x = clamp_coordinate(start.x)
        start_y = clamp_coordinate(start.y)
        end_x = clamp_coordinate(end.x)
        end_y = clamp_coordinate(end.y)

        # Convert normalized coords to pixel coords
        sx = int(start_x * frame_width)
        sy = int(start_y * frame_height)
        ex = int(end_x * frame_width)
        ey = int(end_y * frame_height)

        # Cyan connection lines for visual clarity
        cv2.line(skeleton_frame, (sx, sy), (ex, ey), (252, 238, 0), 2)

    # Draw landmark points
    for landmark in landmarks_list:
        lx = int(clamp_coordinate(landmark.x) * frame_width)
        ly = int(clamp_coordinate(landmark.y) * frame_height)
        # Bright cyan dots for joints
        cv2.circle(skeleton_frame, (lx, ly), 4, (0, 238, 252), -1)
        # White outline ring
        cv2.circle(skeleton_frame, (lx, ly), 5, (255, 255, 255), 1)

    return skeleton_frame


def _extract_clamped_keypoints(landmarks_list) -> List[Dict[str, Any]]:
    """Extract all 33 MediaPipe landmarks as clamped dictionaries.

    Each coordinate is clamped to [0.0, 1.0] per ALGORITHM_GUIDELINES.md §2.

    Returns:
        List of dicts: [{"x": float, "y": float, "confidence": float, "label": str}, ...]
    """
    keypoints = []
    for i, landmark in enumerate(landmarks_list):
        label = MEDIAPIPE_LABELS[i] if i < len(MEDIAPIPE_LABELS) else f"landmark_{i}"
        keypoints.append({
            "x": clamp_coordinate(landmark.x),
            "y": clamp_coordinate(landmark.y),
            "confidence": round(float(landmark.visibility), 4),
            "label": label,
        })
    return keypoints


def _get_knee_angle_from_landmarks(landmarks_list) -> Optional[float]:
    """Calculate the right knee angle from MediaPipe landmarks.

    Uses hip-knee-ankle kinematic chain as defined in BACKEND_IMPLEMENTATION_PLAN §1.2.
    Returns None if landmarks are insufficient.
    """
    if not landmarks_list or len(landmarks_list) <= LANDMARK_RIGHT_ANKLE:
        return None

    hip = (clamp_coordinate(landmarks_list[LANDMARK_RIGHT_HIP].x),
           clamp_coordinate(landmarks_list[LANDMARK_RIGHT_HIP].y))
    knee = (clamp_coordinate(landmarks_list[LANDMARK_RIGHT_KNEE].x),
            clamp_coordinate(landmarks_list[LANDMARK_RIGHT_KNEE].y))
    ankle = (clamp_coordinate(landmarks_list[LANDMARK_RIGHT_ANKLE].x),
             clamp_coordinate(landmarks_list[LANDMARK_RIGHT_ANKLE].y))

    return _calculate_angle(hip, knee, ankle)


def process_video_to_dual(
    video_id: str,
    input_video_path: str,
) -> Dict[str, Any]:
    """Execute the full dual-video generation pipeline.

    Implements DATA_FLOW.md §2 (Happy Path steps 1-6) and
    ALGORITHM_GUIDELINES.md §3 (OpenCV Processing Layout).

    Args:
        video_id: UUID of the video being processed.
        input_video_path: Absolute path to the raw uploaded MP4.

    Returns:
        Dictionary containing:
            - processed_video_path: str — relative URL path to the dual-video
            - graph_data: list — frame-by-frame angle data for frontend charting
            - skeleton_frames: list — per-frame keypoint data
            - angular_velocities: list — angular velocity series for DTW
            - video_fps: float — frames per second
            - status: str — "completed" or "FAILED_NO_SUBJECT"

    Raises:
        ValueError: If the video file cannot be opened (422 Unprocessable Entity).
    """
    cap = cv2.VideoCapture(input_video_path)

    if not cap.isOpened():
        logger.error(f"Video unreadable — cannot open: {input_video_path}")
        raise ValueError(f"Could not open video {input_video_path}")

    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps <= 0:
        fps = 30.0
    frame_interval_ms = 1000.0 / fps

    # ── Setup cv2.VideoWriter for dual-video output ────────────────────────────
    output_filename = f"processed_{video_id}.mp4"
    output_path = settings.PROCESSED_CACHE_DIR / output_filename

    # Combined width = original (640) + skeleton (640) = 1280
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    writer = cv2.VideoWriter(
        str(output_path),
        fourcc,
        fps,
        (FRAME_WIDTH * 2, FRAME_HEIGHT),
    )

    if not writer.isOpened():
        cap.release()
        logger.error(f"Failed to create VideoWriter at {output_path}")
        raise RuntimeError(f"Cannot create output video: {output_path}")

    # ── Initialize MediaPipe PoseLandmarker (Tasks API) ────────────────────────
    if not _MODEL_PATH.exists():
        cap.release()
        writer.release()
        raise FileNotFoundError(
            f"PoseLandmarker model not found at {_MODEL_PATH}. "
            "Download from: https://storage.googleapis.com/mediapipe-models/"
            "pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task"
        )

    options = PoseLandmarkerOptions(
        base_options=BaseOptions(model_asset_path=str(_MODEL_PATH)),
        running_mode=RunningMode.VIDEO,
        num_poses=1,
        min_pose_detection_confidence=0.5,
        min_tracking_confidence=0.5,
    )

    landmarker = PoseLandmarker.create_from_options(options)

    graph_data: List[Dict[str, Any]] = []
    skeleton_frames: List[Dict[str, Any]] = []
    angular_velocities: List[float] = []
    previous_angle: Optional[float] = None
    previous_time_ms: float = 0.0
    frames_with_no_person = 0
    total_frames = 0

    try:
        frame_index = 0
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            total_frames += 1
            timestamp_ms = frame_index * frame_interval_ms
            timestamp_ms_int = int(timestamp_ms)

            # Step 1: Resize original frame to standard dimensions
            original_frame = cv2.resize(frame, (FRAME_WIDTH, FRAME_HEIGHT))

            # Step 2: Run MediaPipe PoseLandmarker detection
            rgb_frame = cv2.cvtColor(original_frame, cv2.COLOR_BGR2RGB)
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)

            result = landmarker.detect_for_video(mp_image, timestamp_ms_int)

            if not result.pose_landmarks or len(result.pose_landmarks) == 0:
                # DATA_FLOW.md Error State: No Person Detected
                frames_with_no_person += 1
                # Write original + blank black frame
                skeleton_frame = np.zeros(
                    (FRAME_HEIGHT, FRAME_WIDTH, 3), dtype=np.uint8
                )
                combined = np.hstack((original_frame, skeleton_frame))
                writer.write(combined)

                # Append empty frame data
                skeleton_frames.append({
                    "frame_index": frame_index,
                    "timestamp_ms": timestamp_ms,
                    "keypoints": [],
                })
                graph_data.append({
                    "axis_x_frame": frame_index,
                    "axis_y_angle": 0.0,
                })
                angular_velocities.append(0.0)
                frame_index += 1
                continue

            # Get the first (and only) detected person's landmarks
            person_landmarks = result.pose_landmarks[0]

            # Step 3: Extract clamped keypoints
            clamped_keypoints = _extract_clamped_keypoints(person_landmarks)

            # Step 4: Calculate knee angle for graph_data
            knee_angle = _get_knee_angle_from_landmarks(person_landmarks)
            if knee_angle is None:
                knee_angle = 0.0

            # Angular velocity calculation: ω = Δθ / Δt
            if previous_angle is not None and timestamp_ms > previous_time_ms:
                dt_seconds = (timestamp_ms - previous_time_ms) / 1000.0
                angular_velocity = (knee_angle - previous_angle) / dt_seconds if dt_seconds > 0 else 0.0
            else:
                angular_velocity = 0.0

            previous_angle = knee_angle
            previous_time_ms = timestamp_ms

            # Step 5: Build graph_data entry (ALGORITHM_GUIDELINES.md §2 Graphing Matrix)
            graph_data.append({
                "axis_x_frame": frame_index,
                "axis_y_angle": clamp_angle(knee_angle),
            })

            angular_velocities.append(angular_velocity)

            # Step 6: Build skeleton_frames entry
            skeleton_frames.append({
                "frame_index": frame_index,
                "timestamp_ms": timestamp_ms,
                "keypoints": clamped_keypoints,
            })

            # Step 7: Draw skeleton on black background
            skeleton_frame = _draw_skeleton_on_black(person_landmarks)

            # Step 8: Horizontal stack and write
            combined_frame = np.hstack((original_frame, skeleton_frame))
            writer.write(combined_frame)

            frame_index += 1

    finally:
        landmarker.close()
        writer.release()
        cap.release()
        logger.debug(f"Released all resources for video {video_id}")

    # Check: If NO frames had a person, mark as failed per DATA_FLOW.md error states
    if total_frames > 0 and frames_with_no_person == total_frames:
        logger.warning(f"FAILED_NO_SUBJECT: No human detected in any frame of video {video_id}")
        return {
            "processed_video_path": "",
            "graph_data": [],
            "skeleton_frames": [],
            "angular_velocities": [],
            "video_fps": fps,
            "status": "FAILED_NO_SUBJECT",
        }

    # Build the URL path that the frontend will use to fetch the video
    processed_video_url_path = f"/processed/{output_filename}"

    logger.info(
        f"Dual-video pipeline complete for {video_id}: "
        f"{total_frames} frames processed, {frames_with_no_person} empty, "
        f"output at {output_path}"
    )

    return {
        "processed_video_path": processed_video_url_path,
        "graph_data": graph_data,
        "skeleton_frames": skeleton_frames,
        "angular_velocities": angular_velocities,
        "video_fps": fps,
        "status": "completed",
    }
