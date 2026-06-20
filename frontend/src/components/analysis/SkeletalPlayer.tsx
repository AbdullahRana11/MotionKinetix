'use client';

import React, { useEffect, useRef } from 'react';

/**
 * A single keypoint from the COCO pose model.
 */
export interface Keypoint {
  x: number;
  y: number;
  confidence: number;
  label: string;
}

/**
 * A single frame of skeleton data from the backend.
 */
export interface SkeletonFrameData {
  frame_index: number;
  timestamp_ms: number;
  keypoints: Keypoint[];
}

interface SkeletalPlayerProps {
  videoUrl: string;
  skeletonFrames: SkeletonFrameData[];
  fps?: number;
}

// COCO keypoint label ordering (matches YOLOv8 pose output)
const LABEL_INDEX: Record<string, number> = {
  nose: 0, left_eye: 1, right_eye: 2, left_ear: 3, right_ear: 4,
  left_shoulder: 5, right_shoulder: 6, left_elbow: 7, right_elbow: 8,
  left_wrist: 9, right_wrist: 10, left_hip: 11, right_hip: 12,
  left_knee: 13, right_knee: 14, left_ankle: 15, right_ankle: 16,
};

// Bones to draw (pairs of keypoint indices)
const SKELETON_CONNECTIONS: [number, number][] = [
  // Head
  [0, 1], [0, 2], [1, 3], [2, 4],
  // Torso
  [5, 6], [5, 11], [6, 12], [11, 12],
  // Left arm
  [5, 7], [7, 9],
  // Right arm
  [6, 8], [8, 10],
  // Left leg
  [11, 13], [13, 15],
  // Right leg
  [12, 14], [14, 16],
];

// Bone color mapping for visual distinction
const BONE_COLORS: Record<string, string> = {
  head: '#00eefc',
  torso: '#2e5bff',
  left_arm: '#00ff80',
  right_arm: '#ff6b6b',
  left_leg: '#00ff80',
  right_leg: '#ff6b6b',
};

function getBoneGroup(a: number, b: number): string {
  if ([0, 1, 2, 3, 4].includes(a) && [0, 1, 2, 3, 4].includes(b)) return 'head';
  if ([5, 6, 11, 12].includes(a) && [5, 6, 11, 12].includes(b)) return 'torso';
  if ([5, 7, 9].includes(a) && [5, 7, 9].includes(b)) return 'left_arm';
  if ([6, 8, 10].includes(a) && [6, 8, 10].includes(b)) return 'right_arm';
  if ([11, 13, 15].includes(a) && [11, 13, 15].includes(b)) return 'left_leg';
  if ([12, 14, 16].includes(a) && [12, 14, 16].includes(b)) return 'right_leg';
  return 'torso';
}

const CONFIDENCE_THRESHOLD = 0.3;

export default function SkeletalPlayer({ videoUrl, skeletonFrames, fps = 30 }: SkeletalPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let videoWidth = 0;
    let videoHeight = 0;

    const resizeCanvas = () => {
      canvas.width = video.clientWidth;
      canvas.height = video.clientHeight;
      videoWidth = video.videoWidth || 1;
      videoHeight = video.videoHeight || 1;
    };

    video.addEventListener('loadedmetadata', () => {
      videoWidth = video.videoWidth;
      videoHeight = video.videoHeight;
      resizeCanvas();
    });
    window.addEventListener('resize', resizeCanvas);

    const renderLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (videoWidth === 0 || videoHeight === 0 || !skeletonFrames || skeletonFrames.length === 0) {
        animationFrameId = requestAnimationFrame(renderLoop);
        return;
      }

      // Calculate current frame from video time
      const currentFrame = Math.floor(video.currentTime * fps);

      // Find the closest frame in skeletonFrames
      let frameData: SkeletonFrameData | null = null;
      let minDist = Infinity;
      for (const sf of skeletonFrames) {
        const dist = Math.abs(sf.frame_index - currentFrame);
        if (dist < minDist) {
          minDist = dist;
          frameData = sf;
        }
        if (dist === 0) break; // Exact match
      }

      if (frameData && frameData.keypoints && frameData.keypoints.length > 0) {
        const kps = frameData.keypoints;
        const scaleX = canvas.width / videoWidth;
        const scaleY = canvas.height / videoHeight;

        // ── Draw Bones ──
        for (const [a, b] of SKELETON_CONNECTIONS) {
          if (a >= kps.length || b >= kps.length) continue;
          const kpA = kps[a];
          const kpB = kps[b];
          if (kpA.confidence < CONFIDENCE_THRESHOLD || kpB.confidence < CONFIDENCE_THRESHOLD) continue;

          const ax = kpA.x * scaleX;
          const ay = kpA.y * scaleY;
          const bx = kpB.x * scaleX;
          const by = kpB.y * scaleY;

          const color = BONE_COLORS[getBoneGroup(a, b)] || '#2e5bff';

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.strokeStyle = color;
          ctx.lineWidth = 3;
          ctx.shadowColor = color;
          ctx.shadowBlur = 8;
          ctx.stroke();
          ctx.restore();
        }

        // ── Draw Joint Dots ──
        for (let i = 0; i < kps.length; i++) {
          const kp = kps[i];
          if (kp.confidence < CONFIDENCE_THRESHOLD) continue;

          const px = kp.x * scaleX;
          const py = kp.y * scaleY;

          ctx.save();
          ctx.beginPath();
          ctx.arc(px, py, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#00eefc';
          ctx.shadowColor = '#00eefc';
          ctx.shadowBlur = 12;
          ctx.fill();
          // White dot center
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.restore();
        }

        // ── HUD Overlay ──
        const hudX = 10;
        const hudY = canvas.height - 80;

        ctx.save();
        ctx.fillStyle = 'rgba(10, 11, 16, 0.75)';
        ctx.shadowColor = '#00eefc';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.roundRect(hudX, hudY, 180, 65, 6);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(0, 238, 252, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.font = 'bold 11px "Courier New", monospace';
        ctx.fillStyle = '#00eefc';
        ctx.fillText(`FRAME: ${currentFrame}`, hudX + 12, hudY + 22);

        ctx.fillStyle = '#8e90a2';
        ctx.font = '10px "Courier New", monospace';
        ctx.fillText(`KEYPOINTS: ${kps.filter(k => k.confidence >= CONFIDENCE_THRESHOLD).length}/${kps.length}`, hudX + 12, hudY + 40);
        ctx.fillText(`TIME: ${video.currentTime.toFixed(2)}s`, hudX + 12, hudY + 55);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [skeletonFrames, fps]);

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-neutral-700 bg-black shadow-2xl">
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        className="block w-full"
        crossOrigin="anonymous"
      />
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
    </div>
  );
}
