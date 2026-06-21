import { type ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-neutral-900">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 to-neutral-900" />
      <div className="relative z-10 w-full max-w-md px-6">{children}</div>
    </main>
  );
}
