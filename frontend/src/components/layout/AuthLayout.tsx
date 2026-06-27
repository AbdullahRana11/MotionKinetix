import { type ReactNode } from 'react';

import BackgroundLayer from '@/components/layout/BackgroundLayer';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <BackgroundLayer overlay="dark">
      <main className="flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16">
        <div
          className="w-full max-w-md"
          style={{ perspective: '1200px' }}
        >
          {children}
        </div>
      </main>
    </BackgroundLayer>
  );
}
