import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppConfig, GameMode } from '../../types';

interface HUDProps {
  config: AppConfig;
  mode: GameMode;
  score: number;
  streak: number;
  combo: number;
  comboAnimation: boolean;
  timeLeft: number;
  timeElapsed: number;
  boss?: { name: string; hp: number; maxHp: number };
  onAbort: () => void;
}

export const HUD: React.FC<HUDProps> = ({ 
  config, mode, score, streak, combo, comboAnimation, timeLeft, timeElapsed, boss, onAbort 
}) => {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-1 sm:mb-2 md:mb-8 gap-2 sm:gap-4 w-full shrink-0">
      <div className="flex flex-row items-center gap-2 md:gap-4 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
        <div className={`border-2 md:border-4 border-black bg-white p-1 sm:p-2 md:p-3 -rotate-2 transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0`}>
          <p className={`text-[10px] md:text-xs font-bold uppercase ${config.theme.primaryText}`}>Score</p>
          <p className="text-xl md:text-3xl font-black">{score.toLocaleString()}</p>
        </div>
        
        <div className="border-2 md:border-4 border-black bg-white p-1 sm:p-2 md:p-3 rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 md:gap-4 shrink-0">
          <div>
            <p className="text-[10px] md:text-xs font-bold text-[#ff00ff] uppercase">Streak</p>
            <p className="text-xl md:text-3xl font-black">{streak}</p>
          </div>
          <div className="h-8 md:h-12 w-1 md:w-2 bg-gray-200">
            <motion.div 
              className="w-full bg-[#00ffff]"
              initial={{ height: 0 }}
              animate={{ height: `${Math.min(100, (combo / 5) * 100)}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          </div>
          <div className="relative">
            <p className="text-[10px] md:text-xs font-bold text-[#ff0000] uppercase">Multiplier</p>
            <AnimatePresence mode="popLayout">
              <motion.p 
                key={comboAnimation ? 'anim' : 'static'}
                initial={comboAnimation ? { scale: 1.5, color: '#ff0000' } : false}
                animate={{ scale: 1, color: '#000000' }}
                className="text-xl md:text-3xl font-black"
              >
                x{Math.floor(combo / 5) + 1}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {(mode === 'random' || mode === 'challenge') && (
          <div className={`border-2 md:border-4 border-black ${timeLeft <= 10 ? 'bg-[#ff0000] text-white animate-pulse' : 'bg-[#00ffff] text-black'} p-1 sm:p-2 md:p-3 rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0`}>
            <p className="text-[10px] md:text-xs font-bold uppercase">{mode === 'challenge' ? 'Time Left' : 'Time'}</p>
            <p className="text-xl md:text-3xl font-black">{mode === 'challenge' ? timeLeft : timeElapsed}s</p>
          </div>
        )}
      </div>

      {mode === 'challenge' && boss && (
        <div className="flex-1 w-full mx-0 md:mx-8">
          <div className="bg-white border-4 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
            <div className="absolute -top-3 -left-3 bg-[#ff0000] text-white text-xs font-black px-2 border-2 border-black rotate-[-5deg]">
              BOSS
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-black text-sm uppercase">{boss.name}</span>
              <span className="font-bold text-xs">{boss.hp}/{boss.maxHp} HP</span>
            </div>
            <div className="w-full h-4 bg-gray-200 border-2 border-black overflow-hidden relative">
              <motion.div 
                className="h-full bg-[#ff0000] origin-left"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: boss.hp / boss.maxHp }}
                transition={{ type: "spring", bounce: 0.2 }}
              />
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={onAbort}
        className="border-2 md:border-4 border-black bg-[#ffea00] px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2 text-xs sm:text-sm md:text-lg font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all transform rotate-2 shrink-0 ml-auto md:ml-0"
      >
        Abort
      </button>
    </header>
  );
};
