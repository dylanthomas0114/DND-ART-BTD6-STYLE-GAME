import type { DamageType, TargetPriority } from '../types';

export type TowerId =
  'fighter' | 'ranger' | 'rogue' | 'wizard' | 'bombardier' | 'druid' | 'ballista' | 'cleric' | 'treasury';

export type AttackKind = 'projectile' | 'melee' | 'aura' | 'instant' | 'trap';

export interface ProjectileSpec {
  speed: number;
  radius: number;
  lifetime: number;
  /** Render sprite id (see render/art/projectiles). */
  sprite: string;
  homing: boolean;
  /** Projectiles per volley. */
  count: number;
  /** Total fan angle (radians) across a volley. */
  spread: number;
  splashRadius: number;
  splashPierce: number;
  splashDamage: number;
}

export interface EffectSpec {
  slowMult: number;
  slowDur: number;
  freezeDur: number;
  burnDps: number;
  burnDur: number;
  stunDur: number;
  /** Multiplier applied to freeze/stun durations on bosses (0 = immune). */
  bossControl: number;
}

export interface AttackStats {
  id: string;
  kind: AttackKind;
  /** Seconds between attacks. */
  rate: number;
  damage: number;
  pierce: number;
  dtype: DamageType;
  /** Multiplies tower range for this attack (Infinity = whole map). */
  rangeMult: number;
  projectile: ProjectileSpec;
  effects: EffectSpec;
  bossMult: number;
  shellMult: number;
  /** Instant: extra jumps to nearby enemies. */
  chain: number;
  /** Which gear slot plays the attack animation. */
  anim: string;
  /** Forced target priority (e.g. assassin marks always go for the strongest). */
  forcePriority?: TargetPriority;
}

export interface SupportStats {
  radius: number;
  rateMult: number;
  rangeMult: number;
  pierceAdd: number;
  damageAdd: number;
  grantSight: number; // 0/1
}

export interface IncomeStats {
  perRound: number;
  lives: number;
  interest: number;
  interestCap: number;
}

export type AbilityKind = 'frenzy' | 'rally' | 'nova' | 'smite' | 'cash' | 'lives';

export interface AbilitySpec {
  id: string;
  name: string;
  kind: AbilityKind;
  cooldown: number;
  /** Damage, cash or lives depending on kind. */
  value: number;
  duration: number;
  /** Where a nova lands: around the tower, around the strongest enemy, or the whole map. */
  at: 'tower' | 'strongest' | 'map';
  /** Nova radius (ignored when `at` is 'map'). */
  radius: number;
  dtype: DamageType;
  freeze: number;
  stun: number;
  /** Rate multiplier for frenzy/rally. */
  rateMult: number;
}

export interface TowerStats {
  range: number;
  trueSight: number; // 0/1
  attacks: AttackStats[];
  support: SupportStats;
  income: IncomeStats;
  ability: AbilitySpec | null;
}

export interface GearDef {
  slot: string;
  /** Art id registered in render/art/gear. */
  art: string;
  /** Purely a glow/aura effect, which never counts as an upgrade's only gear. */
  aura?: boolean;
}

export type Op = 'add' | 'mul' | 'set';

export type AttackKey =
  | 'rate'
  | 'damage'
  | 'pierce'
  | 'rangeMult'
  | 'bossMult'
  | 'shellMult'
  | 'chain'
  | `projectile.${'speed' | 'radius' | 'lifetime' | 'count' | 'spread' | 'splashRadius' | 'splashPierce' | 'splashDamage'}`
  | `effects.${keyof EffectSpec}`;

export type Mod =
  | { kind: 'attack'; op: Op; key: AttackKey; value: number; attack: string }
  | { kind: 'range'; op: Op; value: number }
  | { kind: 'support'; op: Op; key: keyof SupportStats; value: number }
  | { kind: 'income'; op: Op; key: keyof IncomeStats; value: number }
  | { kind: 'sight' }
  | { kind: 'dtype'; dtype: DamageType; attack: string }
  | { kind: 'homing'; attack: string }
  | { kind: 'sprite'; sprite: string; attack: string }
  | { kind: 'addAttack'; attack: AttackStats }
  | { kind: 'ability'; ability: AbilitySpec };

export interface UpgradeDef {
  name: string;
  cost: number;
  desc: string;
  mods: Mod[];
  gear: GearDef[];
}

export interface PathDef {
  name: string;
  /** Gear slots exclusively owned by this path. */
  slots: string[];
  upgrades: [UpgradeDef, UpgradeDef, UpgradeDef, UpgradeDef, UpgradeDef];
}

export interface TowerDef {
  id: TowerId;
  name: string;
  title: string;
  blurb: string;
  cost: number;
  /** Placement radius (world units). */
  footprint: number;
  placement: 'land' | 'any';
  /** Rig id (render/art/rigs). */
  rig: 'humanoid' | 'ballista' | 'treasury';
  /** Body palette key used by the humanoid rig. */
  look: string;
  /** Slots in back-to-front draw order. */
  slots: string[];
  baseGear: GearDef[];
  base: TowerStats;
  paths: [PathDef, PathDef, PathDef];
}

export type Tiers = [number, number, number];
