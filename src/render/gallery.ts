import { Container, Graphics, Rectangle, Text } from 'pixi.js';
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

  /** Renders tier N vs N-1 for every tower/path and returns the fraction of pixels that changed. */
  const tierDiff = async () => {
    const out: { id: TowerId; path: number; tier: number; diff: number }[] = [];
    const renderPixels = (def: (typeof TOWER_LIST)[number], tiers: Tiers) => {
      const v = new TowerView(def, bank);
      v.setGear(computeGear(def, tiers));
      const holder = new Container();
      holder.addChild(v.root);
      v.root.position.set(110, 170);
      const bg = new Graphics().rect(0, 0, 220, 220).fill({ color: 0x000000, alpha: 0 });
      holder.addChildAt(bg, 0);
      const px = app.renderer.extract.pixels({
        target: holder,
        frame: new Rectangle(0, 0, 220, 220),
        resolution: 1,
      });
      holder.destroy({ children: true });
      return px.pixels;
    };
    for (const def of TOWER_LIST) {
      for (let p = 0; p < 3; p++) {
        for (let t = 1; t <= 5; t++) {
          const a: Tiers = [0, 0, 0];
          a[p] = t - 1;
          const b: Tiers = [0, 0, 0];
          b[p] = t;
          const pa = renderPixels(def, a);
          const pb = renderPixels(def, b);
          let changed = 0;
          let opaque = 0;
          for (let i = 0; i < pa.length; i += 4) {
            if (pa[i + 3]! > 20 || pb[i + 3]! > 20) opaque++;
            const d =
              Math.abs(pa[i]! - pb[i]!) +
              Math.abs(pa[i + 1]! - pb[i + 1]!) +
              Math.abs(pa[i + 2]! - pb[i + 2]!) +
              Math.abs(pa[i + 3]! - pb[i + 3]!);
            if (d > 60) changed++;
          }
          out.push({ id: def.id, path: p, tier: t, diff: opaque ? changed / opaque : 0 });
        }
      }
    }
    return out;
  };

  (window as unknown as { __gallery: unknown }).__gallery = {
    tierDiff,
    ready: true,
    count: views.length,
    textures: () => bank.size,
    cells: views.map((v) => ({ id: v.id, tiers: v.tiers, x: v.x, y: v.y })),
    scale: () => stage.scale.x,
  };
}
