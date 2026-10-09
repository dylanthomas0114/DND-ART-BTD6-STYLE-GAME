import { render, type Voice } from './synth';

/** Every sound effect in the game, synthesised in code (see synth.ts). */
export type SfxName =
  | 'pop'
  | 'popBig'
  | 'immune'
  | 'place'
  | 'upgrade'
  | 'sell'
  | 'shoot'
  | 'bow'
  | 'blade'
  | 'magic'
  | 'boom'
  | 'freeze'
  | 'beam'
  | 'leak'
  | 'roundStart'
  | 'roundEnd'
  | 'ability'
  | 'coin'
  | 'click'
  | 'error'
  | 'win'
  | 'lose';

/** Sound recipes. Each returns voices for variant `k` (slight pitch differences). */
export const RECIPES: Record<SfxName, (k: number) => Voice[]> = {
  pop: (k) => [
    { wave: 'sine', freq: 820 + k * 70, freqEnd: 360, dur: 0.07, curve: 2.5, vol: 0.55 },
    { wave: 'noise', freq: 4000, dur: 0.02, vol: 0.18, lowpass: 5000 },
  ],
  popBig: () => [
    { wave: 'sine', freq: 140, freqEnd: 38, dur: 0.45, curve: 1.6, vol: 0.9 },
    { wave: 'noise', freq: 1500, dur: 0.4, vol: 0.45, lowpass: 900, curve: 2 },
    { wave: 'square', freq: 90, freqEnd: 50, dur: 0.18, vol: 0.2 },
  ],
  immune: (k) => [
    { wave: 'square', freq: 1900 + k * 90, dur: 0.05, vol: 0.18, curve: 3 },
    { wave: 'sine', freq: 3100 + k * 120, dur: 0.12, vol: 0.2, curve: 3 },
  ],
  place: () => [
    { wave: 'triangle', freq: 240, freqEnd: 110, dur: 0.14, vol: 0.6, curve: 2 },
    { wave: 'noise', freq: 800, dur: 0.08, vol: 0.3, lowpass: 1200 },
    { wave: 'sine', freq: 660, dur: 0.12, at: 0.06, vol: 0.18 },
  ],
  upgrade: () => [
    { wave: 'triangle', freq: 523, dur: 0.12, vol: 0.35 },
    { wave: 'triangle', freq: 659, dur: 0.12, at: 0.07, vol: 0.35 },
    { wave: 'triangle', freq: 784, dur: 0.22, at: 0.14, vol: 0.4 },
    { wave: 'sine', freq: 1568, dur: 0.3, at: 0.18, vol: 0.15, vibratoRate: 9, vibratoDepth: 0.01 },
  ],
  sell: () => [
    { wave: 'square', freq: 1320, dur: 0.06, vol: 0.18 },
    { wave: 'square', freq: 1760, dur: 0.1, at: 0.06, vol: 0.18 },
  ],
  shoot: (k) => [
    { wave: 'noise', freq: 1200, dur: 0.12, vol: 0.4, lowpass: 1600, curve: 3 },
    { wave: 'sine', freq: 180 + k * 10, freqEnd: 60, dur: 0.12, vol: 0.5 },
  ],
  bow: (k) => [
    { wave: 'saw', freq: 420 + k * 30, freqEnd: 180, dur: 0.07, vol: 0.18, lowpass: 2500 },
    { wave: 'noise', freq: 3000, dur: 0.08, vol: 0.12, lowpass: 3500, curve: 2 },
  ],
  blade: (k) => [
    {
      wave: 'noise',
      freq: 2500 + k * 300,
      freqEnd: 900,
      dur: 0.12,
      vol: 0.28,
      lowpass: 3000,
      attack: 0.02,
      curve: 1.5,
    },
  ],
  magic: (k) => [
    {
      wave: 'sine',
      freq: 700 + k * 40,
      freqEnd: 1500,
      dur: 0.18,
      vol: 0.22,
      vibratoRate: 14,
      vibratoDepth: 0.03,
    },
    { wave: 'triangle', freq: 1400 + k * 60, freqEnd: 2200, dur: 0.14, at: 0.03, vol: 0.12 },
  ],
  boom: () => [
    { wave: 'noise', freq: 900, dur: 0.38, vol: 0.55, lowpass: 700, curve: 1.8 },
    { wave: 'sine', freq: 110, freqEnd: 32, dur: 0.32, vol: 0.7 },
  ],
  freeze: (k) => [
    { wave: 'sine', freq: 2100 + k * 80, dur: 0.25, vol: 0.14, curve: 2 },
    { wave: 'sine', freq: 2800 + k * 90, dur: 0.3, at: 0.03, vol: 0.1 },
    { wave: 'noise', freq: 6000, dur: 0.2, vol: 0.08, lowpass: 8000 },
  ],
  beam: (k) => [
    { wave: 'saw', freq: 1100 + k * 50, freqEnd: 650, dur: 0.16, vol: 0.12, lowpass: 3000, tremolo: 40 },
  ],
  leak: () => [
    { wave: 'square', freq: 160, dur: 0.22, vol: 0.25, lowpass: 900 },
    { wave: 'sine', freq: 110, dur: 0.25, vol: 0.4 },
  ],
  roundStart: () => [
    { wave: 'saw', freq: 220, dur: 0.5, attack: 0.06, vol: 0.18, lowpass: 1400, curve: 1 },
    { wave: 'saw', freq: 330, dur: 0.5, attack: 0.06, vol: 0.14, lowpass: 1400, curve: 1 },
    { wave: 'saw', freq: 440, dur: 0.45, at: 0.18, attack: 0.04, vol: 0.14, lowpass: 1600, curve: 1.2 },
  ],
  roundEnd: () => [
    { wave: 'triangle', freq: 784, dur: 0.3, vol: 0.3 },
    { wave: 'triangle', freq: 1047, dur: 0.45, at: 0.1, vol: 0.3 },
  ],
  ability: () => [
    { wave: 'noise', freq: 2000, freqEnd: 400, dur: 0.4, vol: 0.3, lowpass: 2500, attack: 0.05, curve: 1.4 },
    { wave: 'triangle', freq: 392, dur: 0.5, vol: 0.25 },
    { wave: 'triangle', freq: 494, dur: 0.5, vol: 0.2 },
    { wave: 'triangle', freq: 587, dur: 0.5, vol: 0.2 },
  ],
  coin: () => [
    { wave: 'square', freq: 1976, dur: 0.05, vol: 0.12 },
    { wave: 'sine', freq: 2637, dur: 0.2, at: 0.05, vol: 0.18 },
  ],
  click: () => [{ wave: 'sine', freq: 1200, freqEnd: 700, dur: 0.035, vol: 0.25 }],
  error: () => [
    { wave: 'square', freq: 196, dur: 0.09, vol: 0.18, lowpass: 1200 },
    { wave: 'square', freq: 156, dur: 0.12, at: 0.1, vol: 0.18, lowpass: 1200 },
  ],
  win: () =>
    [523, 659, 784, 1047, 784, 1047].map((f, i) => ({
      wave: 'triangle' as const,
      freq: f,
      dur: i === 5 ? 0.7 : 0.16,
      at: i * 0.13,
      vol: 0.35,
      curve: 1.4,
    })),
  lose: () =>
    [440, 392, 349, 262].map((f, i) => ({
      wave: 'triangle' as const,
      freq: f,
      dur: i === 3 ? 0.8 : 0.22,
      at: i * 0.22,
      vol: 0.3,
    })),
};

