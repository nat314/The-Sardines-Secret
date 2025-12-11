import React from 'react';

export const WaterRipples: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="hidden">
        <defs>
          <filter id="ripple-filter">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.005 0.005" 
              numOctaves="2" 
              seed="1"
            >
              <animate 
                attributeName="baseFrequency" 
                dur="30s" 
                values="0.005 0.005;0.008 0.008;0.005 0.005" 
                repeatCount="indefinite" 
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="50" />
          </filter>
        </defs>
      </svg>

      {/* We apply the filter to a container holding linear gradients to simulate wave lines */}
      <div 
        className="absolute inset-[-100px] opacity-20"
        style={{ filter: 'url(#ripple-filter)' }}
      >
        {/* Layer 1: Main wave lines (roughly horizontal) */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(185deg,transparent_0,transparent_40px,rgba(203,213,225,0.2)_41px,transparent_60px)]" />
        
        {/* Layer 2: Secondary interference lines */}
         <div className="absolute inset-0 bg-[repeating-linear-gradient(175deg,transparent_0,transparent_60px,rgba(148,163,184,0.1)_61px,transparent_90px)]" />
      </div>
      
      {/* Subtle deep blue vignette for underwater feel */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.8)_100%)]" />
    </div>
  );
};