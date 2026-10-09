import { DIFFICULTIES, scaledCost } from './data/difficulty';
import { ENEMIES, ENEMY_STRENGTH, type EnemyDef, type EnemyId, rbe } from './data/enemies';
import { inEllipse, MAPS, type MapDef, type MapId } from './data/maps';
import { getRound, type SpawnGroup } from './data/rounds';
import { TOWERS } from './data/towers';
import type {
  AbilitySpec,
  AttackStats,
  EffectSpec,
  TowerDef,
  TowerId,
  TowerStats,
  Tiers,
} from './data/towerTypes';
import { EventBus } from './events';
import { Path } from './path';
import { Rng } from './rng';
import { SpatialHash } from './spatialHash';
import {
  DT,
  type DamageType,
  type DifficultyId,
  type TargetPriority,
  type Vec2,
  WORLD_H,
  WORLD_W,
} from './types';
import { canUpgrade, computeStats, upgradeCost } from './upgrades';

// ----------------------------------------------------------------------------------------------
// Entities
// ----------------------------------------------------------------------------------------------

export interface Enemy {
  uid: number;
  type: EnemyId;
  def: EnemyDef;
  pathIndex: number;
  progress: number;
  x: number;
  y: number;
  angle: number;
  hp: number;
  maxHp: number;
  armored: boolean;
  invisible: boolean;
  regen: boolean;
  regenChain: EnemyId[];
  lastDamaged: number;
  hpMult: number;
  speedMult: number;
  slowMult: number;
  slowT: number;
  frozenT: number;
  stunT: number;
  burnDps: number;
  burnT: number;
  burnTick: number;
  alive: boolean;
  /** Seconds since last damage, for render hit flashes. */
  hitT: number;
}

export interface TowerBuff {
  rateMult: number;
  rangeMult: number;
  pierceAdd: number;
  damageAdd: number;
  sight: boolean;
}

export interface Tower {
  uid: number;
  def: TowerDef;
  tiers: Tiers;
  x: number;
  y: number;
  stats: TowerStats;
  spent: number;
  priority: TargetPriority;
  cooldowns: number[];
  facing: number;
  /** Per-attack seconds since the last attack (for render animation). */
  attackT: number[];
  abilityCd: number;
  frenzyT: number;
  frenzyMult: number;
  rallyT: number;
  rallyMult: number;
  buff: TowerBuff;
  pops: number;
  /** Cached road points within reach for trap attacks. */
  trapSpots: { path: number; at: number }[];
}

export interface Projectile {
  uid: number;
  towerUid: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  damage: number;
  pierce: number;
  dtype: DamageType;
  radius: number;
  life: number;
  homingUid: number;
  sprite: string;
  splashRadius: number;
  splashPierce: number;
  splashDamage: number;
  effects: EffectSpec;
  bossMult: number;
  shellMult: number;
  trap: boolean;
  hits: number[];
  alive: boolean;
}

interface SpawnEvent {
  t: number;
  group: SpawnGroup;
}

export type PlaceResult = { ok: true; uid: number } | { ok: false; reason: string };

export interface GameOptions {
  mapId: MapId;
  difficulty: DifficultyId;
  seed?: number;
}

export interface SaveState {
  v: 1;
  mapId: MapId;
  difficulty: DifficultyId;
  seed: number;
  rng: number;
  round: number;
  cash: number;
  lives: number;
  nextUid: number;
  freeplay: boolean;
  time: number;
  spawnCounter: number;
  towers: {
    id: TowerId;
    x: number;
    y: number;
    tiers: Tiers;
    priority: TargetPriority;
    spent: number;
    abilityCd: number;
    pops: number;
    cooldowns: number[];
  }[];
  traps: Omit<Projectile, 'alive' | 'uid'>[];
}

const MAX_ENEMY_RADIUS = 70;
const REGROW_DELAY = 2.5;
const CHAIN_RANGE = 130;

const noBuff = (): TowerBuff => ({ rateMult: 1, rangeMult: 1, pierceAdd: 0, damageAdd: 0, sight: false });

// ----------------------------------------------------------------------------------------------
// Game
// ----------------------------------------------------------------------------------------------

export class Game {
  readonly map: MapDef;
  readonly paths: Path[];
  readonly events = new EventBus();
  readonly difficulty: DifficultyId;
  readonly seed: number;
  readonly rng: Rng;

  enemies: Enemy[] = [];
  towers: Tower[] = [];
  projectiles: Projectile[] = [];

  cash: number;
  lives: number;
  round = 0;
  roundActive = false;
  roundTime = 0;
  time = 0;
  over: null | { won: boolean } = null;
  /** True once the player continues past the final round. */
  freeplay = false;
  /** Total cash earned from pops (stats). */
  popCount = 0;

  private nextUid = 1;
  private spawnQueue: SpawnEvent[] = [];
  private spawnIdx = 0;
  private spawnCounter = 0;
  private readonly hash = new SpatialHash(WORLD_W, WORLD_H, 64);
  private readonly tmp: Vec2 = { x: 0, y: 0 };
  private readonly queryBuf: number[] = [];

