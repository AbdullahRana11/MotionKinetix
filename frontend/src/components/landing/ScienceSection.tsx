'use client';

import { motion } from 'framer-motion';

import { sciencePillars } from '@/constants/landing-content';
import { Card } from '@/components/ui/Card';

export default function ScienceSection() {
  return (
    <section id="science" className="scroll-mt-28 py-20">
      <div className="mb-10 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary-400/90 text-crisp">
          Biomechanics Science
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-hero text-hero-crisp md:text-4xl">
          THE PHYSICS BEHIND THE HUD
        </h2>
      </div>

      <div className="space-y-4">
        {sciencePillars.map((pillar, index) => (
          <motion.div
            key={pillar.title}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-l-2 border-l-primary-500/50 bg-black/25 md:flex md:items-center md:gap-8">
              <h3 className="shrink-0 text-base font-bold uppercase tracking-widest text-primary-400 text-crisp md:w-48">
                {pillar.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70 text-crisp md:mt-0">
                {pillar.body}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
