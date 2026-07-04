export type EffectType = 'rocket' | 'laser' | 'explosion';
export type EffectEvent = { id: string, type: EffectType, x: number, y: number };
type EffectListener = (effect: EffectEvent) => void;

const listeners: EffectListener[] = [];
let idCounter = 0;

export const triggerEffect = (type: EffectType, x: number, y: number) => {
  const effect = { id: `effect-${idCounter++}`, type, x, y };
  listeners.forEach(l => l(effect));
};

export const subscribeToEffects = (listener: EffectListener) => {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) listeners.splice(index, 1);
  };
};
