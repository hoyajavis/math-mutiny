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
import { BossIntro } from './quiz/BossIntro';

interface QuizModeProps {
  mode: 'sequential' | 'random' | 'challenge';
  setMode: (m: GameMode) => void;
  config: AppConfig;
}

export const QuizMode: React.FC<QuizModeProps> = ({ mode, setMode, config }) => {
  const { addXp } = useXP();
  const { recordAttempt, getAllCards } = useFSRS();
  const { recordRandomScore, recordChallengeScore } = useHighScores(config.appId);

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
  const [showBossIntro, setShowBossIntro] = useState(false);

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
      setShowBossIntro(true);
      setIsTransitioning(true);
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
    
    let lastReset = 0;
    const resetIdle = () => {
      const now = Date.now();
      if (now - lastReset < 1000) return;
      lastReset = now;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setBotMessage(config.sarcasm.idle[Math.floor(Math.random() * config.sarcasm.idle.length)]);
      }, 30000);
    };

    window.addEventListener('mousemove', resetIdle, { passive: true });
    window.addEventListener('keydown', resetIdle, { passive: true });
    window.addEventListener('click', resetIdle, { passive: true });
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
        setBotMessage(customBotMessage || config.sarcasm.correct[Math.floor(Math.random() * config.sarcasm.correct.length)]);
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
            if (mode === 'sequential' || mode === 'random') {
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
      setBotMessage(config.sarcasm.incorrect[Math.floor(Math.random() * config.sarcasm.incorrect.length)]);
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

  if (showBossIntro && mode === 'challenge') {
    return (
      <BossIntro 
        boss={currentBoss}
        onComplete={() => {
          setShowBossIntro(false);
          setIsTransitioning(false);
          setQuestionStartTime(Date.now());
        }}
      />
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className={`flex flex-col min-h-screen p-1 xs:p-2 sm:p-4 md:p-6 lg:p-4 transition-colors duration-300 ${mode === 'challenge' ? `bg-black text-white` : config.theme.primaryBg} ${isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
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

      <div className="flex-1 min-h-0 overflow-y-auto lg:overflow-visible flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto w-full gap-1 sm:gap-2 lg:gap-4 pb-2">
        
        {/* Math-Bot / Boss Coach Area */}
        {mode === 'challenge' && (
          <div className="w-full lg:w-64 flex flex-row lg:flex-col items-center justify-center shrink-0 mb-1 lg:mb-0 order-last lg:order-first mt-1 lg:mt-0 gap-2 lg:gap-0">
            <motion.div 
              key={botMessage}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white text-black border-2 sm:border-4 border-black p-1 sm:p-3 md:p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative mb-0 lg:mb-4 transform rotate-2 w-full max-w-[200px] sm:max-w-sm flex-1 lg:flex-none"
            >
              <p className="font-bold text-xs sm:text-lg leading-tight text-center">{botMessage}</p>
              <div className="absolute top-1/2 -right-4 -mt-2 lg:top-auto lg:-bottom-4 lg:right-1/2 lg:ml-2 w-4 h-4 bg-white border-t-4 border-r-4 lg:border-t-0 lg:border-r-4 lg:border-b-4 border-black rotate-45 hidden lg:block"></div>
            </motion.div>
            <div className="flex flex-col items-center shrink-0">
              <div className={`text-4xl sm:text-6xl md:text-7xl animate-bounce drop-shadow-xl cursor-pointer select-none`} onClick={handleBotClick}>
                🤖
              </div>
              <div className="text-center font-black uppercase tracking-widest text-[8px] sm:text-xs text-white bg-black px-1 sm:px-3 py-0.5 sm:py-1 mt-1 lg:mt-4 transform -rotate-1 hidden sm:block">
                Math-Bot Coach
              </div>
            </div>
          </div>
        )}

        {/* Quiz Area */}
        <div className="flex-1 min-h-0 w-full flex flex-col items-center justify-center max-w-3xl">
          {mode !== 'challenge' && (
            <div className={`text-sm sm:text-2xl font-black mb-1 sm:mb-4 bg-black text-white px-2 sm:px-4 py-0.5 sm:py-1 border-2 sm:border-4 border-black transform rotate-1`}>
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
        <div className="w-full lg:w-64 flex flex-row lg:flex-col items-center justify-center shrink-0 mb-1 lg:mb-0 order-first lg:order-last gap-2 lg:gap-0">
          {mode === 'challenge' ? (
            <div 
              className={`text-4xl sm:text-6xl md:text-7xl animate-pulse drop-shadow-xl cursor-pointer select-none shrink-0`} 
              onClick={() => {
                setBossMessage(currentBoss.taunts[Math.floor(Math.random() * currentBoss.taunts.length)]);
                triggerEffect('explosion', window.innerWidth - 100, window.innerHeight - 100);
              }}
            >
              👹
            </div>
          ) : (
            <div className={`text-4xl sm:text-6xl md:text-7xl animate-bounce drop-shadow-xl cursor-pointer select-none shrink-0`} onClick={handleBotClick}>
              🤖
            </div>
          )}
          
          <motion.div 
            key={mode === 'challenge' ? bossMessage : botMessage}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white text-black border-2 sm:border-4 border-black p-1 sm:p-3 md:p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative mb-0 lg:mb-4 transform -rotate-2 w-full max-w-[200px] sm:max-w-sm flex-1 lg:flex-none"
          >
            <p className="font-bold text-xs sm:text-lg leading-tight text-center">{mode === 'challenge' ? bossMessage : botMessage}</p>
            <div className="absolute top-1/2 -left-4 -mt-2 lg:top-auto lg:-bottom-4 lg:left-1/2 lg:-ml-2 w-4 h-4 bg-white border-b-4 border-l-4 lg:border-b-4 lg:border-r-4 lg:border-l-0 border-black rotate-45 hidden lg:block"></div>
          </motion.div>
          
          <div 
            className={`hidden lg:block text-center font-black uppercase tracking-widest text-white px-3 py-1 mt-4 transform rotate-1 bg-black`}
          >
            {mode === 'challenge' ? currentBoss.name : 'Math-Bot 9000'}
          </div>
        </div>

      </div>
    </div>
  );
};
