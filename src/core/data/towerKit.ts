/** Small builders that keep tower data files readable. */
import type {
  AbilitySpec,
  AttackKey,
  AttackStats,
  EffectSpec,
  GearDef,
  IncomeStats,
  Mod,
  Op,
  ProjectileSpec,
  SupportStats,
  TowerStats,
  UpgradeDef,
} from './towerTypes';
import type { DamageType } from '../types';

export const noEffects = (): EffectSpec => ({
  slowMult: 1,
  slowDur: 0,
  freezeDur: 0,
  burnDps: 0,
  burnDur: 0,
  stunDur: 0,
  bossControl: 0,
});

export const projectile = (p: Partial<ProjectileSpec> = {}): ProjectileSpec => ({
  speed: 900,
  radius: 8,
  lifetime: 0.6,
  sprite: 'arrow',
  homing: false,
  count: 1,
  spread: 0,
  splashRadius: 0,
  splashPierce: 0,
  splashDamage: 0,
  ...p,
});

export function attack(
  a: Partial<Omit<AttackStats, 'projectile' | 'effects'>> & {
    id: string;
    kind: AttackStats['kind'];
    projectile?: Partial<ProjectileSpec>;
    effects?: Partial<EffectSpec>;
  },
): AttackStats {
  return {
    rate: 1,
    damage: 1,
    pierce: 1,
    dtype: 'piercing',
    rangeMult: 1,
    bossMult: 1,
    shellMult: 1,
    chain: 0,
    anim: 'mainHand',
    ...a,
    projectile: projectile(a.projectile),
    effects: { ...noEffects(), ...a.effects },
  };
}

export const noSupport = (): SupportStats => ({
  radius: 0,
  rateMult: 1,
  rangeMult: 1,
  pierceAdd: 0,
  damageAdd: 0,
  grantSight: 0,
});

export const noIncome = (): IncomeStats => ({ perRound: 0, lives: 0, interest: 0, interestCap: 0 });

export function stats(s: Partial<TowerStats> & { range: number; attacks: AttackStats[] }): TowerStats {
  return { trueSight: 0, support: noSupport(), income: noIncome(), ability: null, ...s };
}

export function ability(
  a: Partial<AbilitySpec> & Pick<AbilitySpec, 'id' | 'name' | 'kind' | 'cooldown'>,
): AbilitySpec {
  return {
    value: 0,
    duration: 0,
    at: 'tower',
    radius: 0,
    dtype: 'true',
    freeze: 0,
    stun: 0,
    rateMult: 1,
    ...a,
  };
}

// ---- mod helpers ---------------------------------------------------------------
const am = (op: Op, key: AttackKey, value: number, attack = 'main'): Mod => ({
  kind: 'attack',
  op,
  key,
  value,
  attack,
});
export const add = (key: AttackKey, value: number, attack = 'main') => am('add', key, value, attack);
export const mul = (key: AttackKey, value: number, attack = 'main') => am('mul', key, value, attack);
export const set = (key: AttackKey, value: number, attack = 'main') => am('set', key, value, attack);
export const rate = (mult: number, attack = 'main') => am('mul', 'rate', mult, attack);
export const dmg = (n: number, attack = 'main') => am('add', 'damage', n, attack);
export const pierce = (n: number, attack = 'main') => am('add', 'pierce', n, attack);
export const range = (mult: number): Mod => ({ kind: 'range', op: 'mul', value: mult });
export const sight = (): Mod => ({ kind: 'sight' });
export const dtype = (d: DamageType, attack = 'main'): Mod => ({ kind: 'dtype', dtype: d, attack });
export const homing = (attack = 'main'): Mod => ({ kind: 'homing', attack });
export const sprite = (s: string, attack = 'main'): Mod => ({ kind: 'sprite', sprite: s, attack });
export const addAttack = (a: AttackStats): Mod => ({ kind: 'addAttack', attack: a });
export const support = (key: keyof SupportStats, op: Op, value: number): Mod => ({
  kind: 'support',
  op,
  key,
  value,
});
export const income = (key: keyof IncomeStats, op: Op, value: number): Mod => ({
  kind: 'income',
  op,
  key,
  value,
});
export const withAbility = (a: AbilitySpec): Mod => ({ kind: 'ability', ability: a });

export const gear = (slot: string, art: string, aura = false): GearDef =>
  aura ? { slot, art, aura } : { slot, art };

export function up(name: string, cost: number, desc: string, gearList: GearDef[], mods: Mod[]): UpgradeDef {
  return { name, cost, desc, gear: gearList, mods };
}
