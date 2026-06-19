import React from 'react';

export default function TopNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      {/* Floating glassmorphic container */}
      <div className="mx-auto flex max-w-7xl items-center justify-between border border-white/10 bg-black/20 px-6 py-3 backdrop-blur-md">
        
        {/* Left Side: Brand */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold tracking-[0.1em] text-gray-300 uppercase">
            Apex Kinematics
          </span>
        </div>

        {/* Right Side: Links & CTA */}
        <div className="flex items-center gap-8">
          <a
            href="#science"
            className="font-mono text-xs font-semibold tracking-widest text-gray-400 transition-colors hover:text-white uppercase"
          >
            The Science
          </a>
          
          <button
            className="border border-white/10 bg-[#2E5BFF]/90 px-6 py-2 font-mono text-xs font-bold tracking-widest text-white transition-all hover:bg-[#2E5BFF] hover:shadow-[0_0_15px_rgba(46,91,255,0.4)] uppercase"
            style={{ borderRadius: '0px' }} // Sharp edges dictated by Stitch
          >
            Secure Access
          </button>
        </div>
      </div>
    </nav>
  );
}
