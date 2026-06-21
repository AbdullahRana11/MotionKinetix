'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <AuthForm />
      </motion.div>
    </AuthLayout>
  );
}
