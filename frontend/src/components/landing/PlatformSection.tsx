'use client';

import { motion } from 'framer-motion';

import { platformFeatures } from '@/constants/landing-content';
import { Card } from '@/components/ui/Card';

export default function PlatformSection() {
  return (
    <section id="platform" className="scroll-mt-28 py-20">
      <div className="mb-10 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary-400/90 text-crisp">
          The Platform
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-hero text-hero-crisp md:text-4xl">
          THREE PILLARS OF PERFORMANCE
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-white/60 text-crisp">
          Upload footage, receive skeletal telemetry, and compare against elite
          reference movement — all from a single cinematic workspace.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {platformFeatures.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: index * 0.12, duration: 0.6 }}
          >
            <Card className="relative h-full overflow-hidden border-cyan-500/10 bg-gradient-to-br from-white/[0.07] to-cyan-500/[0.03]">
              <div className="absolute right-4 top-4 font-mono text-xs font-bold text-primary-500/80">
                {feature.metric}
              </div>
              <h3 className="pr-16 text-lg font-bold text-crisp">{feature.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65 text-crisp">
                {feature.description}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
