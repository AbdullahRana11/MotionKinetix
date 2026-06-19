import TopNav from '@/components/ui/TopNav';
import HeroSection from '@/components/ui/HeroSection';

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#0A0B10]">
      {/* 
        TopNav is already styled with 'fixed top-0 left-0 right-0 z-50' 
        in its own component file, ensuring it hovers cleanly over the hero 
      */}
      <TopNav />
      
      {/* 
        HeroSection contains the background and min-h-screen layout.
        Placing it here allows it to take up the full viewport underneath the nav.
      */}
      <HeroSection />
    </main>
  );
}