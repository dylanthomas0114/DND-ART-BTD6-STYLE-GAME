import { C } from '../palette';
import { banner, cape, keg, pack, quiver, satchel, wings } from './backs';
import {
  astralSpirit,
  bear,
  bird,
  caltropPile,
  camp,
  crate,
  fox,
  owlbear,
  runeCircle,
  shrine,
  standard,
  tent,
  trapCart,
  wagon,
  wolf,
  wyrm,
} from './grounds';
import { bolt, boltRack, cart, crewman, flag, frame, guard, roof, sign, stall, vault } from './structures';
import type { GearSet } from './types';
import {
  arrowHeld,
  bow,
  cannon,
  crystal,
  dagger,
  grail,
  grenade,
  heartOfWinter,
  holySymbol,
  mace,
  orb,
  pouch,
  reliquary,
  staff,
  sword,
  wand,
} from './weapons';
import { armor, crown, goggles, halo, hat, helm, hood, mask, shield } from './wearables';

export type { GearArt, GearSet, Hold } from './types';

const fighter: GearSet = {
  sword_rusty: {
    hold: 'blade',
    draw: (d) =>
      sword(d, {
        len: 40,
        width: 7,
        blade: 0xb7aaa0,
        guard: C.darkIron,
        hilt: C.leather,
        pommel: C.darkIron,
        rusty: true,
      }),
  },
  sword_long: {
    hold: 'blade',
    draw: (d) =>
      sword(d, {
        len: 52,
        width: 8,
        blade: C.steel,
        guard: C.steelDark,
        hilt: C.leatherDark,
        pommel: C.steelDark,
      }),
  },
  sword_runed: {
    hold: 'blade',
    draw: (d) =>
      sword(d, {
        len: 56,
        width: 9,
        blade: 0xd9e4ee,
        guard: C.gold,
        hilt: C.navy,
        pommel: C.gold,
        runes: 0x6fd3ff,
      }),
  },
  sword_flame: {
    hold: 'blade',
    glow: C.fire,
    draw: (d) =>
      sword(d, {
        len: 60,
        width: 10,
        blade: 0xffe2b0,
        guard: C.gold,
        hilt: C.crimson,
        pommel: C.ember,
        runes: C.fire,
        flame: true,
      }),
  },
  sword_dawn: {
    hold: 'blade',
    glow: C.radiant,
    draw: (d) =>
      sword(d, {
        len: 70,
        width: 12,
        blade: 0xfff6d8,
        guard: C.gold,
        hilt: C.white,
        pommel: C.radiant,
        runes: C.gold,
        glow: C.radiant,
        guardWidth: 24,
      }),
  },
  helm_steel: { draw: (d) => helm(d, { kind: 'steel', color: C.steel, trim: C.steelDark }) },
  helm_horned: { draw: (d) => helm(d, { kind: 'horned', color: 0x9aa4ae, trim: C.bronze }) },
  helm_crown: { draw: (d) => helm(d, { kind: 'crown', color: 0xe6edf2, trim: C.gold, plume: C.red }) },
  shield_buckler: {
    hold: 'shield',
    draw: (d) =>
      shield(d, {
        shape: 'round',
        size: 15,
        face: C.wood,
        rim: C.steelDark,
        emblem: 'boss',
        emblemColor: C.steel,
      }),
  },
  shield_kite: {
    hold: 'shield',
    draw: (d) =>
      shield(d, {
        shape: 'kite',
        size: 21,
        face: C.navy,
        rim: C.steel,
        emblem: 'chevron',
        emblemColor: C.white,
      }),
  },
  armor_chain: { draw: (d) => armor(d, { kind: 'chain', color: C.steelDark }) },
  shield_tower: {
    hold: 'shield',
    draw: (d) =>
      shield(d, {
        shape: 'tower',
        size: 24,
        face: C.red,
        rim: C.steel,
        emblem: 'cross',
        emblemColor: C.gold,
      }),
  },
  armor_plate: { draw: (d) => armor(d, { kind: 'plate', color: C.steel, trim: C.steelDark }) },
  shield_lion: {
    hold: 'shield',
    draw: (d) => shield(d, { shape: 'heater', size: 26, face: C.crimson, rim: C.gold, emblem: 'lion' }),
  },
  armor_gilded: { draw: (d) => armor(d, { kind: 'gilded', color: 0xdfe6ec, trim: C.gold }) },
  shield_aegis: {
    hold: 'shield',
    glow: C.radiant,
    draw: (d) =>
      shield(d, { shape: 'aegis', size: 29, face: 0xfff6d8, rim: C.gold, emblem: 'sun', glow: C.radiant }),
  },
  armor_aegis: { draw: (d) => armor(d, { kind: 'aegis', color: 0xfff6d8, trim: C.gold, glow: C.radiant }) },
  cape_red: { draw: (d) => cape(d, { color: C.red, lining: C.gold, len: 40 }) },
  standard_simple: { draw: (d) => standard(d, { cloth: C.red, trim: C.gold, emblem: 'sword' }) },
  banner_war: { draw: (d) => banner(d, { cloth: C.crimson, trim: C.gold, emblem: 'sword' }) },
  standard_dragon: {
    draw: (d) => standard(d, { cloth: 0x2a2430, trim: C.ember, emblem: 'dragon', tall: 114, fringe: true }),
  },
  banner_legion: {
    draw: (d) => banner(d, { cloth: C.purple, trim: C.gold, emblem: 'eagle', pole: C.gold, big: true }),
  },
  standard_legion: {
    draw: (d) => standard(d, { cloth: C.purple, trim: C.gold, emblem: 'eagle', tall: 124, fringe: true }),
  },
};

