import logging
import asyncio
from typing import AsyncGenerator

import cv2
import torch

# Monkey-patch PyTorch 2.6+ to bypass weights_only restrictions that break Ultralytics 8.2.32
_original_torch_load = torch.load
def _patched_torch_load(*args, **kwargs):
    kwargs["weights_only"] = False
    return _original_torch_load(*args, **kwargs)
torch.load = _patched_torch_load

from ultralytics import YOLO

from app.schemas.kinematics import SkeletonFrame, Keypoint

logger = logging.getLogger(__name__)

# COCO keypoint mapping for YOLOv8 pose model
KEYPOINT_LABELS = [
    "nose", "left_eye", "right_eye", "left_ear", "right_ear",
    "left_shoulder", "right_shoulder", "left_elbow", "right_elbow",
    "left_wrist", "right_wrist", "left_hip", "right_hip",
    "left_knee", "right_knee", "left_ankle", "right_ankle"
]


class PoseExtractionService:
    def __init__(self):
        try:
            logger.info("Initializing PoseExtractionService, loading YOLOv8 pose model...")
            self.model = YOLO('yolov8n-pose.pt')
            logger.info("Successfully loaded YOLOv8n-pose model.")
        except Exception as e:
            logger.critical(f"Critical failure loading YOLOv8 pose model weights: {e}", exc_info=True)
            raise RuntimeError("Failed to load YOLOv8 pose model weights.") from e

    async def extract_frames(self, video_path: str) -> AsyncGenerator[SkeletonFrame, None]:
        """
        Asynchronously reads a video frame by frame, calculates FPS,
        and yields a dummy SkeletonFrame object for every frame.
        """
        cap = cv2.VideoCapture(video_path)
        
        if not cap.isOpened():
            logger.error(f"Failed to open video file: {video_path}")
            raise ValueError(f"Could not open video {video_path}")

        fps = cap.get(cv2.CAP_PROP_FPS)
        frame_interval_ms = 1000.0 / fps if fps > 0 else 33.33

        try:
            frame_index = 0
            while True:
                ret, frame = cap.read()
                if not ret:
                    break

                timestamp_ms = frame_index * frame_interval_ms
                
                yield SkeletonFrame(
                    frame_index=frame_index,
                    timestamp_ms=float(timestamp_ms),
                    keypoints=[]
                )
                
                frame_index += 1
                await asyncio.sleep(0)

        finally:
            cap.release()
            logger.debug(f"Released VideoCapture resource for {video_path}")
