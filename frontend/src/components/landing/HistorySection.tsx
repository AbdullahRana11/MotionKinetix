'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

import { historyTimeline } from '@/constants/landing-content';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function HistorySection() {
  return (
    <section id="history" className="scroll-mt-28 py-20">
      <div className="mb-10 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary-400/90 text-crisp">
          Product History
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-hero text-hero-crisp md:text-4xl">
          FROM PIPELINE TO PLATFORM
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-white/60 text-crisp">
          Apex Kinematics evolved from a Python vision engine into a full
          cinematic analysis suite. Your personal session history lives behind
          secure access.
        </p>
      </div>

      <div className="relative mx-auto max-w-3xl">
        <div className="absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-transparent via-primary-500/40 to-transparent md:left-1/2" />

        <div className="space-y-8">
          {historyTimeline.map((item, index) => (
            <motion.div
              key={item.era}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className={`relative pl-12 md:w-1/2 ${
                index % 2 === 0
                  ? 'md:mr-auto md:pr-8 md:pl-0 md:text-right'
                  : 'md:ml-auto md:pl-12'
              }`}
            >
              <div
                className={`absolute top-2 h-2 w-2 rounded-full bg-primary-500 shadow-[0_0_12px_rgba(0,238,252,0.8)] ${
                  index % 2 === 0
                    ? 'left-3 md:left-auto md:right-[-5px]'
                    : 'left-3 md:left-[-5px]'
                }`}
              />
              <Card className="border-primary-500/10 bg-black/30">
                <p className="font-mono text-[10px] uppercase tracking-widest text-primary-500">
                  {item.era}
                </p>
                <h3 className="mt-1 font-bold text-crisp">{item.title}</h3>
                <p className="mt-2 text-sm text-white/65 text-crisp">
                  {item.detail}
                </p>
                {item.cta && (
                  <Link href="/auth" className="mt-4 inline-block">
                    <Button variant="glass" className="text-xs">
                      View Your History
                    </Button>
                  </Link>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