const ranger: GearSet = {
  bow_short: { hold: 'aim', draw: (d) => bow(d, { color: C.wood, len: 26 }) },
  bow_long: { hold: 'aim', draw: (d) => bow(d, { color: C.woodDark, len: 36, tips: C.steel }) },
  quiver_full: { draw: (d) => quiver(d, { color: C.leather, arrows: 5, fletch: C.red }) },
  bow_twin: { hold: 'aim', draw: (d) => bow(d, { color: 0x6b8f3a, len: 32, tips: C.gold, twin: true }) },
  bow_storm: {
    hold: 'aim',
    glow: C.arcane,
    draw: (d) =>
      bow(d, { color: 0x3a4a8a, len: 38, tips: C.radiant, string: C.radiant, recurve: true, glow: C.arcane }),
  },
  quiver_storm: {
    draw: (d) =>
      quiver(d, { color: 0x2a3060, arrows: 6, fletch: C.radiant, glow: C.arcane, trim: C.radiant }),
  },
  bow_sun: {
    hold: 'aim',
    glow: C.radiant,
    draw: (d) =>
      bow(d, { color: C.gold, len: 42, tips: C.ember, string: C.radiant, recurve: true, glow: C.fire }),
  },
  quiver_sun: {
    draw: (d) => quiver(d, { color: C.goldDark, arrows: 7, fletch: C.fire, glow: C.radiant, trim: C.gold }),
  },
  hood_green: { draw: (d) => hood(d, C.green, { trim: 0x9ccf5a }) },
  arrow_barbed: { hold: 'held', draw: (d) => arrowHeld(d, C.steel, C.wood, C.white, { barbed: true }) },
  hood_hawk: { draw: (d) => hood(d, 0x6b5236, { feather: 0xf2f2f2, eye: C.bronze, trim: C.gold }) },
  arrow_heart: {
    hold: 'held',
    glow: C.crimson,
    draw: (d) => arrowHeld(d, C.crimson, C.wood, C.red, { heart: true, glow: C.crimson }),
  },
  mask_deadeye: { draw: (d) => mask(d, { kind: 'deadeye', color: 0x2a2430 }) },
  arrow_star: {
    hold: 'held',
    glow: C.radiant,
    draw: (d) => arrowHeld(d, C.radiant, C.gold, C.white, { star: true, glow: C.radiant }),
  },
  pet_wolfpup: { draw: (d) => wolf(d, { color: 0x8a8a8a, belly: 0xd8d8d8, size: 0.75 }) },
  mantle_fur: { draw: (d) => armor(d, { kind: 'mantle', color: 0x8a6a4a }) },
  pet_direwolf: { draw: (d) => wolf(d, { color: 0x4a4a52, belly: 0x9a9aa2, size: 1.1, eyes: C.ember }) },
  pet_owlbear: { draw: (d) => owlbear(d, { size: 0.9 }) },
  pet_owlbear_elder: { draw: (d) => owlbear(d, { size: 1.1, elder: true }) },
  armor_beastlord: { draw: (d) => armor(d, { kind: 'beastlord', color: 0x5e3a1b }) },
};