  constructor(opts: GameOptions) {
    const map = MAPS[opts.mapId];
    if (!map) throw new Error(`Unknown map ${opts.mapId}`);
    this.map = map;
    this.paths = map.paths.map((p) => new Path(p));
    this.difficulty = opts.difficulty;
    this.seed = opts.seed ?? 1337;
    this.rng = new Rng(this.seed);
    const d = DIFFICULTIES[opts.difficulty];
    this.cash = d.startCash;
    this.lives = d.lives;
  }

  get diff() {
    return DIFFICULTIES[this.difficulty];
  }

  get finalRound(): number {
    return this.diff.finalRound;
  }

  // ------------------------------------------------------------------ economy / commands

  towerCost(id: TowerId): number {
    return scaledCost(TOWERS[id].cost, this.diff.costMult);
  }

  upgradePrice(t: Tower, path: number): number | null {
    const tier = t.tiers[path]!;
    if (tier >= 5 || !canUpgrade(t.tiers, path)) return null;
    return upgradeCost(t.def, path, tier + 1, this.diff.costMult);
  }

  sellValue(t: Tower): number {
    return Math.floor(t.spent * 0.7);
  }

  canPlace(id: TowerId, x: number, y: number): { ok: boolean; reason?: string } {
    const def = TOWERS[id];
    const f = def.footprint;
    if (x < f || y < f || x > WORLD_W - f || y > WORLD_H - f) return { ok: false, reason: 'Out of bounds' };
    for (const p of this.paths) {
      if (p.closest(x, y).dist < this.map.roadWidth / 2 + f * 0.7)
        return { ok: false, reason: 'Too close to the road' };
    }
    for (const b of this.map.blockers) {
      if (Math.hypot(b.x - x, b.y - y) < b.r + f * 0.6)
        return { ok: false, reason: 'Something is in the way' };
    }
    const onWater = this.map.water.some((w) => inEllipse(w, x, y));
    if (onWater && def.placement !== 'any') return { ok: false, reason: 'Cannot stand on water' };
    for (const t of this.towers) {
      if (Math.hypot(t.x - x, t.y - y) < t.def.footprint + f)
        return { ok: false, reason: 'Too close to another tower' };
    }
    return { ok: true };
  }

  placeTower(id: TowerId, x: number, y: number): PlaceResult {
    if (this.over) return { ok: false, reason: 'Game over' };
    const cost = this.towerCost(id);
    if (this.cash < cost) return { ok: false, reason: 'Not enough gold' };
    const check = this.canPlace(id, x, y);
    if (!check.ok) return { ok: false, reason: check.reason ?? 'Cannot place here' };
    this.cash -= cost;
    const t = this.makeTower(id, x, y, [0, 0, 0], cost);
    this.towers.push(t);
    this.recomputeBuffs();
    this.events.emit('towerPlaced', { uid: t.uid });
    return { ok: true, uid: t.uid };
  }

  private makeTower(id: TowerId, x: number, y: number, tiers: Tiers, spent: number): Tower {
    const def = TOWERS[id];
    const stats = computeStats(def, tiers);
    const t: Tower = {
      uid: this.nextUid++,
      def,
      tiers: [...tiers] as Tiers,
      x,
      y,
      stats,
      spent,
      priority: 'first',
      cooldowns: stats.attacks.map(() => 0),
      attackT: stats.attacks.map(() => 99),
      facing: Math.PI / 2,
      abilityCd: stats.ability ? stats.ability.cooldown * 0.5 : 0,
      frenzyT: 0,
      frenzyMult: 1,
      rallyT: 0,
      rallyMult: 1,
      buff: noBuff(),
      pops: 0,
      trapSpots: [],
    };
    this.refreshTrapSpots(t);
    return t;
  }

  upgradeTower(uid: number, path: number): { ok: boolean; reason?: string } {
    const t = this.towerByUid(uid);
    if (!t) return { ok: false, reason: 'No such tower' };
    const price = this.upgradePrice(t, path);
    if (price === null) return { ok: false, reason: 'Path locked' };
    if (this.cash < price) return { ok: false, reason: 'Not enough gold' };
    this.cash -= price;
    t.spent += price;
    const hadAbility = t.stats.ability?.id;
    t.tiers[path] = t.tiers[path]! + 1;
    t.stats = computeStats(t.def, t.tiers);
    while (t.cooldowns.length < t.stats.attacks.length) t.cooldowns.push(0);
    while (t.attackT.length < t.stats.attacks.length) t.attackT.push(99);
    if (t.stats.ability && t.stats.ability.id !== hadAbility) t.abilityCd = t.stats.ability.cooldown * 0.5;
    this.refreshTrapSpots(t);
    this.recomputeBuffs();
    this.events.emit('towerUpgraded', { uid, path, tier: t.tiers[path]! });
    return { ok: true };
  }

  sellTower(uid: number): boolean {
    const i = this.towers.findIndex((t) => t.uid === uid);
    if (i < 0) return false;
    const t = this.towers[i]!;
    const refund = this.sellValue(t);
    this.cash += refund;
    this.towers.splice(i, 1);
    this.recomputeBuffs();
    this.events.emit('towerSold', { uid, refund });
    return true;
  }

  setPriority(uid: number, p: TargetPriority): void {
    const t = this.towerByUid(uid);
    if (t) t.priority = p;
  }

  towerByUid(uid: number): Tower | undefined {
    return this.towers.find((t) => t.uid === uid);
  }

