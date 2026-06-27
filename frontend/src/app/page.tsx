'use client';

import { motion } from 'framer-motion';

import GlassHero from '@/components/landing/GlassHero';
import BackgroundLayer from '@/components/layout/BackgroundLayer';
import TopNav from '@/components/ui/TopNav';

export default function Home() {
  return (
    <BackgroundLayer>
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
        <TopNav />
        <GlassHero />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 text-xs tracking-widest text-white/40 text-crisp"
        >
          APEX KINEMATICS — SPATIAL &amp; LIQUID GLASS UI
        </motion.div>
      </main>
    </BackgroundLayer>
  );
}
