'use client';

import { motion } from 'framer-motion';

import { historyTimeline } from '@/constants/landing-content';
import LandingButton from '@/components/landing/LandingButton';
import SectionHeading from '@/components/landing/SectionHeading';

export default function HistorySection() {
  return (
    <section id="history" className="scroll-mt-28 py-24">
      <SectionHeading
        eyebrow="Product History"
        title="From Pipeline to Platform"
        description="Apex Kinematics evolved from a Python vision engine into a full cinematic analysis suite. Your personal session history lives behind secure access."
      />

      <div className="relative mx-auto max-w-3xl">
        <div className="absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-transparent via-ice/25 to-transparent md:left-1/2" />

        <div className="space-y-7">
          {historyTimeline.map((item, index) => (
            <motion.article
              key={item.era}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={`relative pl-11 md:w-[calc(50%-1rem)] ${
                index % 2 === 0
                  ? 'md:mr-auto md:pl-0 md:pr-10 md:text-right'
                  : 'md:ml-auto md:pl-11'
              }`}
            >
              <div
                className={`absolute top-3 h-1.5 w-1.5 rounded-full bg-ice/70 ${
                  index % 2 === 0
                    ? 'left-3 md:left-auto md:right-[-3px]'
                    : 'left-3 md:left-[-3px]'
                }`}
              />
              <div className="landing-card text-left">
                <p className="font-mono text-[10px] uppercase text-ice-muted" style={{ letterSpacing: '0.1em' }}>
                  {item.era}
                </p>
                <h3 className="landing-card-title mt-2 text-base">{item.title}</h3>
                <p className="landing-body mt-3 text-[14px]">{item.detail}</p>
                {item.cta && (
                  <div className="mt-5">
                    <LandingButton href="/auth" variant="secondary" className="text-[11px] px-6 py-2.5">
                      View Your History
                    </LandingButton>
                  </div>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
