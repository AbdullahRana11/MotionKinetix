'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useParams } from 'next/navigation';
import SkeletalPlayer from '@/components/analysis/SkeletalPlayer';

export default function AnalysisPage() {
  const params = useParams();
  const id = params.id as string;
  const token = useAuthStore((state) => state.token);

  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getVideoUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `http://localhost:8000/${cleanPath}`;
  };

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!token) {
        setError('Not authenticated');
        setIsLoading(false);
        return;
      }
      if (!id) return;

      try {
        const res = await fetch(`http://localhost:8000/api/v1/analysis/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch analysis data');
        }

        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [id, token]);

  if (isLoading) {
    return <div style={{ color: 'white', padding: '2rem', backgroundColor: '#111', minHeight: '100vh' }}>Loading analysis data...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', padding: '2rem', backgroundColor: '#111', minHeight: '100vh' }}>Error: {error}</div>;
  }

  if (!data) {
    return <div style={{ color: 'white', padding: '2rem', backgroundColor: '#111', minHeight: '100vh' }}>No data found.</div>;
  }

  return (
    <div style={{ backgroundColor: '#111', color: 'white', minHeight: '100vh', padding: '2rem' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Analysis: {id}</h1>
      <p style={{ color: '#8e90a2', fontSize: '0.875rem', marginBottom: '2rem' }}>
        {data.skeleton_frames?.length || 0} frames processed &bull; {data.video_fps || 30} FPS
      </p>

      {/* Videos Section */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem' }}>
        <div style={{ flex: 1 }}>
          <h2>Reference (Pro) Video</h2>
          <video 
            controls 
            style={{ width: '100%', borderRadius: '8px', border: '1px solid #333', marginTop: '0.5rem' }}
            src={getVideoUrl(data.reference_video_url)} 
          >
            Your browser does not support the video tag.
          </video>
        </div>
        
        <div style={{ flex: 1 }}>
          <h2>User Video — Skeleton Overlay</h2>
          <div style={{ marginTop: '0.5rem' }}>
            <SkeletalPlayer 
              videoUrl={getVideoUrl(data.user_video_url)} 
              skeletonFrames={data.skeleton_frames || []}
              fps={data.video_fps || 30}
            />
          </div>
        </div>
      </div>

      {/* DTW Score */}
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h2>DTW Similarity Score</h2>
        <div style={{ fontSize: '6rem', fontWeight: 'bold', color: '#00eefc' }}>
          {data.dtw_similarity_score !== undefined ? data.dtw_similarity_score : 'N/A'}
        </div>
      </div>

      {/* Joint Angles Data Table */}
      <div style={{ marginBottom: '3rem' }}>
        <h2>Telemetry Data (Per Frame)</h2>
        {data.joint_angles && data.joint_angles.length > 0 ? (
          <div style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #444' }}>
              <thead>
                <tr style={{ backgroundColor: '#222', position: 'sticky', top: 0 }}>
                  <th style={{ border: '1px solid #444', padding: '8px' }}>Frame</th>
                  <th style={{ border: '1px solid #444', padding: '8px' }}>Metric</th>
                  <th style={{ border: '1px solid #444', padding: '8px' }}>Value</th>
                </tr>
              </thead>
              <tbody>
                {data.joint_angles.map((row: any, idx: number) => (
                  <tr key={idx}>
                    <td style={{ border: '1px solid #444', padding: '8px', textAlign: 'center' }}>{row.frame}</td>
                    <td style={{ border: '1px solid #444', padding: '8px', textAlign: 'center' }}>{row.joint_name}</td>
                    <td style={{ border: '1px solid #444', padding: '8px', textAlign: 'center' }}>{row.angle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No telemetry data available. Video may still be processing.</p>
        )}
      </div>

      {/* Raw JSON Dump */}
      <div>
        <h2>Raw API Response</h2>
        <pre style={{ backgroundColor: '#000', padding: '1rem', overflowX: 'auto', border: '1px solid #333', maxHeight: '300px', overflowY: 'auto' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}