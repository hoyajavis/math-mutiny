import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Boss } from '../../types';
import { playBossIntroMusic } from '../../utils/audio';

interface BossIntroProps {
  boss: Boss;
  onComplete: () => void;
}

export const BossIntro: React.FC<BossIntroProps> = ({ boss, onComplete }) => {
  useEffect(() => {
    // Start audio sequence on mount
    playBossIntroMusic();
    
    // Complete the intro after 4.5 seconds
    const timer = setTimeout(onComplete, 4500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Pulsing red alarm background */}
      <motion.div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/50 via-red-900/10 to-transparent pointer-events-none"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      
      {/* "WARNING" Text */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-red-500 font-black text-2xl md:text-4xl uppercase tracking-[1em] mb-8 relative z-10"
      >
        WARNING
      </motion.div>

      {/* Emoji Slam */}
      <motion.div
        initial={{ y: -500, scale: 3, opacity: 0, rotate: 180 }}
        animate={{ y: 0, scale: 1, opacity: 1, rotate: 0 }}
        transition={{ delay: 1, type: "spring", stiffness: 200, damping: 10 }}
        className="text-8xl md:text-[150px] relative z-10 filter drop-shadow-[0_0_20px_rgba(255,0,0,0.8)]"
      >
        👹
      </motion.div>

      {/* Screen Shake Container for the text */}
      <motion.div
        initial={{ scale: 5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 300, damping: 15 }}
        className="relative z-10 mt-8 px-4 w-full"
      >
        <h1 className="text-4xl sm:text-5xl md:text-8xl font-black text-white uppercase italic text-center drop-shadow-[8px_8px_0px_rgba(255,0,0,1)] break-words w-full">
          {boss.name}
        </h1>
      </motion.div>

      {/* "GET READY" / Taunt */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.5, duration: 0.5 }}
        className="mt-12 bg-white text-black px-4 sm:px-6 py-2 border-4 border-black transform -rotate-2 relative z-10 mx-4 text-center max-w-lg shadow-[8px_8px_0px_0px_rgba(255,0,0,1)]"
      >
        <p className="text-lg sm:text-xl md:text-3xl font-bold uppercase">{boss.taunts[0] || "PREPARE TO BE DESTROYED!"}</p>
        <div className="absolute -top-4 right-1/2 ml-2 w-4 h-4 bg-white border-t-4 border-l-4 border-black rotate-45"></div>
      </motion.div>
    </div>
  );
};