  /** Effective range including support buffs. */
  rangeOf(t: Tower): number {
    return t.stats.range * t.buff.rangeMult;
  }

  seesInvisible(t: Tower): boolean {
    return t.stats.trueSight > 0 || t.buff.sight;
  }

  startRound(): boolean {
    if (this.roundActive || this.over) return false;
    this.round++;
    this.roundActive = true;
    this.roundTime = 0;
    const def = getRound(this.round);
    this.spawnQueue = [];
    for (const g of def) {
      for (let i = 0; i < g.count; i++) this.spawnQueue.push({ t: g.delay + i * g.spacing, group: g });
    }
    this.spawnQueue.sort((a, b) => a.t - b.t);
    this.spawnIdx = 0;
    this.events.emit('roundStart', { round: this.round });
    return true;
  }

  continueFreeplay(): void {
    if (this.over?.won) {
      this.over = null;
      this.freeplay = true;
    }
  }

  abilityReady(t: Tower): boolean {
    return !!t.stats.ability && t.abilityCd <= 0;
  }

  activateAbility(uid: number): boolean {
    const t = this.towerByUid(uid);
    if (!t || !t.stats.ability || t.abilityCd > 0 || this.over) return false;
    const a = t.stats.ability;
    t.abilityCd = a.cooldown;
    this.runAbility(t, a);
    return true;
  }

  // ------------------------------------------------------------------ simulation tick

  step(): void {
    if (this.over) return;
    this.time += DT;
    if (this.roundActive) {
      this.roundTime += DT;
      this.spawnDue();
    }
    this.updateEnemies();
    this.compactEnemies();
    this.rebuildHash();
    this.updateTowers();
    this.updateProjectiles();
    this.compactEnemies();
    this.compactProjectiles();
    this.checkRoundEnd();
  }

  private spawnDue(): void {
    while (this.spawnIdx < this.spawnQueue.length && this.spawnQueue[this.spawnIdx]!.t <= this.roundTime) {
      const ev = this.spawnQueue[this.spawnIdx++]!;
      const g = ev.group;
      const pathIndex = this.spawnCounter++ % this.paths.length;
      const e = this.spawnEnemy(g.enemy, pathIndex, 0, {
        invisible: !!g.invisible,
        regen: !!g.regen,
        armored: !!g.armored,
        hpMult: g.hpMult ?? 1,
        speedMult: g.speedMult ?? 1,
        regenChain: [],
      });
      this.events.emit('spawn', { uid: e.uid, enemy: e.type });
    }
  }

  private spawnEnemy(
    type: EnemyId,
    pathIndex: number,
    progress: number,
    o: {
      invisible: boolean;
      regen: boolean;
      armored: boolean;
      hpMult: number;
      speedMult: number;
      regenChain: EnemyId[];
    },
  ): Enemy {
    const def = ENEMIES[type];
    const armored = o.armored && !!def.shell;
    const maxHp = def.hp * (armored ? 2 : 1) * (def.boss ? o.hpMult : 1);
    const path = this.paths[pathIndex]!;
    path.pointAt(progress, this.tmp);
    const e: Enemy = {
      uid: this.nextUid++,
      type,
      def,
      pathIndex,
      progress,
      x: this.tmp.x,
      y: this.tmp.y,
      angle: path.angleAt(progress),
      hp: maxHp,
      maxHp,
      armored,
      invisible: o.invisible || !!def.invisible,
      regen: o.regen && !def.boss,
      regenChain: o.regenChain,
      lastDamaged: this.time,
      hpMult: o.hpMult,
      speedMult: o.speedMult,
      slowMult: 1,
      slowT: 0,
      frozenT: 0,
      stunT: 0,
      burnDps: 0,
      burnT: 0,
      burnTick: 0,
      alive: true,
      hitT: 99,
    };
    this.enemies.push(e);
    return e;
  }

  private updateEnemies(): void {
    const list = this.enemies;
    for (let i = 0; i < list.length; i++) {
      const e = list[i]!;
      if (!e.alive) continue;
      e.hitT += DT;
      // burning / poison
      if (e.burnT > 0) {
        e.burnT -= DT;
        e.burnTick += DT;
        if (e.burnTick >= 0.5) {
          e.burnTick -= 0.5;
          this.damage(e, e.burnDps * 0.5, 'true', 1, 1, null, -1);
          if (!e.alive) continue;
        }
      }
      // regrowth
      if (e.regen && e.regenChain.length > 0 && this.time - e.lastDamaged > REGROW_DELAY) {
        const parent = e.regenChain.pop()!;
        e.type = parent;
        e.def = ENEMIES[parent];
        e.hp = e.maxHp = e.def.hp;
        e.lastDamaged = this.time;
      }
      if (e.frozenT > 0) e.frozenT -= DT;
      if (e.stunT > 0) e.stunT -= DT;
      if (e.slowT > 0) {
        e.slowT -= DT;
        if (e.slowT <= 0) e.slowMult = 1;
      }
      if (e.frozenT > 0 || e.stunT > 0) continue;
      e.progress += e.def.speed * e.speedMult * e.slowMult * DT;
      const path = this.paths[e.pathIndex]!;
      if (e.progress >= path.length) {
        this.leak(e);
        continue;
      }
      path.pointAt(e.progress, this.tmp);
      e.x = this.tmp.x;
      e.y = this.tmp.y;
      e.angle = path.angleAt(e.progress);
    }
  }

