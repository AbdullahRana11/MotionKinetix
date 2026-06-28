'use client';

import { motion } from 'framer-motion';

import { platformFeatures } from '@/constants/landing-content';
import SectionHeading from '@/components/landing/SectionHeading';

export default function PlatformSection() {
  return (
    <section id="platform" className="scroll-mt-28 py-24">
      <SectionHeading
        eyebrow="The Platform"
        title="Three Pillars of Performance"
        description="Upload footage, receive skeletal telemetry, and compare against elite reference movement — all from a single cinematic workspace."
      />

      <div className="grid gap-5 md:grid-cols-3">
        {platformFeatures.map((feature, index) => (
          <motion.article
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: index * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="landing-card group"
          >
            <span className="font-mono text-[11px] font-medium tabular-nums text-ice-muted transition-colors duration-elite group-hover:text-ice">
              {feature.metric}
            </span>
            <h3 className="landing-card-title mt-4">{feature.title}</h3>
            <p className="landing-body mt-3 text-[14px]">{feature.description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
