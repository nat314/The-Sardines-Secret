import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playPageTurnSound, playCloseClickSound } from '../utils/audio';

const FACTS = [
  { 
    title: "The Name Origin", 
    text: "The term 'sardine' was first used in English during the early 15th century and may come from the Mediterranean island of Sardinia, where they were once abundant." 
  },
  { 
    title: "The Bait Ball", 
    text: "When threatened, sardines instinctively group together into a tight sphere known as a 'bait ball'. This mesmerizing formation can be up to 20 meters wide and protects single fish from predators." 
  },
  { 
    title: "A Broad Family", 
    text: "'Sardine' isn't actually a single species. It is a common name used to refer to various small, oily forage fish in the herring family, Clupeidae." 
  },
  { 
    title: "Clean Eaters", 
    text: "Sardines feed almost exclusively on zooplankton by filtering water as they swim. Because they are low on the food chain, they contain very low levels of mercury compared to other fish." 
  }
];

const STORIES = [
  {
    name: "Percival the Preserved",
    cannedDate: "Nov 14, 1923",
    story: "Percival firmly believes the olive oil surrounding him is actually an expensive anti-aging serum. He plans to emerge in 2050 looking younger than when he was caught."
  },
  {
    name: "Captain Salt",
    cannedDate: "Feb 29, 1984",
    story: "Captain Salt believes the brine will eventually dissolve all meaning. He constantly wonders if the pull-tab is a sign of liberation or just the mechanism of doom."
  },
  {
    name: "Barnaby 'Big Gulp'",
    cannedDate: "Aug 12, 2021",
    story: "Barnaby spent his days debating whether the ocean was infinite or if it just had really clear walls. He concluded that the tin is actually a cozy studio apartment in a trendy neighborhood."
  },
  {
    name: "Lady Glimmer",
    cannedDate: "Dec 31, 1899",
    story: "She claims to be royalty from the Atlantic Ridge. She insists on being packed 'head-to-tail' only with fish of noble lineage. The quality control inspector disagreed."
  }
];

interface SardineFactsProps {
  onClose: () => void;
}

export const SardineFacts: React.FC<SardineFactsProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'facts' | 'stories'>('facts');

  useEffect(() => {
    playPageTurnSound();
  }, []);

  const handleTabChange = (tab: 'facts' | 'stories') => {
    if (activeTab !== tab) {
        playPageTurnSound();
        setActiveTab(tab);
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    playCloseClickSound();
    onClose();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      onClick={handleClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-[#cbd5e1] w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden relative border-4 border-[#94a3b8] flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#1e293b] flex justify-between items-center relative overflow-hidden shadow-md shrink-0">
             <div className="absolute inset-0 bg-tin-lid-texture opacity-10 mix-blend-overlay" />
             
             <h2 className="text-3xl md:text-4xl font-mystical text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400 tracking-widest relative z-10 drop-shadow-md">
                Secrets of the Shoal
             </h2>
             <button 
                onClick={handleClose}
                className="text-slate-400 hover:text-white transition-colors relative z-10 p-2 hover:bg-white/10 rounded-full"
                aria-label="Close facts"
             >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
             </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-[#334155] border-b-4 border-[#475569] shrink-0">
            <button
                onClick={() => handleTabChange('facts')}
                className={`flex-1 py-3 text-center font-mystical text-xl md:text-2xl tracking-wider transition-colors relative ${
                    activeTab === 'facts' 
                    ? 'bg-[#cbd5e1] text-slate-800 shadow-[inset_0_4px_6px_rgba(0,0,0,0.1)]' 
                    : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                }`}
            >
                Taxonomy & the Tin
                {activeTab === 'facts' && <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500/50" />}
            </button>
            <button
                onClick={() => handleTabChange('stories')}
                className={`flex-1 py-3 text-center font-mystical text-xl md:text-2xl tracking-wider transition-colors relative ${
                    activeTab === 'stories' 
                    ? 'bg-[#cbd5e1] text-slate-800 shadow-[inset_0_4px_6px_rgba(0,0,0,0.1)]' 
                    : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                }`}
            >
                Legends of the Oracles
                {activeTab === 'stories' && <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/50" />}
            </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto bg-slate-200 custom-scrollbar flex-1">
            <AnimatePresence mode="wait">
                {activeTab === 'facts' ? (
                    <motion.div 
                        key="facts"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        {FACTS.map((fact, index) => (
                            <motion.div 
                                key={index} 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-5 rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-slate-300 hover:border-slate-400 hover:shadow-lg transition-colors transition-shadow duration-300 group"
                            >
                                <div className="flex items-start gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 text-slate-400 font-mystical text-lg pt-1 group-hover:bg-slate-200 group-hover:text-slate-600 transition-colors">
                                        {index + 1}
                                    </div>
                                    <h3 className="font-mystical text-2xl text-slate-700 pt-1 group-hover:text-indigo-900 transition-colors">{fact.title}</h3>
                                </div>
                                <p className="font-mono text-l text-slate-600 leading-snug pl-11">
                                    {fact.text}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div 
                        key="stories"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-1 gap-6"
                    >
                        {STORIES.map((story, index) => (
                            <motion.div 
                                key={index} 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-[#f1f5f9] p-5 rounded-lg shadow-sm border border-slate-300 flex flex-col md:flex-row gap-4 items-start"
                            >
                                <div className="w-full md:w-36 shrink-0 bg-slate-200 rounded p-3 text-center border border-slate-300 shadow-inner flex flex-col items-center justify-center min-h-[90px]">
                                    <div className="text-3xl mb-1 opacity-50">🐟</div>
                                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Canned In</div>
                                    <div className="font-mono text-base font-bold text-slate-700 leading-none mt-1">{story.cannedDate}</div>
                                </div>
                                <div>
                                    <h3 className="font-mystical text-2xl text-slate-800 mb-2">{story.name}</h3>
                                    <p className="font-mono text-slate-600 italic leading-relaxed">
                                        "{story.story}"
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
            
             <div className="mt-8 text-center opacity-60">
                <p className="text-xs text-slate-500 uppercase tracking-[0.3em] font-mono">
                    Mystic Sardine Co. • Est 2025
                </p>
             </div>
        </div>
      </motion.div>
    </motion.div>
  );
};