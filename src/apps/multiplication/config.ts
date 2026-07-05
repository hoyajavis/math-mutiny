import { AppConfig, Question } from '../../shared/types';
import { generateSequential, generateRandom, generateChallengeFSRS } from '../../shared/utils/math';
// Removed
import { sarcasm } from '../../shared/data/sarcasm';
import { tips } from '../../shared/data/tips';

export const multiplicationConfig: AppConfig = {
  appId: 'multiplication',
  title: 'Multiplication Mutiny',
  theme: {
    primaryBg: 'bg-yellow-400',
    primaryText: 'text-black',
    primaryBorder: 'border-black',
    buttonBg: 'bg-white',
    buttonHoverShadow: 'hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]',
    buttonShadow: 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
  },
  skills: Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    label: (i + 1).toString(),
    prefix: (i + 1).toString()
  })),
  generateQuestions: (mode, skillId, cardsRecord) => {
    if (mode === 'sequential' && skillId) {
      return generateSequential(skillId as number);
    }
    if (mode === 'random') {
      return generateRandom(15);
    }
    if (mode === 'challenge') {
      return generateChallengeFSRS(100, cardsRecord || {});
    }
    return [];
  },
  bosses: [
    {
      name: 'MULTIPLICATOR',
      hp: 20,
      taunts: ['I will multiply your pain!', 'Do the math, you cannot win.', 'I am exponentially better than you.', 'Calculations predict your defeat.'],
      hitMessages: ['Ouch!', 'My algorithms!', 'Error!'],
      defeatedMessage: 'Does not compute... I am bested...'
    },
    {
      name: 'DIVIDER OF SOULS',
      hp: 30,
      taunts: ['I will split you in half!', 'Your focus is divided.', 'Prepare for fractions of your former self.', 'You cannot remain whole.'],
      hitMessages: ['My armor fractures!', 'A clean cut!', 'No!'],
      defeatedMessage: 'I am broken... into pieces...'
    },
    {
      name: 'THE REMAINDER',
      hp: 40,
      taunts: ['You are nothing but a remainder.', 'I am what is left when you fail.', 'You cannot divide me evenly.', 'There is always a remainder.'],
      hitMessages: ['I am reduced!', 'A prime hit!', 'Calculated pain!'],
      defeatedMessage: 'I leave nothing behind...'
    },
    {
      name: 'PRIME MINOTAUR',
      hp: 50,
      taunts: ['My power is indivisible.', 'You cannot factor my strength.', 'I am purely prime.', 'A labyrinth of numbers awaits.'],
      hitMessages: ['A composite strike!', 'My prime defense falls!', 'Gaaah!'],
      defeatedMessage: 'My factors... revealed...'
    },
    {
      name: 'MOTH WIZARD',
      hp: 100,
      taunts: ['Flutter, flutter... into my trap.', 'Drawn to the light of the wrong answer.', 'I multiply faster than you can blink!', 'Dust in your eyes, numbers in your mind.'],
      hitMessages: ['My beautiful wings!', 'I am swat!', 'No, the light!'],
      defeatedMessage: 'I am drawn to the great bulb in the sky...'
    }
  ],
  tips: tips,
  sarcasm: sarcasm
};