const rogue: GearSet = {
  dagger_plain: { hold: 'thrown', draw: (d) => dagger(d, C.steel, C.leatherDark) },
  dagger_off: { hold: 'thrown', draw: (d) => dagger(d, C.steel, C.leatherDark, { curve: true }) },
  dagger_serrated: {
    hold: 'thrown',
    draw: (d) => dagger(d, 0xdfe6ec, 0x5a2a3a, { serrated: true, len: 34 }),
  },
  dagger_venom: {
    hold: 'thrown',
    glow: C.poison,
    draw: (d) => dagger(d, 0xb6e88a, C.black, { curve: true, drip: C.poison, len: 32 }),
  },
  dagger_shadow: {
    hold: 'thrown',
    glow: C.purple,
    draw: (d) => dagger(d, 0x5a4a7a, C.black, { len: 38, glow: C.purple }),
  },
  dagger_nightfang: {
    hold: 'thrown',
    glow: C.arcane,
    draw: (d) => dagger(d, 0x2a2440, C.crimson, { len: 42, glow: C.arcane, serrated: true }),
  },
  dagger_nightfang_off: {
    hold: 'thrown',
    glow: C.arcane,
    draw: (d) => dagger(d, 0x2a2440, C.crimson, { len: 38, glow: C.arcane, curve: true }),
  },
  mask_domino: { draw: (d) => mask(d, { kind: 'domino', color: C.crimson }) },
  cloak_hooded: { draw: (d) => armor(d, { kind: 'cloak', color: 0x2f2a3a, trim: C.steel }) },
  hood_assassin: { draw: (d) => hood(d, 0x1f1a26, { deep: true, trim: C.crimson }) },
  cloak_shadow: { draw: (d) => armor(d, { kind: 'cloak', color: 0x1a1428, trim: C.arcane, glow: C.purple }) },
  mask_grandmaster: { draw: (d) => mask(d, { kind: 'grandmaster', color: 0xf2ecdf }) },
  cloak_grandmaster: {
    draw: (d) => armor(d, { kind: 'cloak', color: 0x5a1020, trim: C.gold, glow: C.crimson }),
  },
  satchel: { draw: (d) => satchel(d, C.leather) },
  caltrop_pile: { draw: (d) => caltropPile(d, 8) },
  satchel_bombs: { draw: (d) => satchel(d, C.leatherDark, { bombs: true }) },
  trap_cart: { draw: (d) => trapCart(d) },
  pack_guildmaster: { draw: (d) => pack(d) },
};

