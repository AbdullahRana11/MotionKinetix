'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const leftLinks = [
  { label: 'ABOUT', href: '#about' },
  { label: 'PLATFORM', href: '#platform' },
  { label: 'SCIENCE', href: '#science' },
];

const rightLinks = [
  { label: 'HISTORY', href: '#history' },
  { label: 'METRICS', href: '#metrics' },
  { label: 'ACCESS', href: '/auth', accent: true },
];

function NavLink({
  label,
  href,
  accent,
}: {
  label: string;
  href: string;
  accent?: boolean;
}) {
  const isExternalRoute = href.startsWith('/');

  const className = `whitespace-nowrap rounded-full px-3 py-2 text-[10px] font-semibold tracking-[0.18em] transition-all duration-300 sm:px-4 sm:text-xs ${
    accent
      ? 'text-primary-400 text-crisp hover:bg-primary-500/10 hover:text-primary-400'
      : 'text-white/55 text-crisp hover:bg-white/5 hover:text-white'
  }`;

  if (isExternalRoute) {
    return (
      <Link href={href} className={className}>
        {label}
      </Link>
    );
  }

  return (
    <a href={href} className={className}>
      {label}
    </a>
  );
}

export default function LandingNav() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-5 sm:px-6"
    >
      <nav
        aria-label="Primary"
        className="glass-liquid mx-auto flex w-full max-w-6xl items-center justify-between gap-2 rounded-2xl px-3 py-2 sm:gap-4 sm:rounded-full sm:px-5 sm:py-2.5"
      >
        <div className="flex min-w-0 flex-1 items-center justify-end gap-0.5 sm:justify-end sm:gap-1">
          {leftLinks.map((link) => (
            <NavLink key={link.label} {...link} />
          ))}
        </div>

        <Link
          href="/"
          className="flex shrink-0 flex-col items-center px-2 sm:px-4"
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-primary-400/80 text-crisp sm:text-xs">
            Apex
          </span>
          <span className="text-sm font-black tracking-hero text-hero-crisp sm:text-base">
            KINEMATICS
          </span>
        </Link>

        <div className="flex min-w-0 flex-1 items-center justify-start gap-0.5 sm:justify-start sm:gap-1">
          {rightLinks.map((link) => (
            <NavLink key={link.label} {...link} />
          ))}
        </div>
      </nav>
    </motion.header>
  );
}
