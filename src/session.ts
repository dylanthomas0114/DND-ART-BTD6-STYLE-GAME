import type { Application } from 'pixi.js';
import { Game, type GameOptions, type SaveState } from './core/game';
import { DT } from './core/types';
import { TextureBank } from './render/bake';
import { WorldView } from './render/worldView';

export type Speed = 1 | 2 | 3;

/**
 * Glue between the deterministic simulation and the renderer: runs fixed 60 Hz steps from the
 * display frame loop, handles speed/pause, and adapts graphics quality to frame time.
 */
export class GameSession {
  readonly game: Game;
  readonly view: WorldView;
  speed: Speed = 1;
  paused = false;
  autoStart = false;
  private acc = 0;
  private frameMs: number[] = [];
  private readonly tick = (t: { deltaMS: number }) => this.frame(t.deltaMS);
  /** Called after each rendered frame (UI refresh hook). */
  onFrame: (() => void) | null = null;
  /** Measured FPS over the last ~60 frames. */
  fps = 60;
  /** 'auto' adapts to frame time; otherwise the tier is fixed by the player. */
  qualityMode: 'auto' | 'low' | 'medium' | 'high' = 'auto';

  constructor(
    readonly app: Application,
    opts: GameOptions | { save: SaveState },
    bank?: TextureBank,
  ) {
    this.game = 'save' in opts ? Game.deserialize(opts.save) : new Game(opts);
    const b = bank ?? new TextureBank(app, Math.min(2, Math.max(1, window.devicePixelRatio || 1)));
    this.view = new WorldView(app, this.game, b);
    app.stage.addChildAt(this.view.root, 0);
    app.ticker.add(this.tick);
  }

  private frame(ms: number): void {
    const dtReal = Math.min(ms, 100) / 1000;
    this.frameMs.push(ms);
    if (this.frameMs.length > 60) this.frameMs.shift();
    if (this.frameMs.length === 60) {
      const avg = this.frameMs.reduce((s, v) => s + v, 0) / 60;
      this.fps = 1000 / avg;
      this.adaptQuality(avg);
    }
    if (!this.paused && !this.game.over) {
      this.acc += dtReal * this.speed;
      let steps = 0;
      while (this.acc >= DT && steps < 12) {
        this.game.step();
        this.acc -= DT;
        steps++;
      }
      if (steps >= 12) this.acc = 0;
      if (this.autoStart && !this.game.roundActive && !this.game.over && this.game.round > 0)
        this.game.startRound();
    }
    this.view.update(this.paused ? 0 : dtReal * this.speed);
    this.onFrame?.();
  }

  private adaptQuality(avgMs: number): void {
    const v = this.view;
    if (this.qualityMode !== 'auto') v.quality = this.qualityMode;
    else if (avgMs > 24 && v.quality !== 'low') {
      v.quality = v.quality === 'high' ? 'medium' : 'low';
      this.frameMs.length = 0;
    }
    v.particles.density = v.quality === 'high' ? 1 : v.quality === 'medium' ? 0.6 : 0.35;
    v.particles.maxLive = v.quality === 'high' ? 900 : v.quality === 'medium' ? 500 : 250;
  }

  destroy(): void {
    this.app.ticker.remove(this.tick);
    this.view.destroy();
  }
}
