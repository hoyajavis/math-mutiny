import React from 'react';
import { AppConfig } from '../../types';

interface NumpadProps {
  config: AppConfig;
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  onSubmit?: () => void; // Optional if we want enter key to submit
}

export const Numpad: React.FC<NumpadProps> = ({ config, onKeyPress, onBackspace, onClear, onSubmit }) => {
  const isFraction = config.appId === 'fractions';

  const fractionKeys = [
    '1', '2', '3', '/', 
    '4', '5', '6', '.', 
    '7', '8', '9', ' ', 
    'C', '0', 'DEL', 'ENTER'
  ];

  const arithmeticKeys = [
    '1', '2', '3', 
    '4', '5', '6', 
    '7', '8', '9', 
    'C', '0', 'DEL' // 'ENTER' is handled implicitly for arithmetic if we want, or add it explicitly
  ];
  
  // Actually, wait, let's keep ENTER for all to unify. Arithmetic didn't have DEL before? It says "C, 0, ENTER".
  // Oh, wait, the user's fraction numpad had 'DEL'.
  // I will just use the `keys` array dynamically.
  
  const keys = isFraction ? fractionKeys : ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'ENTER'];

  return (
    <div className={`mt-1 sm:mt-2 w-full max-w-sm ${isFraction ? 'max-w-md' : 'max-w-xs'}`}>
      <div className={`grid ${isFraction ? 'grid-cols-4' : 'grid-cols-3'} gap-1 sm:gap-2`}>
        {keys.map((btn) => (
          <button
            key={btn}
            type="button"
            onClick={() => {
              if (btn === 'DEL') onBackspace();
              else if (btn === 'C') onClear();
              else if (btn === 'ENTER' && onSubmit) onSubmit();
              else if (btn !== 'ENTER') onKeyPress(btn);
            }}
            className={`doodle-button font-black text-lg sm:text-xl md:text-2xl py-1 xs:py-2 flex items-center justify-center
              ${btn === 'ENTER' ? `${config.theme.buttonBg} ${config.theme.primaryText} text-xs sm:text-sm md:text-lg` : 
                (btn === 'C' || btn === 'DEL') ? 'bg-red-500 text-white text-xs sm:text-sm md:text-lg' : 
                (btn === '/' || btn === '.' || btn === ' ') ? `${config.theme.primaryBg} ${config.theme.primaryText}` :
                'bg-white text-black'}
            `}
          >
            {btn === 'ENTER' ? '↵' : btn === ' ' ? 'SPC' : btn}
          </button>
        ))}
      </div>
    </div>
  );
};
