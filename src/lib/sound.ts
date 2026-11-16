export type SoundName = 'hover' | 'select' | 'back' | 'step' | 'boot';

interface Tone {
  /** 'noise' is band-passed white noise; from/to are then the band's centre frequency. */
  wave: 'sine' | 'triangle' | 'noise';
  from: number;
  to: number;
  duration: number;
  gain: number;
  /** Fade-in time; slow attacks are what keep these from sounding like beeps. */
  attack: number;
  delay?: number;
  /** Skip the echo. Pitched tones with an echo read as a water drop, which is wrong for open/close. */
  dry?: boolean;
}

// Every pitch comes from D minor pentatonic so the cues sound like one instrument.
const NOTE = {
  A1: 55,
  D2: 73.42,
  A2: 110,
  D3: 146.83,
  G3: 196,
  A3: 220,
  D4: 293.66,
  A4: 440,
  D5: 587.33,
  A5: 880,
  D6: 1174.66,
  A6: 1760,
  D7: 2349.32,
} as const;

// Everything is synthesised so the site ships no audio files.
const SOUNDS: Record<SoundName, ReadonlyArray<Tone>> = {
  hover: [{ wave: 'sine', from: NOTE.A6, to: NOTE.A6, duration: 0.06, gain: 0.01, attack: 0.008 }],
  step: [{ wave: 'sine', from: NOTE.D6, to: NOTE.D6, duration: 0.09, gain: 0.016, attack: 0.008 }],
  // Open and close are static: nothing sweeps or glides. A short muted low click with a tiny high
  // transient on top, like a relay engaging. Close is the same click, lower and without the transient.
  select: [
    { wave: 'sine', from: NOTE.G3, to: NOTE.G3, duration: 0.07, gain: 0.05, attack: 0.004, dry: true },
    { wave: 'triangle', from: NOTE.D7, to: NOTE.D7, duration: 0.014, gain: 0.006, attack: 0.002, dry: true },
  ],
  back: [{ wave: 'sine', from: NOTE.D3, to: NOTE.D3, duration: 0.07, gain: 0.05, attack: 0.004, dry: true }],
  boot: [
    { wave: 'sine', from: NOTE.D2, to: NOTE.D3, duration: 2, gain: 0.034, attack: 1 },
    { wave: 'triangle', from: NOTE.A3, to: NOTE.A4, duration: 1.7, gain: 0.014, attack: 1, delay: 0.3 },
  ],
};

const STORAGE_KEY = 'hive-sound';
const MASTER_GAIN = 0.55;
/** Sweeping the mouse across several cells must not turn into a chatter of ticks. */
const HOVER_MIN_INTERVAL_S = 0.11;

interface AudioGraph {
  context: AudioContext;
  /** Voices connect here; from here they go out dry and into the echo. */
  input: AudioNode;
  /** Straight to the master level, bypassing the tone filter and echo. */
  dry: AudioNode;
  noise: AudioBuffer;
}

let graph: AudioGraph | null = null;
let enabled = false;
let lastHoverAt = -1;

/** voices → low-pass → master, plus a quiet filtered echo that gives each cue a glassy tail. */
function buildGraph(): AudioGraph {
  const context = new AudioContext();

  const master = context.createGain();
  master.gain.value = MASTER_GAIN;
  master.connect(context.destination);

  const tone = context.createBiquadFilter();
  tone.type = 'lowpass';
  tone.frequency.value = 3400;
  tone.connect(master);

  const echo = context.createDelay(1);
  echo.delayTime.value = 0.17;
  const feedback = context.createGain();
  feedback.gain.value = 0.3;
  const echoTone = context.createBiquadFilter();
  echoTone.type = 'lowpass';
  echoTone.frequency.value = 1800;
  const echoLevel = context.createGain();
  echoLevel.gain.value = 0.26;

  tone.connect(echo);
  echo.connect(echoTone);
  echoTone.connect(feedback);
  feedback.connect(echo);
  echoTone.connect(echoLevel);
  echoLevel.connect(master);

  // One second of white noise, reused by every noise voice.
  const noise = context.createBuffer(1, context.sampleRate, context.sampleRate);
  const samples = noise.getChannelData(0);
  for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;

  return { context, input: tone, dry: master, noise };
}

export function readSoundPreference(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'on';
  } catch {
    // Storage can be blocked (private mode); sound simply stays off.
    return false;
  }
}

export function setSoundEnabled(on: boolean): void {
  enabled = on;
  try {
    window.localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
  } catch {
    // Preference just won't persist.
  }
}

export function playSound(name: SoundName): void {
  if (!enabled || typeof window === 'undefined' || !('AudioContext' in window)) return;
  graph ??= buildGraph();
  const { context, input, dry, noise } = graph;

  // Browsers keep the context suspended until a user gesture; resume() is a no-op before that.
  if (context.state === 'suspended') {
    void context.resume();
    if (name === 'hover') return;
  }
  if (name === 'hover') {
    if (context.currentTime - lastHoverAt < HOVER_MIN_INTERVAL_S) return;
    lastHoverAt = context.currentTime;
  }

  SOUNDS[name].forEach((tone) => {
    const start = context.currentTime + (tone.delay ?? 0);
    const end = start + tone.duration;
    const envelope = context.createGain();
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.linearRampToValueAtTime(tone.gain, start + tone.attack);
    envelope.gain.exponentialRampToValueAtTime(0.0001, end);
    envelope.connect(tone.dry ? dry : input);

    if (tone.wave === 'noise') {
      const source = context.createBufferSource();
      source.buffer = noise;
      const band = context.createBiquadFilter();
      band.type = 'bandpass';
      band.Q.value = 1.1;
      band.frequency.setValueAtTime(tone.from, start);
      band.frequency.exponentialRampToValueAtTime(tone.to, end);
      source.connect(band).connect(envelope);
      source.start(start);
      source.stop(end + 0.02);
      return;
    }

    const oscillator = context.createOscillator();
    oscillator.type = tone.wave;
    oscillator.frequency.setValueAtTime(tone.from, start);
    oscillator.frequency.exponentialRampToValueAtTime(tone.to, end);
    oscillator.connect(envelope);
    oscillator.start(start);
    oscillator.stop(end + 0.02);
  });
}
