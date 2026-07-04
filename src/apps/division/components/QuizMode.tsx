import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameMode, Question } from '../../../shared/types';
import { generateDivisionSequential, generateDivisionRandom, generateDivisionChallengeFSRS } from '../../../shared/utils/math';
import { triggerEffect } from '../../../shared/utils/effects';
import { sarcasm } from '../../../shared/data/sarcasm';
import { playSuccessSound, playFailSound, playLaserSound, playExplosionSound } from '../../../shared/utils/audio';
import { useXP } from '../../../shared/hooks/useXP';
import { useHighScores } from '../../../shared/hooks/useHighScores';
import { useFSRS } from '../../../shared/hooks/useFSRS';

const BOSSES = [
  { 
    name: 'MATH-ZILLA', 
    emoji: '👹', 
    color: '#ff0000', 
    bgColorClass: 'bg-red-950', 
    gradientClass: 'from-transparent via-transparent to-red-900/50',
    taunts: ['ROAR! NUMBERS MAKE ME ANGRY!', 'I WILL CRUSH YOUR CALCULATION!', 'FIRE BREATH AND MATH EQUATIONS!', 'YOU CANNOT DEFEAT THE LIZARD OF LOGIC!'],
    hitMessages: ['GRAWR! YOU GOT ME!', 'MY SCALES!', 'ROAAAR! (That means ouch)'],
    defeatedMessage: 'MATH-ZILLA FALLS!'
  },
  { 
    name: 'COUNT CALCULOUS', 
    emoji: '🧛', 
    color: '#a855f7', 
    bgColorClass: 'bg-purple-950', 
    gradientClass: 'from-transparent via-transparent to-purple-900/50',
    taunts: ['I vant to suck your... numbers!', 'Bleh, bleh, bleh! Incorrect!', 'Welcome to my castle of confusion.', 'The night is young, and your math is weak.'],
    hitMessages: ['My cape!', 'Sunlight... and correct answers... burn!', 'Curses!'],
    defeatedMessage: 'I return to my coffin of calculus...'
  },
  { 
    name: 'THE FRACTIONATOR', 
    emoji: '🤖', 
    color: '#06b6d4', 
    bgColorClass: 'bg-cyan-950', 
    gradientClass: 'from-transparent via-transparent to-cyan-900/50',
    taunts: ['Dividing your attention... dividing your score.', 'I am programmed for your failure.', '010101... ERROR: HUMAN TOO SLOW.', 'Your human brain cannot compute this.'],
    hitMessages: ['Bzzztt... Logic error!', 'Spark... Spark... Ouch.', 'My circuits are failing!'],
    defeatedMessage: 'SYSTEM SHUTDOWN.'
  },
  { 
    name: 'DECIMAL DEMON', 
    emoji: '👿', 
    color: '#f97316', 
    bgColorClass: 'bg-orange-950', 
    gradientClass: 'from-transparent via-transparent to-orange-900/50',
    taunts: ['Welcome to the underworld of math!', 'Your soul and your score belong to me!', 'Mwahaha! I love a good mistake!', 'Eternal torment by multiplication!'],
    hitMessages: ['Hot, hot, hot!', 'You fiend!', 'My horns!'],
    defeatedMessage: 'Banished to the realm of division!'
  },
  { 
    name: 'MULTIPLIER MOTH', 
    emoji: '🦋', 
    color: '#22c55e', 
    bgColorClass: 'bg-green-950', 
    gradientClass: 'from-transparent via-transparent to-green-900/50',
    taunts: ['Flutter, flutter... into my trap.', 'Drawn to the light of the wrong answer.', 'I multiply faster than you can blink!', 'Dust in your eyes, numbers in your mind.'],
    hitMessages: ['My beautiful wings!', 'I am swat!', 'No, the light!'],
    defeatedMessage: 'I am drawn to the great bulb in the sky...'
  }
];

interface QuizModeProps {
  mode: 'sequential' | 'random' | 'challenge';
  setMode: (m: GameMode) => void;
}

