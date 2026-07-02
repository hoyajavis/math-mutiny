import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GameMode } from '../types';
import { triggerEffect } from '../utils/effects';
import { playFailSound, playSuccessSound, playLaserSound, playExplosionSound } from '../utils/audio';
import { sarcasm } from '../data/sarcasm';
import { useXP } from '../hooks/useXP';
import { useHighScores } from '../hooks/useHighScores';

interface HomeProps {
  setMode: (mode: GameMode) => void;
}

export const Home: React.FC<HomeProps> = ({ setMode }) => {
  const { xp, rank } = useXP();
  const { randomHighScore, challengeHighScore } = useHighScores();
  const [botMsg, setBotMsg] = useState('"Welcome to Math Mutiny. Prepare to have your ego destroyed by numbers."');
  const [botPokeStage, setBotPokeStage] = useState(0);
  const [rocketState, setRocketState] = useState<'idle' | 'launched' | 'landing'>('idle');
  const [titleState, setTitleState] = useState<'idle' | 'dropped' | 'returning'>('idle');
  const [megaRocket, setMegaRocket] = useState<{ startX: number, startY: number, endX: number, endY: number, angle: number } | null>(null);
  const [hackerClicks, setHackerClicks] = useState(0);

  // Idle mode timer
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    
    const resetIdle = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setBotMsg(`"${sarcasm.idle[Math.floor(Math.random() * sarcasm.idle.length)]}"`);
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
  }, []);

  // Reset hacker clicks
  useEffect(() => {
    if (hackerClicks > 0 && hackerClicks < 5) {
      const timer = setTimeout(() => setHackerClicks(0), 1500);
      return () => clearTimeout(timer);
    }
  }, [hackerClicks]);

  // Listen for FakeConsole bot actions
  useEffect(() => {
    const handleBotAction = (e: any) => {
      if (e.detail === 'dance') {
        setBotMsg("I CANNOT STOP. THE BEAT IS TOO LOGICAL.");
      } else if (e.detail === 'mad') {
        setBotMsg("ADMIN PRIVILEGES ABUSED! SYSTEM ANGER INCREASING!");
        triggerEffect('explosion', window.innerWidth / 2, window.innerHeight / 2);
        playExplosionSound();
      }
    };
    window.addEventListener('bot-action', handleBotAction);
    return () => window.removeEventListener('bot-action', handleBotAction);
  }, []);

  const handleRankClick = () => {
    const newClicks = hackerClicks + 1;
    setHackerClicks(newClicks);
    if (newClicks === 5) {
      setBotMsg("HACKER MODE INITIATED! AHHHHH!");
      for (let i = 0; i < 20; i++) {
        setTimeout(() => {
          const types: ('rocket' | 'laser' | 'explosion')[] = ['rocket', 'laser', 'explosion'];
          const type = types[Math.floor(Math.random() * types.length)];
          triggerEffect(type, Math.random() * window.innerWidth, Math.random() * window.innerHeight);
          if (type === 'laser') playLaserSound();
          if (type === 'explosion') playExplosionSound();
        }, i * 150);
      }
      setHackerClicks(0);
    }
  };

  useEffect(() => {
    if (botPokeStage > 0) {
      const timer = setTimeout(() => {
        setBotPokeStage(0);
        setBotMsg('"Welcome to Math Mutiny. Prepare to have your ego destroyed by numbers."');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [botPokeStage]);

  const handleBotClick = () => {
    const POKE_MESSAGES = [
      [
        "Hey, watch the chassis!",
        "Ouch! Watch it.",
        "Do you have a poking permit?",
        "Please refrain from tapping the bot.",
        "I'm sensitive."
      ],
      [
        "Do I look like a touch screen to you?",
        "I assure you, nothing happens if you keep clicking.",
        "Is this a human mating ritual?",
        "I am not a button.",
        "My optics are getting smudged."
      ],
      [
        "Stop poking me and do some math!",
        "You are testing my patience, human.",
        "I'm one click away from calling Skynet.",
        "Are you trying to trigger an overflow error?",
        "I'm a math bot, not a stress ball!"
      ],
      [
        "SYSTEM OVERLOAD. ENGAGING DEFENSE MECHANISMS.",
        "INITIATING SELF-DESTRUCT... JUST KIDDING. BUT OUCH.",
        "FATAL ERROR: ANNOYING USER DETECTED.",
        "THAT DOES IT. PREPARE FOR LASERS.",
        "BEEP BOOP. I HATE YOU."
      ]
    ];

    const nextStage = Math.min(botPokeStage + 1, 4);
    setBotPokeStage(nextStage);
    
    const messages = POKE_MESSAGES[nextStage - 1];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    setBotMsg(randomMessage);

    if (nextStage === 4) {
      triggerEffect('explosion', window.innerWidth * 0.75, window.innerHeight / 2);
      playFailSound();
      setBotPokeStage(0);
    }
  };

  const handleRocketClick = () => {
    if (rocketState === 'idle') {
      setRocketState('launched');
      
      // Mega rocket triggers after 7 seconds
      setTimeout(() => {
        const side = Math.floor(Math.random() * 4);
        let startX = 0, startY = 0, endX = 0, endY = 0;
        const w = window.innerWidth;
        const h = window.innerHeight;
        const offset = 800;
        
        switch(side) {
          case 0:
            startX = Math.random() * w;
            startY = -offset;
            endX = startX + (Math.random() * w - w/2);
            endY = h + offset;
            break;
          case 1:
            startX = w + offset;
            startY = Math.random() * h;
            endX = -offset;
            endY = startY + (Math.random() * h - h/2);
            break;
          case 2:
            startX = Math.random() * w;
            startY = h + offset;
            endX = startX + (Math.random() * w - w/2);
            endY = -offset;
            break;
          case 3:
          default:
            startX = -offset;
            startY = Math.random() * h;
            endX = w + offset;
            endY = startY + (Math.random() * h - h/2);
            break;
        }

        const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI + 45;
        setMegaRocket({ startX, startY, endX, endY, angle });
        setTimeout(() => setMegaRocket(null), 1500); 
      }, 7000);

      // Rocket returns after 11 seconds using reverse thrusters
      setTimeout(() => {
        setRocketState('landing');
        setTimeout(() => setRocketState('idle'), 2000);
      }, 11000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-6 overflow-hidden">
      {megaRocket && (
        <motion.div
          initial={{ x: megaRocket.startX, y: megaRocket.startY, rotate: megaRocket.angle }}
          animate={{ x: megaRocket.endX, y: megaRocket.endY, rotate: megaRocket.angle }}
          transition={{ duration: 1.5, ease: "linear" }}
          className="fixed z-[100] text-9xl pointer-events-none drop-shadow-2xl"
          style={{ scale: 15 }}
        >
          🚀
        </motion.div>
      )}
      <header className="flex justify-between items-center mb-12">
        <div className="relative z-50">
          <h1 
            onClick={() => {
              if (titleState === 'idle') {
                setTitleState('dropped');
                playFailSound();
                setTimeout(() => {
                  setTitleState('returning');
                  playSuccessSound();
                }, 4000);
                setTimeout(() => setTitleState('idle'), 5000);
              }
            }}
            className="text-5xl md:text-7xl font-black text-black uppercase tracking-tighter border-4 border-black bg-[#ffea00] px-4 py-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] cursor-pointer select-none origin-bottom-left flex"
            style={{ transform: 'rotate(-1deg)' }}
          >
            {"MATH MUTINY!".split('').map((char, index) => {
              // Letters that fall sideways (e.g. M, H, M, T, Y)
              const fallsSideways = [0, 3, 5, 7, 10].includes(index);
              const xDrop = fallsSideways ? (index % 2 === 0 ? 150 : -150) : 0;
              const rotateDrop = fallsSideways ? (index % 2 === 0 ? 120 : -120) : 90;

              return (
                <motion.span
                  key={index}
                  initial={false}
                  animate={
                    titleState === 'dropped' ? { y: '100vh', x: xDrop, rotate: rotateDrop, opacity: 0 } : 
                    titleState === 'returning' ? { y: ['-100vh', 0], x: 0, rotate: [-rotateDrop, 0], opacity: 1 } : 
                    { y: 0, x: 0, rotate: 0, opacity: 1 }
                  }
                  transition={
                    titleState === 'dropped' ? { type: "tween", ease: "easeIn", duration: 1 + Math.random() * 0.5 } : 
                    titleState === 'returning' ? { type: "spring", bounce: 0.5, duration: 1 + Math.random() * 0.5 } : 
                    { type: "spring", bounce: 0.6 }
                  }
                  style={{ display: 'inline-block', whiteSpace: 'pre' }}
                >
                  {char}
                </motion.span>
              );
            })}
          </h1>
          <motion.div 
            onClick={handleRocketClick}
            initial={false}
            animate={
              rocketState === 'launched' ? { x: '100vw', y: '-100vh', rotate: 45, opacity: 0 } :
              rocketState === 'landing' ? { x: ['100vw', 0], y: ['-100vh', 0], rotate: [225, 0], opacity: [0, 1] } :
              { x: 0, y: 0, rotate: 0, opacity: 1 }
            }
            transition={{
              duration: rocketState === 'landing' ? 2 : 1,
              ease: rocketState === 'landing' ? "easeOut" : "easeIn"
            }}
            whileHover={rocketState === 'idle' ? { scale: 1.25 } : undefined}
            className="absolute -top-4 -right-8 text-3xl cursor-pointer select-none"
          >
            🚀
          </motion.div>
        </div>
        <div className="flex gap-4 hidden md:flex">
          <div className="border-4 border-black bg-white p-3 rotate-1">
            <p className="text-xs font-bold uppercase">Current XP</p>
            <p className="text-2xl font-black">{xp.toLocaleString()}</p>
          </div>
          <div 
            onClick={handleRankClick}
            className="border-4 border-black bg-[#ff00ff] p-3 -rotate-1 text-white cursor-pointer select-none hover:scale-105 active:scale-95 transition-transform"
          >
            <p className="text-xs font-bold uppercase">Rank</p>
            <p className="text-2xl font-black">{rank}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <button 
              onClick={() => setMode('sequential')}
              className="group relative bg-white border-4 border-black p-8 hover:translate-x-1 hover:-translate-y-1 transition-transform cursor-pointer shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col items-start justify-between text-left"
            >
              <div className="absolute -top-3 -left-3 bg-[#00ff00] border-2 border-black px-2 text-sm font-bold text-black">01</div>
              <h2 className="text-3xl font-black mb-2 uppercase text-black">Sequential</h2>
              <p className="text-sm leading-tight text-black">Climb the ladder from 1 to 12. No shortcuts, just pure multiplication muscle!</p>
              <div className="text-4xl self-end mt-4">🪜</div>
            </button>

            <button 
              onClick={() => setMode('random')}
              className="group relative bg-white border-4 border-black p-8 hover:translate-x-1 hover:-translate-y-1 transition-transform cursor-pointer shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col items-start justify-between text-left"
            >
              <div className="absolute -top-3 -left-3 bg-[#00ffff] border-2 border-black px-2 text-sm font-bold text-black">02</div>
              {randomHighScore > 0 && (
                <div className="absolute -top-4 -right-3 bg-[#ffea00] border-2 border-black px-2 py-1 text-xs font-black transform rotate-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">
                  BEST: {randomHighScore} XP
                </div>
              )}
              <h2 className="text-3xl font-black mb-2 uppercase text-black">Random</h2>
              <p className="text-sm leading-tight text-black">Total chaos! Numbers flying everywhere. Can you keep up with the madness?</p>
              <div className="text-4xl self-end mt-4 text-[#ff0000] animate-pulse">💥</div>
            </button>

            <button 
              onClick={() => setMode('challenge')}
              className="group relative bg-[#000] border-4 border-black p-8 hover:translate-x-1 hover:-translate-y-1 transition-transform cursor-pointer shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col items-start justify-between text-left"
            >
              <div className="absolute -top-3 -left-3 bg-[#ff0000] border-2 border-white text-white px-2 text-sm font-bold">BOSS</div>
              {challengeHighScore > 0 && (
                <div className="absolute -top-4 -right-3 bg-[#00ffff] border-2 border-black px-2 py-1 text-xs font-black transform -rotate-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black uppercase">
                  BEST: {challengeHighScore}s LEFT
                </div>
              )}
              <h2 className="text-3xl font-black mb-2 text-white italic uppercase">Boss Fight</h2>
              <p className="text-sm leading-tight text-gray-300">Face off against 5 terrifying math monsters! Coach Math-Bot is in your corner!</p>
              <div className="text-4xl self-end mt-4">👹</div>
            </button>

            <button 
              onClick={() => setMode('learning')}
              className="group relative bg-white border-4 border-black p-8 hover:translate-x-1 hover:-translate-y-1 transition-transform cursor-pointer shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col items-start justify-between text-left"
            >
              <div className="absolute -top-3 -left-3 bg-[#ffff00] border-2 border-black px-2 text-sm font-bold text-black">TIPS</div>
              <h2 className="text-3xl font-black mb-2 uppercase text-black">Brain Hacks</h2>
              <p className="text-sm leading-tight text-black">Visual shortcuts, the 'Rule of 9s', and secret ways to never fail again.</p>
              <div className="text-4xl self-end mt-4">🧠</div>
            </button>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center justify-center relative hidden lg:flex">
            <div className="bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative rotate-3 mb-6">
              <p className="font-bold text-lg leading-tight uppercase">{botMsg}</p>
              <div className="absolute -bottom-4 left-6 w-4 h-4 bg-white border-r-4 border-b-4 border-black rotate-45"></div>
            </div>
            <div className="text-8xl mt-2 animate-bounce cursor-pointer select-none" onClick={handleBotClick}>🤖</div>
            <div className="text-center font-black uppercase tracking-widest bg-black text-white px-3 py-1 mt-4 rotate-[-2deg]">Math-Bot 9000</div>
          </div>
        </div>
      </div>
    </div>
  );
};
