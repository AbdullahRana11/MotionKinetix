'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useParams } from 'next/navigation';

export default function AnalysisPage() {
  const params = useParams();
  const id = params.id as string;
  const token = useAuthStore((state) => state.token);

  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!token) {
        setError('Not authenticated');
        setIsLoading(false);
        return;
      }
      if (!id) return;

      try {
        const res = await fetch(`http://localhost:8000/api/analysis/${id}`, {
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
    return <div style={{ color: 'white', padding: '2rem' }}>Loading analysis data...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', padding: '2rem' }}>Error: {error}</div>;
  }

  if (!data) {
    return <div style={{ color: 'white', padding: '2rem' }}>No data found.</div>;
  }

  return (
    <div style={{ backgroundColor: '#111', color: 'white', minHeight: '100vh', padding: '2rem' }}>
      <h1>Analysis ID: {id}</h1>

      {/* Videos Section */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', marginTop: '2rem' }}>
        <div style={{ flex: 1 }}>
          <h2>Reference (Pro) Video</h2>
          <video 
            controls 
            style={{ width: '100%', border: '2px solid #555' }}
            src={data.reference_video_url || ''} 
          >
            Your browser does not support the video tag.
          </video>
        </div>
        <div style={{ flex: 1 }}>
          <h2>User Video</h2>
          <video 
            controls 
            style={{ width: '100%', border: '2px solid #555' }}
            src={data.user_video_url || ''} 
          >
            Your browser does not support the video tag.
          </video>
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
        <h2>Joint Angles (Telemetry)</h2>
        {data.joint_angles && data.joint_angles.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #444' }}>
            <thead>
              <tr style={{ backgroundColor: '#222' }}>
                <th style={{ border: '1px solid #444', padding: '8px' }}>Frame</th>
                <th style={{ border: '1px solid #444', padding: '8px' }}>Joint</th>
                <th style={{ border: '1px solid #444', padding: '8px' }}>Angle (Degrees)</th>
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
        ) : (
          <p>No joint angle data available.</p>
        )}
      </div>

      {/* Raw JSON Dump */}
      <div>
        <h2>Raw Telemetry JSON</h2>
        <pre style={{ backgroundColor: '#000', padding: '1rem', overflowX: 'auto', border: '1px solid #333' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>

    </div>
  );
}
