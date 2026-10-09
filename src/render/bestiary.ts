import { Container, Graphics, Sprite, Text } from 'pixi.js';
import { ENEMIES, ENEMY_IDS } from '../core/data/enemies';
import {
  BOSSES,
  drawArmorOverlay,
  drawCracks,
  drawEnemy,
  drawIceBlock,
  drawRegenOverlay,
} from './art/enemies';
import { TextureBank } from './bake';
import { createPixiApp } from './pixiApp';

/** `?bestiary`: every enemy with its modifiers, for art review. */
export async function startBestiary(host: HTMLElement): Promise<void> {
  const app = await createPixiApp(host, 0xc9a46b);
  const bank = new TextureBank(app, 2);
  const stage = new Container();
  app.stage.addChild(stage);
  const add = (
    key: string,
    draw: Parameters<TextureBank['get']>[1],
    x: number,
    y: number,
    parent: Container = stage,
    alpha = 1,
  ) => {
    const b = bank.get(key, draw);
    const s = new Sprite(b.texture);
    s.anchor.set(b.ax, b.ay);
    s.position.set(x, y);
    s.alpha = alpha;
    parent.addChild(s);
    return s;
  };
  const slimes = ENEMY_IDS.filter((id) => !BOSSES[id]);
  const bosses = ENEMY_IDS.filter((id) => BOSSES[id]);
  slimes.forEach((id, i) => {
    const r = Math.round(ENEMIES[id].radius * 1.5);
    const x = 70 + i * 110;
    const variants: [string, number][] = [
      ['plain', 80],
      ['invisible', 170],
      ['regen', 260],
      ['armored', 350],
      ['frozen', 440],
      ['cracked', 530],
    ];
    for (const [v, y] of variants) {
      const c = new Container();
      c.position.set(x, y);
      stage.addChild(c);
      add(`enemy:${id}`, (d) => drawEnemy(d, id, r), 0, 0, c, v === 'invisible' ? 0.45 : 1);
      if (v === 'regen') add(`ov:regen:${r}`, (d) => drawRegenOverlay(d, r), 0, 0, c);
      if (v === 'armored') add(`ov:armor:slime:${r}`, (d) => drawArmorOverlay(d, r, false), 0, 0, c);
      if (v === 'frozen') add(`ov:ice:${r}`, (d) => drawIceBlock(d, r), 0, 0, c);
      if (v === 'cracked') add(`ov:crack:${id}:2`, (d) => drawCracks(d, r, 2), 0, 0, c);
    }
    const t = new Text({
      text: ENEMIES[id].name.replace(' Slime', '').replace(' Ooze', ''),
      style: { fontFamily: 'sans-serif', fontSize: 13, fill: 0x1d1410 },
    });
    t.anchor.set(0.5, 0);
    t.position.set(x, 20);
    stage.addChild(t);
  });
  bosses.forEach((id, i) => {
    const r = Math.round(ENEMIES[id].radius * 1.15);
    const x = 140 + i * 260;
    add(`enemy:${id}`, (d) => drawEnemy(d, id, r), x, 720);
    const t = new Text({
      text: ENEMIES[id].name,
      style: { fontFamily: 'sans-serif', fontSize: 15, fill: 0x1d1410 },
    });
    t.anchor.set(0.5, 0);
    t.position.set(x, 800);
    stage.addChild(t);
  });
  stage.addChildAt(new Graphics().rect(0, 0, 1350, 860).fill({ color: 0xc9a46b }), 0);
  const fit = () => stage.scale.set(Math.min(app.screen.width / 1350, app.screen.height / 860));
  fit();
  app.renderer.on('resize', fit);
  (window as unknown as { __gallery: unknown }).__gallery = { ready: true };
}
