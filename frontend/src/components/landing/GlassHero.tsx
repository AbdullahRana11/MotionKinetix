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
      className="glass-liquid relative mx-auto mt-24 w-full max-w-5xl rounded-3xl px-8 py-16 text-center md:px-16 md:py-24"
    >
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-white/10 via-transparent to-transparent opacity-50" />

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
        className="relative mx-auto mt-6 max-w-2xl text-sm font-light tracking-wide text-white/70 text-crisp md:text-lg"
      >
        Unlock elite athletic performance through advanced biomechanics AI,
        skeletal canvas telemetry, and DTW similarity scoring — refracted
        through liquid glass precision.
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
        <Link href="#platform">
          <Button variant="glass">EXPLORE PLATFORM</Button>
        </Link>
      </motion.div>
    </motion.section>
  );
}
