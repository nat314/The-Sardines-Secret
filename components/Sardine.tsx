import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { SardineProps } from '../types';

export const Sardine: React.FC<SardineProps> = ({ id, onClick, delay, isConsulted }) => {
  const controls = useAnimation();
  const isMounted = useRef(false);

  // Generate unique IDs for this specific sardine instance to prevent SVG ID collisions
  const uniqueId = `sardine-${id}`;
  const aliveGradientId = `fishGradient-alive-${uniqueId}`;
  const deadGradientId = `fishGradient-dead-${uniqueId}`;
  const shimmerId = `shimmerGradient-${uniqueId}`;
  const wetId = `wetGradient-${uniqueId}`;
  const clipId = `fishClip-${uniqueId}`;

  // Handle entrance animation on mount
  useEffect(() => {
    controls.start({ 
      opacity: isConsulted ? 0.6 : 1, // Start faded if already consulted
      y: 0,
      scale: 1,
      rotate: [5, -3, 2, -1, 0], // The "Wiggle" settling effect
      transition: { 
        delay: delay, 
        duration: 1.2,
        ease: "easeOut",
        times: [0, 0.3, 0.6, 0.8, 1]
      }
    });
  }, [delay, controls]); // Ignore isConsulted for entrance

  // Handle state change to consulted (only after mount)
  useEffect(() => {
    if (!isMounted.current) {
        isMounted.current = true;
        return;
    }

    if (isConsulted) {
        controls.start({
            opacity: 0.6, // Fade out slightly
            scale: 0.9,   // Shrink back to resting size
            rotate: 0,
            transition: { duration: 0.8, ease: "easeInOut" }
        });
    } else {
        controls.start({
            opacity: 1,
            scale: 1,
            rotate: 0,
            transition: { duration: 0.5 }
        });
    }
  }, [isConsulted, controls]);

  const bodyPath = "M 10 50 Q 90 20, 200 50 Q 280 70, 290 50 Q 280 30, 200 50 Q 90 80, 10 50 Z";
  const tailPath = "M 290 50 L 300 35 L 295 50 L 300 65 Z";

  const handleClick = (e: React.MouseEvent) => {
    if (isConsulted) {
      e.stopPropagation();
      // Trigger subtle wiggle animation for consulted fish
      controls.start({
        rotate: [0, -1, 1, -1, 1, 0],
        transition: { duration: 0.3 }
      });
    } else {
      onClick(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9, rotate: 5 }}
      animate={controls}
      whileHover={isConsulted ? {} : { scale: 1.02 }}
      whileTap={isConsulted ? {} : { scale: 0.98 }}
      className={`relative group w-full h-24 my-1 ${isConsulted ? 'cursor-default' : 'cursor-pointer'}`} 
      onClick={handleClick}
      style={{ willChange: 'transform, opacity' }}
    >
      <svg
        viewBox="0 0 300 100"
        className="w-full h-full drop-shadow-xl"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Alive Gradient (Silver/Blue) */}
          <linearGradient id={aliveGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="30%" stopColor="#e2e8f0" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="80%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          {/* Dead/Consulted Gradient (Dull Gray) */}
          <linearGradient id={deadGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="30%" stopColor="#64748b" />
            <stop offset="50%" stopColor="#475569" />
            <stop offset="80%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          
          <linearGradient id={shimmerId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="40%" stopColor="white" stopOpacity="0.1" />
            <stop offset="50%" stopColor="white" stopOpacity="0.6" />
            <stop offset="60%" stopColor="white" stopOpacity="0.1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          <linearGradient id={wetId} x1="0%" y1="0%" x2="100%" y2="100%">
             <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
             <stop offset="50%" stopColor="#a5b4fc" stopOpacity="0.3" />
             <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.2" />
          </linearGradient>

          <clipPath id={clipId}>
            <path d={bodyPath} />
            <path d={tailPath} />
          </clipPath>
        </defs>
        
        {/* --- BACK LAYER: Dead State (Always rendered, revealed when top layer fades) --- */}
        <g opacity={1}>
             <path d={bodyPath} fill={`url(#${deadGradientId})`} stroke="#334155" strokeWidth="1" />
             <path d={tailPath} fill="#475569" />
             {/* Dead Eye */}
             <circle cx="40" cy="48" r="4" fill="#334155" />
             <circle cx="42" cy="46" r="1.5" fill="#64748b" />
        </g>

        {/* --- FRONT LAYER: Alive State (Fades out when consulted) --- */}
        <motion.g 
            initial={{ opacity: 1 }}
            animate={{ opacity: isConsulted ? 0 : 1 }}
            transition={{ duration: 0.8 }}
        >
            <path d={bodyPath} fill={`url(#${aliveGradientId})`} stroke="#475569" strokeWidth="1" />
            <path d={tailPath} fill="#64748b" />
            
            {/* Wet Sheen (Only on alive fish) */}
            <rect width="100%" height="100%" fill={`url(#${wetId})`} clipPath={`url(#${clipId})`} className="opacity-100" />
            
            {/* Alive Eye */}
            <circle cx="40" cy="48" r="4" fill="#000" />
            <circle cx="42" cy="46" r="1.5" fill="#fff" />

            {/* Scale Details */}
            <path d="M 60 50 Q 65 48, 70 50" stroke="rgba(0,0,0,0.2)" fill="none" />
            <path d="M 75 50 Q 80 48, 85 50" stroke="rgba(0,0,0,0.2)" fill="none" />
            <path d="M 67 53 Q 72 51, 77 53" stroke="rgba(0,0,0,0.2)" fill="none" />
        </motion.g>

        {/* --- EFFECTS LAYER --- */}

        {/* Hover Brightness (White Overlay) - Replaces 'filter: brightness' to avoid flickering */}
        {!isConsulted && (
             <motion.rect
                width="100%" height="100%"
                fill="white"
                clipPath={`url(#${clipId})`}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.15 }} // Gentle brightness increase
                transition={{ duration: 0.2 }}
                className="pointer-events-none"
             />
        )}

        {/* Shimmer Animation */}
        {!isConsulted && (
            <motion.rect
            x="-100%"
            y="0"
            width="100%"
            height="100%"
            fill={`url(#${shimmerId})`}
            clipPath={`url(#${clipId})`}
            animate={{ x: ["-120%", "200%"] }}
            transition={{ 
                repeat: Infinity, 
                duration: 1.8, 
                ease: "easeInOut",
                repeatDelay: 0.5
            }}
            className="opacity-40 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            />
        )}
      </svg>
    </motion.div>
  );
};