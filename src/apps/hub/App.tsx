import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [showPrivacy, setShowPrivacy] = useState(false);

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

      <button
        onClick={() => setShowPrivacy(true)}
        className="mt-16 text-xl font-bold bg-white border-4 border-black px-4 py-2 hover:bg-gray-200 transition-colors z-10"
      >
        Privacy & Data Storage
      </button>

      <AnimatePresence>
        {showPrivacy && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border-8 border-black p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative"
            >
              <button
                onClick={() => setShowPrivacy(false)}
                className="absolute top-4 right-4 text-4xl font-black hover:scale-110 transition-transform bg-red-400 border-4 border-black w-12 h-12 flex items-center justify-center leading-none"
              >
                ×
              </button>

              <h2 className="text-4xl font-black uppercase mb-6 border-b-4 border-black pb-4">Privacy & Data Storage</h2>
              <p className="text-xl font-bold mb-6 italic">The "Zero Tracking" Promise</p>

              <div className="space-y-6 text-lg font-medium">
                <div>
                  <h3 className="text-2xl font-black mb-2 bg-yellow-400 border-2 border-black inline-block px-2">1. No Data Leaves This Device</h3>
                  <p>This application is entirely local-first. All spaced-repetition schedules, XP tracking, mastery stats, and response latency logs are stored directly in your browser's local database (IndexedDB). No data is ever transmitted to an external server, cloud database, or third party.</p>
                </div>

                <div>
                  <h3 className="text-2xl font-black mb-2 bg-cyan-400 border-2 border-black inline-block px-2">2. No Accounts or Telemetry</h3>
                  <p>There are no user accounts, no login screens, and no passwords. We do not use Google Analytics, tracking pixels, or advertising cookies. The application operates completely offline once loaded.</p>
                </div>

                <div>
                  <h3 className="text-2xl font-black mb-2 bg-purple-400 border-2 border-black inline-block px-2">3. Open Source Transparency</h3>
                  <p>The complete source code for the mathematical engines, procedural generators, and UI is publicly available on GitHub. Anyone can verify exactly how the application runs and confirm the absence of network calls.</p>
                </div>

                <div className="bg-red-100 border-4 border-black p-4 mt-8">
                  <h3 className="text-2xl font-black mb-2 flex items-center gap-2">⚠️ Important Note on Data Loss</h3>
                  <p>Because your progress is saved locally to your specific browser, clearing your browser's site data or cache will permanently delete your mastery history and XP. If you switch to a different device or a different browser, you will be starting with a blank slate.</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Decorative background elements */}
      <div className="fixed top-20 left-10 text-6xl opacity-20 transform -rotate-45 font-black pointer-events-none z-0">x = y²</div>
      <div className="fixed bottom-20 right-10 text-8xl opacity-20 transform rotate-12 font-black pointer-events-none z-0">3/4</div>
      <div className="fixed top-40 right-20 text-7xl opacity-20 font-black pointer-events-none z-0">÷</div>
      <div className="fixed bottom-40 left-20 text-9xl opacity-20 font-black pointer-events-none z-0">=</div>
    </div>
  );
}
