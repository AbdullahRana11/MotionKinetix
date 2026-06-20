'use client';

import React, { useEffect, useRef } from 'react';

export interface TelemetryDataPoint {
  frame: number;
  joint_name: string;
  angle: number;
}

interface SkeletalPlayerProps {
  videoUrl: string;
  telemetryData: TelemetryDataPoint[];
}

export default function SkeletalPlayer({ videoUrl, telemetryData }: SkeletalPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const FPS = 30; // Assumed frame rate

    // Ensure canvas dimensions match video dimensions for accurate rendering
    const resizeCanvas = () => {
      canvas.width = video.clientWidth;
      canvas.height = video.clientHeight;
    };

    video.addEventListener('loadedmetadata', resizeCanvas);
    window.addEventListener('resize', resizeCanvas);

    const renderLoop = () => {
      // Clear previous frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!video.paused && !video.ended) {
        // Calculate current frame
        const currentFrame = Math.floor(video.currentTime * FPS);

        // Filter telemetry data for the current frame
        const frameData = telemetryData.filter((d) => d.frame === currentFrame);

        if (frameData.length > 0) {
          // Draw Glowing HUD Background
          const padding = 20;
          const hudWidth = 220;
          const hudHeight = 40 + (frameData.length * 25);
          const x = canvas.width - hudWidth - padding;
          const y = padding;

          ctx.save();
          
          // Outer glow
          ctx.shadowColor = '#00eefc';
          ctx.shadowBlur = 15;
          ctx.fillStyle = 'rgba(10, 11, 16, 0.7)';
          ctx.beginPath();
          ctx.roundRect(x, y, hudWidth, hudHeight, 8);
          ctx.fill();

          // Inner border
          ctx.shadowBlur = 0;
          ctx.strokeStyle = 'rgba(0, 238, 252, 0.5)';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Title
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px "Courier New", Courier, monospace';
          ctx.fillText(`FRAME: ${currentFrame}`, x + 15, y + 25);

          // Divider
          ctx.beginPath();
          ctx.moveTo(x + 10, y + 35);
          ctx.lineTo(x + hudWidth - 10, y + 35);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.stroke();

          // Draw Data Points
          frameData.forEach((data, index) => {
            const textY = y + 55 + (index * 25);
            
            // Joint Name
            ctx.fillStyle = '#8e90a2';
            ctx.font = '11px "Courier New", Courier, monospace';
            ctx.fillText(data.joint_name.toUpperCase(), x + 15, textY);

            // Angle Value with glowing cyan
            ctx.fillStyle = '#00eefc';
            ctx.shadowColor = '#00eefc';
            ctx.shadowBlur = 10;
            ctx.font = 'bold 13px "Courier New", Courier, monospace';
            ctx.fillText(`${data.angle.toFixed(1)}°`, x + hudWidth - 60, textY);
            
            // Reset shadow for next iteration
            ctx.shadowBlur = 0;
          });

          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    // Start loop
    renderLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      video.removeEventListener('loadedmetadata', resizeCanvas);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [telemetryData]);

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-neutral-700 bg-black shadow-2xl">
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        className="block w-full"
        crossOrigin="anonymous"
      >
        Your browser does not support the video tag.
      </video>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
    </div>
  );
}
