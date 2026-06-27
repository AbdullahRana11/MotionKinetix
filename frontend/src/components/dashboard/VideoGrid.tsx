'use client';

import Link from 'next/link';

import { Card } from '@/components/ui/Card';

interface Video {
  id: string;
  filename: string;
  upload_date: string;
  status: string;
}

interface VideoGridProps {
  videos: Video[];
}

export default function VideoGrid({ videos }: VideoGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {videos.map((video) => {
        const isCompleted = video.status.toLowerCase() === 'completed';

        const card = (
          <Card className={`h-full ${!isCompleted ? 'opacity-75' : ''}`}>
            <h2
              className="mb-2 truncate text-lg font-semibold text-crisp"
              title={video.filename}
            >
              {video.filename}
            </h2>
            <p className="text-sm text-white/50 text-crisp">
              Uploaded: {new Date(video.upload_date).toLocaleDateString()}
            </p>
            <div className="mt-4">
              <span
                className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${
                  isCompleted
                    ? 'border-success/30 bg-success/10 text-success'
                    : 'border-warning/30 bg-warning/10 text-warning'
                }`}
              >
                {video.status}
              </span>
            </div>
          </Card>
        );

        if (isCompleted) {
          return (
            <Link key={video.id} href={`/analysis/${video.id}`} className="block h-full">
              {card}
            </Link>
          );
        }

        return <div key={video.id}>{card}</div>;
      })}
    </div>
  );
}
