'use client';

import { motion } from 'framer-motion';

import { fitnessInsights } from '@/constants/landing-content';
import { Card } from '@/components/ui/Card';

export default function MetricsSection() {
  return (
    <section id="metrics" className="scroll-mt-28 py-20 pb-32">
      <div className="mb-10 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary-400/90 text-crisp">
          Performance Metrics
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-hero text-hero-crisp md:text-4xl">
          FITNESS &amp; FORM BENCHMARKS
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-white/60 text-crisp">
          Reference ranges used by elite coaches when evaluating sprint
          mechanics, power transfer, and DTW similarity against pro footage.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {fitnessInsights.map((insight, index) => (
          <motion.div
            key={insight.label}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.45 }}
          >
            <Card className="text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-white/50 text-crisp">
                {insight.label}
              </p>
              <p className="mt-3 font-mono text-2xl font-bold text-primary-500 text-crisp">
                {insight.range}
              </p>
              <p className="mt-2 text-xs text-white/55 text-crisp">
                {insight.context}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
