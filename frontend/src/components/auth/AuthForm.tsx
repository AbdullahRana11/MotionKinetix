'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { LoadingState } from '@/components/ui/LoadingState';
import { useAuthStore } from '@/store/useAuthStore';

export default function AuthForm() {
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const res = await fetch(`${apiUrl}/api/v1/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError('Invalid credentials. Access denied.');
          return;
        }
        throw new Error('system');
      }

      const data = await res.json();

      if (data.access_token) {
        setToken(data.access_token);
        router.push('/dashboard');
      } else {
        setError('Invalid credentials. Access denied.');
      }
    } catch {
      setError('Telemetry link severed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fieldError = error?.includes('Invalid credentials')
    ? error
    : undefined;

  return (
    <Card className="shadow-glass">
      <div className="mb-8 text-center">
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-neutral-400">
          Secure Access Portal
        </p>
        <h1 className="text-2xl font-black uppercase tracking-hero text-neutral-50">
          The Gateway
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Initialize your biomechanics session
        </p>
      </div>

      {error && !fieldError && (
        <p className="mb-6 text-center text-xs text-error" role="alert">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Input
          label="Secure Email"
          type="email"
          placeholder="agent@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldError}
          disabled={isLoading}
          required
        />

        <Input
          label="Secure Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldError}
          disabled={isLoading}
          required
        />

        <div className="mt-2 flex flex-col items-center gap-4">
          {isLoading ? (
            <LoadingState message="Authenticating..." />
          ) : (
            <Button type="submit" className="w-full">
              INITIALIZE SYSTEM
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