  private leak(e: Enemy): void {
    e.alive = false;
    const remaining = Math.max(1, Math.ceil(rbe(e.type, e.armored) - (e.maxHp - e.hp)));
    this.lives -= remaining;
    this.events.emit('leak', { enemy: e.type, livesLost: remaining });
    if (this.lives <= 0) {
      this.lives = 0;
      this.over = { won: false };
      this.roundActive = false;
      this.events.emit('gameOver', { won: false, round: this.round });
    }
  }

  private rebuildHash(): void {
    this.hash.clear();
    const list = this.enemies;
    for (let i = 0; i < list.length; i++) {
      const e = list[i]!;
      this.hash.insert(i, e.x, e.y);
    }
  }

  private compactEnemies(): void {
    const list = this.enemies;
    let w = 0;
    for (let r = 0; r < list.length; r++) {
      const e = list[r]!;
      if (e.alive) list[w++] = e;
    }
    list.length = w;
  }

  private compactProjectiles(): void {
    const list = this.projectiles;
    let w = 0;
    for (let r = 0; r < list.length; r++) {
      const p = list[r]!;
      if (p.alive) list[w++] = p;
    }
    list.length = w;
  }

  private checkRoundEnd(): void {
    if (!this.roundActive || this.over) return;
    if (this.spawnIdx < this.spawnQueue.length || this.enemies.length > 0) return;
    this.roundActive = false;
    // projectiles in flight are cleared; traps persist
    for (const p of this.projectiles) if (!p.trap) p.alive = false;
    this.compactProjectiles();
    const bonus = 100 + this.round;
    let income = 0;
    let lives = 0;
    for (const t of this.towers) {
      income += t.stats.income.perRound;
      lives += t.stats.income.lives;
      if (t.stats.income.interest > 0)
        income += Math.min(t.stats.income.interestCap, Math.floor(this.cash * t.stats.income.interest));
    }
    this.cash += bonus + income;
    this.lives += lives;
    this.events.emit('roundEnd', { round: this.round, bonus: bonus + income });
    if (!this.freeplay && this.round >= this.finalRound) {
      this.over = { won: true };
      this.events.emit('gameOver', { won: true, round: this.round });
    }
  }

  // ------------------------------------------------------------------ damage

  /** Cash per layer popped, tapering in late rounds (as in classic tower defense). */
  private popCash(): number {
    const r = this.round;
    if (r <= 50) return 1;
    if (r <= 60) return 0.5;
    if (r <= 85) return 0.2;
    if (r <= 100) return 0.1;
    return 0.05;
  }

  /**
   * Applies damage to an enemy. Overflow damage carries into its children. Returns false if the
   * enemy was immune.
   */
  damage(
    e: Enemy,
    amount: number,
    dtype: DamageType,
    bossMult: number,
    shellMult: number,
    effects: EffectSpec | null,
    towerUid: number,
  ): boolean {
    if (!e.alive) return false;
    if (dtype !== 'true' && e.def.immune.includes(dtype)) {
      this.events.emit('immune', { x: e.x, y: e.y, enemy: e.type, dtype });
      return false;
    }
    let amt = amount;
    if (e.def.boss) amt *= bossMult;
    if (e.def.shell && e.def.hp > 1) amt *= shellMult;
    e.hp -= amt;
    e.lastDamaged = this.time;
    e.hitT = 0;
    if (e.hp > 0) {
      if (effects) this.applyEffects(e, effects);
      return true;
    }
    this.pop(e, -e.hp, dtype, effects, towerUid);
    return true;
  }

  applyEffects(e: Enemy, fx: EffectSpec, force = false): void {
    const ctl = e.def.boss ? (force ? 0.5 : fx.bossControl) : 1;
    if (fx.freezeDur > 0 && ctl > 0) e.frozenT = Math.max(e.frozenT, fx.freezeDur * ctl);
    if (fx.stunDur > 0 && ctl > 0) e.stunT = Math.max(e.stunT, fx.stunDur * ctl);
    if (fx.slowDur > 0 && fx.slowMult < 1 && ctl > 0) {
      e.slowMult = Math.min(e.slowMult, fx.slowMult);
      e.slowT = Math.max(e.slowT, fx.slowDur);
    }
    if (fx.burnDur > 0 && fx.burnDps > 0) {
      e.burnDps = Math.max(e.burnDps, fx.burnDps);
      e.burnT = Math.max(e.burnT, fx.burnDur);
    }
  }

  private pop(
    e: Enemy,
    overflow: number,
    dtype: DamageType,
    effects: EffectSpec | null,
    towerUid: number,
  ): void {
    e.alive = false;
    this.cash += this.popCash() * (e.def.boss ? Math.ceil(e.maxHp / 20) : 1);
    this.popCount++;
    if (towerUid >= 0) {
      const t = this.towerByUid(towerUid);
      if (t) t.pops++;
    }
    this.events.emit('pop', { x: e.x, y: e.y, enemy: e.type, dtype, boss: !!e.def.boss });
    let n = 0;
    for (const c of e.def.children) {
      for (let k = 0; k < c.count; k++) {
        const child = this.spawnEnemy(c.id, e.pathIndex, Math.max(0, e.progress - n * 9), {
          invisible: e.invisible,
          regen: e.regen,
          armored: false,
          hpMult: e.hpMult,
          speedMult: e.speedMult,
          regenChain: e.regen ? [...e.regenChain, e.type] : [],
        });
        n++;
        child.frozenT = e.frozenT;
        child.slowMult = e.slowMult;
        child.slowT = e.slowT;
        child.burnDps = e.burnDps;
        child.burnT = e.burnT;
        if (overflow > 1e-6) this.damage(child, overflow, dtype, 1, 1, effects, towerUid);
      }
    }
  }

