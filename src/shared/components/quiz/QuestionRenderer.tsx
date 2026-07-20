import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppConfig, Question } from '../../types';

interface QuestionRendererProps {
  config: AppConfig;
  currentIndex: number;
  currentQ?: Question;
  input: string;
  setInput: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({ 
  config, currentIndex, currentQ, input, setInput, onSubmit 
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Keep focus on input
    const focusInput = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };
    focusInput();
    window.addEventListener('click', focusInput);
    return () => window.removeEventListener('click', focusInput);
  }, []);

  const isFraction = config.appId === 'fractions';

  return (
    <div className={`border-4 border-black p-2 sm:p-4 md:p-8 w-full bg-white text-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ x: 100, opacity: 0, rotate: 5 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          exit={{ x: -100, opacity: 0, rotate: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex flex-col items-center"
        >
          <div className="font-black text-2xl sm:text-4xl md:text-5xl lg:text-7xl mb-2 sm:mb-6 flex items-center justify-center gap-2 md:gap-4 w-full text-center flex-wrap">
            {currentQ?.type === 'fraction' && currentQ.fractionType === 'visual' ? (
              <div className="flex justify-center items-center w-full mb-4">
                <svg viewBox="0 0 120 120" className="w-20 h-20 sm:w-32 sm:h-32 md:w-48 md:h-48 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  {Array.from({ length: currentQ.total || 1 }).map((_, i) => {
                    const angle = 360 / (currentQ.total || 1);
                    const startAngle = i * angle - 90;
                    const endAngle = (i + 1) * angle - 90;
                    const x1 = 60 + 50 * Math.cos(startAngle * Math.PI / 180);
                    const y1 = 60 + 50 * Math.sin(startAngle * Math.PI / 180);
                    const x2 = 60 + 50 * Math.cos(endAngle * Math.PI / 180);
                    const y2 = 60 + 50 * Math.sin(endAngle * Math.PI / 180);
                    const largeArcFlag = angle > 180 ? 1 : 0;
                    const pathData = `M 60 60 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
                    const isShaded = i < (currentQ.shaded || 0);
                    // Use theme colors for visual pie chart
                    const fill = isShaded ? (config.theme.primaryBg.replace('bg-', '') || '#00ff00') : '#fdf4ff';
                    // We just use hardcoded colors for now to ensure it looks decent, or pull from somewhere
                    return <path key={i} d={pathData} fill={isShaded ? '#39ff14' : '#fdf4ff'} stroke="#000" strokeWidth="4" />;
                  })}
                </svg>
              </div>
            ) : currentQ?.type === 'fraction' ? (
              <>
                <span className={`text-base sm:text-xl md:text-2xl ${config.theme.primaryText} mr-2 sm:mr-4 tracking-widest uppercase`}>
                  {currentQ.fractionType === 'simplification' ? 'Simplify' : 
                   currentQ.fractionType === 'improperToMixed' ? 'To Mixed' :
                   currentQ.fractionType === 'mixedToImproper' ? 'To Improper' :
                   currentQ.fractionType === 'decimal' ? 'To Decimal' : ''}
                </span>
                <span className={`border-b-4 sm:border-b-8 border-black pb-0 sm:pb-1 px-1 sm:px-2 md:px-4 text-purple-600 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] whitespace-nowrap`}>{currentQ.a}</span>
                {currentQ.b && (
                  <>
                    <span className="text-4xl">/</span>
                    <span className={`border-b-4 sm:border-b-8 border-black pb-0 sm:pb-1 px-1 sm:px-2 md:px-4 text-yellow-500 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]`}>{currentQ.b}</span>
                  </>
                )}
                <span className="text-2xl sm:text-4xl">=</span>
              </>
            ) : currentQ?.type === 'arithmetic' ? (
              <>
                <span className="border-b-4 sm:border-b-8 border-black pb-0 sm:pb-1 px-1 sm:px-2 md:px-4 text-[#ff00ff] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">{currentQ.a}</span>
                <span className="text-4xl text-black">{currentQ.operator}</span>
                <span className="border-b-4 sm:border-b-8 border-black pb-0 sm:pb-1 px-1 sm:px-2 md:px-4 text-[#00ff00] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">{currentQ.b}</span>
                <span className="text-4xl text-black">=</span>
              </>
            ) : null}
          </div>

          <form onSubmit={onSubmit} className="w-full max-w-xs relative">
            <input
              ref={inputRef}
              type="text"
              inputMode="none"
              value={input}
              onChange={e => {
                let val = e.target.value;
                if (isFraction) {
                  val = val.replace(/[^0-9/ .]/g, '');
                  if (val.length <= 10) setInput(val);
                } else {
                  val = val.replace(/[^0-9]/g, '');
                  if (val.length <= 4) setInput(val);
                }
              }}
              className={`w-full text-center text-2xl sm:text-4xl md:text-5xl font-black p-1 sm:p-2 md:p-4 border-4 sm:border-[6px] border-black outline-none ${config.theme.primaryBg} ${config.theme.primaryText} shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:translate-y-[-2px] focus:translate-x-[-2px] transition-all uppercase`}
              placeholder="?"
              autoFocus
            />
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
