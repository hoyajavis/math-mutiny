import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GameMode } from '../../../shared/types';
import { tips } from '../../../shared/data/tips';
import { useXP } from '../../../shared/hooks/useXP';

export const LearningMode: React.FC<{ setMode: (m: GameMode) => void }> = ({ setMode }) => {
  const { addXp } = useXP();
  const [selectedTip, setSelectedTip] = useState(tips[0]);
  const [step, setStep] = useState(1);
  const [example, setExample] = useState<{ equation: string, answer: number } | null>(null);

  const sentences = selectedTip.text.match(/[^.!?]+[.!?]+/g) || [selectedTip.text];

  React.useEffect(() => {
    setStep(1);
    setExample(null);
  }, [selectedTip]);

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden p-2 md:p-4 lg:p-6">
      <header className="flex justify-between items-center mb-2 md:mb-4 lg:mb-6 shrink-0">
        <h1 className="text-2xl md:text-4xl font-black text-cyan-950 uppercase tracking-tighter transform -rotate-1 border-4 border-cyan-950 bg-[#ffff00] px-2 py-1 md:px-4 md:py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          Brain Hacks
        </h1>
        <button 
          onClick={() => setMode('home')}
          className="doodle-button px-2 py-1 md:px-4 md:py-2 font-black uppercase text-sm md:text-xl"
        >
          ← Abort
        </button>
      </header>

      <div className="flex-1 flex flex-col md:flex-row gap-2 md:gap-4 lg:gap-6 min-h-0 overflow-hidden">
        <div className="w-full md:w-64 lg:w-80 flex flex-col shrink-0 border-4 border-cyan-950 bg-cyan-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <h2 className="font-black text-lg md:text-2xl p-2 md:p-4 border-b-4 border-cyan-950 bg-[#0891b2] uppercase text-center shrink-0">Select a Table</h2>
          <div className="flex md:flex-col gap-2 p-2 md:p-4 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto bg-gray-100 flex-1">
            {tips.map(tip => (
              <button
                key={tip.table}
                onClick={() => setSelectedTip(tip)}
                className={`border-2 border-cyan-950 p-2 md:p-3 font-bold text-sm md:text-lg text-left transition-colors uppercase whitespace-nowrap md:whitespace-normal shrink-0 ${selectedTip.table === tip.table ? 'bg-[#0284c7] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-1 -translate-y-1' : 'bg-cyan-50 hover:bg-gray-50'}`}
              >
                Table of {tip.table}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <motion.div 
            key={selectedTip.table}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 border-4 border-cyan-950 p-3 md:p-6 lg:p-8 bg-[#0ea5e9] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col relative overflow-hidden"
          >
            <div className="absolute top-2 right-2 text-4xl md:text-6xl lg:text-8xl opacity-30 transform rotate-12 pointer-events-none">
              {selectedTip.visual}
            </div>
            
            <div className="shrink-0">
              <h1 className="font-black text-3xl md:text-5xl lg:text-6xl mb-1 md:mb-2 text-cyan-950 border-b-4 border-cyan-950 pb-2 md:pb-4">The {selectedTip.table}s</h1>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-4 lg:mb-6 text-cyan-950 bg-cyan-50 border-2 border-cyan-950 inline-block px-2 md:px-4 py-1 self-start transform -rotate-1 mt-2 md:mt-4">{selectedTip.title}</h2>
            </div>
            
            <div 
              className="text-lg md:text-2xl lg:text-3xl leading-snug md:leading-relaxed whitespace-pre-wrap flex-grow font-bold bg-cyan-50 border-4 border-cyan-950 p-3 md:p-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-2 md:gap-4 cursor-pointer select-none relative overflow-y-auto min-h-0"
              onClick={() => {
                if (step < sentences.length) {
                  setStep(s => s + 1);
                }
              }}
            >
              {sentences.map((sentence, idx) => (
                idx < step && (
                  <motion.div
                    key={`${selectedTip.table}-${idx}`}
                    initial={{ opacity: 0, x: -20, rotate: -1 }}
                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="bg-gray-100 border-2 border-cyan-950 p-3 inline-block self-start shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    {sentence.trim()}
                  </motion.div>
                )
              ))}
              {step < sentences.length ? (
                <motion.div 
                  animate={{ y: [0, 5, 0] }} 
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="bg-[#14b8a6] text-cyan-50 border-2 border-cyan-950 px-2 py-1 md:px-4 md:py-2 text-sm md:text-lg mt-auto text-center font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] self-center shrink-0 hover:scale-105 transition-transform"
                >
                  Click to reveal next step ▼
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-auto flex flex-col gap-2 md:gap-4 w-full shrink-0"
                >
                  {example && (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-yellow-300 border-4 border-cyan-950 p-2 md:p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center self-center transform rotate-1 my-2"
                    >
                      <p className="text-sm md:text-xl font-bold uppercase mb-1 md:mb-2">Try Applying the Trick!</p>
                      <p className="text-2xl md:text-4xl font-black mb-1 md:mb-2">{example.equation} = {example.answer}</p>
                    </motion.div>
                  )}
                  <div className="flex flex-col sm:flex-row gap-2 md:gap-4 justify-center items-center">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const randMultiplier = Math.floor(Math.random() * 12) + 1;
                        setExample({
                          equation: `${selectedTip.table} x ${randMultiplier}`,
                          answer: selectedTip.table * randMultiplier
                        });
                        addXp(5);
                      }}
                      className="bg-blue-500 text-cyan-50 border-2 border-cyan-950 px-2 py-1 md:px-4 md:py-2 text-sm md:text-lg font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                    >
                      Show Example 🎲
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setStep(1);
                        setExample(null);
                      }}
                      className="bg-[#00ffcc] text-cyan-950 border-2 border-cyan-950 px-2 py-1 md:px-4 md:py-2 text-sm md:text-lg font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                    >
                      Read Again 🔄
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="hidden lg:block shrink-0 mt-4 md:mt-8 text-center text-sm md:text-xl font-bold italic bg-cyan-950 text-cyan-50 p-2 md:p-4 transform rotate-1">
              "You got this, it's easier than it looks!" - Diary of a Math Whiz
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