const wizard: GearSet = {
  wand_plain: { hold: 'aim', glow: C.arcane, draw: (d) => wand(d, { color: C.wood, tip: C.arcane }) },
  staff_oak: { hold: 'staff', glow: C.arcane, draw: (d) => staff(d, { wood: C.wood, head: 'crook' }) },
  orb_fire: { hold: 'held', glow: C.fire, draw: (d) => orb(d, C.fire) },
  staff_ember: {
    hold: 'staff',
    glow: C.fire,
    draw: (d) => staff(d, { wood: C.woodDark, head: 'flame', glow: C.fire }),
  },
  staff_phoenix: {
    hold: 'staff',
    glow: C.fire,
    draw: (d) => staff(d, { wood: 0x5a2a1a, head: 'phoenix', len: 70, glow: C.ember }),
  },
  staff_archmage: {
    hold: 'staff',
    glow: C.radiant,
    draw: (d) => staff(d, { wood: C.white, head: 'sun', len: 76, glow: C.radiant }),
  },
  orb_sun: { hold: 'held', glow: C.radiant, draw: (d) => orb(d, C.radiant, 11, true) },
  hat_pointed: { draw: (d) => hat(d, 0x3b4fa8, { band: C.gold, stars: C.radiant }) },
  robe_storm: { draw: (d) => armor(d, { kind: 'robe', color: 0x2a3a7a, trim: C.steel }) },
  crown_storm: { draw: (d) => crown(d, { color: C.darkIron, kind: 'storm' }) },
  robe_thunder: { draw: (d) => armor(d, { kind: 'robe', color: 0x1a1f4a, trim: C.radiant, glow: C.arcane }) },
  crown_tempest: { draw: (d) => crown(d, { color: C.darkIron, kind: 'tempest' }) },
  cape_star: { draw: (d) => cape(d, { color: 0x24396b, lining: 0x3b4fa8, stars: C.radiant, len: 44 }) },
  pet_owl: { draw: (d) => bird(d, { kind: 'owl' }) },
  pet_raven: { draw: (d) => bird(d, { kind: 'raven', size: 1.1 }) },
  cape_astral: {
    draw: (d) =>
      cape(d, { color: 0x140f2a, lining: C.arcane, stars: C.radiant, len: 50, glow: C.arcane, trim: C.gold }),
  },
  pet_astral: { draw: (d) => astralSpirit(d) },
};

const bombardier: GearSet = {
  cannon_hand: { hold: 'aim', draw: (d) => cannon(d, { len: 30, bore: 6, color: C.darkIron, bands: 2 }) },
  satchel_powder: { draw: (d) => satchel(d, 0x6e5a3a, { bombs: true }) },
  cannon_heavy: { hold: 'aim', draw: (d) => cannon(d, { len: 36, bore: 8, color: 0x3a3f46, bands: 3 }) },
  cannon_mortar: {
    hold: 'aim',
    draw: (d) => cannon(d, { len: 30, bore: 11, color: C.bronze, bands: 2, mortar: true }),
  },
  keg: { draw: (d) => keg(d, {}) },
  cannon_thunder: {
    hold: 'aim',
    glow: C.arcane,
    draw: (d) => cannon(d, { len: 42, bore: 11, color: 0x2a2f3a, bands: 4, runes: C.arcane, thunder: true }),
  },
  keg_rune: { draw: (d) => keg(d, { rune: true }) },
  goggles: { draw: (d) => goggles(d) },
  pouch_frag: { hold: 'held', draw: (d) => pouch(d, C.leather, { spikes: true }) },
  grenade_cluster: { hold: 'held', draw: (d) => grenade(d, C.darkIron, 4) },
  helm_tinker: { draw: (d) => helm(d, { kind: 'tinker', color: C.bronze, trim: C.goldDark }) },
  grenade_recursive: { hold: 'held', glow: C.arcane, draw: (d) => grenade(d, 0x3a2f5a, 6, C.arcane) },
  apron_leather: { draw: (d) => armor(d, { kind: 'apron', color: C.leather, wide: true }) },
  crate_ammo: { draw: (d) => crate(d, { bombs: true }) },
  apron_iron: { draw: (d) => armor(d, { kind: 'apron', color: C.iron, trim: C.steel, wide: true }) },
  crate_rune: { draw: (d) => crate(d, { color: 0x4a3a2a, rune: true }) },
  apron_mithril: {
    draw: (d) => armor(d, { kind: 'apron', color: 0xd9e8f5, trim: C.gold, wide: true, glow: C.frost }),
  },
};

