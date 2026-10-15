import { effect } from '@preact/signals';
import { settings } from '../ui/store';
import { Music } from './music';
import { sfx } from './sfx';

/**
 * Audio bootstrap: creates the AudioContext on the first user gesture (required on mobile),
 * wires master/music/sfx gains to the settings, and suspends audio when the app is hidden.
 */
export const music = new Music();
let ctx: AudioContext | null = null;
let musicGain: GainNode | null = null;

function unlock(): void {
  if (!ctx) {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx = new AC({ latencyHint: 'interactive' });
    const master = ctx.createGain();
    master.connect(ctx.destination);
    const sfxGain = ctx.createGain();
    sfxGain.connect(master);
    musicGain = ctx.createGain();
    musicGain.connect(master);
    sfx.unlock(ctx, sfxGain);
    music.start(ctx, musicGain);
    effect(() => {
      const s = settings.value;
      sfx.volume = s.sfx;
      if (musicGain) musicGain.gain.value = s.music * 0.7;
    });
  }
  if (ctx.state === 'suspended') void ctx.resume();
}

export function initAudio(): void {
  const once = () => unlock();
  window.addEventListener('pointerdown', once, { passive: true });
  window.addEventListener('keydown', once);
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) void ctx.suspend();
    else void ctx.resume();
  });
}

export function setMusicIntensity(v: number): void {
  music.intensity = v;
}
