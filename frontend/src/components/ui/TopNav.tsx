'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const navLinks = [
  { label: 'THE PLATFORM', href: '#platform' },
  { label: 'SCIENCE', href: '#science' },
  { label: 'CASE STUDIES', href: '#cases' },
  { label: 'SECURE ACCESS', href: '/auth', accent: true },
];

export default function TopNav() {
  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="glass-liquid fixed left-1/2 top-6 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full px-2 py-2 md:gap-2 md:px-4"
    >
      {navLinks.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className={`rounded-full px-4 py-2 text-xs font-medium tracking-widest transition-colors duration-300 ${
            link.accent
              ? 'text-success text-crisp hover:text-white'
              : 'text-white/60 text-crisp hover:text-white'
          }`}
        >
          {link.label}
        </Link>
      ))}

      <div className="mx-2 hidden h-6 w-px bg-white/10 md:block" />

      <div className="px-3 text-sm font-black tracking-hero text-primary-500 text-crisp md:px-4 md:text-lg">
        APEX
      </div>
    </motion.nav>
  );
}
