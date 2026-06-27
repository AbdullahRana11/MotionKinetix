'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingState } from '@/components/ui/LoadingState';
import { useAuthStore } from '@/store/useAuthStore';

export default function UploadVideoPage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const validTypes = ['video/mp4', 'video/quicktime'];
    if (!validTypes.includes(selected.type)) {
      setError('Invalid format. MP4/MOV only.');
      setFile(null);
      return;
    }

    setFile(selected);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a video file first.');
      return;
    }
    if (!token) {
      setError('You must be logged in to upload videos.');
      return;
    }

    setIsUploading(true);
    setError(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${apiUrl}/api/v1/videos/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.detail || 'Failed to upload video');
      }

      router.push('/dashboard');
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Upload interrupted. Check connection.',
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="text-xs font-medium uppercase tracking-widest text-white/50 text-crisp transition-colors hover:text-white"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <Card>
        <h1 className="mb-2 text-2xl font-black tracking-hero text-hero-crisp">
          Upload Video
        </h1>
        <p className="mb-8 text-sm text-white/60 text-crisp">
          Ingest raw athletic footage for biomechanics processing.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium uppercase tracking-widest text-white/60 text-crisp">
              Select Video File
            </label>
            <input
              type="file"
              accept="video/mp4,video/quicktime"
              onChange={handleFileChange}
              disabled={isUploading}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white shadow-input-inner backdrop-blur-sm file:mr-4 file:rounded-lg file:border-0 file:bg-primary-500/20 file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-widest file:text-primary-400 hover:file:bg-primary-500/30 disabled:opacity-50"
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-error text-crisp" role="alert">
              {error}
            </p>
          )}

          {isUploading ? (
            <LoadingState message="Uploading..." />
          ) : (
            <Button type="submit" disabled={!file} className="w-full">
              Initialize Upload
            </Button>
          )}
        </form>
      </Card>
    </div>
  );
}
