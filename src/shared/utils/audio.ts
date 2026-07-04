export const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  // @ts-ignore
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  return new AudioContext();
};

let audioCtx: AudioContext | null = null;

const resumeAudio = () => {
  if (!audioCtx) audioCtx = getAudioContext();
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

export const playLaserSound = () => {
  resumeAudio();
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'square';
  osc.frequency.setValueAtTime(1200, t);
  osc.frequency.exponentialRampToValueAtTime(100, t + 0.15);
  
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.2, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start(t);
  osc.stop(t + 0.15);
};

export const playExplosionSound = () => {
  resumeAudio();
  if (!audioCtx) return;
  
  const t = audioCtx.currentTime;
  const duration = 0.8;
  
  // 1. Noise blast
  const bufferSize = audioCtx.sampleRate * duration;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    // Generate pink-ish noise by accumulating random
    data[i] = (Math.random() * 2 - 1) + (Math.random() * 2 - 1);
  }
  
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2000, t);
  filter.frequency.exponentialRampToValueAtTime(100, t + duration);
  
  const noiseGain = audioCtx.createGain();
  noiseGain.gain.setValueAtTime(1.5, t);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, t + duration);
  
  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(audioCtx.destination);
  
  // 2. Sub bass drop (the "oomph")
  const osc = audioCtx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(150, t);
  osc.frequency.exponentialRampToValueAtTime(20, t + duration * 0.7);
  
  const oscGain = audioCtx.createGain();
  oscGain.gain.setValueAtTime(1.5, t);
  oscGain.gain.exponentialRampToValueAtTime(0.01, t + duration * 0.7);
  
  osc.connect(oscGain);
  oscGain.connect(audioCtx.destination);
  
  // 3. Crunchy transient (square)
  const transient = audioCtx.createOscillator();
  transient.type = 'square';
  transient.frequency.setValueAtTime(100, t);
  transient.frequency.exponentialRampToValueAtTime(10, t + 0.2);
  
  const transGain = audioCtx.createGain();
  transGain.gain.setValueAtTime(1, t);
  transGain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
  
  transient.connect(transGain);
  transGain.connect(audioCtx.destination);
  
  noise.start(t);
  osc.start(t);
  transient.start(t);
  
  noise.stop(t + duration);
  osc.stop(t + duration);
  transient.stop(t + 0.2);
};

export const playSuccessSound = () => {
  resumeAudio();
  if (!audioCtx) return;
  
  const t = audioCtx.currentTime;
  
  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc1.type = 'square';
  osc2.type = 'square';
  
  // C5, E5, G5, C6 fast arpeggio (arcade power up)
  osc1.frequency.setValueAtTime(523.25, t);
  osc1.frequency.setValueAtTime(659.25, t + 0.05);
  osc1.frequency.setValueAtTime(783.99, t + 0.1);
  osc1.frequency.setValueAtTime(1046.50, t + 0.15);
  
  osc2.frequency.setValueAtTime(523.25 * 1.01, t); // slight detune
  osc2.frequency.setValueAtTime(659.25 * 1.01, t + 0.05);
  osc2.frequency.setValueAtTime(783.99 * 1.01, t + 0.1);
  osc2.frequency.setValueAtTime(1046.50 * 1.01, t + 0.15);
  
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.3, t + 0.02);
  gain.gain.setValueAtTime(0.3, t + 0.15);
  gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
  
  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc1.start(t);
  osc2.start(t);
  osc1.stop(t + 0.3);
  osc2.stop(t + 0.3);
};

export const playFailSound = () => {
  resumeAudio();
  if (!audioCtx) return;
  
  const t = audioCtx.currentTime;
  
  // Dissonant low frequencies (thud / buzzer)
  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc1.type = 'sawtooth';
  osc2.type = 'square';
  
  osc1.frequency.setValueAtTime(150, t);
  osc1.frequency.exponentialRampToValueAtTime(40, t + 0.3);
  
  osc2.frequency.setValueAtTime(160, t);
  osc2.frequency.exponentialRampToValueAtTime(45, t + 0.3);
  
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.4, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
  
  // add a bit of noise
  const bufferSize = audioCtx.sampleRate * 0.3;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  const noiseFilter = audioCtx.createBiquadFilter();
  noiseFilter.type = 'lowpass';
  noiseFilter.frequency.setValueAtTime(800, t);
  noiseFilter.frequency.exponentialRampToValueAtTime(100, t + 0.2);
  
  const noiseGain = audioCtx.createGain();
  noiseGain.gain.setValueAtTime(0.5, t);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
  
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(audioCtx.destination);
  
  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc1.start(t);
  osc2.start(t);
  noise.start(t);
  osc1.stop(t + 0.3);
  osc2.stop(t + 0.3);
};
