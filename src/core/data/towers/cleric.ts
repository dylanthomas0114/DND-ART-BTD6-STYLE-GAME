import type { TowerDef } from '../towerTypes';
import {
  ability,
  add,
  attack,
  dmg,
  gear,
  income,
  mul,
  range,
  rate,
  stats,
  support,
  up,
  withAbility,
} from '../towerKit';

const beam = attack({
  id: 'main',
  kind: 'instant',
  rate: 1.3,
  damage: 1,
  pierce: 1,
  dtype: 'radiant',
  anim: 'mainHand',
});

export const cleric: TowerDef = {
  id: 'cleric',
  name: 'Cleric',
  title: 'Voice of the Dawn',
  blurb: 'Radiant beams. Blesses nearby towers and keeps the faithful alive.',
  cost: 500,
  footprint: 21,
  placement: 'land',
  rig: 'humanoid',
  look: 'cleric',
  slots: ['ground', 'back', 'body', 'head', 'offHand', 'mainHand'],
  baseGear: [gear('mainHand', 'mace_plain')],
  base: stats({ range: 145, attacks: [beam] }),
  paths: [
    {
      name: 'Light',
      slots: ['mainHand', 'head'],
      upgrades: [
        up('Holy Mace', 180, 'Beams burn brighter.', [gear('mainHand', 'mace_holy')], [dmg(1)]),
        up('Halo', 350, 'Beams leap between foes.', [gear('head', 'halo')], [add('chain', 2)]),
        up(
          'Sun Mace',
          1500,
          'Sun-forged: devastating to shells.',
          [gear('mainHand', 'mace_sun')],
          [dmg(3), mul('shellMult', 3), rate(0.8)],
        ),
        up(
          'Radiant Halo',
          5000,
          'Ability: Divine Smite scours every foe on the map.',
          [gear('head', 'halo_radiant')],
          [
            add('chain', 3),
            dmg(2),
            withAbility(
              ability({
                id: 'smite',
                name: 'Divine Smite',
                kind: 'nova',
                cooldown: 40,
                at: 'map',
                value: 40,
                dtype: 'radiant',
              }),
            ),
          ],
        ),
        up(
          'Mace of Dawn',
          24000,
          'Dawn itself in a weapon.',
          [gear('mainHand', 'mace_dawn')],
          [dmg(16), add('chain', 6), rate(0.6), mul('bossMult', 2)],
        ),
      ],
    },
    {
      name: 'Blessing',
      slots: ['offHand', 'body'],
      upgrades: [
        up(
          'Holy Symbol',
          250,
          'Nearby towers see invisible foes.',
          [gear('offHand', 'symbol_holy')],
          [support('radius', 'set', 170), support('grantSight', 'set', 1), { kind: 'sight' }],
        ),
        up(
          'Blessed Vestments',
          900,
          'Nearby towers attack 15% faster.',
          [gear('body', 'vestments_blessed')],
          [support('rateMult', 'mul', 0.85)],
        ),
        up(
          'Reliquary',
          2000,
          'Nearby towers reach farther and pierce more.',
          [gear('offHand', 'reliquary')],
          [support('rangeMult', 'mul', 1.1), support('pierceAdd', 'add', 1), support('radius', 'add', 20)],
        ),
        up(
          'Saint’s Vestments',
          7500,
          'Nearby towers deal +1 damage.',
          [gear('body', 'vestments_saint')],
          [support('damageAdd', 'add', 1)],
        ),
        up(
          'Holy Grail',
          20000,
          'Ability: Miracle. Nearby towers attack three times as fast.',
          [gear('offHand', 'grail')],
          [
            support('radius', 'add', 40),
            support('damageAdd', 'add', 1),
            withAbility(
              ability({
                id: 'miracle',
                name: 'Miracle',
                kind: 'rally',
                cooldown: 60,
                duration: 10,
                rateMult: 0.33,
              }),
            ),
          ],
        ),
      ],
    },
    {
      name: 'Sanctuary',
      slots: ['back', 'ground'],
      upgrades: [
        up(
          'Pilgrim Cloak',
          200,
          'Restores 2 lives each round.',
          [gear('back', 'cape_pilgrim')],
          [income('lives', 'add', 2)],
        ),
        up(
          'Wayside Shrine',
          500,
          'Offerings: +60 gold each round.',
          [gear('ground', 'shrine')],
          [income('perRound', 'add', 60)],
        ),
        up(
          'Angel Wings',
          2200,
          'Restores 5 lives each round. Beams hit harder.',
          [gear('back', 'wings_angel')],
          [income('lives', 'add', 5), dmg(1), range(1.1)],
        ),
        up(
          'Temple',
          6000,
          '+250 gold each round. Ability: Sanctuary restores 25 lives.',
          [gear('ground', 'temple')],
          [
            income('perRound', 'add', 250),
            withAbility(
              ability({ id: 'sanctuary', name: 'Sanctuary', kind: 'lives', cooldown: 90, value: 25 }),
            ),
          ],
        ),
        up(
          'Seraph',
          30000,
          'Six wings of light: more lives, more gold, brighter beams.',
          [gear('back', 'wings_seraph')],
          [income('lives', 'add', 15), income('perRound', 'add', 500), dmg(5), rate(0.7)],
        ),
      ],
    },
  ],
};
