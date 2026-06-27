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

      <footer className="border-t border-white/5 py-8 text-center">
        <p className="text-[10px] uppercase tracking-[0.25em] text-white/35 text-crisp">
          Apex Kinematics — Enterprise Biomechanics Intelligence
        </p>
      </footer>
    </BackgroundLayer>
  );
}
