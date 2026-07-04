import React from 'react';
import { motion } from 'motion/react';
import { GameMode, AppConfig } from '../../types';

interface GameOverProps {
  config: AppConfig;
  mode: GameMode;
  score: number;
  xpEarned: number;
  bossDefeated: boolean;
  newHighScoreAlert: boolean;
  onMenu: () => void;
  onPlayAgain: () => void;
  currentBoss: { name: string; bgColorClass: string; gradientClass: string };
}

export const GameOver: React.FC<GameOverProps> = ({
  config, mode, score, xpEarned, bossDefeated, newHighScoreAlert,
  onMenu, onPlayAgain, currentBoss
}) => {
  return (
    <div className={`flex flex-col min-h-screen p-6 items-center justify-center ${mode === 'challenge' && !bossDefeated ? currentBoss.bgColorClass : config.theme.primaryBg}`}>
      {mode === 'challenge' && !bossDefeated && (
        <div className={`fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${currentBoss.gradientClass} animate-pulse z-[-1]`}></div>
      )}
      {mode === 'challenge' && bossDefeated && (
        <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-yellow-300/30 animate-pulse z-[-1]"></div>
      )}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`border-4 border-black p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] text-center ${mode === 'challenge' && !bossDefeated ? 'bg-black text-white' : 'bg-white text-black'}`}
      >
        <div className="text-8xl mb-6">
          {mode === 'challenge' ? (bossDefeated ? "🏆" : "💀") : "🌟"}
        </div>
        <h2 className="text-5xl md:text-6xl font-black uppercase mb-6 transform -rotate-2 text-inherit">
          {mode === 'challenge' ? (bossDefeated ? "BOSS DEFEATED!" : "YOU DIED!") : "Awesome Job!"}
        </h2>
        {newHighScoreAlert && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [1.2, 1] }}
            transition={{ type: "spring", bounce: 0.6 }}
            className="text-xl md:text-2xl font-black uppercase mb-6 bg-[#ffff00] text-black border-4 border-black p-2 inline-block transform rotate-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse"
          >
            NEW RECORD! 🎉
          </motion.div>
        )}
        <div className={`text-3xl md:text-4xl font-bold mb-4 p-4 inline-block transform rotate-1 ${mode === 'challenge' && !bossDefeated ? 'bg-white text-black' : 'bg-black text-white'}`}>
          Score: <span className={mode === 'challenge' && !bossDefeated ? 'text-[#ff0000]' : 'text-[#00ffff]'}>{score}</span>
        </div>
        <div className={`text-xl md:text-2xl font-bold mb-10 border-4 border-black p-2 inline-block transform -rotate-1 ${mode === 'challenge' && !bossDefeated ? 'bg-black text-white' : 'bg-white text-black'}`}>
          + {xpEarned} XP
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center">
          <button onClick={onMenu} className="doodle-button px-6 py-3 md:px-8 md:py-4 text-xl md:text-2xl font-black text-black uppercase bg-white">Menu</button>
          <button onClick={onPlayAgain} className="doodle-button px-6 py-3 md:px-8 md:py-4 text-xl md:text-2xl font-black bg-[#ffea00] text-black uppercase">Play Again</button>
        </div>
      </motion.div>
    </div>
  );
};