  // ------------------------------------------------------------------ towers

  private recomputeBuffs(): void {
    for (const t of this.towers) t.buff = noBuff();
    for (const s of this.towers) {
      const sup = s.stats.support;
      if (sup.radius <= 0) continue;
      for (const t of this.towers) {
        if (t === s) continue;
        if (Math.hypot(t.x - s.x, t.y - s.y) > sup.radius) continue;
        t.buff.rateMult = Math.min(t.buff.rateMult, sup.rateMult);
        t.buff.rangeMult = Math.max(t.buff.rangeMult, sup.rangeMult);
        t.buff.pierceAdd = Math.max(t.buff.pierceAdd, sup.pierceAdd);
        t.buff.damageAdd = Math.max(t.buff.damageAdd, sup.damageAdd);
        t.buff.sight = t.buff.sight || sup.grantSight > 0;
      }
    }
    for (const t of this.towers) this.refreshTrapSpots(t);
  }

  private refreshTrapSpots(t: Tower): void {
    t.trapSpots = [];
    if (!t.stats.attacks.some((a) => a.kind === 'trap')) return;
    const r = t.stats.range * t.buff.rangeMult;
    this.paths.forEach((p, pi) => {
      for (let d = 0; d < p.length; d += 12) {
        p.pointAt(d, this.tmp);
        if (Math.hypot(this.tmp.x - t.x, this.tmp.y - t.y) <= r && this.tmp.x > 0 && this.tmp.x < WORLD_W) {
          t.trapSpots.push({ path: pi, at: d });
        }
      }
    });
  }

  private updateTowers(): void {
    for (const t of this.towers) {
      if (this.roundActive && t.abilityCd > 0) t.abilityCd -= DT;
      if (t.frenzyT > 0) {
        t.frenzyT -= DT;
        if (t.frenzyT <= 0) t.frenzyMult = 1;
      }
      if (t.rallyT > 0) {
        t.rallyT -= DT;
        if (t.rallyT <= 0) t.rallyMult = 1;
      }
      const attacks = t.stats.attacks;
      for (let i = 0; i < attacks.length; i++) {
        t.attackT[i] = (t.attackT[i] ?? 99) + DT;
        const a = attacks[i]!;
        if (t.cooldowns[i]! > 0) {
          t.cooldowns[i]! -= DT;
          continue;
        }
        if (this.fire(t, a, i)) {
          t.cooldowns[i] = a.rate * t.buff.rateMult * t.frenzyMult * t.rallyMult;
          t.attackT[i] = 0;
        }
      }
    }
  }

  private attackRange(t: Tower, a: AttackStats): number {
    return a.rangeMult === Infinity ? Infinity : this.rangeOf(t) * a.rangeMult;
  }

  /** Picks the best visible target in range by priority. */
  findTarget(t: Tower, range: number, priority: TargetPriority, exclude?: number[]): Enemy | null {
    const sees = this.seesInvisible(t);
    let best: Enemy | null = null;
    let bestScore = -Infinity;
    const consider = (e: Enemy) => {
      if (!e.alive) return;
      if (e.invisible && !sees) return;
      if (exclude && exclude.includes(e.uid)) return;
      const dx = e.x - t.x;
      const dy = e.y - t.y;
      const d2 = dx * dx + dy * dy;
      if (range !== Infinity && d2 > (range + e.def.radius) * (range + e.def.radius)) return;
      if (e.x < -20 || e.x > WORLD_W + 20) return; // not yet visible on screen
      let score: number;
      switch (priority) {
        case 'first':
          score = e.progress;
          break;
        case 'last':
          score = -e.progress;
          break;
        case 'close':
          score = -d2;
          break;
        case 'strong':
          score = ENEMY_STRENGTH[e.type] * 1e5 + e.progress;
          break;
      }
      if (score > bestScore) {
        bestScore = score;
        best = e;
      }
    };
    if (range === Infinity) {
      for (const e of this.enemies) consider(e);
    } else {
      this.hash.query(t.x, t.y, range + MAX_ENEMY_RADIUS, (i) => {
        const e = this.enemies[i];
        if (e) consider(e);
      });
    }
    return best;
  }

  private enemiesInRadius(x: number, y: number, r: number, out: Enemy[]): Enemy[] {
    out.length = 0;
    if (r === Infinity) {
      for (const e of this.enemies) if (e.alive) out.push(e);
      return out;
    }
    this.hash.query(x, y, r + MAX_ENEMY_RADIUS, (i) => {
      const e = this.enemies[i];
      if (!e || !e.alive) return;
      const rr = r + e.def.radius;
      if ((e.x - x) ** 2 + (e.y - y) ** 2 <= rr * rr) out.push(e);
    });
    return out;
  }

