'use client';

import { motion } from 'framer-motion';

import { aboutBlocks } from '@/constants/landing-content';
import SectionHeading from '@/components/landing/SectionHeading';

export default function AboutSection() {
  return (
    <section id="about" className="scroll-mt-28 py-24">
      <SectionHeading
        eyebrow="About Apex Kinematics"
        title="Elite Sports Science, Redefined"
      />

      <div className="grid gap-5 md:grid-cols-3">
        {aboutBlocks.map((block, index) => (
          <motion.article
            key={block.heading}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: index * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="landing-card"
          >
            <h3 className="landing-eyebrow text-ice/80">{block.heading}</h3>
            <p className="landing-body mt-5 text-[14px] leading-[1.75]">
              {block.text}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
