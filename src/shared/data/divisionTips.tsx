import React from 'react';
import { motion } from 'motion/react';

export const divisionTips = [
  {
    id: 1,
    title: "The Identity Rule",
    text: "Any number divided by 1 is just itself! 7 ÷ 1 = 7.",
    visual: "1️⃣"
  },
  { 
    id: 2, 
    title: "Cut in Half", 
    text: "Dividing by 2 is just cutting the number in half! Think of sharing something equally with a friend.", 
    visual: "2️⃣",
    graphic: (
      <div className="flex flex-col items-center justify-center p-4 bg-cyan-100 border-4 border-black rounded-lg gap-4">
        <div className="flex gap-2 text-3xl">
          <span>🍕</span><span>🍕</span><span>🍕</span><span>🍕</span>
        </div>
        <div className="flex items-center gap-4 text-2xl font-black">
          <motion.div initial={{ x: 20 }} animate={{ x: -10 }} transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1 }} className="flex gap-1 border-r-4 border-black pr-4">
            <span>🍕</span><span>🍕</span>
          </motion.div>
          <motion.div initial={{ x: -20 }} animate={{ x: 10 }} transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1 }} className="flex gap-1">
            <span>🍕</span><span>🍕</span>
          </motion.div>
        </div>
        <p className="font-black text-xl">4 ÷ 2 = 2</p>
      </div>
    )
  },
  { 
    id: 3, 
    title: "Sum of Digits", 
    text: "If you add up the digits and that sum is divisible by 3, the whole number is! e.g., 27 -> 2 + 7 = 9. 9 ÷ 3 works!", 
    visual: "3️⃣" 
  },
  { 
    id: 4, 
    title: "Half of a Half", 
    text: "Cut it in half, then cut it in half again! 24 ÷ 2 = 12. 12 ÷ 2 = 6. So 24 ÷ 4 = 6.", 
    visual: "4️⃣",
    graphic: (
      <div className="flex flex-col items-center justify-center font-black text-2xl p-4 bg-cyan-100 border-4 border-black rounded-lg gap-2">
        <div className="flex items-center gap-2"><span>24</span><span>÷2 ➔</span><span className="text-blue-500">12</span></div>
        <div className="flex items-center gap-2"><span className="text-blue-500">12</span><span>÷2 ➔</span><span className="text-pink-500">6</span></div>
      </div>
    )
  },
  { 
    id: 5, 
    title: "Double and Drop", 
    text: "Double the number, then drop the last zero! 40 ÷ 5 -> 40 x 2 = 80 -> Drop the zero -> 8.", 
    visual: "5️⃣",
    graphic: (
      <div className="flex flex-col items-center justify-center font-black text-3xl p-4 bg-cyan-100 border-4 border-black rounded-lg gap-2">
        <div>40 x 2 = <span className="text-blue-500">80</span></div>
        <div className="flex gap-1">
          <span className="text-blue-500">8</span>
          <motion.span animate={{ y: 50, opacity: 0 }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-red-500">0</motion.span>
        </div>
      </div>
    )
  },
  { 
    id: 6, 
    title: "Even by Three", 
    text: "It must be an even number AND the sum of its digits must be divisible by 3 (the rule for 3).", 
    visual: "6️⃣" 
  },
  { 
    id: 7, 
    title: "The Tricky Seven", 
    text: "7 is tough! Memorization is key here. 56 ÷ 7 = 8. (5, 6, 7, 8).", 
    visual: "7️⃣" 
  },
  { 
    id: 8, 
    title: "Half x3", 
    text: "Cut it in half three times! 48 ÷ 8 -> 24 -> 12 -> 6.", 
    visual: "8️⃣" 
  },
  { 
    id: 9, 
    title: "Sum is Nine", 
    text: "If you add the digits and it equals 9, it is divisible by 9! E.g., 63 -> 6 + 3 = 9.", 
    visual: "9️⃣" 
  },
  { 
    id: 10, 
    title: "Chop the Zero", 
    text: "Just chop the 0 off the end! 90 ÷ 10 = 9.", 
    visual: "🔟",
    graphic: (
      <div className="flex items-center justify-center font-black text-5xl p-4 bg-cyan-100 border-4 border-black rounded-lg gap-2 overflow-hidden">
        <span>9</span>
        <motion.span animate={{ y: 50, rotate: 45, opacity: 0 }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-red-500">0</motion.span>
      </div>
    )
  },
  { 
    id: 11, 
    title: "Double Digits", 
    text: "If it's a double digit (up to 99), just pick one of the digits! 77 ÷ 11 = 7.", 
    visual: "1️⃣1️⃣" 
  },
  { 
    id: 12, 
    title: "Dozen Rules", 
    text: "It must be divisible by both 3 and 4! Check if it's in the dozen song: 12, 24, 36, 48...", 
    visual: "1️⃣2️⃣" 
  }
];
