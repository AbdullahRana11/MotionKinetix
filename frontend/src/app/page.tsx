'use client';

import AboutSection from '@/components/landing/AboutSection';
import GlassHero from '@/components/landing/GlassHero';
import HistorySection from '@/components/landing/HistorySection';
import LandingNav from '@/components/landing/LandingNav';
import MetricsSection from '@/components/landing/MetricsSection';
import PlatformSection from '@/components/landing/PlatformSection';
import ScienceSection from '@/components/landing/ScienceSection';
import BackgroundLayer from '@/components/layout/BackgroundLayer';

export default function Home() {
  return (
    <BackgroundLayer background="landing" overlay="landing">
      <LandingNav />

      <main className="relative mx-auto max-w-6xl px-4 pb-12 pt-28 sm:px-6 md:pt-32">
        <GlassHero />
        <AboutSection />
        <PlatformSection />
        <ScienceSection />
        <HistorySection />
        <MetricsSection />
      </main>

      <footer className="border-t border-white/[0.06] py-10 text-center">
        <p className="font-sans text-[11px] uppercase text-zinc-600" style={{ letterSpacing: '0.18em' }}>
          Apex Kinematics — Enterprise Biomechanics Intelligence
        </p>
      </footer>
    </BackgroundLayer>
  );
}
