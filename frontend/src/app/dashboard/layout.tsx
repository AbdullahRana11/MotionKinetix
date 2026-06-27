'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import BackgroundLayer from '@/components/layout/BackgroundLayer';
import TopNav from '@/components/ui/TopNav';
import { useAuthStore } from '@/store/useAuthStore';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token) {
      router.replace('/auth');
    }
  }, [token, router]);

  if (!token) {
    return null;
  }

  return (
    <BackgroundLayer background="lab" overlay="lab">
      <TopNav />
      <div className="relative mx-auto min-h-screen max-w-7xl px-4 pb-16 pt-28 md:px-8">
        {children}
      </div>
    </BackgroundLayer>
  );
}
