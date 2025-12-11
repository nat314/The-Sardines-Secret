import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { TinProps } from '../types';
import { Sardine } from './Sardine';

export const Tin: React.FC<TinProps & { onSardineClick: (rect: DOMRect, index: number) => void }> = ({
  id,
  isSelected,
  isOtherSelected,
  gameState,
  consultedFish,
  onSelect,
  onSardineClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // If another tin is selected, we hide this one
  if (isOtherSelected) return null;

  const handleClick = () => {
    if (gameState === 'CHOOSING') {
      onSelect(id);
    }
  };

  const handleSardineClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const rect = (e.target as Element).closest('div')?.getBoundingClientRect();
    if (rect) {
      onSardineClick(rect, index);
    }
  };

  // Logic for pull tab animation
  const isInteractive = gameState === 'CHOOSING' && !isSelected;
  const pullTabVariants: Variants = {
    hover: {
      scale: 1.05,
      rotate: 95,
      filter: "drop-shadow(-2px 4px 4px rgba(0,0,0,0.3))",
      transition: { duration: 0.3, ease: "easeOut" }
    },
    idle: {
      scale: 1,
      rotate: 90,
      filter: "drop-shadow(-1px 2px 2px rgba(0,0,0,0.2))",
      transition: { duration: 0.3, ease: "easeIn" }
    }
  };

  return (
    <motion.div
      layoutId={`tin-${id}`}
      className={`relative rounded-xl shadow-2xl transition-all duration-700
        ${isSelected ? 'w-[600px] h-[350px] z-20 cursor-default' : 'w-64 h-40 z-10 cursor-pointer'}
        ${!isSelected && 'hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]'}
      `}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={false}
      animate={{
        scale: isSelected ? 1 : isHovered ? 1.05 : 1,
      }}
    >
      {/* The Tin Container - 3D Beveled Edge */}
      <div className={`w-full h-full rounded-xl overflow-hidden relative tin-rim-bevel border-4 shadow-xl bg-[#cbd5e1]`}>
        
        {/* Interior (Sardines) - Radial gradient for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#334155_0%,_#1e293b_100%)] p-6 flex flex-col justify-center items-center opacity-100 box-border border-b border-white/10">
            {/* Inner shadow/grime */}
            <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.6)] pointer-events-none" />
            
            {isSelected && (
              <div className="w-full h-full flex flex-col justify-evenly px-4 relative z-10">
                <Sardine 
                  id={0} 
                  delay={0.2} 
                  isConsulted={consultedFish.includes(0)}
                  onClick={(e) => handleSardineClick(e, 0)} 
                />
                <Sardine 
                  id={1} 
                  delay={0.4} 
                  isConsulted={consultedFish.includes(1)}
                  onClick={(e) => handleSardineClick(e, 1)} 
                />
                <Sardine 
                  id={2} 
                  delay={0.6} 
                  isConsulted={consultedFish.includes(2)}
                  onClick={(e) => handleSardineClick(e, 2)} 
                />
              </div>
            )}
        </div>

        {/* The Lid */}
        <motion.div
          className="absolute inset-0 bg-tin-lid-texture rounded-lg z-30 flex items-center justify-center shadow-lg overflow-hidden"
          initial={false}
          animate={{
            y: isSelected ? '-120%' : '0%',
            rotateX: isSelected ? 20 : 0,
            opacity: isSelected ? 0 : 1, 
          }}
          transition={{
            type: "spring",
            stiffness: 40,
            damping: 15,
            delay: isSelected ? 0.2 : 0 
          }}
        >
          {/* Stamped Groove (Inset) */}
          <div className="absolute inset-3 border border-slate-500/20 rounded-md tin-groove opacity-60 pointer-events-none" />
          
          {/* Animated Gleam Effect - Only on Hover */}
          {!isSelected && isHovered && (
            <motion.div
              className="absolute inset-0 z-10 pointer-events-none"
              initial={{ x: "-150%" }}
              animate={{ x: "150%" }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "linear",
                repeatDelay: 0.5
              }}
              style={{
                background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1) 55%, transparent 70%)",
                transform: "skewX(-20deg)",
                mixBlendMode: "overlay"
              }}
            />
          )}

          {/* Animated Pull Tab Group */}
          {/* Wrapper handles Layout Position (prevents stretch, moves with expansion) */}
          <motion.div
            layout="position"
            className="absolute top-5 right-12 w-8 h-12 z-20 pointer-events-none"
          >
             {/* Inner Div handles Rotation Animation (avoids transform conflict) */}
             <motion.div 
                className="w-full h-full origin-bottom-right"
                variants={pullTabVariants}
                initial="idle"
                animate={isHovered && isInteractive ? "hover" : "idle"}
             >
                {/* Tab Base - Metal Gradient */}
                <div className="absolute inset-0 rounded-t-lg rounded-b-md pull-tab-metal border border-slate-400" />
                
                {/* The Hole */}
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-5 h-6 rounded-full bg-tin-lid-texture shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] border border-white/50" />
                
                {/* Rivet */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-300 shadow-md border border-slate-400" />
             </motion.div>
          </motion.div>
          
          {/* Simplified Text */}
          <motion.div 
            layout
            className="text-center pointer-events-none relative z-10 opacity-80 flex flex-col items-center justify-center"
          >
             <motion.h2 
               layout
               className="font-mystical font-bold text-embossed tracking-widest text-slate-700 leading-none"
             >
                <span className="block text-3xl">Mystic</span>
                <span className="block text-xl mt-1">Sardine Co.</span>
             </motion.h2>
             <motion.p 
               layout
               className="text-[10px] text-slate-600 font-mono tracking-[0.4em] font-bold mt-2 uppercase text-embossed"
             >
               EST. 2025
             </motion.p>
          </motion.div>

          {/* Shine effect on lid */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-10 pointer-events-none mix-blend-soft-light" />
        </motion.div>

      </div>
    </motion.div>
  );
};
