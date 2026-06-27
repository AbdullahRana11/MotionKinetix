'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import VideoGrid from '@/components/dashboard/VideoGrid';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingState } from '@/components/ui/LoadingState';
import { useAuthStore } from '@/store/useAuthStore';

interface Video {
  id: string;
  filename: string;
  upload_date: string;
  status: string;
}

export default function DashboardPage() {
  const token = useAuthStore((state) => state.token);
  const [videos, setVideos] = useState<Video[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      if (!token) {
        setError('Not authenticated');
        setIsLoading(false);
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

      try {
        const res = await fetch(`${apiUrl}/api/v1/videos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch videos');
        }

        const data = await res.json();
        setVideos(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch videos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingState message="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-error/30">
        <p className="text-sm text-error text-crisp">Error: {error}</p>
      </Card>
    );
  }

  return (
    <div>
      <div className="glass-liquid mb-10 flex flex-col items-start justify-between gap-4 rounded-2xl p-6 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-white/50 text-crisp">
            Mission Control
          </p>
          <h1 className="mt-1 text-3xl font-black tracking-wide text-hero-crisp">
            Dashboard
          </h1>
        </div>
        <Link href="/dashboard/upload">
          <Button variant="glass">Upload Video</Button>
        </Link>
      </div>

      {videos.length === 0 ? (
        <Card>
          <p className="text-white/60 text-crisp">
            No videos found. Upload one to get started.
          </p>
        </Card>
      ) : (
        <VideoGrid videos={videos} />
      )}
    </div>
  );
}
