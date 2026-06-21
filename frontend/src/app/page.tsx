'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-neutral-900">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 to-neutral-900" />

      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="absolute top-8 z-50 flex items-center justify-between gap-8 rounded-full border border-neutral-700/50 bg-neutral-800/30 px-8 py-4 shadow-glass backdrop-blur-md"
      >
        <Link href="#" className="text-xs font-medium tracking-widest text-neutral-400 transition-colors duration-300 hover:text-neutral-50">
          THE PLATFORM
        </Link>
        <Link href="#" className="text-xs font-medium tracking-widest text-neutral-400 transition-colors duration-300 hover:text-neutral-50">
          SCIENCE
        </Link>
        <div className="px-4 text-lg font-black tracking-hero text-primary-500">
          APEX
        </div>
        <Link href="#" className="text-xs font-medium tracking-widest text-neutral-400 transition-colors duration-300 hover:text-neutral-50">
          CASE STUDIES
        </Link>
        <Link
          href="/auth"
          className="text-xs font-medium tracking-widest text-success transition-colors duration-300 hover:text-neutral-50"
        >
          SECURE ACCESS
        </Link>
      </motion.nav>

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-5xl font-black tracking-hero text-transparent md:text-7xl lg:text-8xl"
        >
          OPTIMIZE. ANALYZE. EXCEL.
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="mt-6 max-w-2xl text-sm font-light tracking-wide text-neutral-400 md:text-lg"
        >
          Unlock Elite Athletic Performance through Advanced Biomechanics AI.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
        >
          <Link href="/auth" className="mt-12 inline-block">
            <Button>INITIALIZE SYSTEM</Button>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
