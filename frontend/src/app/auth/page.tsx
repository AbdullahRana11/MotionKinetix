'use client';

import React from 'react';
import { motion } from 'framer-motion';

import AuthLayout from '@/components/layout/AuthLayout';
import AuthForm from '@/components/auth/AuthForm';

export default function AuthPage() {
  return (
    <AuthLayout>
      {/* 
        Flexbox utility classes guarantee the form is perfectly centered 
        within the layout's constrained max-w-md container.
      */}
      <div className="flex h-full w-full flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full"
        >
          <AuthForm />
        </motion.div>
      </div>
    </AuthLayout>
  );
}
