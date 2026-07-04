import React, { useState } from 'react';
import { Home } from './components/Home';
import { LearningMode } from './components/LearningMode';
import { QuizMode } from './components/QuizMode';
import { EffectOverlay } from '../../shared/components/EffectOverlay';
import { FakeConsole } from '../../shared/components/FakeConsole';
import { GameMode } from '../../shared/types';
import { UserProvider, useUser } from '../../shared/hooks/useUser';
import { motion } from 'motion/react';

function GameApp() {
  const [mode, setMode] = useState<GameMode>('home');
  const { currentUser, login } = useUser();
  const [nameInput, setNameInput] = useState('');

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#39ff14] flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white border-8 border-black p-8 max-w-md w-full shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center"
        >
          <div className="text-6xl mb-4">👾</div>
          <h1 className="text-4xl md:text-5xl font-black uppercase mb-6 transform -rotate-2 text-black leading-tight">IDENTIFY YOURSELF</h1>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (nameInput.trim()) login(nameInput);
            }}
            className="w-full flex flex-col gap-4"
          >
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="ENTER NAME..."
              className="w-full text-2xl font-bold p-4 border-4 border-black bg-gray-100 uppercase focus:bg-[#00ffff] outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-y-[-2px] focus:translate-x-[-2px] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
              autoFocus
              maxLength={15}
            />
            <button
              type="submit"
              disabled={!nameInput.trim()}
              className="w-full bg-[#ff00ff] text-white border-4 border-black p-4 text-2xl font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed transform rotate-1"
            >
              LOG IN
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <EffectOverlay />
      <FakeConsole />
      
      {mode === 'home' && <Home setMode={setMode} />}
      {mode === 'learning' && <LearningMode setMode={setMode} />}
      {(mode === 'sequential' || mode === 'random' || mode === 'challenge') && (
        <QuizMode mode={mode} setMode={setMode} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <GameApp />
    </UserProvider>
  );
}
