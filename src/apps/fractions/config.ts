import { AppConfig, Question } from '../../shared/types';
import { 
  generateVisualFacts, 
  generateSimplificationFacts, 
  generateImproperToMixedFacts, 
  generateMixedToImproperFacts, 
  generateDecimalFacts,
  generateAllFractionTypes,
  generateFractionChallengeFSRS
} from '../../shared/utils/fractions';
import { sarcasm } from '../../shared/data/sarcasm';
import { fractionTips } from '../../shared/data/fractionTips';

export const fractionsConfig: AppConfig = {
  appId: 'fractions',
  title: 'Fraction Mutiny',
  theme: {
    primaryBg: 'bg-purple-50',
    primaryText: 'text-purple-950',
    primaryBorder: 'border-purple-950',
    buttonBg: 'bg-white',
    buttonHoverShadow: 'hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]',
    buttonShadow: 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
  },
  skills: [
    { id: 'Visuals', label: 'Visuals', prefix: 'vis_' },
    { id: 'Simplifying', label: 'Simplifying', prefix: 'simp_' },
    { id: 'To Mixed', label: 'To Mixed', prefix: 'imp2mix_' },
    { id: 'To Improper', label: 'To Improper', prefix: 'mix2imp_' },
    { id: 'Decimals', label: 'Decimals', prefix: 'dec_' }
  ],
  generateQuestions: (mode, skillId, cardsRecord) => {
    if (mode === 'sequential' && skillId) {
      if (skillId === 'Visuals') return generateVisualFacts(15);
      if (skillId === 'Simplifying') return generateSimplificationFacts(15);
      if (skillId === 'To Mixed') return generateImproperToMixedFacts(15);
      if (skillId === 'To Improper') return generateMixedToImproperFacts(15);
      if (skillId === 'Decimals') return generateDecimalFacts(15);
    }
    if (mode === 'random') {
      return generateAllFractionTypes(15);
    }
    if (mode === 'challenge') {
      return generateFractionChallengeFSRS(100, cardsRecord || {});
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
  tips: fractionTips,
  sarcasm: sarcasm
};
