'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
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

      try {
        const res = await fetch('http://localhost:8000/api/v1/videos', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch videos');
        }

        const data = await res.json();
        setVideos(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [token]);

  if (isLoading) {
    return <div className="p-8 text-white">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-900 p-8 text-white">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link 
          href="/dashboard/upload" 
          className="rounded bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-700"
        >
          Upload Video
        </Link>
      </div>

      {videos.length === 0 ? (
        <p className="text-neutral-400">No videos found. Upload one to get started.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {videos.map((video) => {
            const CardContent = (
              <div className="flex h-full flex-col justify-between rounded-lg border border-neutral-700 bg-neutral-800 p-6 shadow-sm transition-colors hover:border-neutral-500">
                <div>
                  <h2 className="mb-2 truncate text-lg font-semibold" title={video.filename}>
                    {video.filename}
                  </h2>
                  <p className="text-sm text-neutral-400">
                    Uploaded: {new Date(video.upload_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-4">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      video.status.toLowerCase() === 'completed'
                        ? 'bg-green-900/50 text-green-400'
                        : 'bg-yellow-900/50 text-yellow-400'
                    }`}
                  >
                    {video.status}
                  </span>
                </div>
              </div>
            );

            if (video.status.toLowerCase() === 'completed') {
              return (
                <Link key={video.id} href={`/analysis/${video.id}`} className="block h-full">
                  {CardContent}
                </Link>
              );
            }

            return (
              <div key={video.id} className="block h-full opacity-75">
                {CardContent}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
