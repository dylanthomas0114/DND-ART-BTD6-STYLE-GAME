import { signal } from '@preact/signals';
import type { SaveState } from '../core/game';
import type { MapId } from '../core/data/maps';
import type { DifficultyId } from '../core/types';
import { load, loadRaw, remove, save } from '../platform/storage';

export interface Settings {
  music: number;
  sfx: number;
  haptics: boolean;
  quality: 'auto' | 'low' | 'medium' | 'high';
  autoStart: boolean;
  showFps: boolean;
}

export interface Progress {
  /** Medals: `${map}:${difficulty}` → true once that difficulty is won. */
  medals: Record<string, boolean>;
  tutorialDone: boolean;
  bestRound: Record<string, number>;
}

const SETTINGS_KEY = 'ar.settings.v1';
const PROGRESS_KEY = 'ar.progress.v1';
const SAVE_KEY = 'ar.save.v1';

export const settings = signal<Settings>(
  load<Settings>(SETTINGS_KEY, {
    music: 0.6,
    sfx: 0.8,
    haptics: true,
    quality: 'auto',
    autoStart: false,
    showFps: false,
  }),
);
export const progress = signal<Progress>(
  load<Progress>(PROGRESS_KEY, { medals: {}, tutorialDone: false, bestRound: {} }),
);

export function updateSettings(patch: Partial<Settings>): void {
  settings.value = { ...settings.value, ...patch };
  save(SETTINGS_KEY, settings.value);
}

export function updateProgress(patch: Partial<Progress>): void {
  progress.value = { ...progress.value, ...patch };
  save(PROGRESS_KEY, progress.value);
}

export function recordWin(map: MapId, diff: DifficultyId): void {
  updateProgress({ medals: { ...progress.value.medals, [`${map}:${diff}`]: true } });
}

export function recordRound(map: MapId, diff: DifficultyId, round: number): void {
  const key = `${map}:${diff}`;
  if ((progress.value.bestRound[key] ?? 0) >= round) return;
  updateProgress({ bestRound: { ...progress.value.bestRound, [key]: round } });
}

export function loadGameSave(): SaveState | null {
  const s = loadRaw<SaveState>(SAVE_KEY);
  return s && s.v === 1 ? s : null;
}

export function storeGameSave(s: SaveState): void {
  save(SAVE_KEY, s);
  savedGame.value = s;
}

export function clearGameSave(): void {
  remove(SAVE_KEY);
  savedGame.value = null;
}

export const savedGame = signal<SaveState | null>(loadGameSave());

export type Screen =
  | { name: 'menu' }
  | { name: 'maps' }
  | { name: 'game'; map: MapId; difficulty: DifficultyId; save?: SaveState }
  | { name: 'settings'; back: Screen };

export const screen = signal<Screen>({ name: 'menu' });