  private readonly areaBuf: Enemy[] = [];

  private fire(t: Tower, a: AttackStats, idx: number): boolean {
    const range = this.attackRange(t, a);
    const priority = a.forcePriority ?? t.priority;
    const damage = a.damage + t.buff.damageAdd;
    const pierce = a.pierce + t.buff.pierceAdd;
    switch (a.kind) {
      case 'projectile': {
        const target = this.findTarget(t, range, priority);
        if (!target) return false;
        const ang = Math.atan2(target.y - t.y, target.x - t.x);
        t.facing = ang;
        const n = Math.max(1, Math.round(a.projectile.count));
        for (let k = 0; k < n; k++) {
          const off = n === 1 ? 0 : -a.projectile.spread / 2 + (a.projectile.spread * k) / (n - 1);
          this.spawnProjectile(t, a, ang + off, damage, pierce, target.uid);
        }
        this.events.emit('attack', {
          towerUid: t.uid,
          attackId: a.id,
          angle: ang,
          tx: target.x,
          ty: target.y,
          kind: a.kind,
        });
        return true;
      }
      case 'melee': {
        const target = this.findTarget(t, range, priority);
        if (!target) return false;
        t.facing = Math.atan2(target.y - t.y, target.x - t.x);
        const sees = this.seesInvisible(t);
        const list = this.enemiesInRadius(t.x, t.y, range, this.areaBuf).filter((e) => !e.invisible || sees);
        list.sort((p, q) => q.progress - p.progress);
        let hits = 0;
        for (const e of list) {
          if (hits >= pierce) break;
          this.damage(e, damage, a.dtype, a.bossMult, a.shellMult, a.effects, t.uid);
          hits++;
        }
        this.events.emit('attack', {
          towerUid: t.uid,
          attackId: a.id,
          angle: t.facing,
          tx: target.x,
          ty: target.y,
          kind: a.kind,
        });
        return true;
      }
      case 'aura': {
        const list = this.enemiesInRadius(t.x, t.y, range, this.areaBuf);
        if (list.length === 0) return false;
        list.sort((p, q) => q.progress - p.progress);
        let hits = 0;
        for (const e of [...list]) {
          if (hits >= pierce) break;
          if (damage > 0) this.damage(e, damage, a.dtype, a.bossMult, a.shellMult, a.effects, t.uid);
          else if (!a.effects || a.dtype === 'true' || !e.def.immune.includes(a.dtype))
            this.applyEffects(e, a.effects);
          hits++;
        }
        this.events.emit('attack', {
          towerUid: t.uid,
          attackId: a.id,
          angle: t.facing,
          tx: t.x,
          ty: t.y,
          kind: a.kind,
        });
        return true;
      }
      case 'instant': {
        const target = this.findTarget(t, range, priority);
        if (!target) return false;
        t.facing = Math.atan2(target.y - t.y, target.x - t.x);
        let cur: Enemy | null = target;
        let fx = t.x;
        let fy = t.y;
        const hit: number[] = [];
        for (let j = 0; j <= a.chain && cur; j++) {
          const cx: number = cur.x;
          const cy: number = cur.y;
          this.events.emit('beam', { x1: fx, y1: fy, x2: cx, y2: cy, dtype: a.dtype });
          hit.push(cur.uid);
          if (a.projectile.splashRadius > 0)
            this.explode(
              cx,
              cy,
              a.projectile.splashRadius,
              a.projectile.splashPierce,
              a.projectile.splashDamage,
              a,
              t.uid,
            );
          this.damage(cur, damage, a.dtype, a.bossMult, a.shellMult, a.effects, t.uid);
          fx = cx;
          fy = cy;
          cur = j < a.chain ? this.nearestTo(cx, cy, CHAIN_RANGE, hit, this.seesInvisible(t)) : null;
        }
        this.events.emit('attack', {
          towerUid: t.uid,
          attackId: a.id,
          angle: t.facing,
          tx: target.x,
          ty: target.y,
          kind: a.kind,
        });
        return true;
      }
      case 'trap': {
        if (t.trapSpots.length === 0) return false;
        if (!this.roundActive) return false;
        const spot = t.trapSpots[this.rng.int(0, t.trapSpots.length)]!;
        this.paths[spot.path]!.pointAt(spot.at, this.tmp);
        const p = this.spawnProjectile(t, a, 0, damage, pierce, -1);
        p.x = this.tmp.x + this.rng.range(-8, 8);
        p.y = this.tmp.y + this.rng.range(-8, 8);
        p.vx = 0;
        p.vy = 0;
        p.trap = true;
        this.events.emit('attack', {
          towerUid: t.uid,
          attackId: a.id,
          angle: t.facing,
          tx: p.x,
          ty: p.y,
          kind: a.kind,
        });
        void idx;
        return true;
      }
    }
  }

  private nearestTo(x: number, y: number, r: number, exclude: number[], sees: boolean): Enemy | null {
    let best: Enemy | null = null;
    let bd = r * r;
    this.hash.query(x, y, r + MAX_ENEMY_RADIUS, (i) => {
      const e = this.enemies[i];
      if (!e || !e.alive || exclude.includes(e.uid) || (e.invisible && !sees)) return;
      const d = (e.x - x) ** 2 + (e.y - y) ** 2;
      if (d < bd) {
        bd = d;
        best = e;
      }
    });
    return best;
  }

