import type { Application } from 'pixi.js';
import type { TextureBank } from './bake';

/** The single Pixi app + texture bank shared by every screen. */
export const hub: { app: Application | null; bank: TextureBank | null } = { app: null, bank: null };
