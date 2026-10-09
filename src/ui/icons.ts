import { useEffect, useState } from 'preact/hooks';
import { Container, Graphics, Sprite } from 'pixi.js';
import { TOWERS } from '../core/data/towers';
import type { TowerId, Tiers } from '../core/data/towerTypes';
import { computeGear } from '../core/upgrades';
import { GEAR } from '../render/art/gear';
import { hub } from '../render/hub';
import { TowerView } from '../render/towerView';

const cache = new Map<string, Promise<string>>();

async function extract(target: Container, size: number): Promise<string> {
  const app = hub.app!;
  const b = target.getLocalBounds();
  const pad = 6;
  const s = size / Math.max(b.width + pad * 2, b.height + pad * 2);
  const wrap = new Container();
  wrap.addChild(target);
  target.scale.set(s);
  target.position.set(-b.x * s + (size - b.width * s) / 2, -b.y * s + (size - b.height * s) / 2);
  const bg = new Graphics().rect(0, 0, size, size).fill({ color: 0x000000, alpha: 0 });
  wrap.addChildAt(bg, 0);
  const url = await app.renderer.extract.base64({ target: wrap, resolution: 1, frame: undefined });
  wrap.destroy({ children: true });
  return url;
}

/** Portrait of a tower at the given tiers (PNG data URL). */
export function towerPortrait(id: TowerId, tiers: Tiers = [0, 0, 0], size = 128): Promise<string> {
  const key = `p:${id}:${tiers.join('')}:${size}`;
  let p = cache.get(key);
  if (!p) {
    p = (async () => {
      const v = new TowerView(TOWERS[id], hub.bank!);
      v.setGear(computeGear(TOWERS[id], tiers));
      return extract(v.root, size);
    })();
    cache.set(key, p);
  }
  return p;
}

/** Badge icon for a gear piece (used for upgrade buttons). */
export function gearIcon(art: string, size = 96): Promise<string> {
  const key = `g:${art}:${size}`;
  let p = cache.get(key);
  if (!p) {
    p = (async () => {
      const g = GEAR[art];
      const c = new Container();
      if (g) {
        const b = hub.bank!.get(`gear:${art}`, (d) => g.draw(d));
        const s = new Sprite(b.texture);
        s.anchor.set(b.ax, b.ay);
        c.addChild(s);
      }
      return extract(c, size);
    })();
    cache.set(key, p);
  }
  return p;
}

export function useImage(make: () => Promise<string>, deps: unknown[]): string | null {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let live = true;
    make().then((u) => live && setUrl(u));
    return () => {
      live = false;
    };
  }, deps);
  return url;
}

/** Painted portrait if one was generated (public/assets/portraits/<id>.webp), else null. */
export function paintedPortraitUrl(id: TowerId): string {
  return `./assets/portraits/${id}.webp`;
}
