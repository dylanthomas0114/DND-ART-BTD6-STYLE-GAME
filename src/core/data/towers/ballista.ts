import type { TowerDef } from '../towerTypes';
import {
  ability,
  add,
  attack,
  dmg,
  dtype,
  gear,
  income,
  mul,
  rate,
  set,
  sight,
  stats,
  support,
  up,
  withAbility,
} from '../towerKit';

const bolt = attack({
  id: 'main',
  kind: 'instant',
  rate: 1.6,
  damage: 2,
  pierce: 1,
  dtype: 'piercing',
  rangeMult: Infinity,
  anim: 'bolt',
});

export const ballista: TowerDef = {
  id: 'ballista',
  name: 'Ballista Crew',
  title: 'Siegeworks of the Iron Legion',
  blurb: 'Hits anything anywhere on the map. Slow but strong.',
  cost: 350,
  footprint: 24,
  placement: 'land',
  rig: 'ballista',
  look: 'ballista',
  slots: ['ground', 'flag', 'ammo', 'frame', 'crew', 'bolt'],
  baseGear: [gear('bolt', 'bolt_wood')],
  base: stats({ range: 132, attacks: [bolt] }),
  paths: [
    {
      name: 'Heavy Bolts',
      slots: ['bolt', 'frame'],
      upgrades: [
        up('Iron Bolts', 350, 'Iron-tipped bolts deal +2 damage.', [gear('bolt', 'bolt_iron')], [dmg(2)]),
        up(
          'Reinforced Frame',
          1300,
          'A sturdier frame hurls bolts harder.',
          [gear('frame', 'frame_reinforced')],
          [dmg(3), mul('shellMult', 2)],
        ),
        up(
          'Dragonbone Bolts',
          2700,
          'Bolts that pierce any hide, iron or ward.',
          [gear('bolt', 'bolt_dragonbone')],
          [dmg(7), dtype('true')],
        ),
        up(
          'Siege Frame',
          5600,
          'Siege-grade. Staggers bosses.',
          [gear('frame', 'frame_siege')],
          [dmg(15), mul('bossMult', 2), add('effects.stunDur', 0.3), add('effects.bossControl', 0.6)],
        ),
        up(
          'Adamant Bolts',
          26000,
          'Ability: Siege Shot devastates the strongest foe.',
          [gear('bolt', 'bolt_adamant'), gear('frame', 'frame_adamant')],
          [
            dmg(60),
            mul('bossMult', 2),
            withAbility(
              ability({
                id: 'siegeshot',
                name: 'Siege Shot',
                kind: 'smite',
                cooldown: 30,
                value: 6000,
                at: 'strongest',
                dtype: 'true',
              }),
            ),
          ],
        ),
      ],
    },
    {
      name: 'Repeater',
      slots: ['crew', 'ammo'],
      upgrades: [
        up('Loader', 300, 'A second crewman: faster reloads.', [gear('crew', 'crew_loader')], [rate(0.75)]),
        up('Bolt Rack', 450, 'Pre-loaded bolts.', [gear('ammo', 'rack_bolts')], [rate(0.75)]),
        up(
          'Repeater Crew',
          3200,
          'A drilled crew fires twice as fast.',
          [gear('crew', 'crew_repeater')],
          [rate(0.5), dmg(1)],
        ),
        up(
          'Gatling Rack',
          7000,
          'A rotating rack of bolts.',
          [gear('ammo', 'rack_gatling')],
          [rate(0.5), dmg(2)],
        ),
        up(
          'Elite Crew',
          16000,
          'Ability: Barrage triples fire rate briefly.',
          [gear('crew', 'crew_elite')],
          [
            rate(0.7),
            dmg(4),
            withAbility(
              ability({
                id: 'barrage',
                name: 'Barrage',
                kind: 'frenzy',
                cooldown: 40,
                duration: 8,
                rateMult: 0.33,
              }),
            ),
          ],
        ),
      ],
    },
    {
      name: 'Supply',
      slots: ['ground', 'flag'],
      upgrades: [
        up(
          'Spotter Tent',
          400,
          'A spotter calls out invisible foes.',
          [gear('ground', 'tent_spotter')],
          [sight()],
        ),
        up(
          'Scout Flag',
          400,
          'Bolts burst into shrapnel.',
          [gear('flag', 'flag_scout')],
          [
            set('projectile.splashRadius', 40),
            set('projectile.splashPierce', 5),
            set('projectile.splashDamage', 1),
          ],
        ),
        up(
          'Supply Wagon',
          3400,
          'Supplies earn gold every round.',
          [gear('ground', 'wagon_supply')],
          [income('perRound', 'add', 150)],
        ),
        up(
          'Signal Flag',
          7600,
          'Bigger shrapnel. Ability: Supply Drop.',
          [gear('flag', 'flag_signal')],
          [
            set('projectile.splashRadius', 70),
            set('projectile.splashPierce', 12),
            set('projectile.splashDamage', 3),
            withAbility(
              ability({ id: 'supplydrop', name: 'Supply Drop', kind: 'cash', cooldown: 60, value: 1000 }),
            ),
          ],
        ),
        up(
          'Fortress Camp',
          14000,
          'A fortified camp: more gold, and nearby towers pierce more.',
          [gear('ground', 'camp_fortress'), gear('flag', 'flag_fortress')],
          [income('perRound', 'add', 400), support('radius', 'set', 200), support('pierceAdd', 'add', 1)],
        ),
      ],
    },
  ],
};