  private spawnProjectile(
    t: Tower,
    a: AttackStats,
    ang: number,
    damage: number,
    pierce: number,
    targetUid: number,
  ): Projectile {
    const sp = a.projectile.speed;
    const p: Projectile = {
      uid: this.nextUid++,
      towerUid: t.uid,
      x: t.x + Math.cos(ang) * 16,
      y: t.y + Math.sin(ang) * 16 - 10,
      vx: Math.cos(ang) * sp,
      vy: Math.sin(ang) * sp,
      speed: sp,
      damage,
      pierce,
      dtype: a.dtype,
      radius: a.projectile.radius,
      life: a.projectile.lifetime,
      homingUid: a.projectile.homing ? targetUid : -1,
      sprite: a.projectile.sprite,
      splashRadius: a.projectile.splashRadius,
      splashPierce: a.projectile.splashPierce + t.buff.pierceAdd,
      splashDamage: a.projectile.splashDamage + t.buff.damageAdd,
      effects: a.effects,
      bossMult: a.bossMult,
      shellMult: a.shellMult,
      trap: false,
      hits: [],
      alive: true,
    };
    this.projectiles.push(p);
    return p;
  }

  private updateProjectiles(): void {
    const list = this.projectiles;
    const n = list.length;
    for (let i = 0; i < n; i++) {
      const p = list[i]!;
      if (!p.alive) continue;
      p.life -= DT;
      if (p.life <= 0) {
        p.alive = false;
        continue;
      }
      if (p.homingUid >= 0) {
        let target = this.enemyByUidFast(p.homingUid);
        if (!target) {
          const re = this.nearestTo(p.x, p.y, 260, p.hits, true);
          target = re;
          p.homingUid = re ? re.uid : -1;
        }
        if (target) {
          const desired = Math.atan2(target.y - p.y, target.x - p.x);
          const cur = Math.atan2(p.vy, p.vx);
          let diff = desired - cur;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          const turn = Math.max(-10 * DT, Math.min(10 * DT, diff));
          const na = cur + turn;
          p.vx = Math.cos(na) * p.speed;
          p.vy = Math.sin(na) * p.speed;
        }
      }
      p.x += p.vx * DT;
      p.y += p.vy * DT;
      if (p.x < -100 || p.x > WORLD_W + 100 || p.y < -100 || p.y > WORLD_H + 100) {
        p.alive = false;
        continue;
      }
      this.collide(p);
    }
  }

  private enemyByUidFast(uid: number): Enemy | null {
    for (const e of this.enemies) if (e.uid === uid && e.alive) return e;
    return null;
  }

  private collide(p: Projectile): void {
    this.hash.query(p.x, p.y, p.radius + MAX_ENEMY_RADIUS, (i) => {
      if (!p.alive) return;
      const e = this.enemies[i];
      if (!e || !e.alive) return;
      if (p.hits.includes(e.uid)) return;
      const rr = p.radius + e.def.radius;
      if ((e.x - p.x) ** 2 + (e.y - p.y) ** 2 > rr * rr) return;
      p.hits.push(e.uid);
      if (p.hits.length > 24) p.hits.shift();
      if (p.splashRadius > 0) {
        this.damage(e, p.damage, p.dtype, p.bossMult, p.shellMult, p.effects, p.towerUid);
        this.explodeProjectile(p);
        p.alive = false;
        return;
      }
      this.damage(e, p.damage, p.dtype, p.bossMult, p.shellMult, p.effects, p.towerUid);
      p.pierce--;
      if (p.pierce <= 0) p.alive = false;
    });
  }

  private explodeProjectile(p: Projectile): void {
    const list = this.enemiesInRadius(p.x, p.y, p.splashRadius, this.areaBuf);
    list.sort((a, b) => b.progress - a.progress);
    let hits = 0;
    for (const e of [...list]) {
      if (hits >= p.splashPierce) break;
      if (p.hits.includes(e.uid)) continue;
      this.damage(
        e,
        p.splashDamage,
        p.dtype === 'piercing' ? 'blast' : p.dtype,
        p.bossMult,
        p.shellMult,
        p.effects,
        p.towerUid,
      );
      hits++;
    }
    this.events.emit('explode', { x: p.x, y: p.y, radius: p.splashRadius, dtype: p.dtype });
  }

  private explode(
    x: number,
    y: number,
    radius: number,
    pierce: number,
    damage: number,
    a: AttackStats,
    towerUid: number,
  ): void {
    const list = this.enemiesInRadius(x, y, radius, this.areaBuf);
    let hits = 0;
    for (const e of [...list]) {
      if (hits >= pierce) break;
      this.damage(e, damage, 'blast', a.bossMult, a.shellMult, a.effects, towerUid);
      hits++;
    }
    this.events.emit('explode', { x, y, radius, dtype: 'blast' });
  }

  // ------------------------------------------------------------------ abilities

  private strongestEnemy(): Enemy | null {
    let best: Enemy | null = null;
    let bs = -Infinity;
    for (const e of this.enemies) {
      if (!e.alive || e.x < 0 || e.x > WORLD_W) continue;
      const s = ENEMY_STRENGTH[e.type] * 1e5 + e.progress;
      if (s > bs) {
        bs = s;
        best = e;
      }
    }
    return best;
  }

