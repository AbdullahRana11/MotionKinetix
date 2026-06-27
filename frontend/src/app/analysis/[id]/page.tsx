'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import TelemetryTable from '@/components/analysis/TelemetryTable';
import SkeletalPlayer, {
  type SkeletonFrameData,
} from '@/components/analysis/SkeletalPlayer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingState } from '@/components/ui/LoadingState';
import { useAuthStore } from '@/store/useAuthStore';

interface JointAngleRow {
  frame: number;
  joint_name: string;
  angle: number;
}

interface AnalysisData {
  reference_video_url: string;
  user_video_url: string;
  skeleton_frames: SkeletonFrameData[];
  video_fps: number;
  dtw_similarity_score?: number;
  joint_angles?: JointAngleRow[];
}

export default function AnalysisPage() {
  const params = useParams();
  const id = params.id as string;
  const token = useAuthStore((state) => state.token);

  const [data, setData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getVideoUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
    return `${apiUrl}/${cleanPath}`;
  };

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!token) {
        setError('Not authenticated');
        setIsLoading(false);
        return;
      }
      if (!id) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

      try {
        const res = await fetch(`${apiUrl}/api/v1/analysis/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 404) {
            setError('Telemetry data corrupted or missing.');
            return;
          }
          throw new Error('Failed to fetch analysis data');
        }

        const json = await res.json();
        setData(json);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch analysis data',
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [id, token]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingState message="Loading analysis..." />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <p className="mb-6 text-sm text-error text-crisp">{error}</p>
        <Link href="/dashboard">
          <Button variant="glass">Return to Dashboard</Button>
        </Link>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <p className="text-white/60 text-crisp">No data found.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="glass-liquid rounded-2xl p-6">
        <p className="text-xs font-medium uppercase tracking-widest text-white/50 text-crisp">
          Telemetry HUD
        </p>
        <h1 className="mt-1 text-3xl font-black tracking-wide text-hero-crisp">
          Analysis: {id}
        </h1>
        <p className="mt-2 text-sm text-white/60 text-crisp">
          {data.skeleton_frames?.length || 0} frames processed &bull;{' '}
          {data.video_fps || 30} FPS
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Reference (Pro) Video">
          <video
            controls
            className="mt-4 w-full overflow-hidden rounded-xl border border-white/10"
            src={getVideoUrl(data.reference_video_url)}
          >
            Your browser does not support the video tag.
          </video>
        </Card>

        <Card title="User Video — Skeleton Overlay">
          <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
            <SkeletalPlayer
              videoUrl={getVideoUrl(data.user_video_url)}
              skeletonFrames={data.skeleton_frames || []}
              fps={data.video_fps || 30}
            />
          </div>
        </Card>
      </div>

      <Card className="text-center">
        <h2 className="text-sm font-medium uppercase tracking-widest text-white/50 text-crisp">
          DTW Similarity Score
        </h2>
        <div className="mt-4 font-black tracking-hero text-primary-500 text-hero-crisp text-6xl md:text-8xl">
          {data.dtw_similarity_score !== undefined
            ? data.dtw_similarity_score
            : 'N/A'}
        </div>
      </Card>

      <Card title="Telemetry Data (Per Frame)">
        {data.joint_angles && data.joint_angles.length > 0 ? (
          <TelemetryTable rows={data.joint_angles} />
        ) : (
          <p className="mt-4 text-white/60 text-crisp">
            No telemetry data available. Video may still be processing.
          </p>
        )}
      </Card>

      <Card title="Raw API Response">
        <pre className="mt-4 max-h-[300px] overflow-auto rounded-xl border border-white/10 bg-black/30 p-4 font-mono text-xs text-white/70 backdrop-blur-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      </Card>
    </div>
  );
}
