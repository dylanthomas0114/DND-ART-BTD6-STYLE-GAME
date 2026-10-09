import type { TowerDef, TowerId } from '../towerTypes';
import { ballista } from './ballista';
import { bombardier } from './bombardier';
import { cleric } from './cleric';
import { druid } from './druid';
import { fighter } from './fighter';
import { ranger } from './ranger';
import { rogue } from './rogue';
import { treasury } from './treasury';
import { wizard } from './wizard';

/** Shop order. */
export const TOWER_LIST: readonly TowerDef[] = [
  fighter,
  ranger,
  rogue,
  wizard,
  bombardier,
  druid,
  ballista,
  cleric,
  treasury,
];

export const TOWERS: Record<TowerId, TowerDef> = Object.fromEntries(
  TOWER_LIST.map((t) => [t.id, t]),
) as Record<TowerId, TowerDef>;