const druid: GearSet = {
  staff_gnarled: { hold: 'staff', glow: C.frost, draw: (d) => staff(d, { wood: C.woodDark, head: 'knot' }) },
  crystal_frost: { hold: 'held', glow: C.frost, draw: (d) => crystal(d, C.frost, 10) },
  circle_rime: { draw: (d) => runeCircle(d, C.frost, 38) },
  crystal_wind: { hold: 'held', glow: C.frost, draw: (d) => crystal(d, 0xbfeaff, 13, true) },
  glacier: { draw: (d) => runeCircle(d, C.frost, 40, true) },
  heart_winter: { hold: 'held', glow: C.frost, draw: (d) => heartOfWinter(d) },
  staff_frost: {
    hold: 'staff',
    glow: C.frost,
    draw: (d) => staff(d, { wood: 0x8a7a6a, head: 'crystal', color: C.frost }),
  },
  crown_antler: { draw: (d) => crown(d, { color: 0xe9dcc0, kind: 'antler' }) },
  staff_blizzard: {
    hold: 'staff',
    glow: C.frost,
    draw: (d) => staff(d, { wood: 0x6a7a8a, head: 'snowflake', len: 70, glow: C.frost }),
  },
  crown_icicle: { draw: (d) => crown(d, { color: C.ice, kind: 'icicle' }) },
  staff_winter: {
    hold: 'staff',
    glow: C.frost,
    draw: (d) => staff(d, { wood: 0xdfe8f0, head: 'blizzard', len: 76, glow: C.frost }),
  },
  pet_snowfox: { draw: (d) => fox(d) },
  armor_bark: { draw: (d) => armor(d, { kind: 'bark', color: 0x7a5a3a }) },
  pet_frostwolf: {
    draw: (d) => wolf(d, { color: 0xdfeaf2, belly: 0xffffff, size: 1.05, eyes: C.frost, frost: true }),
  },
  pet_frostbear: { draw: (d) => bear(d, { frost: true }) },
  pet_frostwyrm: { draw: (d) => wyrm(d) },
  armor_spirit: { draw: (d) => armor(d, { kind: 'spirit', color: 0x9fd8f0 }) },
};

const ballista: GearSet = {
  bolt_wood: { hold: 'aim', draw: (d) => bolt(d, { shaft: C.wood, head: C.iron, fletch: C.cloth }) },
  bolt_iron: {
    hold: 'aim',
    draw: (d) => bolt(d, { shaft: C.woodDark, head: C.steel, fletch: C.red, len: 50 }),
  },
  frame_reinforced: { draw: (d) => frame(d, { color: C.iron, studs: C.steel }) },
  bolt_dragonbone: {
    hold: 'aim',
    draw: (d) => bolt(d, { shaft: C.bone, head: 0xf2ecdf, fletch: C.crimson, len: 56, barbs: true }),
  },
  frame_siege: { draw: (d) => frame(d, { color: C.darkIron, studs: C.bronze, spikes: true }) },
  bolt_adamant: {
    hold: 'aim',
    glow: C.arcane,
    draw: (d) =>
      bolt(d, { shaft: 0x3a3450, head: 0xb9a8ff, fletch: C.radiant, len: 62, glow: C.arcane, barbs: true }),
  },
  frame_adamant: {
    draw: (d) => frame(d, { color: 0x4a4070, studs: C.radiant, spikes: true, rune: C.arcane }),
  },
  crew_loader: { draw: (d) => crewman(d, { tunic: C.red, hat: 'cap', beard: 0x6b3d1f, tool: 'bolt' }) },
  rack_bolts: { draw: (d) => boltRack(d, {}) },
  crew_repeater: { draw: (d) => crewman(d, { tunic: C.navy, hat: 'helm', beard: 0xc4511f, tool: 'crank' }) },
  rack_gatling: { draw: (d) => boltRack(d, { gatling: true }) },
  crew_elite: {
    draw: (d) => crewman(d, { tunic: C.crimson, hat: 'plumed', beard: 0xe9e6f0, tool: 'crank' }),
  },
  tent_spotter: { draw: (d) => tent(d, { color: 0x8a9a6a }) },
  flag_scout: { draw: (d) => flag(d, { color: C.green, trim: C.gold }) },
  wagon_supply: { draw: (d) => wagon(d, {}) },
  flag_signal: { draw: (d) => flag(d, { color: C.red, trim: C.gold, signal: true }) },
  camp_fortress: { draw: (d) => camp(d) },
  flag_fortress: { draw: (d) => flag(d, { color: C.crimson, trim: C.gold, tall: 90, fortress: true }) },
};

