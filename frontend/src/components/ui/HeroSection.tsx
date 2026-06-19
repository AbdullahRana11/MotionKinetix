'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  // Midnight Titanium spring physics constraints
  const springTransition = {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: springTransition,
    },
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A0B10] bg-[url('/backgrounds/landing-bg.jpg')] bg-cover bg-center bg-fixed">
      {/* Dimming overlay to ensure text legibility against the complex background */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      <motion.div
        className="relative z-10 flex flex-col items-center justify-center px-4 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Massive Center-Aligned Typography */}
        <motion.h1
          variants={childVariants}
          className="max-w-5xl text-5xl font-bold uppercase tracking-[-0.04em] text-white sm:text-6xl md:text-7xl lg:text-8xl"
          style={{ fontFamily: '"Geist Mono", "Space Grotesk", monospace' }}
        >
          Kinematic Engine Live
        </motion.h1>

        {/* Secondary Subtitle */}
        <motion.p
          variants={childVariants}
          className="mt-6 max-w-2xl text-lg font-light tracking-wide text-[#E3E1E9] sm:text-xl md:text-2xl"
          style={{ fontFamily: '"Inter", "Manrope", sans-serif' }}
        >
          Unlock Elite Athletic Performance through Advanced Biomechanics AI.
        </motion.p>

        {/* Primary Glowing Call-to-Action Button */}
        <motion.div variants={childVariants} className="mt-12">
          <button
            className="group relative overflow-hidden bg-gradient-to-br from-[#121318] to-[#1E1F25] px-10 py-4 font-mono text-sm font-bold tracking-widest text-[#E3E1E9] uppercase transition-all hover:text-white"
            style={{
              borderRadius: '0px',
              boxShadow: '0 0 20px rgba(0, 238, 252, 0.15)',
              fontFamily: '"Geist Mono", monospace',
            }}
          >
            {/* Metallic inner sheen & 1px border */}
            <div className="absolute inset-0 border border-white/20 transition-all group-hover:border-[#00eefc]/50" />
            
            {/* Cyan diffuse glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00eefc]/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            
            <span className="relative z-10">Initialize System</span>
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