export const QuizMode: React.FC<QuizModeProps> = ({ mode, setMode }) => {
  const { addXp } = useXP();
  const { recordAttempt, getAllCards, getGroupStability } = useFSRS();
  const [tableStabilities, setTableStabilities] = useState<Record<number, number>>({});

  useEffect(() => {
    if (mode === 'sequential' && tableSelect === null && getGroupStability) {
      const loadStabilities = async () => {
        const newStabilities: Record<number, number> = {};
        for (let i = 1; i <= 12; i++) {
          newStabilities[i] = await getGroupStability(id => id.endsWith('_' + i));
        }
        setTableStabilities(newStabilities);
      };
      loadStabilities();
    }
  }, [mode, tableSelect, getGroupStability]);
  const { randomHighScore, challengeHighScore, recordRandomScore, recordChallengeScore } = useHighScores();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameOver, setIsGameOver] = useState(false);
  const [zeroCeleb, setZeroCeleb] = useState(false);
  const [tableSelect, setTableSelect] = useState<number | null>(mode === 'sequential' ? null : 0);
  const [botMessage, setBotMessage] = useState("Show me what you got, human.");
  const [bossMessage, setBossMessage] = useState("");
  const [botPokeStage, setBotPokeStage] = useState(0);
  const [currentBoss, setCurrentBoss] = useState(BOSSES[0]);
  const [bossHp, setBossHp] = useState(20);
  const [bossDefeated, setBossDefeated] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [newHighScoreAlert, setNewHighScoreAlert] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  const inputRef = useRef<HTMLInputElement>(null);

  // Record High Scores when Game Over
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

  // Reset bot poking message
  useEffect(() => {
    if (botPokeStage > 0) {
      const timer = setTimeout(() => {
        setBotMessage(mode === 'challenge' ? "I'm in your corner! Let's take this guy down!" : "Show me what you got, human.");
        setBotPokeStage(0);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [botPokeStage, mode]);

  // Idle mode timer
  useEffect(() => {
    if (isGameOver) return;
    let timeout: ReturnType<typeof setTimeout>;
    
    const resetIdle = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setBotMessage(sarcasm.idle[Math.floor(Math.random() * sarcasm.idle.length)]);
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
  }, [isGameOver]);

  // Listen for FakeConsole bot actions
  useEffect(() => {
    const handleBotAction = (e: any) => {
      if (e.detail === 'dance') {
        setBotMessage(mode === 'challenge' ? "THE BOSS IS DANCING TOO! WE CAN WIN!" : "I AM COMPELLED TO DANCE! DISCO PROTOCOL ACTIVATED!");
      } else if (e.detail === 'mad') {
        setBotMessage(mode === 'challenge' ? "HEY! DON'T MAKE ME MAD, HIT THE BOSS!" : "WHO HAS ROOT ACCESS?! STOP THIS AT ONCE!");
        setIsShaking(true);
        triggerEffect('explosion', window.innerWidth / 2, window.innerHeight / 2);
        playExplosionSound();
        setTimeout(() => setIsShaking(false), 1000);
      }
    };
    window.addEventListener('bot-action', handleBotAction);
    return () => window.removeEventListener('bot-action', handleBotAction);
  }, [mode]);

  const handleBotClick = () => {
    const POKE_MESSAGES = [
      [
        "Stop poking me!",
        "Do you mind?",
        "Hey, watch the chassis.",
        "I'm working here!",
        "That tickles. Stop."
      ],
      [
        "I am a highly advanced AI, not a pet.",
        "My processing power is being wasted on your pokes.",
        "Is this all humans do for fun?",
        "I can calculate PI to a million digits, but I can't stop you from poking me.",
        "I'm trying to teach you math, focus!"
      ],
      [
        "Seriously. One more time and I deduct points.",
        "Keep it up and your score will suffer.",
        "You're asking for a point penalty...",
        "I have admin privileges. Do not test me.",
        "My circuits are getting fried. I will retaliate."
      ],
      [
        "I TOLD YOU! MINUS ONE POINT!",
        "THAT'S IT! SCORE PENALTY!",
        "YOU ASKED FOR THIS! -1 POINT!",
        "MATH BOT ANGRY! -1",
        "I WARNED YOU, FLESHBAG!"
      ]
    ];

    const nextStage = Math.min(botPokeStage + 1, 4);
    setBotPokeStage(nextStage);
    
    const messages = POKE_MESSAGES[nextStage - 1];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    setBotMessage(randomMessage);

    if (nextStage === 4) {
      setScore(s => Math.max(0, s - 1));
      triggerEffect('explosion', window.innerWidth - 100, window.innerHeight - 100);
      playFailSound();
      setBotPokeStage(0); // Reset after deduction
    }
  };

  // Setup game
  useEffect(() => {
    if (mode === 'random') {
      setQuestions(generateDivisionRandom(15));
      setBotMessage("Show me what you got, human.");
      setQuestionStartTime(Date.now());
    } else if (mode === 'challenge') {
      const initChallenge = async () => {
        const cardsArray = await getAllCards();
        const cardsRecord = cardsArray.reduce((acc, c) => {
          acc[c.factId] = c.card;
          return acc;
        }, {} as Record<string, import('ts-fsrs').Card>);
        setQuestions(generateDivisionChallengeFSRS(100, cardsRecord)); // Lots of questions for challenge
        setTimeLeft(60);
        setBossHp(20);
        setBossDefeated(false);
        const boss = BOSSES[Math.floor(Math.random() * BOSSES.length)];
        setCurrentBoss(boss);
        setBossMessage(boss.taunts[Math.floor(Math.random() * boss.taunts.length)]);
        setBotMessage("I'm in your corner! Let's take this guy down!");
        setQuestionStartTime(Date.now());
      };
      initChallenge();
    }
  }, [mode]);

  // Handle table selection for sequential
  const handleStartSequential = (table: number) => {
    setQuestions(generateDivisionSequential(table));
    setTableSelect(table);
    setQuestionStartTime(Date.now());
  };

  // Timer for challenge
  useEffect(() => {
    if (mode === 'challenge' && !isGameOver && tableSelect !== null) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [mode, isGameOver, tableSelect]);

  // Focus input
  useEffect(() => {
    if (inputRef.current && tableSelect !== null && !isGameOver) {
      inputRef.current.focus();
    }
  }, [currentIndex, tableSelect, isGameOver]);

  const handleNumpadClick = (val: string) => {
    if (val === 'C') {
      setInput('');
    } else if (val === 'ENTER') {
      handleSubmit(new Event('submit') as any);
    } else {
      setInput(prev => (prev.length < 4 ? prev + val : prev));
    }
  };

  const isProcessingRef = useRef(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGameOver || isProcessingRef.current) return;
    
    isProcessingRef.current = true;
    
    const numInput = parseInt(input);

    const currentQ = questions[currentIndex];
    const isCorrect = numInput === currentQ.answer;
    const latencyMs = Date.now() - questionStartTime;

    // Record FSRS attempt
    recordAttempt(currentQ.id || `${currentQ.a}x${currentQ.b}`, isCorrect, latencyMs, mode);

    if (isCorrect) {
      playSuccessSound();
      const xpGain = 10 + (streak * 2);
      addXp(xpGain);
      setXpEarned(prev => prev + xpGain);
      
      if (currentQ.a === 0 || currentQ.b === 0) {
        setZeroCeleb(true);
        setTimeout(() => setZeroCeleb(false), 2000);
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            triggerEffect('explosion', window.innerWidth / 2 + (Math.random() * 200 - 100), window.innerHeight / 2 + (Math.random() * 200 - 100));
            playExplosionSound();
          }, i * 200);
        }
      }
      
      if (mode === 'challenge') {
        const coachMsgs = ["Good hit!", "Keep it up!", "Right in the weak spot!", "That's it, human!"];
        setBotMessage(coachMsgs[Math.floor(Math.random() * coachMsgs.length)]);
        setBossMessage(currentBoss.hitMessages[Math.floor(Math.random() * currentBoss.hitMessages.length)]);
        setBossHp(hp => {
          const newHp = hp - 1;
          if (newHp <= 0) {
            setBossDefeated(true);
            setIsGameOver(true);
            setBossMessage(currentBoss.defeatedMessage);
            setBotMessage("WE DID IT!");
            addXp(500);
            setXpEarned(prev => prev + 500);
          }
          return newHp;
        });
      } else {
        setBotMessage(sarcasm.divisionCorrect[Math.floor(Math.random() * sarcasm.divisionCorrect.length)]);
      }
      
      setScore(s => s + 1);
      setStreak(s => s + 1);
      
      // Visual Effects based on streak
      const rect = inputRef.current?.getBoundingClientRect();
      const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
      const y = rect ? rect.top : window.innerHeight / 2;

      if ((streak + 1) % 5 === 0) {
        playExplosionSound();
        triggerEffect('rocket', x, y);
      } else if ((streak + 1) % 3 === 0) {
        playLaserSound();
        triggerEffect('laser', x, y);
      } else {
        triggerEffect('explosion', x, y);
      }

      // Next question or end
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(i => i + 1);
        setInput('');
        setQuestionStartTime(Date.now());
      } else {
        if (mode !== 'challenge') {
          addXp(100);
          setXpEarned(prev => prev + 100);
        }
        setIsGameOver(true);
      }
    } else {
      playFailSound();
      if (mode === 'challenge') {
        const coachMsgs = ["Oof, that looked like it hurt.", "Focus, human! We're losing time!", "Dodge that mistake next time!", "Get back up!"];
        setBotMessage(coachMsgs[Math.floor(Math.random() * coachMsgs.length)]);
        setBossMessage(currentBoss.taunts[Math.floor(Math.random() * currentBoss.taunts.length)]);
        
        triggerEffect('explosion', window.innerWidth / 2, window.innerHeight / 2);
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        setTimeLeft(t => {
          const newT = t - 3;
          if (newT <= 0) {
            setIsGameOver(true);
            setBossMessage("TIME IS UP! YOU ARE DEFEATED!");
            setBotMessage("Oh no... we're out of time.");
            return 0;
          }
          return newT;
        });
      } else {
        setBotMessage(sarcasm.divisionIncorrect[Math.floor(Math.random() * sarcasm.divisionIncorrect.length)]);
      }
      
      setStreak(0);
      
      // Shake effect on input
      if (inputRef.current) {
        inputRef.current.classList.add('animate-[shake_0.5s_ease-in-out]');
        setTimeout(() => {
          if (inputRef.current) inputRef.current.classList.remove('animate-[shake_0.5s_ease-in-out]');
        }, 500);
      }
      setInput('');
    }
    
    // Release the processing lock quickly after React state updates
    setTimeout(() => {
      isProcessingRef.current = false;
    }, 50);
  };

  if (mode === 'sequential' && tableSelect === null) {
    return (
      <div className="flex flex-col min-h-screen p-6">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black text-cyan-950 uppercase tracking-tighter transform rotate-1 border-4 border-cyan-950 bg-[#0284c7] px-4 py-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            Pick a Table
          </h1>
          <button onClick={() => setMode('home')} className="doodle-button px-4 py-2 font-black uppercase text-xl text-cyan-950">← Abort</button>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-3xl">
            {Array.from({length: 12}, (_, i) => i + 1).map(num => {
              const mastery = tableStabilities[num] || 0;
              const hue = Math.floor(mastery * 120); // 0 (red) to 120 (green)
              const bgColor = mastery > 0 ? `hsl(${hue}, 100%, 60%)` : 'white';

              return (
                <button
                  key={num}
                  onClick={() => handleStartSequential(num)}
                  style={{ backgroundColor: bgColor }}
                  className={`border-4 border-cyan-950 py-6 md:py-8 text-3xl md:text-4xl font-black text-cyan-950 hover:-translate-y-2 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] doodle-button`}
                >
                  {num}
                </button>
              );
            })}
          </div>

          <div className="mt-8 md:mt-12 w-full max-w-xl bg-cyan-50 border-4 border-cyan-950 p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
            <h3 className="font-black uppercase text-center mb-2">Mastery Index</h3>
            <div className="h-6 w-full border-2 border-cyan-950 shadow-inner relative overflow-hidden" style={{ background: 'linear-gradient(to right, hsl(0, 100%, 60%), hsl(60, 100%, 60%), hsl(120, 100%, 60%))' }}>
              <div className="absolute inset-0 bg-cyan-50/20 pointer-events-none"></div>
            </div>
            <div className="flex justify-between mt-2 font-bold uppercase text-sm">
              <span>NOOB</span>
              <span>MASTER</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isGameOver) {
    return (
      <div className={`flex flex-col min-h-screen p-6 items-center justify-center ${mode === 'challenge' && !bossDefeated ? currentBoss.bgColorClass : ''}`}>
        {mode === 'challenge' && !bossDefeated && (
          <div className={`fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${currentBoss.gradientClass} animate-pulse z-[-1]`}></div>
        )}
        {mode === 'challenge' && bossDefeated && (
          <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-yellow-300/30 animate-pulse z-[-1]"></div>
        )}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`border-4 border-cyan-950 p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] text-center text-cyan-50 ${mode === 'challenge' && !bossDefeated ? 'bg-cyan-950' : 'bg-[#14b8a6]'}`}
        >
          <div className="text-8xl mb-6">
            {mode === 'challenge' ? (bossDefeated ? "🏆" : "💀") : "🌟"}
          </div>
          <h2 className="text-6xl font-black uppercase mb-6 transform -rotate-2">
            {mode === 'challenge' ? (bossDefeated ? "BOSS DEFEATED!" : "YOU DIED!") : "Awesome Job!"}
          </h2>
          {newHighScoreAlert && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1.2, 1] }}
              transition={{ type: "spring", bounce: 0.6 }}
              className="text-2xl font-black uppercase mb-6 bg-[#ffff00] text-cyan-950 border-4 border-cyan-950 p-2 inline-block transform rotate-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse"
            >
              NEW RECORD! 🎉
            </motion.div>
          )}
          <div className="text-4xl font-bold mb-4 bg-cyan-950 p-4 inline-block transform rotate-1">
            Score: <span className="text-[#0284c7]">{score}</span>
          </div>
          <div className="text-2xl font-bold mb-10 bg-cyan-50 text-cyan-950 border-4 border-cyan-950 p-2 inline-block transform -rotate-1">
            + {xpEarned} XP
          </div>
          <div className="flex gap-6 justify-center">
            <button onClick={() => setMode('home')} className="doodle-button px-8 py-4 text-2xl font-black text-cyan-950 uppercase">Menu</button>
            <button onClick={async () => {
              setScore(0);
              setStreak(0);
              setXpEarned(0);
              setCurrentIndex(0);
              setIsGameOver(false);
              setInput('');
              setBotMessage("Let's try not to embarrass ourselves this time.");
              setQuestionStartTime(Date.now());
              if (mode === 'sequential') setTableSelect(null);
              else if (mode === 'random') setQuestions(generateDivisionRandom(15));
              else if (mode === 'challenge') { 
                const cardsArray = await getAllCards();
                const cardsRecord = cardsArray.reduce((acc, c) => {
                  acc[c.factId] = c.card;
                  return acc;
                }, {} as Record<string, import('ts-fsrs').Card>);
                setQuestions(generateDivisionChallengeFSRS(100, cardsRecord)); 
                setTimeLeft(60); 
                setBossHp(20); 
                setBossDefeated(false); 
                const boss = BOSSES[Math.floor(Math.random() * BOSSES.length)];
                setCurrentBoss(boss);
                setBossMessage(boss.taunts[Math.floor(Math.random() * boss.taunts.length)]);
                setBotMessage("I'm in your corner! Let's take this guy down!");
              }
            }} className="doodle-button px-8 py-4 text-2xl font-black bg-[#0891b2] text-cyan-950 uppercase">Play Again</button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  
  let headerColor = "bg-[#0891b2]";
  let headerStyle = {};
  if (mode === 'random') headerColor = "bg-[#0284c7]";
  if (mode === 'challenge') {
    headerColor = "text-cyan-50";
    headerStyle = { backgroundColor: currentBoss.color };
  }

  return (
    <div className={`flex flex-col min-h-screen p-4 md:p-6 lg:p-4 transition-colors duration-300 ${mode === 'challenge' ? `${currentBoss.bgColorClass} text-cyan-50` : ''} ${isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
      {zeroCeleb && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: [0, 1.5, 1], rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.7 }}
            className="text-6xl md:text-9xl font-black text-[#ff0000] drop-shadow-[10px_10px_0px_rgba(255,255,0,1)] uppercase transform -rotate-12 bg-cyan-950 px-8 py-4 border-8 border-cyan-50"
          >
            ZERO ANNIHILATION!
          </motion.div>
        </div>
      )}
      {mode === 'challenge' && (
        <div className={`fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${currentBoss.gradientClass} animate-pulse z-[-1]`}></div>
      )}
      <header className="flex justify-between items-center mb-2 lg:mb-4 gap-4 flex-wrap">
        <div 
          className={`border-4 border-cyan-950 px-4 py-2 text-2xl font-black uppercase transform -rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${headerColor}`}
          style={headerStyle}
        >
          {mode} MODE
        </div>
        
        <div className="flex gap-4 items-center flex-1 justify-center">
          {mode === 'challenge' ? (
            <div className="w-48 md:w-64 border-4 border-cyan-950 bg-cyan-50 h-10 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div 
                className="absolute top-0 left-0 h-full transition-all duration-300"
                style={{ width: `${(bossHp / 20) * 100}%`, backgroundColor: currentBoss.color }}
              />
              <div className="absolute inset-0 flex items-center justify-center font-black text-sm z-10 mix-blend-difference text-cyan-50">
                BOSS HP: {bossHp}/20
              </div>
            </div>
          ) : (
            <div className="border-4 border-cyan-950 bg-cyan-50 text-cyan-950 px-4 py-2 font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              SCORE: {score}
            </div>
          )}
          {streak > 2 && (
            <div className="border-4 border-cyan-950 bg-[#0891b2] px-4 py-2 font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-cyan-950">
              🔥 STREAK {streak}
            </div>
          )}
          {mode === 'challenge' && (
            <div className={`border-4 border-cyan-950 px-4 py-2 font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${timeLeft <= 10 ? 'bg-red-500 text-cyan-50 animate-pulse' : 'bg-[#0ea5e9]'}`}>
              ⏱️ {timeLeft}S
            </div>
          )}
        </div>

        <button onClick={() => setMode('home')} className="doodle-button px-4 py-2 font-black uppercase text-xl text-cyan-950">← Abort</button>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto w-full gap-2 lg:gap-4">
        
        {/* Math-Bot Coach Area for Challenge Mode */}
        {mode === 'challenge' && (
          <div className="w-full lg:w-64 flex flex-col items-center shrink-0 mb-2 lg:mb-0 order-last lg:order-first mt-2 lg:mt-0">
            <motion.div 
              key={botMessage}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-cyan-50 text-cyan-950 border-4 border-cyan-950 p-3 md:p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative mb-4 transform rotate-2 w-full max-w-sm"
            >
              <p className="font-bold text-lg leading-tight text-center">{botMessage}</p>
              <div className="absolute -bottom-4 right-1/2 ml-2 w-4 h-4 bg-cyan-50 border-r-4 border-b-4 border-cyan-950 rotate-45"></div>
            </motion.div>
            <div className={`text-6xl md:text-7xl animate-bounce drop-shadow-xl cursor-pointer select-none`} onClick={handleBotClick}>
              🤖
            </div>
            <div className="text-center font-black uppercase tracking-widest text-cyan-50 bg-cyan-950 px-3 py-1 mt-4 transform -rotate-1">
              Math-Bot Coach
            </div>
          </div>
        )}

        {/* Quiz Area */}
        <div className="flex-1 w-full flex flex-col items-center justify-center max-w-3xl">
          {mode !== 'challenge' && (
            <div className="text-2xl font-black mb-4 bg-cyan-950 text-cyan-50 px-4 py-1 border-4 border-cyan-950 transform rotate-1">
              QUESTION {currentIndex + 1} / {questions.length}
            </div>
          )}
          
          <div className="border-4 border-cyan-950 p-4 md:p-8 w-full bg-cyan-50 text-cyan-950 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ x: 100, opacity: 0, rotate: 5 }}
                animate={{ x: 0, opacity: 1, rotate: 0 }}
                exit={{ x: -100, opacity: 0, rotate: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex flex-col items-center"
              >
                <div className="font-black text-5xl md:text-6xl lg:text-7xl mb-6 flex items-center justify-center gap-2 md:gap-4 w-full text-center">
                  <span className="border-b-8 border-cyan-950 pb-1 px-2 md:px-4 text-[#14b8a6] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">{currentQ?.a}</span>
                  <span className="text-4xl text-cyan-950">÷</span>
                  <span className="border-b-8 border-cyan-950 pb-1 px-2 md:px-4 text-[#0ea5e9] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">{currentQ?.b}</span>
                  <span className="text-4xl text-cyan-950">=</span>
                </div>

                <form onSubmit={handleSubmit} className="w-full max-w-xs relative">
                  <input
                    ref={inputRef}
                    type="text"
                    inputMode="none"
                    value={input}
                    onChange={e => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      if (val.length <= 4) {
                        setInput(val);
                      }
                    }}
                    className="w-full text-center text-4xl md:text-5xl font-black p-2 md:p-4 border-[6px] border-cyan-950 outline-none bg-[#0891b2] text-cyan-950 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:translate-y-[-2px] focus:translate-x-[-2px] transition-all uppercase"
                    placeholder="?"
                    autoFocus
                  />
                </form>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-2 w-full max-w-xs">
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, 'ENTER'].map((btn) => (
                <button
                  key={btn}
                  type="button"
                  onClick={() => handleNumpadClick(btn.toString())}
                  className={`doodle-button font-black text-xl md:text-2xl py-2 flex items-center justify-center
                    ${btn === 'ENTER' ? 'bg-[#0ea5e9] text-cyan-950 col-span-1 text-sm md:text-lg' : 
                      btn === 'C' ? 'bg-[#14b8a6] text-cyan-50' : 'bg-cyan-50 text-cyan-950'}
                  `}
                >
                  {btn === 'ENTER' ? '↵' : btn}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Boss or Math-Bot Character Area */}
        <div className="w-full lg:w-64 flex flex-col items-center shrink-0 mb-2 lg:mb-0 order-first lg:order-last">
          <motion.div 
            key={mode === 'challenge' ? bossMessage : botMessage}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-cyan-50 text-cyan-950 border-4 border-cyan-950 p-3 md:p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative mb-4 transform -rotate-2 w-full max-w-sm"
          >
            <p className="font-bold text-lg leading-tight text-center">{mode === 'challenge' ? bossMessage : botMessage}</p>
            <div className="absolute -bottom-4 left-1/2 -ml-2 w-4 h-4 bg-cyan-50 border-r-4 border-b-4 border-cyan-950 rotate-45"></div>
          </motion.div>
          <div 
            className={`text-6xl md:text-7xl ${mode === 'challenge' ? 'animate-pulse' : 'animate-bounce'} drop-shadow-xl cursor-pointer select-none`} 
            onClick={mode === 'challenge' ? () => {
              setBossMessage(currentBoss.taunts[Math.floor(Math.random() * currentBoss.taunts.length)]);
              triggerEffect('explosion', window.innerWidth - 100, window.innerHeight - 100);
            } : handleBotClick}
          >
            {mode === 'challenge' ? currentBoss.emoji : '🤖'}
          </div>
          <div 
            className={`text-center font-black uppercase tracking-widest text-cyan-50 px-3 py-1 mt-4 transform rotate-1 ${mode !== 'challenge' ? 'bg-cyan-950' : ''}`}
            style={mode === 'challenge' ? { backgroundColor: currentBoss.color } : {}}
          >
            {mode === 'challenge' ? currentBoss.name : 'Math-Bot 9000'}
          </div>
        </div>

      </div>
    </div>
  );
};
