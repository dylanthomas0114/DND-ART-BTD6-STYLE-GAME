import { TOWER_LIST } from '../core/data/towers';
import type { TowerId } from '../core/data/towerTypes';
import type { Game, Tower } from '../core/game';
import { TARGET_PRIORITIES, type TargetPriority } from '../core/types';
import { canUpgrade } from '../core/upgrades';
import { gearIcon, towerPortrait, useImage } from './icons';
import { IconClose, IconCoin, IconLock } from './svg';

const PRIORITY_LABEL: Record<TargetPriority, string> = {
  first: 'First',
  last: 'Last',
  close: 'Close',
  strong: 'Strong',
};

export function fmt(n: number): string {
  return Math.floor(n).toLocaleString('en-US');
}

function ShopCard({
  id,
  game,
  selected,
  onGrab,
}: {
  id: TowerId;
  game: Game;
  selected: boolean;
  onGrab: (id: TowerId, e: PointerEvent) => void;
}) {
  const def = TOWER_LIST.find((t) => t.id === id)!;
  const img = useImage(() => towerPortrait(id), [id]);
  const cost = game.towerCost(id);
  const poor = game.cash < cost;
  return (
    <div
      class={`card ${poor ? 'poor' : ''} ${selected ? 'selected' : ''}`}
      data-tower={id}
      onPointerDown={(e) => onGrab(id, e as PointerEvent)}
      title={def.blurb}
    >
      {img ? <img src={img} alt={def.name} /> : <div style={{ aspectRatio: '1', width: '100%' }} />}
      <div class="name">{def.name.replace('Dwarf ', '')}</div>
      <div class="price">
        <IconCoin />
        {fmt(cost)}
      </div>
    </div>
  );
}

export function Shop({
  game,
  placing,
  onGrab,
}: {
  game: Game;
  placing: TowerId | null;
  onGrab: (id: TowerId, e: PointerEvent) => void;
}) {
  return (
    <div class="shop">
      {TOWER_LIST.map((t) => (
        <ShopCard id={t.id} game={game} selected={placing === t.id} onGrab={onGrab} />
      ))}
    </div>
  );
}

function PathRow({
  game,
  tower,
  path,
  onBuy,
}: {
  game: Game;
  tower: Tower;
  path: number;
  onBuy: (path: number) => void;
}) {
  const def = tower.def;
  const p = def.paths[path]!;
  const tier = tower.tiers[path]!;
  const maxed = tier >= 5;
  const locked = !maxed && !canUpgrade(tower.tiers, path);
  const next = maxed ? p.upgrades[4]! : p.upgrades[tier]!;
  const price = game.upgradePrice(tower, path);
  const art = next.gear.find((g) => !g.aura)?.art ?? next.gear[0]!.art;
  const icon = useImage(() => gearIcon(art), [art]);
  const affordable = price !== null && game.cash >= price;
  return (
    <div class={`path ${locked ? 'locked' : ''} ${maxed ? 'maxed' : ''}`} data-path={path}>
      <div class="icon">{icon && <img src={icon} alt="" />}</div>
      <div class="info">
        <b>{maxed ? `${p.name}: maxed` : next.name}</b>
        <span>{maxed ? next.desc : locked ? 'Path locked by your other upgrades' : next.desc}</span>
        <div class="pips">
          {[0, 1, 2, 3, 4].map((i) => (
            <i class={i < tier ? 'on' : ''} />
          ))}
        </div>
      </div>
      {maxed ? null : locked ? (
        <div style={{ alignSelf: 'center', width: '1.8em' }}>
          <IconLock />
        </div>
      ) : (
        <button
          class={`btn ${affordable ? 'green' : ''} buy`}
          disabled={!affordable}
          onClick={() => onBuy(path)}
        >
          {fmt(price ?? 0)}
        </button>
      )}
    </div>
  );
}

export function UpgradePanel({
  game,
  tower,
  onClose,
  onBuy,
  onSell,
  onPriority,
  onAbility,
}: {
  game: Game;
  tower: Tower;
  onClose: () => void;
  onBuy: (path: number) => void;
  onSell: () => void;
  onPriority: (p: TargetPriority) => void;
  onAbility: () => void;
}) {
  const portrait = useImage(
    () => towerPortrait(tower.def.id, tower.tiers, 128),
    [tower.def.id, tower.tiers.join('')],
  );
  const hasAttack = tower.stats.attacks.length > 0;
  const cycle = (dir: number) => {
    const i = TARGET_PRIORITIES.indexOf(tower.priority);
    onPriority(TARGET_PRIORITIES[(i + dir + TARGET_PRIORITIES.length) % TARGET_PRIORITIES.length]!);
  };
  const ab = tower.stats.ability;
  return (
    <div class="upg">
      <div class="panel upg-head">
        {portrait && <img src={portrait} alt="" />}
        <div>
          <div class="nm">{tower.def.name}</div>
          <div class="sub">
            {tower.tiers.join('-')} · {fmt(tower.pops)} pops
          </div>
        </div>
        <button
          class="btn round red x"
          style={{ width: '2em', height: '2em' }}
          onClick={onClose}
          aria-label="Close"
        >
          <IconClose />
        </button>
      </div>
      {[0, 1, 2].map((p) => (
        <PathRow game={game} tower={tower} path={p} onBuy={onBuy} />
      ))}
      {hasAttack && (
        <div class="panel target" style={{ padding: '0.15em' }}>
          <button class="btn small wood" onClick={() => cycle(-1)}>
            ‹
          </button>
          <span>{PRIORITY_LABEL[tower.priority]}</span>
          <button class="btn small wood" onClick={() => cycle(1)}>
            ›
          </button>
        </div>
      )}
      <div class="row">
        {ab && (
          <button
            class={`btn ${game.abilityReady(tower) ? 'blue' : ''}`}
            disabled={!game.abilityReady(tower)}
            onClick={onAbility}
          >
            {game.abilityReady(tower) ? ab.name : `${Math.ceil(tower.abilityCd)}s`}
          </button>
        )}
        <button class="btn red" onClick={onSell}>
          Sell {fmt(game.sellValue(tower))}
        </button>
      </div>
    </div>
  );
}
