import { type ReactNode } from 'react';

import BackgroundLayer from '@/components/layout/BackgroundLayer';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <BackgroundLayer background="auth" overlay="auth">
      <main className="flex min-h-screen items-center justify-center px-4 py-16 sm:px-6 lg:justify-end lg:pr-[8vw] xl:pr-[12vw]">
        <div
          className="w-full max-w-md"
          style={{ perspective: '1400px' }}
        >
          {children}
        </div>
      </main>
    </BackgroundLayer>
  );
}
