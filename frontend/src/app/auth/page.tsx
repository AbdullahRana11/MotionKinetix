'use client';

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
      <AuthForm />
    </AuthLayout>
  );
}
