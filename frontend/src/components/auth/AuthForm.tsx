'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

type AuthMode = 'login' | 'register';

export default function AuthForm() {
  const router = useRouter();
  const loginAction = useAuthStore((state) => state.login);

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'register') {
        const res = await fetch('http://localhost:8000/api/v1/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.detail || 'Registration failed');
        }
        
        // Auto-login after register, or prompt to login
        // For simplicity, we'll just switch to login mode with prefilled email
        setMode('login');
        setError('Registration successful. Please log in.');
      } else {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        const res = await fetch('http://localhost:8000/api/v1/auth/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString(),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.detail || 'Login failed');
        }

        const data = await res.json();
        if (data.access_token) {
          loginAction(data.access_token);
          router.push('/dashboard');
        } else {
          throw new Error('No token received');
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header / Mode Toggle */}
      <div className="mb-10 text-center">
        <p className="mb-2 font-mono text-xs font-bold tracking-[0.1em] text-[#8e90a2] uppercase">
          Premium Type
        </p>
        <h2 className="mb-1 text-3xl font-bold tracking-tight text-white uppercase" style={{ fontFamily: '"Geist Mono", "Space Grotesk", monospace' }}>
          The Gateway
        </h2>
        <p className="mb-8 font-mono text-xs font-semibold tracking-widest text-[#c4c5d9] uppercase">
          Secure Access Portal<br />
          Initialize System
        </p>

        {/* Toggle Buttons */}
        <div className="mx-auto flex max-w-[240px] items-center justify-between border-b border-white/10 pb-2">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 text-center font-mono text-sm font-bold tracking-wider uppercase transition-colors ${
              mode === 'login' ? 'text-white' : 'text-[#8e90a2] hover:text-[#c4c5d9]'
            }`}
          >
            Login
          </button>
          <div className="h-4 w-px bg-white/10" />
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 text-center font-mono text-sm font-bold tracking-wider uppercase transition-colors ${
              mode === 'register' ? 'text-white' : 'text-[#8e90a2] hover:text-[#c4c5d9]'
            }`}
          >
            Register
          </button>
        </div>
      </div>

      {error && (
        <div className={`mb-6 text-center font-mono text-xs font-semibold ${error.includes('successful') ? 'text-[#00eefc]' : 'text-red-500'}`}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Email Field */}
        <div className="group relative flex flex-col">
          <label className="mb-2 font-mono text-[11px] font-bold tracking-[0.1em] text-[#e3e1e9] uppercase">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            required
            className="w-full border-b border-neutral-700 bg-transparent py-2 font-mono text-sm text-white placeholder-white/30 outline-none transition-all focus:border-[#2E5BFF]"
          />
          {/* Subtle glow on focus (optional but fits the theme) */}
          <div className="absolute bottom-0 left-0 h-[1px] w-full bg-[#2E5BFF] opacity-0 shadow-[0_0_8px_rgba(46,91,255,0.8)] transition-opacity duration-300 group-focus-within:opacity-100" />
        </div>

        {/* Password Field */}
        <div className="group relative flex flex-col">
          <label className="mb-2 font-mono text-[11px] font-bold tracking-[0.1em] text-[#e3e1e9] uppercase">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full border-b border-neutral-700 bg-transparent py-2 font-mono text-sm text-white placeholder-white/30 outline-none transition-all focus:border-[#2E5BFF]"
          />
          {/* Subtle glow on focus */}
          <div className="absolute bottom-0 left-0 h-[1px] w-full bg-[#2E5BFF] opacity-0 shadow-[0_0_8px_rgba(46,91,255,0.8)] transition-opacity duration-300 group-focus-within:opacity-100" />
        </div>

        {/* Submit Button (Matching HeroSection 'Initialize System' aesthetic) */}
        <div className="mt-4 flex flex-col items-center gap-4">
          <button
            type="submit"
            className="group relative w-full overflow-hidden bg-gradient-to-br from-[#121318] to-[#1E1F25] px-10 py-4 font-mono text-sm font-bold tracking-widest text-[#E3E1E9] uppercase transition-all hover:text-white"
            style={{
              borderRadius: '0px',
              boxShadow: '0 0 20px rgba(0, 238, 252, 0.15)',
              fontFamily: '"Geist Mono", monospace',
            }}
          >
            {/* Metallic inner sheen & 1px border */}
            <div className="absolute inset-0 border border-white/20 transition-all group-hover:border-[#00eefc]/50" />
            
            {/* Cyan diffuse glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00eefc]/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            
            <span className="relative z-10">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </span>
          </button>
          
          {mode === 'login' && (
            <button type="button" className="text-xs text-[#8e90a2] hover:text-white transition-colors underline-offset-4 hover:underline">
              Forgot Password?
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
