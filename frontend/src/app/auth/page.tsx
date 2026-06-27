'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import AuthForm from '@/components/auth/AuthForm';
import AuthLayout from '@/components/layout/AuthLayout';
import { useAuthStore } from '@/store/useAuthStore';

export default function AuthPage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (token) {
      router.replace('/dashboard');
    }
  }, [token, router]);

  if (token) {
    return null;
  }

  return (
    <AuthLayout>
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.25em] text-white/40 text-crisp transition-colors hover:text-white"
      >
        ← Return to Apex Kinematics
      </Link>
      <AuthForm />
    </AuthLayout>
  );
}
