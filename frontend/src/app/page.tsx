"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0A0B10]">
      {/* Background Image Layer with Dark Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-[url('/backgrounds/landing-bg.jpg')] bg-cover bg-center bg-fixed opacity-60"
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 via-[#0A0B10]/80 to-[#0A0B10]" />

      {/* Floating Navigation Pill */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-8 z-50 flex items-center justify-between gap-8 rounded-full border border-white/10 bg-white/5 px-8 py-4 backdrop-blur-md"
      >
        <Link href="#" className="text-xs font-medium tracking-widest text-neutral-400 transition-colors hover:text-white">THE PLATFORM</Link>
        <Link href="#" className="text-xs font-medium tracking-widest text-neutral-400 transition-colors hover:text-white">SCIENCE</Link>
        <div className="px-4 text-lg font-bold tracking-widest text-white">SB AI</div>
        <Link href="#" className="text-xs font-medium tracking-widest text-neutral-400 transition-colors hover:text-white">CASE STUDIES</Link>
        <Link href="/auth" className="text-xs font-medium tracking-widest text-[#00FF80] transition-colors hover:text-white drop-shadow-[0_0_8px_rgba(0,255,128,0.5)]">SECURE ACCESS</Link>
      </motion.nav>

      {/* Cinematic Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.h1 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-5xl font-black tracking-[0.2em] text-transparent md:text-7xl lg:text-8xl"
        >
          OPTIMIZE. ANALYZE. EXCEL.
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-6 max-w-2xl text-sm font-light tracking-wide text-neutral-400 md:text-lg"
        >
          Unlock Elite Athletic Performance through Advanced Biomechanics AI.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <Link href="/auth">
            <button className="group mt-12 rounded-lg border border-neutral-700 bg-black/80 px-10 py-4 text-sm font-semibold tracking-widest text-white shadow-[0_0_30px_-5px_rgba(0,255,128,0.2)] backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-neutral-500 hover:shadow-[0_0_40px_-5px_rgba(0,255,128,0.4)]">
              INITIALIZE SYSTEM
            </button>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}