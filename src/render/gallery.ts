import { Container, Graphics, Text } from 'pixi.js';
import { TOWER_LIST, TOWERS } from '../core/data/towers';
import type { TowerId, Tiers } from '../core/data/towerTypes';
import { allValidTiers, computeGear } from '../core/upgrades';
import { TextureBank } from './bake';
import { createPixiApp } from './pixiApp';
import { TowerView } from './towerView';

const SHOWCASE: Tiers[] = [
  [0, 0, 0],
  [5, 0, 0],
  [0, 5, 0],
  [0, 0, 5],
  [5, 2, 0],
  [2, 5, 0],
  [0, 5, 2],
  [2, 0, 5],
];

/**
 * Gear gallery (`?gallery`, or `?gallery=fighter` for every legal tier combo of one tower).
 * Exposes `window.__gallery` for automated screenshot/pixel-diff checks.
 */
export async function startGallery(host: HTMLElement, param: string): Promise<void> {
  const app = await createPixiApp(host, 0x6fa64a);
  const bank = new TextureBank(app, 2);
  const stage = new Container();
  app.stage.addChild(stage);
  const one = param && param !== '1' && TOWERS[param as TowerId] ? TOWERS[param as TowerId] : null;
  const rows = one ? [one] : TOWER_LIST;
  const combos = one ? allValidTiers() : SHOWCASE;
  const cellW = 150;
  const cellH = 170;
  const cols = one ? 10 : SHOWCASE.length;
  const views: { id: TowerId; tiers: Tiers; view: TowerView; x: number; y: number }[] = [];

  rows.forEach((def, r) => {
    combos.forEach((tiers, i) => {
      const col = one ? i % cols : i;
      const row = one ? Math.floor(i / cols) : r;
      const x = 40 + col * cellW + cellW / 2;
      const y = 30 + row * cellH + cellH - 40;
      const bg = new Graphics()
        .roundRect(x - cellW / 2 + 4, y - cellH + 44, cellW - 8, cellH - 8, 10)
        .fill({ color: 0x4f8a3a, alpha: 0.6 });
      stage.addChild(bg);
      const v = new TowerView(def, bank);
      v.setGear(computeGear(def, tiers));
      v.root.position.set(x, y);
      stage.addChild(v.root);
      const label = new Text({
        text: `${def.name} ${tiers.join('-')}`,
        style: { fontFamily: 'sans-serif', fontSize: 11, fill: 0xffffff },
      });
      label.position.set(x - cellW / 2 + 10, y + 6);
      stage.addChild(label);
      views.push({ id: def.id, tiers, view: v, x, y });
    });
  });

  const fit = () => {
    const w = 80 + cols * cellW;
    const h = 60 + Math.ceil(one ? combos.length / cols : rows.length) * cellH;
    const s = Math.min(app.screen.width / w, app.screen.height / h);
    stage.scale.set(s);
  };
  fit();
  app.renderer.on('resize', fit);

  let t = 0;
  const animate = new URLSearchParams(location.search).has('animate');
  app.ticker.add((tk) => {
    const dt = tk.deltaMS / 1000;
    t += dt;
    for (const v of views) {
      const at = animate ? t % 1.2 : 99;
      v.view.update(animate ? dt : 0, {
        facing: 0.2,
        slotT: { mainHand: at, offHand: at, companion: at, bolt: at },
        anyT: at,
      });
    }
  });

  (window as unknown as { __gallery: unknown }).__gallery = {
    ready: true,
    count: views.length,
    textures: () => bank.size,
    cells: views.map((v) => ({ id: v.id, tiers: v.tiers, x: v.x, y: v.y })),
    scale: () => stage.scale.x,
  };
}
