'use client';

import { motion } from 'framer-motion';

import LandingButton from '@/components/landing/LandingButton';

export default function GlassHero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="landing-panel mx-auto w-full max-w-5xl px-8 py-16 text-center md:px-14 md:py-20 lg:py-24"
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.8 }}
        className="landing-eyebrow relative"
      >
        Elite Biomechanics Intelligence
      </motion.p>

      <motion.h1
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="landing-hero-title relative mt-6"
      >
        Optimize.
        <br className="hidden sm:block" />
        Analyze. Excel.
      </motion.h1>

      <motion.p
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.58, ease: [0.22, 1, 0.36, 1] }}
        className="landing-body relative mx-auto mt-8 max-w-xl"
      >
        Skeletal canvas telemetry, DTW similarity scoring, and frame-precise
        joint angles — engineered for coaches and athletes who measure in
        milliseconds, not guesswork.
      </motion.p>

      <motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.72, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
      >
        <LandingButton href="/auth">Initialize System</LandingButton>
        <LandingButton href="#platform" variant="secondary">
          Explore Platform
        </LandingButton>
      </motion.div>
    </motion.section>
  );
}
