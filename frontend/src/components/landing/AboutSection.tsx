'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

import { aboutBlocks } from '@/constants/landing-content';
import { Card } from '@/components/ui/Card';

export default function AboutSection() {
  return (
    <section id="about" className="scroll-mt-28 py-20">
      <div className="mb-10 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary-400/90 text-crisp">
          About Apex Kinematics
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-hero text-hero-crisp md:text-4xl">
          ELITE SPORTS SCIENCE, REDEFINED
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {aboutBlocks.map((block, index) => (
          <motion.div
            key={block.heading}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
          >
            <Card className="h-full border-primary-500/10 bg-black/20">
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary-400 text-crisp">
                {block.heading}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-white/70 text-crisp">
                {block.text}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
