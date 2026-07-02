import React, { useState, useRef, useEffect } from 'react';
import { triggerEffect } from '../utils/effects';
import { playExplosionSound, playLaserSound } from '../utils/audio';
import { useXP } from '../hooks/useXP';
import { useHighScores } from '../hooks/useHighScores';
import { useMastery } from '../hooks/useMastery';

export const FakeConsole = () => {
  const { resetXP } = useXP();
  const { resetHighScores } = useHighScores();
  const { resetMastery } = useMastery();

  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<string[]>(['SYSTEM READY.', 'Type /help for available commands.']);
  const [inputValue, setInputValue] = useState('');
  const [strikes, setStrikes] = useState(0);
  const [isAwaitingPassword, setIsAwaitingPassword] = useState(false);
  const [passwordRetries, setPasswordRetries] = useState(0);
  const [pendingCommand, setPendingCommand] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView();
    }
  }, [history]);

  const handleCommand = (cmd: string) => {
    if (isAwaitingPassword) {
      const maskedPassword = '*'.repeat(Math.max(1, cmd.length));

      if (pendingCommand === 'user reset' && cmd === 'iamanadult') {
         setIsAwaitingPassword(false);
         setPasswordRetries(0);
         setPendingCommand(null);
         resetXP();
         resetMastery();
         resetHighScores();
         setHistory(prev => [...prev, `> ${maskedPassword}`, 'PASSWORD ACCEPTED.', 'USER PROGRESS RESET SUCCESSFUL.']);
         return;
      }

      if (passwordRetries === 0) {
        setPasswordRetries(1);
        setHistory(prev => [...prev, `> ${maskedPassword}`, 'INCORRECT PASSWORD. 1 RETRY REMAINING.', 'ENTER PASSWORD:']);
      } else {
        setIsAwaitingPassword(false);
        setPasswordRetries(0);
        setPendingCommand(null);
        const newStrikes = strikes + 1;
        setStrikes(newStrikes);
        
        let response = 'ACCESS DENIED: Insufficient privileges.';
        if (newStrikes >= 3) {
          setHistory(prev => [
            ...prev, 
            `> ${maskedPassword}`, 
            response, 
            'WARNING: REPEATED UNAUTHORIZED ACCESS DETECTED.', 
            'INITIATING SYSTEM PURGE IN 3... 2... 1...'
          ]);
          setTimeout(() => window.location.reload(), 3000);
          return;
        }
        response += ` (Incident logged. Warning ${newStrikes}/3)`;
        setHistory(prev => [...prev, `> ${maskedPassword}`, response]);
      }
      return;
    }

    const cleanCmd = cmd.trim().toLowerCase().replace(/^\//, ''); // Remove leading slash
    
    let response = '';

    if (cleanCmd.startsWith('echo ')) {
      response = cleanCmd.substring(5);
    } else if (cleanCmd.startsWith('sudo ')) {
      response = 'Nice try. This incident will be reported to Math-Bot 9000.';
    } else {
      switch (cleanCmd) {
        case 'help':
          response = 'Commands: /ping, /clear, /bot dance, /bot mad, /spawn boss, /give score, /godmode, /noclip, /spin, /matrix, /whoami, /date, /pizza, /echo, /sudo, /user reset';
          break;
        case 'ping':
          response = `Pong! (Latency: ${Math.floor(Math.random() * 50) + 10}ms)`;
          break;
        case 'bot dance':
          response = 'Bot override accepted. Initiating dance sequence...';
          window.dispatchEvent(new CustomEvent('bot-action', { detail: 'dance' }));
          // Some visual flair
          for(let i=0; i<3; i++) {
            setTimeout(() => {
              triggerEffect('rocket', Math.random() * window.innerWidth, window.innerHeight);
              playLaserSound();
            }, i * 300);
          }
          break;
        case 'bot mad':
        case 'bot angry':
          response = 'Bot emotion override applied. Warning: Volatile system state.';
          window.dispatchEvent(new CustomEvent('bot-action', { detail: 'mad' }));
          break;
        case 'spawn boss':
          response = 'ERROR: Room dimensions too small. Entity "MATH-ZILLA" rendering failed.';
          break;
        case 'clear':
          setHistory([]);
          return;
        case 'spin':
          response = 'Initiating barrel roll...';
          document.body.style.transition = 'transform 2s ease-in-out';
          document.body.style.transform = `rotate(${Math.random() > 0.5 ? 360 : -360}deg)`;
          setTimeout(() => {
            document.body.style.transition = 'none';
            document.body.style.transform = 'none';
          }, 2000);
          break;
        case 'matrix':
          response = 'Wake up, Neo... The Matrix has you.';
          setHistory(prev => [...prev, `> ${cmd}`, response]);
          setTimeout(() => {
            setHistory(prev => [...prev, 'Follow the white rabbit.']);
          }, 2000);
          return;
        case 'whoami':
          response = `USER_UNKNOWN_${Math.floor(Math.random() * 9000) + 1000}`;
          break;
        case 'date':
          response = 'ERROR: TEMPORAL SYNC FAILED. CURRENT YEAR ESTIMATED: 2042';
          break;
        case 'pizza':
          response = 'Order received. Expected delivery: 4 to 6 business years.';
          break;
        case 'user reset':
          setIsAwaitingPassword(true);
          setPasswordRetries(0);
          setPendingCommand('user reset');
          setHistory(prev => [...prev, `> ${cmd}`, 'WARNING: THIS WILL ERASE ALL TRACKED USER DATA.', 'ENTER ADMIN PASSWORD TO CONFIRM:']);
          return;
        default:
          if (cleanCmd.startsWith('give') || cleanCmd === 'godmode' || cleanCmd === 'noclip' || cleanCmd === 'hack' || cleanCmd === 'admin') {
            setIsAwaitingPassword(true);
            setPasswordRetries(0);
            setPendingCommand(cleanCmd);
            setHistory(prev => [...prev, `> ${cmd}`, 'COMMAND REQUIRES ELEVATED PERMISSIONS.', 'ENTER PASSWORD:']);
            return;
          } else {
            response = `Unknown command: ${cmd}. Type /help.`;
          }
      }
    }

    setHistory(prev => [...prev, `> ${cmd}`, response]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      handleCommand(inputValue);
      setInputValue('');
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-black text-[#00ff00] font-mono p-2 border-2 border-[#00ff00] z-[100] shadow-[4px_4px_0px_0px_rgba(0,255,0,0.5)] hover:bg-[#00ff00] hover:text-black transition-colors"
      >
        {'>_'}
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 h-64 bg-black border-2 border-[#00ff00] p-3 flex flex-col font-mono text-[#00ff00] text-sm z-[100] shadow-[4px_4px_0px_0px_rgba(0,255,0,0.5)]">
      <div className="flex justify-between items-center border-b border-[#00ff00] pb-2 mb-2">
        <span className="font-bold tracking-widest">ADMIN CONSOLE</span>
        <button onClick={() => setIsOpen(false)} className="hover:text-white hover:bg-[#00ff00] px-2 font-bold cursor-pointer">X</button>
      </div>
      <div className="flex-1 overflow-y-auto flex flex-col space-y-1 mb-2">
        {history.map((line, i) => (
          <span key={i} className={line.startsWith('CRITICAL') || line.startsWith('WARNING') || line.startsWith('ACCESS DENIED') ? 'text-red-500' : ''}>
            {line}
          </span>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex items-center">
        <span className="mr-2">{'>'}</span>
        <input 
          ref={inputRef}
          type={isAwaitingPassword ? "password" : "text"} 
          className="bg-transparent outline-none flex-1 text-[#00ff00] placeholder-[#00ff00]/30" 
          placeholder="Enter command..."
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          onKeyDown={handleKeyDown} 
          autoComplete="off"
          spellCheck="false"
        />
      </div>
    </div>
  );
};
