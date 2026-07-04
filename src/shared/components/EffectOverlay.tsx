import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { subscribeToEffects, EffectEvent } from '../utils/effects';

export const EffectOverlay: React.FC = () => {
  const [effects, setEffects] = useState<EffectEvent[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToEffects((effect) => {
      setEffects((prev) => [...prev, effect]);
      setTimeout(() => {
        setEffects((prev) => prev.filter(e => e.id !== effect.id));
      }, 2000); // Remove after animation
    });
    return unsubscribe;
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <AnimatePresence>
        {effects.map(effect => (
          <React.Fragment key={effect.id}>
            {effect.type === 'explosion' && (
              <motion.div
                initial={{ scale: 0, rotate: -45, opacity: 1 }}
                animate={{ scale: [1, 1.5, 1], rotate: [-45, 10, -10], opacity: [1, 1, 0] }}
                transition={{ duration: 0.8 }}
                className="absolute flex items-center justify-center"
                style={{ left: effect.x - 100, top: effect.y - 100, width: 200, height: 200 }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full fill-red-500 stroke-black stroke-[3px]">
                  <path d="M 50 0 L 60 30 L 95 20 L 70 45 L 100 70 L 65 70 L 75 100 L 50 80 L 25 100 L 35 70 L 0 70 L 30 45 L 5 20 L 40 30 Z" />
                </svg>
                <span className="absolute font-marker text-4xl text-yellow-300 drop-shadow-[2px_2px_0_#000] rotate-12">BOOM!</span>
              </motion.div>
            )}
            {effect.type === 'rocket' && (
              <motion.div
                initial={{ x: -100, y: window.innerHeight, rotate: 45 }}
                animate={{ x: window.innerWidth + 100, y: -100 }}
                transition={{ duration: 1.2, ease: "easeIn" }}
                className="absolute text-6xl"
                style={{ left: 0, top: 0 }}
              >
                🚀
              </motion.div>
            )}
            {effect.type === 'laser' && (
              <motion.div
                initial={{ scaleX: 0, opacity: 1 }}
                animate={{ scaleX: 1, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute h-4 bg-green-500 origin-left z-40 border-y-2 border-black"
                style={{ 
                  left: -100, 
                  top: effect.y, 
                  width: '200vw', 
                  transform: `rotate(${Math.atan2(effect.y - window.innerHeight/2, effect.x - (-100))}rad)` 
                }}
              />
            )}
          </React.Fragment>
        ))}
      </AnimatePresence>
    </div>
  );
};
