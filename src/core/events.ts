import type { DamageType } from './types';
import type { EnemyId } from './data/enemies';

/** One-shot notifications from the simulation to render/audio/UI layers. */
export interface GameEvents {
  pop: { x: number; y: number; enemy: EnemyId; dtype: DamageType; boss: boolean };
  immune: { x: number; y: number; enemy: EnemyId; dtype: DamageType };
  leak: { enemy: EnemyId; livesLost: number };
  spawn: { uid: number; enemy: EnemyId };
  attack: { towerUid: number; attackId: string; angle: number; tx: number; ty: number; kind: string };
  explode: { x: number; y: number; radius: number; dtype: DamageType };
  beam: { x1: number; y1: number; x2: number; y2: number; dtype: DamageType };
  towerPlaced: { uid: number };
  towerUpgraded: { uid: number; path: number; tier: number };
  towerSold: { uid: number; refund: number };
  ability: { towerUid: number; abilityId: string; x: number; y: number };
  roundStart: { round: number };
  roundEnd: { round: number; bonus: number };
  cash: { amount: number; x?: number; y?: number };
  gameOver: { won: boolean; round: number };
}

type Listener<T> = (payload: T) => void;

export class EventBus {
  private listeners: { [K in keyof GameEvents]?: Listener<GameEvents[K]>[] } = {};

  on<K extends keyof GameEvents>(type: K, fn: Listener<GameEvents[K]>): () => void {
    const list = (this.listeners[type] ??= []) as Listener<GameEvents[K]>[];
    list.push(fn);
    return () => {
      const i = list.indexOf(fn);
      if (i >= 0) list.splice(i, 1);
    };
  }

  emit<K extends keyof GameEvents>(type: K, payload: GameEvents[K]): void {
    const list = this.listeners[type] as Listener<GameEvents[K]>[] | undefined;
    if (!list) return;
    for (let i = 0; i < list.length; i++) list[i]!(payload);
  }

  clear(): void {
    this.listeners = {};
  }
}
