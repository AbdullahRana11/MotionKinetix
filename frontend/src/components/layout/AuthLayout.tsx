import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen w-full bg-[#0A0B10]">
      {/* 
        Left Column — 40% on desktop, full-width on mobile.
        Pure glassmorphism container that wraps injected auth forms.
      */}
      <div className="relative z-10 flex w-full flex-col items-center justify-center border-r border-white/5 bg-black/40 px-6 py-12 backdrop-blur-2xl md:w-[40%]">
        {/* Subtle top-edge light simulation (Stitch Level 3 inner glow) */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Content wrapper — constrains children to a comfortable reading width */}
        <div className="w-full max-w-md">
          {children}
        </div>

        {/* Bottom version stamp */}
        <p
          className="absolute bottom-6 left-6 text-[11px] font-bold uppercase tracking-[0.1em] text-white/20"
          style={{ fontFamily: '"Geist Mono", monospace' }}
        >
          v2.1 System Security Protokoll
        </p>
      </div>

      {/* 
        Right Column — 60% on desktop, hidden on mobile.
        Cinematic background panel with inner shadow blending.
      */}
      <div className="relative hidden md:block md:w-[60%]">
        {/* Background image layer */}
        <div className="absolute inset-0 bg-[url('/backgrounds/auth-bg.jpg')] bg-cover bg-center" />

        {/* Inner shadow overlay — blends the image into the Midnight Titanium theme */}
        <div className="absolute inset-0 shadow-[inset_60px_0_80px_-20px_rgba(10,11,16,0.95),inset_0_60px_80px_-20px_rgba(10,11,16,0.4),inset_0_-60px_80px_-20px_rgba(10,11,16,0.6)]" />

        {/* Subtle vignette for cinematic depth */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#0A0B10]/30" />
      </div>
    </div>
  );
}
