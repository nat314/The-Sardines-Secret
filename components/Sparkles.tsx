import React from 'react';
import { motion } from 'framer-motion';

const { useEffect, useState } = React;

const random = (min: number, max: number) => Math.random() * (max - min) + min;

interface Sparkle {
  id: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export const Sparkles: React.FC = () => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles = Array.from({ length: 20 }).map((_, i) => ({
        id: `sparkle-${i}`,
        x: random(0, 100),
        y: random(0, 100),
        size: random(2, 6),
        duration: random(2, 5),
        delay: random(0, 2),
      }));
      setSparkles(newSparkles);
    };

    generateSparkles();
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.8)]"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            delay: s.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};