/** Minimum seconds between two plays of the same sound (prevents swarm noise). */
const MIN_GAP: Partial<Record<SfxName, number>> = {
  pop: 0.035,
  immune: 0.08,
  bow: 0.05,
  blade: 0.06,
  magic: 0.06,
  shoot: 0.08,
  boom: 0.09,
  freeze: 0.15,
  beam: 0.06,
  leak: 0.25,
  coin: 0.05,
};

const VARIANTS = 4;

class Sfx {
  ctx: AudioContext | null = null;
  out: GainNode | null = null;
  private buffers = new Map<SfxName, AudioBuffer[]>();
  private last = new Map<SfxName, number>();
  volume = 0.8;

  /** Must be called from a user gesture on mobile. */
  unlock(ctx: AudioContext, out: GainNode): void {
    if (this.ctx) return;
    this.ctx = ctx;
    this.out = out;
    // pre-render all sounds (a few ms of CPU)
    for (const name of Object.keys(RECIPES) as SfxName[]) {
      const list: AudioBuffer[] = [];
      for (let k = 0; k < VARIANTS; k++) {
        const pcm = render(RECIPES[name](k), ctx.sampleRate, 17 + k);
        const buf = ctx.createBuffer(1, pcm.length, ctx.sampleRate);
        buf.copyToChannel(pcm as Float32Array<ArrayBuffer>, 0);
        list.push(buf);
      }
      this.buffers.set(name, list);
    }
  }

  play(name: SfxName, volume = 1): void {
    const ctx = this.ctx;
    if (!ctx || !this.out || this.volume <= 0 || ctx.state !== 'running') return;
    const now = ctx.currentTime;
    const gap = MIN_GAP[name] ?? 0;
    if (now - (this.last.get(name) ?? -1) < gap) return;
    this.last.set(name, now);
    const list = this.buffers.get(name);
    if (!list) return;
    const src = ctx.createBufferSource();
    src.buffer = list[Math.floor(Math.random() * list.length)]!;
    src.playbackRate.value = 0.94 + Math.random() * 0.12;
    const g = ctx.createGain();
    g.gain.value = volume * this.volume;
    src.connect(g).connect(this.out);
    src.start();
  }
}

export const sfx = new Sfx();

export function playSfx(name: SfxName, volume = 1): void {
  sfx.play(name, volume);
}
