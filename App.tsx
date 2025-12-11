import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Sparkles } from './components/Sparkles';
import { Tin } from './components/Tin';
import { MistParticles } from './components/MistParticles';
import { WaterRipples } from './components/WaterRipples';
import { SardineFacts } from './components/SardineFacts';
import { GameState } from './types';
import { FORTUNES } from './constants';
import { playTinSound, playMysticalSound, playAcceptFateSound, playResetSound } from './utils/audio';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('SPLASH');
  const [selectedTin, setSelectedTin] = useState<number | null>(null);
  const [activeFortune, setActiveFortune] = useState<{ text: string; x: number; y: number } | null>(null);
  const [loadingPos, setLoadingPos] = useState<{ x: number; y: number } | null>(null);
  const [isConsulting, setIsConsulting] = useState(false);
  const [isTextAnimationComplete, setIsTextAnimationComplete] = useState(false);
  const [consultedFish, setConsultedFish] = useState<number[]>([]);
  const [showFacts, setShowFacts] = useState(false);
  
  // Track which fortunes have been shown to avoid repeats
  const [availableIndices, setAvailableIndices] = useState<number[]>(
    Array.from({ length: FORTUNES.length }, (_, i) => i)
  );

  const handleStart = () => {
    playResetSound();
    setGameState('CHOOSING');
  };

  const handleTinSelect = (id: number) => {
    playTinSound();
    setGameState('OPENING');
    setSelectedTin(id);
    // Short delay to allow animation to start before considering it 'REVEALED'
    setTimeout(() => setGameState('REVEALED'), 800);
  };

  const handleReset = () => {
    playResetSound();
    setActiveFortune(null);
    setGameState('CHOOSING');
    setSelectedTin(null);
    setConsultedFish([]);
  };

  const handleSardineClick = (rect: DOMRect, index: number) => {
    if (isConsulting) return;

    // Mark this fish as consulted immediately
    setConsultedFish(prev => [...prev, index]);

    // Calculate position: Anchor to the fish's head/mouth.
    // The fish head is on the far left of the bounding box (rect).
    // We add a small offset (30px) from the left edge to hit the mouth.
    // We use half the height to center it vertically on the fish body.
    const targetX = rect.left + 30;
    const targetY = rect.top + (rect.height / 2);

    setActiveFortune(null);
    setIsTextAnimationComplete(false);
    setLoadingPos({ x: targetX, y: targetY });
    setIsConsulting(true);

    // Simulate consulting the oracle with a delay
    setTimeout(() => {
        let currentPool = [...availableIndices];
        
        // If we've exhausted the list, reset it to the full list
        if (currentPool.length === 0) {
            currentPool = Array.from({ length: FORTUNES.length }, (_, i) => i);
        }

        const randomIndex = Math.floor(Math.random() * currentPool.length);
        const fortuneIndex = currentPool[randomIndex];
        
        // Update state to remove the chosen index
        const newPool = currentPool.filter(i => i !== fortuneIndex);
        setAvailableIndices(newPool);

        playMysticalSound();

        setActiveFortune({
            text: FORTUNES[fortuneIndex],
            x: targetX,
            y: targetY
        });
        
        setIsConsulting(false);
        setLoadingPos(null);
    }, 1200);
  };

  // Variants for the typewriter effect
  const sentenceVariants: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.2,
        staggerChildren: 0.03, // Speed of typing
      },
    },
  };

  const letterVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
    },
  };

  const buttonVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, delay: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0f1e] relative flex flex-col items-center justify-center overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 via-[#0a0f1e] to-black opacity-80" />
      <Sparkles />

      <AnimatePresence>
        {gameState === 'SPLASH' ? (
          <motion.div
            key="splash"
            id="splash-screen"
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ 
              opacity: 0, 
              scale: 1.1,
              filter: "blur(20px)",
              transition: { duration: 1.5, ease: "easeInOut" } 
            }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#020617]"
          >
            <WaterRipples />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
              className="flex flex-col items-center p-6 relative z-10"
            >
              <h1 className="text-6xl md:text-9xl font-mystical text-shimmer-effect drop-shadow-[0_0_25px_rgba(255,255,255,0.2)] text-center mb-12">
                The Sardine's Secret
              </h1>
              
              <div className="flex flex-col items-center gap-6">
                <motion.button
                    onClick={handleStart}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-4 bg-slate-900/50 border border-slate-500 text-slate-200 font-mystical text-2xl md:text-3xl tracking-widest rounded-full hover:bg-slate-800 hover:border-slate-300 hover:text-white transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-sm group"
                >
                    <span className="group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">
                    Consult the Fish
                    </span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="z-10 w-full max-w-4xl px-4 flex flex-col items-center h-full min-h-[600px] justify-center relative"
          >
            {/* Title / Header - Fades out when game starts */}
            <AnimatePresence>
              {gameState === 'CHOOSING' && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  className="absolute top-10 text-center pointer-events-none"
                >
                  <h1 className="text-4xl md:text-6xl font-mystical text-transparent bg-clip-text bg-gradient-to-b from-slate-200 to-slate-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    The Sardine's Secret
                  </h1>
                  <p className="text-slate-400 mt-4 font-mono uppercase tracking-wider">
                    Choose a tin to reveal your fate.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tins Container */}
            <div className={`flex flex-col md:flex-row gap-8 md:gap-12 items-center justify-center transition-all duration-700 ${gameState !== 'CHOOSING' ? 'w-full h-full' : ''}`}>
              {[0, 1, 2].map((id) => (
                <Tin
                  key={id}
                  id={id}
                  isSelected={selectedTin === id}
                  isOtherSelected={selectedTin !== null && selectedTin !== id}
                  gameState={gameState}
                  consultedFish={consultedFish}
                  onSelect={handleTinSelect}
                  onReset={handleReset}
                  onSardineClick={handleSardineClick}
                />
              ))}
            </div>

            {/* Loading Spinner */}
            <AnimatePresence>
                {isConsulting && loadingPos && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="fixed z-50 pointer-events-none flex flex-col items-center"
                        style={{
                            left: loadingPos.x,
                            top: loadingPos.y,
                            transform: 'translate(-50%, -100%)', // Align bottom-center to target
                            marginTop: '-20px' // Offset slightly above the fish
                        }}
                    >
                        <div className="mb-4 relative w-12 h-12 flex items-center justify-center">
                            {/* Outer Glow */}
                            <motion.div
                                className="absolute inset-0 rounded-full bg-slate-400 opacity-10 blur-md"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            
                            {/* Outer rotating ring */}
                            <motion.div 
                                className="absolute inset-0 border-[1px] border-slate-400 border-t-transparent border-l-transparent rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            />
                            
                            {/* Inner rotating ring */}
                            <motion.div 
                                className="absolute inset-2 border-[1px] border-white border-b-transparent border-r-transparent rounded-full"
                                animate={{ rotate: -360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            
                            {/* Center pearl/light */}
                            <motion.div 
                                className="w-2 h-2 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                                animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Fortune Bubble Pop-up */}
            <AnimatePresence>
              {activeFortune && (
                <React.Fragment key="fortune-overlay">
                    <MistParticles x={activeFortune.x} y={activeFortune.y} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: "-50%", y: "-90%" }}
                        animate={{ opacity: 1, scale: 1, x: "-50%", y: "calc(-100% - 24px)" }} // Float up above finger/cursor
                        exit={{ opacity: 0, scale: 0.5, x: "-50%", y: "-90%" }}
                        className="fixed z-50 max-w-[240px] md:max-w-xs"
                        style={{ 
                            left: activeFortune.x,
                            top: activeFortune.y,
                        }}
                    >
                    <div className="relative bg-white text-slate-900 p-4 rounded-xl shadow-[0_0_40px_rgba(255,255,255,0.4)] border-2 border-slate-200">
                        {/* Tail for bubble */}
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white transform rotate-45 border-b-2 border-r-2 border-slate-200" />
                        
                        <motion.p 
                        className="font-handwriting text-xl md:text-2xl text-center !leading-[1.1] !m-0 !p-0"
                        variants={sentenceVariants}
                        initial="hidden"
                        animate="visible"
                        onAnimationComplete={() => setIsTextAnimationComplete(true)}
                        >
                        {/* Split text into characters for typing effect, including quotes */}
                        {`"${activeFortune.text}"`.split("").map((char, index) => (
                            <motion.span key={`${char}-${index}`} variants={letterVariants}>
                            {char}
                            </motion.span>
                        ))}
                        </motion.p>
                        
                        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col items-center gap-1">
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isTextAnimationComplete ? 1 : 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="font-mono text-[10px] text-slate-600 tracking-[0.2em] font-bold uppercase"
                        >
                            The Sardine Has Spoken
                        </motion.p>
                        <motion.button 
                            variants={buttonVariants}
                            initial="hidden"
                            animate={isTextAnimationComplete ? "visible" : "hidden"}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => { 
                            e.stopPropagation(); 
                            playAcceptFateSound();
                            setActiveFortune(null); 
                            }}
                            className="pointer-events-auto px-5 py-1.5 bg-slate-900 text-slate-100 uppercase text-[11px] tracking-widest rounded-full hover:bg-slate-700 shadow-lg font-mono border border-slate-700"
                        >
                            Accept Your Fate
                        </motion.button>
                        </div>
                    </div>
                    </motion.div>
                </React.Fragment>
              )}
            </AnimatePresence>

            {/* About Button - Only Visible in CHOOSING state (when lids are closed) */}
            <AnimatePresence>
                {gameState === 'CHOOSING' && (
                    <motion.button
                        initial={{ opacity: 0, x: "-50%" }}
                        animate={{ opacity: 0.6, x: "-50%" }}
                        exit={{ opacity: 0, x: "-50%" }}
                        onClick={() => setShowFacts(true)}
                        className="absolute bottom-10 left-1/2 text-slate-500 hover:text-slate-300 font-mystical text-xl tracking-widest transition-colors flex items-center gap-2 z-30"
                        whileHover={{ scale: 1.05, opacity: 1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-sans">?</span>
                        <span>About the Sardines</span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Reset Button - Visible only in REVEALED state */}
            <AnimatePresence>
              {gameState === 'REVEALED' && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={handleReset}
                  className="absolute bottom-10 px-8 py-3 bg-transparent border border-slate-400 text-slate-300 font-mystical text-xl md:text-2xl tracking-[0.1em] rounded-full hover:bg-slate-800 hover:text-white hover:border-white transition-colors duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] z-40"
                >
                  Consult the Fates Again
                </motion.button>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Sardine Facts Modal - Independent of Game State */}
      <AnimatePresence>
        {showFacts && <SardineFacts onClose={() => setShowFacts(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default App;