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

// --- Boss Intro Cinematic Audio ---
export const playBossIntroMusic = () => {
  resumeAudio();
  if (!audioCtx) return;
  const t = audioCtx.currentTime;

  // Helper: Distortion Curve for Rock Guitar
  const makeDistortionCurve = (amount: number) => {
    const k = amount;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  };

  // 1. The Alarm Siren (0.0s to 1.0s)
  const sirenOsc = audioCtx.createOscillator();
  sirenOsc.type = 'sawtooth';
  sirenOsc.frequency.setValueAtTime(400, t);
  sirenOsc.frequency.linearRampToValueAtTime(800, t + 0.5);
  sirenOsc.frequency.linearRampToValueAtTime(400, t + 1.0);
  
  const sirenGain = audioCtx.createGain();
  sirenGain.gain.setValueAtTime(0, t);
  sirenGain.gain.linearRampToValueAtTime(0.3, t + 0.1);
  sirenGain.gain.setValueAtTime(0.3, t + 0.8);
  sirenGain.gain.linearRampToValueAtTime(0, t + 1.0);
  
  sirenOsc.connect(sirenGain);
  sirenGain.connect(audioCtx.destination);
  sirenOsc.start(t);
  sirenOsc.stop(t + 1.0);

  // 2. The Stomp Explosion (1.0s)
  const stompT = t + 1.0;
  const bufferSize = audioCtx.sampleRate * 1.5;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) + (Math.random() * 2 - 1);
  }
  const noiseSource = audioCtx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  const noiseFilter = audioCtx.createBiquadFilter();
  noiseFilter.type = 'lowpass';
  noiseFilter.frequency.setValueAtTime(1500, stompT);
  noiseFilter.frequency.exponentialRampToValueAtTime(50, stompT + 1.5);
  const stompGain = audioCtx.createGain();
  stompGain.gain.setValueAtTime(2.0, stompT);
  stompGain.gain.exponentialRampToValueAtTime(0.01, stompT + 1.5);
  noiseSource.connect(noiseFilter);
  noiseFilter.connect(stompGain);
  stompGain.connect(audioCtx.destination);
  noiseSource.start(stompT);

  const subOsc = audioCtx.createOscillator();
  subOsc.type = 'sine';
  subOsc.frequency.setValueAtTime(100, stompT);
  subOsc.frequency.exponentialRampToValueAtTime(20, stompT + 1.0);
  const subGain = audioCtx.createGain();
  subGain.gain.setValueAtTime(2.0, stompT);
  subGain.gain.exponentialRampToValueAtTime(0.01, stompT + 1.0);
  subOsc.connect(subGain);
  subGain.connect(audioCtx.destination);
  subOsc.start(stompT);
  subOsc.stop(stompT + 1.0);

  // 3. Heavy Metal Power Chords (1.5s and 2.5s)
  const playPowerChord = (time: number, rootFreq: number, duration: number) => {
    if (!audioCtx) return;
    const oscRoot = audioCtx.createOscillator();
    const oscFifth = audioCtx.createOscillator();
    const oscOctave = audioCtx.createOscillator();
    
    oscRoot.type = 'sawtooth';
    oscFifth.type = 'sawtooth';
    oscOctave.type = 'square';
    
    oscRoot.frequency.setValueAtTime(rootFreq, time);
    oscFifth.frequency.setValueAtTime(rootFreq * 1.5, time); // Perfect fifth
    oscOctave.frequency.setValueAtTime(rootFreq * 2.0, time); // Octave
    
    const distortion = audioCtx.createWaveShaper();
    distortion.curve = makeDistortionCurve(400); // Heavy fuzz
    distortion.oversample = '4x';
    
    const chordGain = audioCtx.createGain();
    chordGain.gain.setValueAtTime(0, time);
    chordGain.gain.linearRampToValueAtTime(0.2, time + 0.05); // Attack
    chordGain.gain.setValueAtTime(0.2, time + duration - 0.2); // Sustain
    chordGain.gain.linearRampToValueAtTime(0, time + duration); // Release
    
    oscRoot.connect(distortion);
    oscFifth.connect(distortion);
    oscOctave.connect(distortion);
    
    distortion.connect(chordGain);
    chordGain.connect(audioCtx.destination);
    
    oscRoot.start(time);
    oscFifth.start(time);
    oscOctave.start(time);
    
    oscRoot.stop(time + duration);
    oscFifth.stop(time + duration);
    oscOctave.stop(time + duration);
  };

  // E2 power chord at 1.5s
  playPowerChord(t + 1.5, 82.41, 1.0); 
  // G2 power chord at 2.5s (dissonant step up)
  playPowerChord(t + 2.5, 98.00, 2.0);
};
