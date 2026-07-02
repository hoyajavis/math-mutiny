import React, { useState } from 'react';
import { Home } from './components/Home';
import { LearningMode } from './components/LearningMode';
import { QuizMode } from './components/QuizMode';
import { EffectOverlay } from './components/EffectOverlay';
import { FakeConsole } from './components/FakeConsole';
import { GameMode } from './types';

export default function App() {
  const [mode, setMode] = useState<GameMode>('home');

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
