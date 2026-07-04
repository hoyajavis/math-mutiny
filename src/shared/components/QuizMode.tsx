import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { GameMode, AppConfig, Question } from '../types';
import { useXP } from '../hooks/useXP';
import { useFSRS } from '../hooks/useFSRS';
import { useHighScores } from '../hooks/useHighScores';
import { triggerEffect } from '../utils/effects';
import { playSuccessSound, playFailSound } from '../utils/audio';

import { useGameState } from '../hooks/useGameState';
import { HUD } from './quiz/HUD';
import { Numpad } from './quiz/Numpad';
import { QuestionRenderer } from './quiz/QuestionRenderer';
import { SkillSelector } from './quiz/SkillSelector';
import { GameOver } from './quiz/GameOver';

interface QuizModeProps {
  mode: 'sequential' | 'random' | 'challenge';
  setMode: (m: GameMode) => void;
  config: AppConfig;
}

export const QuizMode: React.FC<QuizModeProps> = ({ mode, setMode, config }) => {
  const { addXp } = useXP();
  const { recordAttempt, getAllCards } = useFSRS();
  const { recordRandomScore, recordChallengeScore } = useHighScores();

  const gameState = useGameState(mode, config);
  const {
    score, addScore, streak, incrementStreak, resetStreak,
    combo, incrementCombo, resetCombo, comboAnimation,
    xpEarned, setXpEarned, timeLeft, setTimeLeft, timeElapsed,
    isGameOver, setIsGameOver, isTransitioning, setIsTransitioning,
    currentBoss, setCurrentBoss, bossHp, setBossHp, bossDefeated, setBossDefeated,
    resetGame
  } = gameState;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  
  const [zeroCeleb, setZeroCeleb] = useState(false);
  const [skillSelect, setSkillSelect] = useState<string | number | null>(mode === 'sequential' ? null : 0);
  
  const [botMessage, setBotMessage] = useState("Show me what you got, human.");
  const [bossMessage, setBossMessage] = useState("");
  const [botPokeStage, setBotPokeStage] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [newHighScoreAlert, setNewHighScoreAlert] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  // Initialization and Restart Logic
  const initGame = async (skillId: string | number | null = skillSelect) => {
    resetGame();
    setCurrentIndex(0);
    setInput('');
    setBotMessage("Let's try not to embarrass ourselves this time.");
    setBotPokeStage(0);
    setQuestionStartTime(Date.now());

    if (mode === 'sequential' && skillId !== null) {
      setQuestions(config.generateQuestions('sequential', skillId));
      setSkillSelect(skillId);
    } else if (mode === 'random') {
      setQuestions(config.generateQuestions('random'));
    } else if (mode === 'challenge') {
      let cardsRecord: Record<string, import('ts-fsrs').Card> = {};
      if (getAllCards) {
        const cardsArray = await getAllCards();
        cardsRecord = cardsArray.reduce((acc, c) => {
          acc[c.factId] = c.card;
          return acc;
        }, {} as Record<string, import('ts-fsrs').Card>);
      }
      setQuestions(config.generateQuestions('challenge', undefined, cardsRecord));
      const boss = config.bosses[Math.floor(Math.random() * config.bosses.length)];
      setCurrentBoss(boss);
      setBossHp(boss.hp);
      setBossMessage(boss.taunts[Math.floor(Math.random() * boss.taunts.length)]);
      setBotMessage("I'm in your corner! Let's take this guy down!");
    }
  };

  useEffect(() => {
    if (mode !== 'sequential') {
      initGame(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, config]);

  // Handle Game Over
  useEffect(() => {
    if (isGameOver) {
      if (mode === 'random') {
        if (recordRandomScore(xpEarned)) setNewHighScoreAlert(true);
      } else if (mode === 'challenge' && bossDefeated) {
        if (recordChallengeScore(timeLeft)) setNewHighScoreAlert(true);
      }
    } else {
      setNewHighScoreAlert(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameOver]);

  // Bot Poke Reset
  useEffect(() => {
    if (botPokeStage > 0) {
      const timer = setTimeout(() => {
        setBotMessage(mode === 'challenge' ? "I'm in your corner! Let's take this guy down!" : "Show me what you got, human.");
        setBotPokeStage(0);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [botPokeStage, mode]);

  // Idle mode
  useEffect(() => {
    if (isGameOver || skillSelect === null) return;
    let timeout: ReturnType<typeof setTimeout>;
    
    const resetIdle = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setBotMessage(config.sarcasm.idle[Math.floor(Math.random() * config.sarcasm.idle.length)]);
      }, 30000);
    };

    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);
    window.addEventListener('click', resetIdle);
    resetIdle();

    return () => {
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      window.removeEventListener('click', resetIdle);
      clearTimeout(timeout);
    };
  }, [isGameOver, skillSelect, config.sarcasm.idle]);

  // Handle bot action (from fake console)
  useEffect(() => {
    const handleBotAction = (e: any) => {
      if (mode === 'challenge') {
        setBotMessage("I can't cheat during a boss fight! You're on your own!");
      } else {
        const val = e.detail;
        addScore(val);
        setBotMessage(`Adding ${val} points! 🤖✨ Don't tell the developer.`);
        triggerEffect('sparkle', window.innerWidth / 2, window.innerHeight / 2);
        playSuccessSound();
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 1000);
      }
    };
    window.addEventListener('bot-action', handleBotAction);
    return () => window.removeEventListener('bot-action', handleBotAction);
  }, [mode, addScore]);

  const handleBotClick = () => {
    const POKE_MESSAGES = [
      ["Stop poking me!", "Do you mind?", "Hey, watch the chassis.", "I'm working here!", "That tickles. Stop."],
      ["I am a highly advanced AI, not a pet.", "My processing power is being wasted on your pokes.", "Is this all humans do for fun?", "I'm trying to teach you math, focus!"],
      ["Seriously. One more time and I deduct points.", "Keep it up and your score will suffer.", "You're asking for a point penalty..."],
      ["I TOLD YOU! MINUS ONE POINT!", "THAT'S IT! SCORE PENALTY!", "MATH BOT ANGRY! -1"]
    ];

    const nextStage = Math.min(botPokeStage + 1, 4);
    setBotPokeStage(nextStage);
    
    const messages = POKE_MESSAGES[nextStage - 1] || POKE_MESSAGES[0];
    setBotMessage(messages[Math.floor(Math.random() * messages.length)]);

    if (nextStage === 4) {
      addScore(score > 0 ? -1 : 0);
      triggerEffect('explosion', window.innerWidth - 100, window.innerHeight - 100);
      playFailSound();
      setBotPokeStage(0);
    }
  };

  const isProcessingRef = useRef(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isGameOver || isProcessingRef.current || isTransitioning) return;
    
    isProcessingRef.current = true;
    
    const currentQ = questions[currentIndex];
    
    let isCorrect = false;
    let customBotMessage = '';

    if (currentQ.type === 'arithmetic') {
      isCorrect = parseInt(input) === currentQ.answer;
    } else if (currentQ.type === 'fraction') {
      const cleanInput = input.trim().replace(/\s+/g, ' ');
      const cleanAnswer = String(currentQ.answer).trim().replace(/\s+/g, ' ');

      if (currentQ.fractionType === 'decimal') {
        const inputNum = parseFloat(cleanInput);
        const answerNum = parseFloat(cleanAnswer);
        isCorrect = !isNaN(inputNum) && inputNum === answerNum;
      } else if (currentQ.fractionType === 'visual') {
        // Visual fractions expect exact match (e.g. 2/4) or simplified (e.g. 1/2)
        if (cleanInput === cleanAnswer) {
          isCorrect = true;
        } else {
          // Check mathematically if simplified
          const [inN, inD] = cleanInput.split('/').map(Number);
          const [ansN, ansD] = cleanAnswer.split('/').map(Number);
          if (inD && ansD && (inN / inD === ansN / ansD)) {
            isCorrect = true;
            customBotMessage = "Ooo, someone knows how to simplify! Nice job! ✨";
          }
        }
      } else {
        // Simplification, Improper, Mixed: Exact match on standard form
        isCorrect = cleanInput === cleanAnswer;
      }
    }

    const latencyMs = Date.now() - questionStartTime;
    recordAttempt(currentQ.id, isCorrect, latencyMs, mode);

    if (isCorrect) {
      playSuccessSound();
      const xpGain = 10 + (streak * 2);
      addXp(xpGain);
      setXpEarned(prev => prev + xpGain);
      
      // Zero celeb logic
      if (currentQ.type === 'arithmetic' && (currentQ.a === 0 || currentQ.b === 0)) {
        setZeroCeleb(true);
        setTimeout(() => setZeroCeleb(false), 2000);
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            triggerEffect('explosion', window.innerWidth / 2 + (Math.random() * 200 - 100), window.innerHeight / 2 + (Math.random() * 200 - 100));
          }, i * 200);
        }
        setBotMessage("ZERO DESTROYS ALL! MWHAHAHA!");
      } else {
        setBotMessage(customBotMessage || config.sarcasm.good[Math.floor(Math.random() * config.sarcasm.good.length)]);
      }

      addScore(10 + Math.floor(combo / 5) * 5);
      incrementStreak();
      incrementCombo();

      if (mode === 'challenge') {
        const newBossHp = bossHp - 1;
        setBossHp(newBossHp);
        triggerEffect('explosion', window.innerWidth - 150, window.innerHeight / 2);
        
        if (newBossHp <= 0) {
          playSuccessSound();
          setBossDefeated(true);
          setIsGameOver(true);
          setBossMessage(currentBoss.defeatedMessage);
          for (let i = 0; i < 10; i++) {
            setTimeout(() => {
              triggerEffect('explosion', window.innerWidth - 150 + (Math.random() * 100 - 50), window.innerHeight / 2 + (Math.random() * 100 - 50));
            }, i * 150);
          }
        } else {
          setBossMessage(currentBoss.hitMessages[Math.floor(Math.random() * currentBoss.hitMessages.length)]);
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 500);
        }
      }

      setIsTransitioning(true);
      setTimeout(() => {
        if (mode !== 'challenge' || bossHp > 1) { // If challenge and boss dead, don't go to next Q
          if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setInput('');
            setIsTransitioning(false);
            setQuestionStartTime(Date.now());
          } else {
            if (mode === 'sequential') {
              setIsGameOver(true);
            } else {
              // Generate more questions
              setQuestions(prev => [...prev, ...config.generateQuestions(mode)]);
              setCurrentIndex(prev => prev + 1);
              setInput('');
              setIsTransitioning(false);
              setQuestionStartTime(Date.now());
            }
          }
        } else {
          setIsTransitioning(false);
        }
        isProcessingRef.current = false;
      }, 400);

    } else {
      playFailSound();
      setBotMessage(config.sarcasm.bad[Math.floor(Math.random() * config.sarcasm.bad.length)]);
      resetStreak();
      resetCombo();
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      
      if (mode === 'challenge') {
        setBossMessage(currentBoss.taunts[Math.floor(Math.random() * currentBoss.taunts.length)]);
      }
      
      setInput('');
      isProcessingRef.current = false;
    }
  };

  // Render Sequential Skill Selection
  if (mode === 'sequential' && skillSelect === null) {
    return <SkillSelector config={config} onSelect={initGame} />;
  }

  // Render Game Over
  if (isGameOver) {
    return (
      <GameOver 
        config={config} 
        mode={mode} 
        score={score} 
        xpEarned={xpEarned} 
        bossDefeated={bossDefeated} 
        newHighScoreAlert={newHighScoreAlert}
        onMenu={() => setMode('home')}
        onPlayAgain={() => initGame(skillSelect)}
        currentBoss={{ name: currentBoss.name, bgColorClass: 'bg-black', gradientClass: 'from-transparent via-transparent to-red-900/50' }} 
        // Need to pass the actual boss colors... wait, currentBoss already has them! 
        // Oh right, currentBoss is of type Boss inside config.
      />
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className={`flex flex-col min-h-screen p-4 md:p-6 lg:p-4 transition-colors duration-300 ${mode === 'challenge' ? `bg-black text-white` : config.theme.primaryBg} ${isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
      {zeroCeleb && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: [0, 1.5, 1], rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.7 }}
            className={`text-6xl md:text-9xl font-black text-[#ff0000] drop-shadow-[10px_10px_0px_rgba(255,255,0,1)] uppercase transform -rotate-12 bg-black px-8 py-4 border-8 border-white`}
          >
            ZERO ANNIHILATION!
          </motion.div>
        </div>
      )}
      
      {mode === 'challenge' && (
        <div className={`fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-red-900/50 animate-pulse z-[-1]`}></div>
      )}

      <HUD 
        config={config}
        mode={mode}
        score={score}
        streak={streak}
        combo={combo}
        comboAnimation={comboAnimation}
        timeLeft={timeLeft}
        timeElapsed={timeElapsed}
        boss={mode === 'challenge' ? { name: currentBoss.name, hp: bossHp, maxHp: currentBoss.hp } : undefined}
        onAbort={() => setMode('home')}
      />

      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto w-full gap-2 lg:gap-4">
        
        {/* Math-Bot / Boss Coach Area */}
        {mode === 'challenge' && (
          <div className="w-full lg:w-64 flex flex-col items-center shrink-0 mb-2 lg:mb-0 order-last lg:order-first mt-2 lg:mt-0">
            <motion.div 
              key={botMessage}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white text-black border-4 border-black p-3 md:p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative mb-4 transform rotate-2 w-full max-w-sm"
            >
              <p className="font-bold text-lg leading-tight text-center">{botMessage}</p>
              <div className="absolute -bottom-4 right-1/2 ml-2 w-4 h-4 bg-white border-r-4 border-b-4 border-black rotate-45"></div>
            </motion.div>
            <div className={`text-6xl md:text-7xl animate-bounce drop-shadow-xl cursor-pointer select-none`} onClick={handleBotClick}>
              🤖
            </div>
            <div className="text-center font-black uppercase tracking-widest text-white bg-black px-3 py-1 mt-4 transform -rotate-1">
              Math-Bot Coach
            </div>
          </div>
        )}

        {/* Quiz Area */}
        <div className="flex-1 w-full flex flex-col items-center justify-center max-w-3xl">
          {mode !== 'challenge' && (
            <div className={`text-2xl font-black mb-4 bg-black text-white px-4 py-1 border-4 border-black transform rotate-1`}>
              QUESTION {currentIndex + 1}
            </div>
          )}
          
          <QuestionRenderer 
            config={config}
            currentIndex={currentIndex}
            currentQ={currentQ}
            input={input}
            setInput={setInput}
            onSubmit={handleSubmit}
          />

          <Numpad 
            config={config}
            onKeyPress={(val) => setInput(prev => (prev.length < 10 ? prev + val : prev))}
            onBackspace={() => setInput(prev => prev.slice(0, -1))}
            onClear={() => setInput('')}
            onSubmit={handleSubmit}
          />
        </div>

        {/* Boss Area / Bot Area */}
        <div className="w-full lg:w-64 flex flex-col items-center shrink-0 mb-2 lg:mb-0 order-first lg:order-last">
          <motion.div 
            key={mode === 'challenge' ? bossMessage : botMessage}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white text-black border-4 border-black p-3 md:p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative mb-4 transform -rotate-2 w-full max-w-sm"
          >
            <p className="font-bold text-lg leading-tight text-center">{mode === 'challenge' ? bossMessage : botMessage}</p>
            <div className="absolute -bottom-4 left-1/2 -ml-2 w-4 h-4 bg-white border-r-4 border-b-4 border-black rotate-45"></div>
          </motion.div>
          
          {mode === 'challenge' ? (
            <div 
              className={`text-6xl md:text-7xl animate-pulse drop-shadow-xl cursor-pointer select-none`} 
              onClick={() => {
                setBossMessage(currentBoss.taunts[Math.floor(Math.random() * currentBoss.taunts.length)]);
                triggerEffect('explosion', window.innerWidth - 100, window.innerHeight - 100);
              }}
            >
              👹
            </div>
          ) : (
            <div className={`text-6xl md:text-7xl animate-bounce drop-shadow-xl cursor-pointer select-none`} onClick={handleBotClick}>
              🤖
            </div>
          )}
          <div 
            className={`text-center font-black uppercase tracking-widest text-white px-3 py-1 mt-4 transform rotate-1 bg-black`}
          >
            {mode === 'challenge' ? currentBoss.name : 'Math-Bot 9000'}
          </div>
        </div>

      </div>
    </div>
  );
};
