import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-12">
        Math Mutiny
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full">
        <a 
          href="/math-mutiny/multiplication.html" 
          className="group block p-8 bg-gray-900 border border-gray-800 rounded-2xl hover:border-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all"
        >
          <h2 className="text-2xl font-bold mb-4 text-blue-400 group-hover:text-blue-300">Multiplication</h2>
          <p className="text-gray-400">Master your times tables with spaced repetition.</p>
        </a>

        <a 
          href="/math-mutiny/division.html" 
          className="group block p-8 bg-gray-900 border border-gray-800 rounded-2xl hover:border-purple-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all"
        >
          <h2 className="text-2xl font-bold mb-4 text-purple-400 group-hover:text-purple-300">Division</h2>
          <p className="text-gray-400">Learn inverse operations and division facts.</p>
        </a>

        <a 
          href="/math-mutiny/fractions.html" 
          className="group block p-8 bg-gray-900 border border-gray-800 rounded-2xl hover:border-emerald-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all"
        >
          <h2 className="text-2xl font-bold mb-4 text-emerald-400 group-hover:text-emerald-300">Fractions</h2>
          <p className="text-gray-400">Add, subtract, and multiply fractions like a pro.</p>
        </a>
      </div>
    </div>
  );
}
