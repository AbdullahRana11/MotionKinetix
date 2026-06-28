'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const leftLinks = [
  { label: 'About', href: '#about' },
  { label: 'Platform', href: '#platform' },
  { label: 'Science', href: '#science' },
];

const rightLinks = [
  { label: 'History', href: '#history' },
  { label: 'Metrics', href: '#metrics' },
  { label: 'Access', href: '/auth', accent: true },
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
  const className = accent ? 'nav-link-elite nav-link-elite-accent' : 'nav-link-elite';

  if (href.startsWith('/')) {
    return (
      <Link href={href} className={`${className} px-3 py-2 sm:px-4`}>
        {label}
      </Link>
    );
  }

  return (
    <a href={href} className={`${className} px-3 py-2 sm:px-4`}>
      {label}
    </a>
  );
}

export default function LandingNav() {
  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-6 sm:px-6"
    >
      <nav
        aria-label="Primary"
        className="glass-landing mx-auto flex w-full max-w-5xl items-center justify-between gap-2 rounded-xl px-5 py-3.5 sm:gap-4 sm:px-8 sm:py-4"
      >
        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-4 md:gap-6">
          {leftLinks.map((link) => (
            <NavLink key={link.label} {...link} />
          ))}
        </div>

        <Link
          href="/"
          className="flex shrink-0 flex-col items-center border-x border-white/[0.08] px-5 transition-colors duration-300 hover:border-white/[0.14] sm:px-8"
        >
          <span className="font-sans text-[10px] font-medium uppercase text-ice/60" style={{ letterSpacing: '0.22em' }}>
            Apex
          </span>
          <span className="font-display text-base font-bold uppercase leading-none tracking-tight text-zinc-100 sm:text-lg">
            Kinematics
          </span>
        </Link>

        <div className="flex min-w-0 flex-1 items-center justify-start gap-2 sm:gap-4 md:gap-6">
          {rightLinks.map((link) => (
            <NavLink key={link.label} {...link} />
          ))}
        </div>
      </nav>
    </motion.header>
  );
}
