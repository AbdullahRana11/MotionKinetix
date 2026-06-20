'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function UploadVideoPage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
    }
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

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Using the exact endpoint provided. If backend uses v1 routing, this might need updating to /api/v1/videos/upload
      const res = await fetch('http://localhost:8000/api/videos/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Note: Do NOT set Content-Type header manually when using FormData.
          // The browser will automatically set it to multipart/form-data with the correct boundary.
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.detail || 'Failed to upload video');
      }

      // On success, redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0B10] p-4 text-white">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
        <h1 className="mb-6 text-2xl font-bold tracking-wider">Upload Video</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-400">
              Select Video File
            </label>
            <input
              type="file"
              accept="video/mp4, video/quicktime"
              onChange={handleFileChange}
              disabled={isUploading}
              className="file:mr-4 file:rounded-md file:border-0 file:bg-[#2E5BFF] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#2E5BFF]/80 disabled:opacity-50"
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={isUploading || !file}
            className="mt-4 rounded-lg bg-[#2E5BFF] py-3 font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#2E5BFF]/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUploading ? 'Uploading...' : 'Upload Video'}
          </button>
        </form>
      </div>
    </div>
  );
}
