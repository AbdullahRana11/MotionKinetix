'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import { useAuthStore } from '@/store/useAuthStore';

const appLinks = [
  { label: 'DASHBOARD', href: '/dashboard' },
  { label: 'UPLOAD', href: '/dashboard/upload' },
];

export default function TopNav() {
  const router = useRouter();
  const clearToken = useAuthStore((state) => state.clearToken);

  const handleLogout = () => {
    clearToken();
    router.replace('/auth');
  };

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-5 sm:px-6"
    >
      <nav
        aria-label="Application"
        className="glass-liquid mx-auto flex w-full max-w-4xl items-center justify-between gap-4 rounded-full px-4 py-2.5 sm:px-6"
      >
        <Link href="/dashboard" className="shrink-0">
          <span className="text-sm font-black tracking-hero text-primary-500 text-crisp">
            APEX
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {appLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-full px-3 py-2 text-[10px] font-semibold tracking-[0.18em] text-white/55 text-crisp transition-colors hover:bg-white/5 hover:text-white sm:px-4 sm:text-xs"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="shrink-0 rounded-full px-3 py-2 text-[10px] font-semibold tracking-[0.18em] text-error/80 text-crisp transition-colors hover:bg-error/10 hover:text-error sm:px-4 sm:text-xs"
        >
          LOGOUT
        </button>
      </nav>
    </motion.header>
  );
}
