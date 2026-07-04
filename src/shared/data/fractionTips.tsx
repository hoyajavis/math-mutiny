import React from 'react';
import { motion } from 'motion/react';

export const fractionTips = [
  {
    id: 'Visuals',
    title: 'See the Slices',
    visual: '🍕',
    text: "Think of fractions like slices of a pizza. The bottom number (denominator) tells you how many slices make up the whole pizza. The top number (numerator) tells you how many slices you have.\nIf the pie is cut into 4 slices and 3 are shaded, that's 3/4.",
    graphic: (
      <div className="flex items-center justify-center p-4 bg-purple-100 border-4 border-black rounded-lg gap-8">
        <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
          {/* Slices of pizza */}
          <path d="M 50 50 L 50 0 A 50 50 0 0 1 100 50 Z" fill="#39ff14" stroke="#000" strokeWidth="2" />
          <path d="M 50 50 L 100 50 A 50 50 0 0 1 50 100 Z" fill="#39ff14" stroke="#000" strokeWidth="2" />
          <path d="M 50 50 L 50 100 A 50 50 0 0 1 0 50 Z" fill="#39ff14" stroke="#000" strokeWidth="2" />
          <path d="M 50 50 L 0 50 A 50 50 0 0 1 50 0 Z" fill="#fdf4ff" stroke="#000" strokeWidth="2" />
        </svg>
        <div className="font-black text-5xl flex flex-col items-center">
          <span className="text-pink-500">3</span>
          <div className="w-12 h-1 bg-black my-1"></div>
          <span className="text-blue-500">4</span>
        </div>
      </div>
    )
  },
  {
    id: 'Simplifying',
    title: 'Find the Common Factor',
    visual: '🔍',
    text: "To simplify a fraction, look for a number that divides evenly into both the top and the bottom.\nIf both numbers are even, you can always divide by 2! Keep dividing until you can't divide them evenly anymore.\nFor example: 4/8 -> divide both by 4 -> 1/2.",
    graphic: (
      <div className="flex items-center justify-center p-4 bg-purple-100 border-4 border-black rounded-lg gap-4 font-black text-3xl">
        <div className="flex flex-col items-center">
          <span>4</span><div className="w-8 h-1 bg-black my-1"></div><span>8</span>
        </div>
        <div className="flex flex-col text-sm text-blue-500 justify-center gap-4">
          <span>÷4 ➔</span>
          <span>÷4 ➔</span>
        </div>
        <div className="flex flex-col items-center text-pink-500">
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ repeat: Infinity, duration: 2 }}>1</motion.span>
          <div className="w-8 h-1 bg-black my-1"></div>
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ repeat: Infinity, duration: 2 }}>2</motion.span>
        </div>
      </div>
    )
  },
  {
    id: 'To Mixed',
    title: 'Top-Heavy Fractions',
    visual: '🏋️',
    text: "If the top number is bigger than the bottom number, it's an improper fraction (top-heavy).\nTo convert it to a mixed number, divide the top by the bottom.\nThe whole number is your answer, and the remainder becomes your new numerator over the same denominator.\nFor example: 5/4 -> 5 divided by 4 is 1 with a remainder of 1. So it's 1 1/4.",
    graphic: (
      <div className="flex items-center justify-center p-4 bg-purple-100 border-4 border-black rounded-lg gap-4 font-black text-3xl">
        <div className="flex flex-col items-center">
          <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="text-red-500">5</motion.span>
          <div className="w-8 h-1 bg-black my-1"></div>
          <span>4</span>
        </div>
        <span>=</span>
        <div className="flex items-center gap-2">
          <motion.span initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ repeat: Infinity, duration: 2 }} className="text-blue-500 text-5xl">1</motion.span>
          <div className="flex flex-col items-center text-pink-500">
            <span>1</span><div className="w-6 h-1 bg-black my-1"></div><span>4</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'To Improper',
    title: 'The Multiply & Add Trick',
    visual: '🔄',
    text: "To turn a mixed number into an improper fraction, multiply the whole number by the denominator, then add the numerator.\nPut that result over the original denominator.\nFor example: 1 1/4 -> 1 * 4 = 4. Add 1 = 5. So it's 5/4.",
    graphic: (
      <div className="flex flex-col items-center justify-center p-4 bg-purple-100 border-4 border-black rounded-lg gap-2 font-black">
        <div className="flex items-center gap-2 text-3xl">
          <span className="text-blue-500">1</span>
          <div className="flex flex-col items-center">
            <span className="text-pink-500">1</span><div className="w-6 h-1 bg-black my-1"></div><span>4</span>
          </div>
          <span>➔</span>
          <div className="flex flex-col items-center text-red-500">
            <span>5</span><div className="w-6 h-1 bg-black my-1"></div><span className="text-black">4</span>
          </div>
        </div>
        <p className="text-sm">(1 x 4) + 1 = 5</p>
      </div>
    )
  },
  {
    id: 'Decimals',
    title: 'Quarters and Tenths',
    visual: '🪙',
    text: "Some fractions are easy to convert to decimals if you memorize them.\n1/2 is 0.5 (half a dollar).\n1/4 is 0.25 (a quarter).\nIf the bottom is 10, just put the top number after the decimal point! 3/10 is 0.3.",
    graphic: (
      <div className="flex flex-col items-center justify-center p-4 bg-purple-100 border-4 border-black rounded-lg gap-2 font-black text-2xl">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center"><span>1</span><div className="w-4 h-1 bg-black"></div><span>2</span></div>
          <span>=</span>
          <span className="text-pink-500">0.5</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center"><span>3</span><div className="w-4 h-1 bg-black"></div><span>10</span></div>
          <span>=</span>
          <span className="text-blue-500">0.3</span>
        </div>
      </div>
    )
  }
];
