'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

import { Button } from '@/components/ui/Button';

export default function GlassHero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="glass-liquid relative mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border-cyan-500/15 bg-gradient-to-br from-black/30 via-white/[0.04] to-amber-500/[0.03] px-8 py-16 text-center md:px-16 md:py-24"
    >
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-tr from-cyan-500/10 via-transparent to-amber-500/5 opacity-70" />
      <div className="pointer-events-none absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative mb-6 text-xs font-medium uppercase tracking-[0.3em] text-primary-400 text-crisp"
      >
        Elite Biomechanics Intelligence
      </motion.p>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.35, ease: 'easeOut' }}
        className="relative text-4xl font-black tracking-hero text-hero-crisp md:text-6xl lg:text-7xl"
      >
        OPTIMIZE. ANALYZE. EXCEL.
      </motion.h1>

      <motion.p
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
        className="relative mx-auto mt-6 max-w-2xl text-sm font-light leading-relaxed tracking-wide text-white/75 text-crisp md:text-lg"
      >
        Harness kinetic energy trails of data — skeletal canvas telemetry, DTW
        scoring, and frame-precise joint angles for athletes who refuse to guess.
      </motion.p>

      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.65, ease: 'easeOut' }}
        className="relative mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
      >
        <Link href="/auth">
          <Button>INITIALIZE SYSTEM</Button>
        </Link>
        <a href="#platform">
          <Button variant="glass">EXPLORE PLATFORM</Button>
        </a>
      </motion.div>
    </motion.section>
  );
}
