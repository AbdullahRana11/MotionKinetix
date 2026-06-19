'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const leftLinks = [
  { label: 'THE PLATFORM', href: '#platform' },
  { label: 'SCIENCE', href: '#science' },
];

const rightLinks = [
  { label: 'CASE STUDIES', href: '#cases' },
  { label: 'CONTACT', href: '#contact' },
  { label: 'SECURE ACCESS', href: '/auth' },
];

export default function TopNav() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-4 pt-6 md:px-8"
      style={{ perspective: '1000px' }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-4">
        {/* LEFT SHARDS */}
        {leftLinks.map((link, i) => (
          <motion.a
            key={link.label}
            href={link.href}
            onHoverStart={() => setHoveredIndex(i)}
            onHoverEnd={() => setHoveredIndex(null)}
            initial={{ opacity: 0, rotateX: 45, y: -30 }}
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.8, type: 'spring', stiffness: 100 }}
            className="group relative hidden cursor-pointer md:block"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div
              className="relative flex items-center justify-center px-8 py-3 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-2"
              style={{
                clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)',
                background: 'linear-gradient(135deg, rgba(10,11,16,0.8) 0%, rgba(46,91,255,0.1) 100%)',
                backdropFilter: 'blur(24px)',
                boxShadow: hoveredIndex === i ? '0 0 30px rgba(0, 238, 252, 0.4)' : '0 0 10px rgba(0,0,0,0.5)',
              }}
            >
              {/* Inner glowing border */}
              <div className="pointer-events-none absolute inset-[1px] bg-gradient-to-r from-transparent via-[#2e5bff]/30 to-transparent opacity-50" style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)' }} />
              
              <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#e3e1e9] transition-colors group-hover:text-[#00eefc]">
                {link.label}
              </span>
            </div>
          </motion.a>
        ))}

        {/* CENTER CRYSTAL LOGO */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateZ: -5 }}
          animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
          transition={{ delay: 0.1, duration: 1, type: 'spring' }}
          className="group relative z-10 mx-4 cursor-pointer"
        >
          <div
            className="relative flex flex-col items-center justify-center px-10 py-5 transition-transform duration-700 ease-out group-hover:scale-105"
            style={{
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              background: 'linear-gradient(180deg, rgba(46,91,255,0.4) 0%, rgba(10,11,16,0.9) 100%)',
              backdropFilter: 'blur(30px)',
              boxShadow: '0 0 40px rgba(46,91,255,0.6), inset 0 0 20px rgba(0,238,252,0.3)',
            }}
          >
            <div className="absolute inset-[1px] bg-[#0A0B10]/40" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
            
            <div className="relative z-10 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center bg-[#2e5bff]/20 border border-[#00eefc]/50 shadow-[0_0_15px_rgba(0,238,252,0.5)]">
                <span className="font-mono text-sm font-black text-[#00eefc]">SB</span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-sm font-bold tracking-widest text-white">Sports</span>
                <span className="font-mono text-[10px] tracking-[0.1em] text-[#8e90a2]">Biomechanics AI</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT SHARDS */}
        {rightLinks.map((link, i) => (
          <motion.a
            key={link.label}
            href={link.href}
            onHoverStart={() => setHoveredIndex(i + 3)}
            onHoverEnd={() => setHoveredIndex(null)}
            initial={{ opacity: 0, rotateX: 45, y: -30 }}
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1, duration: 0.8, type: 'spring', stiffness: 100 }}
            className="group relative hidden cursor-pointer md:block"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div
              className="relative flex items-center justify-center px-8 py-3 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-2"
              style={{
                clipPath: 'polygon(0 0, 90% 0, 100% 100%, 10% 100%)',
                background: 'linear-gradient(135deg, rgba(10,11,16,0.8) 0%, rgba(46,91,255,0.1) 100%)',
                backdropFilter: 'blur(24px)',
                boxShadow: hoveredIndex === i + 3 ? '0 0 30px rgba(0, 238, 252, 0.4)' : '0 0 10px rgba(0,0,0,0.5)',
              }}
            >
              <div className="pointer-events-none absolute inset-[1px] bg-gradient-to-l from-transparent via-[#2e5bff]/30 to-transparent opacity-50" style={{ clipPath: 'polygon(0 0, 90% 0, 100% 100%, 10% 100%)' }} />
              
              <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#e3e1e9] transition-colors group-hover:text-[#00eefc]">
                {link.label}
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </motion.nav>
  );
}
