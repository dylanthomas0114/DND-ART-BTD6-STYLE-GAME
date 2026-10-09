import type { AttackStats, GearDef, Mod, Op, TowerDef, TowerStats, Tiers } from './data/towerTypes';

export const MAX_TIER = 5;

/**
 * BTD-style crosspath rule: at most two paths may be upgraded, and only one of them past tier 2.
 */
export function isValidTiers(t: Tiers): boolean {
  let nonZero = 0;
  let overTwo = 0;
  for (const v of t) {
    if (v < 0 || v > MAX_TIER || !Number.isInteger(v)) return false;
    if (v > 0) nonZero++;
    if (v > 2) overTwo++;
  }
  return nonZero <= 2 && overTwo <= 1;
}

export function canUpgrade(t: Tiers, path: number): boolean {
  if (path < 0 || path > 2) return false;
  const next: Tiers = [t[0], t[1], t[2]];
  next[path] = next[path]! + 1;
  return isValidTiers(next);
}

/** Every crosspath-legal tier combination (used by tests and the gallery). */
export function allValidTiers(): Tiers[] {
  const out: Tiers[] = [];
  for (let a = 0; a <= MAX_TIER; a++)
    for (let b = 0; b <= MAX_TIER; b++)
      for (let c = 0; c <= MAX_TIER; c++) {
        const t: Tiers = [a, b, c];
        if (isValidTiers(t)) out.push(t);
      }
  return out;
}

function applyOp(cur: number, op: Op, v: number): number {
  switch (op) {
    case 'add':
      return cur + v;
    case 'mul':
      return cur * v;
    case 'set':
      return v;
  }
}

function getKey(a: AttackStats, key: string): number {
  const [head, tail] = key.split('.') as [string, string | undefined];
  const obj = (tail
    ? (a as unknown as Record<string, Record<string, number>>)[head]
    : a) as unknown as Record<string, number>;
  return obj[tail ?? head]!;
}

function setKey(a: AttackStats, key: string, v: number): void {
  const [head, tail] = key.split('.') as [string, string | undefined];
  const obj = (tail
    ? (a as unknown as Record<string, Record<string, number>>)[head]
    : a) as unknown as Record<string, number>;
  obj[tail ?? head] = v;
}

function cloneStats(s: TowerStats): TowerStats {
  return {
    range: s.range,
    trueSight: s.trueSight,
    attacks: s.attacks.map((a) => ({ ...a, projectile: { ...a.projectile }, effects: { ...a.effects } })),
    support: { ...s.support },
    income: { ...s.income },
    ability: s.ability ? { ...s.ability } : null,
  };
}

function targets(s: TowerStats, attack: string): AttackStats[] {
  if (attack === '*') return s.attacks;
  return s.attacks.filter((a) => a.id === attack);
}

export function applyMod(s: TowerStats, m: Mod, ctx = ''): void {
  switch (m.kind) {
    case 'attack': {
      const list = targets(s, m.attack);
      if (list.length === 0) throw new Error(`${ctx}: mod targets missing attack "${m.attack}"`);
      for (const a of list) setKey(a, m.key, applyOp(getKey(a, m.key), m.op, m.value));
      break;
    }
    case 'range':
      s.range = applyOp(s.range, m.op, m.value);
      break;
    case 'support':
      s.support[m.key] = applyOp(s.support[m.key], m.op, m.value);
      break;
    case 'income':
      s.income[m.key] = applyOp(s.income[m.key], m.op, m.value);
      break;
    case 'sight':
      s.trueSight = 1;
      break;
    case 'dtype':
      for (const a of targets(s, m.attack)) a.dtype = m.dtype;
      break;
    case 'homing':
      for (const a of targets(s, m.attack)) a.projectile.homing = true;
      break;
    case 'sprite':
      for (const a of targets(s, m.attack)) a.projectile.sprite = m.sprite;
      break;
    case 'addAttack': {
      const idx = s.attacks.findIndex((a) => a.id === m.attack.id);
      const copy = { ...m.attack, projectile: { ...m.attack.projectile }, effects: { ...m.attack.effects } };
      if (idx >= 0) s.attacks[idx] = copy;
      else s.attacks.push(copy);
      break;
    }
    case 'ability':
      s.ability = { ...m.ability };
      break;
  }
}

/** Effective stats for a tower at the given tiers (mods applied path by path, tier by tier). */
export function computeStats(def: TowerDef, tiers: Tiers): TowerStats {
  const s = cloneStats(def.base);
  for (let p = 0; p < 3; p++) {
    for (let t = 0; t < tiers[p]!; t++) {
      const u = def.paths[p]!.upgrades[t]!;
      for (const m of u.mods) applyMod(s, m, `${def.id} ${p + 1}-${t + 1}`);
    }
  }
  return s;
}

/**
 * The gear a tower wears at the given tiers, in draw order. Within a path, a higher tier replaces
 * a lower tier's piece in the same slot; pieces in that path's other slots remain. Paths own
 * disjoint slots, so two upgraded paths always combine.
 */
export function computeGear(def: TowerDef, tiers: Tiers): GearDef[] {
  const bySlot = new Map<string, GearDef>();
  for (const g of def.baseGear) bySlot.set(g.slot, g);
  for (let p = 0; p < 3; p++) {
    for (let t = 0; t < tiers[p]!; t++) {
      for (const g of def.paths[p]!.upgrades[t]!.gear) bySlot.set(g.slot, g);
    }
  }
  const out: GearDef[] = [];
  for (const slot of def.slots) {
    const g = bySlot.get(slot);
    if (g) out.push(g);
  }
  return out;
}

export function upgradeCost(def: TowerDef, path: number, tier: number, costMult: number): number {
  const u = def.paths[path]?.upgrades[tier - 1];
  if (!u) throw new Error(`No upgrade ${def.id} path ${path} tier ${tier}`);
  return Math.max(5, Math.round((u.cost * costMult) / 5) * 5);
}
