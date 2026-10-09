/**
 * Tiny offline synthesiser: renders short sound effects from parameters into PCM. Pure and
 * deterministic (seeded noise), so every sound is generated in code with no audio assets.
 */
export type Wave = 'sine' | 'triangle' | 'saw' | 'square' | 'noise';

export interface Voice {
  wave: Wave;
  /** Start frequency (Hz). */
  freq: number;
  /** End frequency (exponential slide). Defaults to `freq`. */
  freqEnd?: number;
  /** Seconds. */
  dur: number;
  /** Delay before this voice starts (s). */
  at?: number;
  attack?: number;
  /** Envelope curve exponent for the decay (1 = linear, higher = punchier). */
  curve?: number;
  vol?: number;
  vibratoRate?: number;
  vibratoDepth?: number;
  /** One-pole low-pass cutoff in Hz (applied to this voice). */
  lowpass?: number;
  /** Tremolo (amplitude modulation) rate in Hz. */
  tremolo?: number;
}

export function render(voices: Voice[], sampleRate: number, seed = 1): Float32Array {
  const len = Math.ceil(sampleRate * Math.max(...voices.map((v) => (v.at ?? 0) + v.dur)) + sampleRate * 0.01);
  const out = new Float32Array(len);
  let rs = seed >>> 0 || 1;
  const rnd = () => {
    rs ^= rs << 13;
    rs ^= rs >>> 17;
    rs ^= rs << 5;
    return ((rs >>> 0) / 4294967296) * 2 - 1;
  };
  for (const v of voices) {
    const start = Math.floor((v.at ?? 0) * sampleRate);
    const n = Math.floor(v.dur * sampleRate);
    const f0 = v.freq;
    const f1 = v.freqEnd ?? v.freq;
    const atk = Math.max(1, Math.floor((v.attack ?? 0.004) * sampleRate));
    const curve = v.curve ?? 2;
    const vol = v.vol ?? 0.5;
    const lpA = v.lowpass ? 1 - Math.exp((-2 * Math.PI * v.lowpass) / sampleRate) : 1;
    let phase = 0;
    let lp = 0;
    let held = 0;
    let holdCount = 0;
    for (let i = 0; i < n; i++) {
      const t = i / n;
      let f = f0 * Math.pow(f1 / f0, t);
      if (v.vibratoRate)
        f *= 1 + Math.sin((2 * Math.PI * v.vibratoRate * i) / sampleRate) * (v.vibratoDepth ?? 0.02);
      phase += f / sampleRate;
      phase -= Math.floor(phase);
      let s: number;
      switch (v.wave) {
        case 'sine':
          s = Math.sin(2 * Math.PI * phase);
          break;
        case 'triangle':
          s = 1 - 4 * Math.abs(phase - 0.5);
          break;
        case 'saw':
          s = 2 * phase - 1;
          break;
        case 'square':
          s = phase < 0.5 ? 0.7 : -0.7;
          break;
        case 'noise': {
          // pitched noise: hold random values for a period tied to freq
          const hold = Math.max(1, Math.round(sampleRate / Math.max(50, f) / 2));
          if (holdCount-- <= 0) {
            held = rnd();
            holdCount = hold;
          }
          s = held;
          break;
        }
      }
      if (v.lowpass) {
        lp += (s - lp) * lpA;
        s = lp;
      }
      const env = i < atk ? i / atk : Math.pow(1 - (i - atk) / Math.max(1, n - atk), curve);
      let amp = env * vol;
      if (v.tremolo) amp *= 0.6 + 0.4 * Math.sin((2 * Math.PI * v.tremolo * i) / sampleRate);
      const k = start + i;
      if (k < len) out[k]! += s * amp;
    }
  }
  // soft clip
  for (let i = 0; i < len; i++) out[i] = Math.tanh(out[i]! * 1.2);
  return out;
}

/** Note name → frequency (A4 = 440). */
export function hz(semitonesFromA4: number): number {
  return 440 * Math.pow(2, semitonesFromA4 / 12);
}