  private runAbility(t: Tower, a: AbilitySpec): void {
    let fxX = t.x;
    let fxY = t.y;
    switch (a.kind) {
      case 'frenzy':
        t.frenzyT = a.duration;
        t.frenzyMult = a.rateMult;
        break;
      case 'rally': {
        const r = t.stats.support.radius > 0 ? t.stats.support.radius : 220;
        for (const o of this.towers) {
          if (Math.hypot(o.x - t.x, o.y - t.y) <= r) {
            o.rallyT = Math.max(o.rallyT, a.duration);
            o.rallyMult = Math.min(o.rallyMult, a.rateMult);
          }
        }
        break;
      }
      case 'nova': {
        let cx = t.x;
        let cy = t.y;
        let r = a.radius;
        if (a.at === 'map') r = Infinity;
        else if (a.at === 'strongest') {
          const s = this.strongestEnemy();
          if (s) {
            cx = s.x;
            cy = s.y;
          }
        }
        fxX = cx;
        fxY = cy;
        const fx: EffectSpec = {
          slowMult: 1,
          slowDur: 0,
          freezeDur: a.freeze,
          burnDps: 0,
          burnDur: 0,
          stunDur: a.stun,
          bossControl: 0,
        };
        const list = [...this.enemiesInRadiusAll(cx, cy, r)];
        for (const e of list) {
          if (a.value > 0) this.damage(e, a.value, a.dtype, 1, 1, fx, t.uid);
          if (e.alive) this.applyEffects(e, fx);
        }
        if (r !== Infinity) this.events.emit('explode', { x: cx, y: cy, radius: r, dtype: a.dtype });
        break;
      }
      case 'smite': {
        const s = this.strongestEnemy();
        if (s) {
          fxX = s.x;
          fxY = s.y;
          this.events.emit('beam', { x1: t.x, y1: t.y, x2: s.x, y2: s.y, dtype: a.dtype });
          this.damage(s, a.value, a.dtype, 1, 1, null, t.uid);
        }
        break;
      }
      case 'cash':
        this.cash += a.value;
        this.events.emit('cash', { amount: a.value, x: t.x, y: t.y });
        break;
      case 'lives':
        this.lives += a.value;
        break;
    }
    this.events.emit('ability', { towerUid: t.uid, abilityId: a.id, x: fxX, y: fxY });
  }

  /** Like enemiesInRadius but rebuilds the hash first (abilities can run between ticks). */
  private enemiesInRadiusAll(x: number, y: number, r: number): Enemy[] {
    const out: Enemy[] = [];
    for (const e of this.enemies) {
      if (!e.alive) continue;
      if (r === Infinity) {
        if (e.x >= -20 && e.x <= WORLD_W + 20) out.push(e);
        continue;
      }
      const rr = r + e.def.radius;
      if ((e.x - x) ** 2 + (e.y - y) ** 2 <= rr * rr) out.push(e);
    }
    return out;
  }

  // ------------------------------------------------------------------ persistence

  /** Saves are only taken between rounds (no enemies in flight). */
  canSave(): boolean {
    return !this.roundActive && !this.over;
  }

  serialize(): SaveState {
    return {
      v: 1,
      mapId: this.map.id,
      difficulty: this.difficulty,
      seed: this.seed,
      rng: this.rng.state,
      round: this.round,
      cash: this.cash,
      lives: this.lives,
      nextUid: this.nextUid,
      freeplay: this.freeplay,
      time: this.time,
      spawnCounter: this.spawnCounter,
      traps: this.projectiles
        .filter((p) => p.trap && p.alive)
        .map(({ alive: _a, uid: _u, ...rest }) => ({ ...rest, hits: [...rest.hits] })),
      towers: this.towers.map((t) => ({
        id: t.def.id,
        x: t.x,
        y: t.y,
        tiers: [...t.tiers] as Tiers,
        priority: t.priority,
        spent: t.spent,
        abilityCd: t.abilityCd,
        pops: t.pops,
        cooldowns: [...t.cooldowns],
      })),
    };
  }

  static deserialize(s: SaveState): Game {
    if (s.v !== 1) throw new Error('Unsupported save version');
    const g = new Game({ mapId: s.mapId, difficulty: s.difficulty, seed: s.seed });
    g.rng.state = s.rng;
    g.round = s.round;
    g.cash = s.cash;
    g.lives = s.lives;
    g.freeplay = s.freeplay;
    g.time = s.time ?? 0;
    g.spawnCounter = s.spawnCounter ?? 0;
    for (const ts of s.towers) {
      if (!TOWERS[ts.id]) continue;
      const t = g.makeTower(ts.id, ts.x, ts.y, ts.tiers, ts.spent);
      t.priority = ts.priority;
      t.abilityCd = ts.abilityCd;
      t.pops = ts.pops;
      if (ts.cooldowns) ts.cooldowns.forEach((c, i) => (t.cooldowns[i] = c));
      g.towers.push(t);
    }
    g.nextUid = Math.max(s.nextUid, ...g.towers.map((t) => t.uid + 1), 1);
    for (const tr of s.traps ?? [])
      g.projectiles.push({ ...tr, hits: [...tr.hits], uid: g.nextUid++, alive: true });
    g.recomputeBuffs();
    return g;
  }
}
