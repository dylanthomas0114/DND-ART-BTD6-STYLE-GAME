import { hz } from './synth';

/**
 * Generative folk-fantasy soundtrack (D dorian): pad chords, a plucked arpeggio, a lute-like
 * melody and frame-drum percussion when the battle is on. Scheduled ahead on the AudioContext
 * clock, so it stays in time regardless of frame rate.
 */
const BPM = 92;
const BEAT = 60 / BPM;
// chord roots in semitones from A4: Dm, C, Bb, C  (i - VII - VI - VII)
const PROGRESSION: number[][] = [
  [-7, -4, 0], // D F A
  [-9, -5, -2], // C E G
  [-11, -7, -4], // Bb D F
  [-9, -5, -2], // C E G
];
// D dorian scale degrees (semitones from A4) for the melody, one octave up
const SCALE = [5, 7, 8, 10, 12, 14, 15, 17];

export class Music {
  private ctx: AudioContext | null = null;
  private out: GainNode | null = null;
  private timer: number | null = null;
  private nextTime = 0;
  private step = 0;
  /** 0 = calm (menu / between rounds), 1 = battle (drums + busier melody). */
  intensity = 0;
  private rng = 12345;

  start(ctx: AudioContext, out: GainNode): void {
    this.ctx = ctx;
    this.out = out;
    if (this.timer !== null) return;
    this.nextTime = ctx.currentTime + 0.1;
    this.timer = window.setInterval(() => this.schedule(), 100);
  }

  stop(): void {
    if (this.timer !== null) window.clearInterval(this.timer);
    this.timer = null;
  }

  private rand(): number {
    this.rng = (this.rng * 1103515245 + 12345) & 0x7fffffff;
    return this.rng / 0x7fffffff;
  }

  private schedule(): void {
    const ctx = this.ctx!;
    while (this.nextTime < ctx.currentTime + 0.4) {
      this.playStep(this.step, this.nextTime);
      this.nextTime += BEAT / 2; // eighth notes
      this.step++;
    }
  }

  private note(
    freq: number,
    t: number,
    dur: number,
    type: OscillatorType,
    vol: number,
    attack = 0.01,
    cutoff = 4000,
  ): void {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = cutoff;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(f).connect(g).connect(this.out!);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  private drum(t: number, freq: number, vol: number, dur = 0.25): void {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(freq, t);
    o.frequency.exponentialRampToValueAtTime(freq * 0.4, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(this.out!);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  private playStep(step: number, t: number): void {
    const bar = Math.floor(step / 8);
    const inBar = step % 8;
    const chord = PROGRESSION[bar % PROGRESSION.length]!;
    // pad: whole-bar chord
    if (inBar === 0) {
      for (const s of chord) {
        this.note(hz(s - 12), t, BEAT * 4.2, 'triangle', 0.05, 0.6, 1200);
        this.note(hz(s - 12) * 1.004, t, BEAT * 4.2, 'sine', 0.04, 0.8, 1200);
      }
      this.note(hz(chord[0]! - 24), t, BEAT * 4, 'sine', 0.09, 0.05, 600);
    }
    // plucked arpeggio
    const arp = [0, 1, 2, 1, 0, 2, 1, 2][inBar]!;
    this.note(hz(chord[arp]!), t, BEAT * 0.9, 'triangle', 0.045, 0.005, 2600);
    // melody: sparse when calm, busier in battle
    const p = this.intensity > 0.5 ? 0.45 : 0.22;
    if ((inBar % 2 === 0 || this.intensity > 0.5) && this.rand() < p) {
      const deg = SCALE[Math.floor(this.rand() * SCALE.length)]!;
      this.note(hz(deg), t, BEAT * (this.rand() < 0.3 ? 1.6 : 0.8), 'square', 0.025, 0.01, 1800);
    }
    // frame drum & shaker in battle
    if (this.intensity > 0.5) {
      if (inBar === 0 || inBar === 4) this.drum(t, 110, 0.32);
      if (inBar === 3 || inBar === 7) this.drum(t, 160, 0.16, 0.15);
      if (inBar % 2 === 1) this.drum(t, 900, 0.03, 0.05);
    }
  }
}
