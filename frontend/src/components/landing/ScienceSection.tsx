'use client';

import { motion } from 'framer-motion';

import { sciencePillars } from '@/constants/landing-content';
import SectionHeading from '@/components/landing/SectionHeading';

export default function ScienceSection() {
  return (
    <section id="science" className="scroll-mt-28 py-24">
      <SectionHeading
        eyebrow="Biomechanics Science"
        title="The Physics Behind the HUD"
      />

      <div className="space-y-4">
        {sciencePillars.map((pillar, index) => (
          <motion.article
            key={pillar.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="landing-card flex flex-col gap-4 border-l border-l-ice/25 md:flex-row md:items-center md:gap-10"
          >
            <h3 className="landing-card-title shrink-0 md:w-52">{pillar.title}</h3>
            <p className="landing-body text-[14px]">{pillar.body}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