const cleric: GearSet = {
  mace_plain: { hold: 'blade', draw: (d) => mace(d, { head: C.iron, handle: C.wood, kind: 'plain' }) },
  mace_holy: {
    hold: 'blade',
    glow: C.radiant,
    draw: (d) => mace(d, { head: C.steel, handle: C.white, kind: 'flanged' }),
  },
  halo: { draw: (d) => halo(d, {}) },
  mace_sun: {
    hold: 'blade',
    glow: C.radiant,
    draw: (d) => mace(d, { head: C.gold, handle: C.white, kind: 'sun', len: 44, glow: C.radiant }),
  },
  halo_radiant: { draw: (d) => halo(d, { radiant: true }) },
  mace_dawn: {
    hold: 'blade',
    glow: C.radiant,
    draw: (d) => mace(d, { head: C.radiant, handle: C.gold, kind: 'dawn', len: 50, glow: C.fire }),
  },
  symbol_holy: { hold: 'held', glow: C.radiant, draw: (d) => holySymbol(d, C.gold) },
  vestments_blessed: { draw: (d) => armor(d, { kind: 'vestments', color: C.white, trim: C.gold }) },
  reliquary: { hold: 'held', glow: C.radiant, draw: (d) => reliquary(d) },
  vestments_saint: {
    draw: (d) => armor(d, { kind: 'vestments', color: 0xfff6d8, trim: C.crimson, glow: C.radiant }),
  },
  grail: { hold: 'held', glow: C.radiant, draw: (d) => grail(d) },
  cape_pilgrim: { draw: (d) => cape(d, { color: 0x8a7a5a, lining: C.cloth, len: 42, tattered: true }) },
  shrine: { draw: (d) => shrine(d, {}) },
  wings_angel: { draw: (d) => wings(d, { color: C.white, tip: C.gold, pairs: 1, glow: C.radiant }) },
  temple: { draw: (d) => shrine(d, { temple: true }) },
  wings_seraph: { draw: (d) => wings(d, { color: 0xfff6d8, tip: C.radiant, pairs: 3, glow: C.radiant }) },
};

const treasury: GearSet = {
  vault_wood: { draw: (d) => vault(d, { kind: 'wood' }) },
  vault_iron: { draw: (d) => vault(d, { kind: 'iron' }) },
  roof_tiled: { draw: (d) => roof(d, { kind: 'tiled' }) },
  vault_gold: { draw: (d) => vault(d, { kind: 'gold' }) },
  roof_gilded: { draw: (d) => roof(d, { kind: 'gilded' }) },
  vault_hoard: { draw: (d) => vault(d, { kind: 'hoard' }) },
  roof_dragon: { draw: (d) => roof(d, { kind: 'dragon' }) },
  sign_ledger: { draw: (d) => sign(d, { kind: 'ledger' }) },
  guard_strongbox: { front: true, draw: (d) => guard(d, { kind: 'strongbox' }) },
  sign_bank: { draw: (d) => sign(d, { kind: 'bank' }) },
  guard_golem: { front: true, draw: (d) => guard(d, { kind: 'golem' }) },
  sign_crown: { draw: (d) => sign(d, { kind: 'crown' }) },
  guard_royal: { front: true, draw: (d) => guard(d, { kind: 'royal' }) },
  stall_fruit: { draw: (d) => stall(d, { kind: 'fruit' }) },
  cart_trade: { draw: (d) => cart(d, { kind: 'trade' }) },
  stall_spice: { draw: (d) => stall(d, { kind: 'spice' }) },
  cart_caravan: { draw: (d) => cart(d, { kind: 'caravan' }) },
  stall_bazaar: { draw: (d) => stall(d, { kind: 'bazaar' }) },
  cart_royal: { draw: (d) => cart(d, { kind: 'royal' }) },
};

/** Every gear art piece, keyed by the `art` id used in tower data. */
export const GEAR: GearSet = {
  ...fighter,
  ...ranger,
  ...rogue,
  ...wizard,
  ...bombardier,
  ...druid,
  ...ballista,
  ...cleric,
  ...treasury,
};
