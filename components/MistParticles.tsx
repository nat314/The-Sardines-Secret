import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface MistParticlesProps {
  x: number;
  y: number;
}

export const MistParticles: React.FC<MistParticlesProps> = ({ x, y }) => {
  // Generate a randomized set of particles
  const particles = useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    initialX: (Math.random() - 0.5) * 40,
    targetX: (Math.random() - 0.5) * 120, // Drift spread
    targetY: -80 - Math.random() * 120, // Upward distance
    duration: 1.5 + Math.random() * 2,
    delay: Math.random() * 0.5,
    scale: 0.5 + Math.random(),
    isBubble: Math.random() > 0.6 // 40% chance of being a bubble
  })), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ 
            x: x + p.initialX, 
            y: y, 
            opacity: 0, 
            scale: 0 
          }}
          animate={{ 
            x: x + p.targetX, 
            y: y + p.targetY, 
            opacity: [0, p.isBubble ? 0.8 : 0.4, 0], 
            scale: [0, p.scale, p.scale * 1.2],
            rotate: p.isBubble ? 0 : Math.random() * 360 // Rotate mist clouds
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeOut"
          }}
          className={`absolute rounded-full ${
            p.isBubble 
              ? 'bg-cyan-100/40 border border-white/60 shadow-[0_0_8px_rgba(255,255,255,0.6)]' 
              : 'bg-slate-300/30 blur-md'
          }`}
          style={{
            width: p.isBubble ? 6 + Math.random() * 6 : 20 + Math.random() * 20,
            height: p.isBubble ? 6 + Math.random() * 6 : 20 + Math.random() * 20,
          }}
        />
      ))}
    </div>
  );
};
