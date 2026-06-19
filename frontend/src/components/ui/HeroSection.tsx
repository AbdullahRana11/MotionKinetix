'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, MeshDistortMaterial, Environment, Float, Html } from '@react-three/drei';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';

const partnerLogos = [
  'Microsoft', 'Nike', 'Depr.', 'Alcamos', 'bainlabs', 'Ficiorsoft',
];

const dataCards = [
  { label: 'Velocity', value: '—' },
  { label: 'Angular Drift', value: '—' },
  { label: 'Joint Flex', value: '—' },
  { label: 'Symmetry', value: '—' },
  { label: 'Performance Index', value: '—' },
];

function CoreCrystal({ isHovered }: { isHovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * (isHovered ? 1.5 : 0.5);
      meshRef.current.rotation.y = state.clock.elapsedTime * (isHovered ? 2.0 : 0.8);
      
      const scale = THREE.MathUtils.lerp(meshRef.current.scale.x, isHovered ? 1.2 : 1.0, 0.1);
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <Float speed={isHovered ? 5 : 2} rotationIntensity={isHovered ? 2 : 1} floatIntensity={isHovered ? 2 : 1}>
      <Icosahedron ref={meshRef} args={[1, 1]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color={isHovered ? "#00eefc" : "#2e5bff"}
          emissive={isHovered ? "#00eefc" : "#124af0"}
          emissiveIntensity={isHovered ? 2 : 1}
          distort={isHovered ? 0.4 : 0.2}
          speed={isHovered ? 5 : 2}
          roughness={0.1}
          metalness={0.9}
          wireframe={false}
        />
      </Icosahedron>
      {/* Outer wireframe cage */}
      <Icosahedron args={[1.2, 1]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#00eefc" wireframe transparent opacity={isHovered ? 0.3 : 0.1} />
      </Icosahedron>
    </Float>
  );
}

export default function HeroSection() {
  const router = useRouter();
  const [coreHovered, setCoreHovered] = useState(false);

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#0A0B10]">
      {/* ── Fixed Background ── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/backgrounds/landing-bg.jpg')" }}
      />

      {/* ── Dark Radial Overlay ── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(10,11,16,0.4) 0%, rgba(10,11,16,0.85) 60%, rgba(10,11,16,1) 100%)',
        }}
      />

      {/* ── Main Content ── */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-32 pb-12">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="flex w-full max-w-7xl flex-col items-center"
        >
          {/* ── Cinematic Typography ── */}
          <motion.div variants={fadeUp} className="text-center">
            <h1 
              className="font-mono text-center text-[2.5rem] font-bold tracking-[-0.04em] uppercase leading-[1.0] text-transparent sm:text-6xl md:text-7xl lg:text-[6.5rem] xl:text-[7.5rem]"
              style={{
                backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, #c4c5d9 60%, #8e90a2 100%)',
                WebkitBackgroundClip: 'text',
                filter: 'drop-shadow(0 0 30px rgba(46,91,255,0.4))',
              }}
            >
              OPTIMIZE. ANALYZE. EXCEL.
            </h1>
            <p className="mt-8 max-w-3xl mx-auto font-sans text-lg font-normal tracking-wide text-[#c4c5d9] sm:text-xl md:text-2xl">
              Unlock Elite Athletic Performance through Advanced Biomechanics AI.
            </p>
          </motion.div>

          {/* ── WebGL Core Button ── */}
          <motion.div variants={fadeUp} className="relative mt-16 h-[300px] w-full max-w-[400px]">
            {/* The 3D Canvas */}
            <div className="absolute inset-0 cursor-pointer" 
                 onMouseEnter={() => setCoreHovered(true)} 
                 onMouseLeave={() => setCoreHovered(false)}
                 onClick={() => router.push('/auth')}
            >
              <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#00eefc" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#2e5bff" />
                <Environment preset="city" />
                <CoreCrystal isHovered={coreHovered} />
                <Html position={[0, 0, 0]} center style={{ pointerEvents: 'none' }}>
                  <div className="flex flex-col items-center justify-center">
                    <span 
                      className={`whitespace-nowrap font-mono text-sm font-bold tracking-widest text-white uppercase transition-all duration-500 ${coreHovered ? 'scale-110 drop-shadow-[0_0_15px_#00eefc]' : ''}`}
                      style={{ textShadow: '0px 2px 10px rgba(0,0,0,0.8)' }}
                    >
                      Initialize System
                    </span>
                  </div>
                </Html>
              </Canvas>
            </div>
            
            {/* Ground rings / Pedestal glow */}
            <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-[60px] w-[250px] rounded-[100%] border border-[#00eefc]/30 shadow-[0_0_50px_rgba(46,91,255,0.6)_inset]" style={{ transform: 'translateX(-50%) rotateX(70deg)' }} />
            <div className="pointer-events-none absolute bottom-[-10px] left-1/2 -translate-x-1/2 h-[80px] w-[350px] rounded-[100%] border border-[#2e5bff]/20" style={{ transform: 'translateX(-50%) rotateX(70deg)' }} />
          </motion.div>

          {/* ── Data Grid (Frosted Glass) ── */}
          <motion.div variants={fadeUp} className="mt-8 w-full max-w-6xl">
            <div className="mb-8 flex items-center justify-center">
              <div className="h-[1px] w-1/3 bg-gradient-to-r from-transparent to-white/10" />
              <span className="mx-6 font-mono text-[11px] font-bold tracking-[0.1em] text-[#e3e1e9] uppercase">
                Performance Science
              </span>
              <div className="h-[1px] w-1/3 bg-gradient-to-l from-transparent to-white/10" />
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {dataCards.map((card, i) => (
                <div
                  key={card.label}
                  className="flex flex-col items-start px-5 py-6 transition-all hover:-translate-y-1"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
                  }}
                >
                  <span className="font-mono text-[10px] font-bold tracking-[0.1em] text-[#8e90a2] uppercase">
                    {card.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Partner Logos ── */}
          <motion.div variants={fadeUp} className="mt-16 flex w-full max-w-4xl flex-wrap items-center justify-center gap-10 border-t border-white/5 pt-10">
            {partnerLogos.map((name, i) => (
              <span key={name} className="font-sans text-sm font-medium tracking-widest text-[#434656] uppercase transition-colors hover:text-[#8e90a2]">
                {name}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
