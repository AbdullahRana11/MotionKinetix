'use client';

import { motion } from 'framer-motion';

import { fitnessInsights } from '@/constants/landing-content';
import SectionHeading from '@/components/landing/SectionHeading';

export default function MetricsSection() {
  return (
    <section id="metrics" className="scroll-mt-28 py-24 pb-36">
      <SectionHeading
        eyebrow="Performance Metrics"
        title="Fitness & Form Benchmarks"
        description="Reference ranges used by elite coaches when evaluating sprint mechanics, power transfer, and DTW similarity against pro footage."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {fitnessInsights.map((insight, index) => (
          <motion.article
            key={insight.label}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="landing-card text-center"
          >
            <p className="landing-eyebrow text-zinc-500">{insight.label}</p>
            <p className="landing-metric mt-4">{insight.range}</p>
            <p className="mt-3 font-sans text-[12px] leading-relaxed text-zinc-500">
              {insight.context}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
