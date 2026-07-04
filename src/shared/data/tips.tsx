import React from 'react';
import { motion } from 'motion/react';

export const tips = [
  { 
    id: 2, 
    title: "Double It!", 
    text: "Just add the number to itself. 2 x 7 is just 7 + 7 = 14.", 
    visual: "2️⃣",
    graphic: (
      <div className="flex gap-4 items-center justify-center font-black text-4xl p-4 bg-yellow-100 border-4 border-black rounded-lg">
        <motion.div initial={{ y: -10 }} animate={{ y: 0 }} transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.5 }}>7</motion.div>
        <div>+</div>
        <motion.div initial={{ y: 10 }} animate={{ y: 0 }} transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.5 }}>7</motion.div>
        <div>=</div>
        <div className="text-pink-500">14</div>
      </div>
    )
  },
  { 
    id: 3, 
    title: "Triple Threat", 
    text: "Double it, then add one more! 3 x 6 = (2 x 6) + 6 = 12 + 6 = 18.", 
    visual: "3️⃣" 
  },
  { 
    id: 4, 
    title: "Double Double", 
    text: "Double the number, then double it again! 4 x 7 -> 14 -> 28.", 
    visual: "4️⃣",
    graphic: (
      <div className="flex flex-col items-center justify-center font-black text-3xl p-4 bg-yellow-100 border-4 border-black rounded-lg gap-2">
        <div className="flex items-center gap-2"><span>7</span><span>→</span><span className="text-blue-500">14</span></div>
        <div className="flex items-center gap-2"><span className="text-blue-500">14</span><span>→</span><span className="text-pink-500">28</span></div>
      </div>
    )
  },
  { 
    id: 5, 
    title: "Half of Ten", 
    text: "Multiply by 10, then cut it in half. Or just count by 5s! Ends in 0 or 5.", 
    visual: "5️⃣",
    graphic: (
      <div className="flex items-center justify-center font-black text-3xl p-4 bg-yellow-100 border-4 border-black rounded-lg gap-4">
        <span>6 x 10 = 60</span>
        <span className="text-xl">➔</span>
        <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-pink-500 text-4xl">30</motion.span>
      </div>
    )
  },
  { 
    id: 6, 
    title: "Even Trick", 
    text: "When you multiply 6 by an even number, they end in the same digit! 6x2=12, 6x4=24, 6x6=36, 6x8=48.", 
    visual: "6️⃣" 
  },
  { 
    id: 7, 
    title: "The Weird One", 
    text: "7x8=56 (5,6,7,8). For others, break it down: 7x6 is (5x6) + (2x6) = 30 + 12 = 42.", 
    visual: "7️⃣" 
  },
  { 
    id: 8, 
    title: "Double x3", 
    text: "Double it three times! 8 x 6 -> 12 -> 24 -> 48.", 
    visual: "8️⃣" 
  },
  { 
    id: 9, 
    title: "The Finger Trick", 
    text: "Hold up 10 fingers. Put down the finger you're multiplying by. Fingers left = tens, fingers right = ones! The digits always add up to 9, like 9x3=27 where 2+7=9.", 
    visual: "9️⃣",
    graphic: (
      <div className="flex flex-col items-center justify-center font-black text-xl p-4 bg-yellow-100 border-4 border-black rounded-lg gap-2 text-center">
        <div className="flex gap-1 text-4xl">
          <span>🖐️</span><span>🖐️</span>
        </div>
        <p className="text-sm">9 x 3 = ? (Fold 3rd finger)</p>
        <div className="text-3xl"><span className="text-blue-500">2</span> | <span className="text-pink-500">7</span> = 27</div>
      </div>
    )
  },
  { 
    id: 10, 
    title: "Add a Zero", 
    text: "Just stick a 0 at the end of the number. Easy peasy lemon squeezy.", 
    visual: "🔟",
    graphic: (
      <div className="flex items-center justify-center font-black text-5xl p-4 bg-yellow-100 border-4 border-black rounded-lg gap-2">
        <span>7</span>
        <motion.span initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ repeat: Infinity, duration: 2 }} className="text-pink-500">0</motion.span>
      </div>
    )
  },
  { 
    id: 11, 
    title: "The Twin Trick", 
    text: "Up to 9, just write the number twice! 11 x 4 = 44.", 
    visual: "1️⃣1️⃣",
    graphic: (
      <div className="flex items-center justify-center font-black text-5xl p-4 bg-yellow-100 border-4 border-black rounded-lg gap-2">
        <span>4</span>
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", repeat: Infinity, duration: 2 }} className="text-pink-500">4</motion.span>
      </div>
    )
  },
  { 
    id: 12, 
    title: "Ten Plus Two", 
    text: "Multiply by 10, then add double the number. 12 x 4 = (10x4) + (2x4) = 40 + 8 = 48.", 
    visual: "1️⃣2️⃣" 
  }
];
