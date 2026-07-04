import React from 'react';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 text-black relative overflow-hidden">
      <motion.h1 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.6 }}
        className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-16 border-8 border-black bg-[#ffff00] px-8 py-4 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transform -rotate-2 hover:rotate-0 hover:scale-105 transition-all text-center cursor-default z-10"
      >
        Math Mutiny
      </motion.h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-6xl w-full z-10 px-4">
        
        {/* Multiplication */}
        <motion.a 
          whileHover={{ scale: 1.05, rotate: 2 }}
          whileTap={{ scale: 0.95 }}
          href="/math-mutiny/multiplication.html" 
          className="doodle-button flex flex-col items-center p-8 bg-yellow-400 text-center relative group"
        >
          <div className="text-8xl mb-6">✖️</div>
          <h2 className="text-3xl md:text-4xl font-black uppercase mb-4 tracking-widest bg-white border-4 border-black px-4 py-2 transform -rotate-1 group-hover:rotate-1 transition-transform">Multiplication</h2>
          <p className="text-xl font-bold bg-black text-white p-2">Master your times tables.</p>
        </motion.a>

        {/* Division */}
        <motion.a 
          whileHover={{ scale: 1.05, rotate: -2 }}
          whileTap={{ scale: 0.95 }}
          href="/math-mutiny/division.html" 
          className="doodle-button flex flex-col items-center p-8 bg-cyan-400 text-center relative group"
        >
          <div className="text-8xl mb-6">➗</div>
          <h2 className="text-3xl md:text-4xl font-black uppercase mb-4 tracking-widest bg-white border-4 border-black px-4 py-2 transform rotate-1 group-hover:-rotate-1 transition-transform">Division</h2>
          <p className="text-xl font-bold bg-black text-white p-2">Learn inverse operations.</p>
        </motion.a>

        {/* Fractions */}
        <motion.a 
          whileHover={{ scale: 1.05, rotate: 2 }}
          whileTap={{ scale: 0.95 }}
          href="/math-mutiny/fractions.html" 
          className="doodle-button flex flex-col items-center p-8 bg-purple-400 text-center relative group"
        >
          <div className="text-8xl mb-6">🍕</div>
          <h2 className="text-3xl md:text-4xl font-black uppercase mb-4 tracking-widest bg-white border-4 border-black px-4 py-2 transform -rotate-1 group-hover:rotate-1 transition-transform">Fractions</h2>
          <p className="text-xl font-bold bg-black text-white p-2">Master the slices.</p>
        </motion.a>

      </div>

      {/* Decorative background elements */}
      <div className="fixed top-20 left-10 text-6xl opacity-20 transform -rotate-45 font-black pointer-events-none z-0">x = y²</div>
      <div className="fixed bottom-20 right-10 text-8xl opacity-20 transform rotate-12 font-black pointer-events-none z-0">3/4</div>
      <div className="fixed top-40 right-20 text-7xl opacity-20 font-black pointer-events-none z-0">÷</div>
      <div className="fixed bottom-40 left-20 text-9xl opacity-20 font-black pointer-events-none z-0">=</div>
    </div>
  );
}
