import { Container, Graphics, Rectangle } from 'pixi.js';
import { MAPS, type MapId } from '../core/data/maps';
import { WORLD_H, WORLD_W } from '../core/types';
import { drawMapGround, drawRoads, MAP_MARGIN_X } from './art/mapArt';
import { Draw } from './art/pen';
import { createPixiApp } from './pixiApp';

/**
 * `?mapguide=<id>`: renders the code-drawn layout (terrain, water, road) at 21:9 and exposes it as
 * a PNG data URL on `window.__mapguide` — the reference image for AI repainting (scripts/gen-art.md).
 */
export async function startMapGuide(host: HTMLElement, id: string): Promise<void> {
  const app = await createPixiApp(host);
  const map = MAPS[id as MapId] ?? MAPS.glade;
  const g = new Graphics();
  const d = new Draw(g, 3);
  drawMapGround(d, map, false);
  drawRoads(d, map);
  const wrap = new Container();
  wrap.addChild(g);
  g.position.set(MAP_MARGIN_X, 0);
  const tex = app.renderer.generateTexture({
    target: wrap,
    frame: new Rectangle(0, 0, WORLD_W + MAP_MARGIN_X * 2, WORLD_H),
    resolution: 1,
  });
  const url = await app.renderer.extract.base64(tex);
  (window as unknown as { __mapguide: unknown }).__mapguide = { ready: true, url };
}
