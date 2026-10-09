import type { TowerDef } from '../towerTypes';
import { ability, gear, income, stats, up, withAbility } from '../towerKit';

export const treasury: TowerDef = {
  id: 'treasury',
  name: 'Guild Treasury',
  title: 'House of Coin',
  blurb: 'Earns gold at the end of every round.',
  cost: 1150,
  footprint: 28,
  placement: 'land',
  rig: 'treasury',
  look: 'treasury',
  slots: ['ground', 'cart', 'stall', 'vault', 'roof', 'guard', 'sign'],
  baseGear: [gear('vault', 'vault_wood')],
  base: stats({ range: 60, attacks: [], income: { perRound: 80, lives: 0, interest: 0, interestCap: 0 } }),
  paths: [
    {
      name: 'Vault',
      slots: ['vault', 'roof'],
      upgrades: [
        up(
          'Iron Vault',
          450,
          '+40 gold each round.',
          [gear('vault', 'vault_iron')],
          [income('perRound', 'add', 40)],
        ),
        up(
          'Tiled Roof',
          550,
          '+60 gold each round.',
          [gear('roof', 'roof_tiled')],
          [income('perRound', 'add', 60)],
        ),
        up(
          'Gold Vault',
          2600,
          '+170 gold each round.',
          [gear('vault', 'vault_gold')],
          [income('perRound', 'add', 170)],
        ),
        up(
          'Gilded Roof',
          6500,
          '+320 gold each round.',
          [gear('roof', 'roof_gilded')],
          [income('perRound', 'add', 320)],
        ),
        up(
          'Dragon Hoard',
          18000,
          '+900 gold each round. Ability: Cash Out.',
          [gear('vault', 'vault_hoard'), gear('roof', 'roof_dragon')],
          [
            income('perRound', 'add', 900),
            withAbility(
              ability({ id: 'cashout', name: 'Cash Out', kind: 'cash', cooldown: 90, value: 3000 }),
            ),
          ],
        ),
      ],
    },
    {
      name: 'Bank',
      slots: ['sign', 'guard'],
      upgrades: [
        up(
          'Ledger Sign',
          250,
          '+30 gold each round.',
          [gear('sign', 'sign_ledger')],
          [income('perRound', 'add', 30)],
        ),
        up(
          'Strongbox Guard',
          600,
          'Earns 5% interest on your gold each round (up to 200).',
          [gear('guard', 'guard_strongbox')],
          [income('interest', 'set', 0.05), income('interestCap', 'set', 200)],
        ),
        up(
          'Banking House',
          2800,
          'Interest cap rises to 600, +80 gold each round.',
          [gear('sign', 'sign_bank')],
          [income('interestCap', 'set', 600), income('perRound', 'add', 80)],
        ),
        up(
          'Golem Guard',
          7000,
          '8% interest (cap 1200). Ability: Withdraw.',
          [gear('guard', 'guard_golem')],
          [
            income('interest', 'set', 0.08),
            income('interestCap', 'set', 1200),
            withAbility(
              ability({ id: 'withdraw', name: 'Withdraw', kind: 'cash', cooldown: 60, value: 1200 }),
            ),
          ],
        ),
        up(
          'Royal Mint',
          22000,
          '10% interest (cap 3500).',
          [gear('sign', 'sign_crown'), gear('guard', 'guard_royal')],
          [income('interest', 'set', 0.1), income('interestCap', 'set', 3500)],
        ),
      ],
    },
    {
      name: 'Market',
      slots: ['stall', 'cart'],
      upgrades: [
        up(
          'Fruit Stall',
          200,
          '+20 gold and +1 life each round.',
          [gear('stall', 'stall_fruit')],
          [income('perRound', 'add', 20), income('lives', 'add', 1)],
        ),
        up(
          'Trade Cart',
          650,
          '+80 gold each round.',
          [gear('cart', 'cart_trade')],
          [income('perRound', 'add', 80)],
        ),
        up(
          'Spice Stall',
          2200,
          '+120 gold and +3 lives each round.',
          [gear('stall', 'stall_spice')],
          [income('perRound', 'add', 120), income('lives', 'add', 3)],
        ),
        up(
          'Caravan',
          6200,
          '+260 gold each round. Ability: Bazaar.',
          [gear('cart', 'cart_caravan')],
          [
            income('perRound', 'add', 260),
            withAbility(ability({ id: 'bazaar', name: 'Bazaar', kind: 'cash', cooldown: 60, value: 900 })),
          ],
        ),
        up(
          'Grand Bazaar',
          20000,
          '+700 gold and +10 lives each round.',
          [gear('stall', 'stall_bazaar'), gear('cart', 'cart_royal')],
          [income('perRound', 'add', 700), income('lives', 'add', 10)],
        ),
      ],
    },
  ],
};
