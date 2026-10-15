import type { MapDef } from '../../core/data/maps';
import { type Draw, mix, OUTLINE, shade, tint } from './pen';

/** Small drifting things that live above the terrain. Pure drawings, baked once by the texture bank. */
export type Ambient =
  'leaf' | 'butterfly' | 'mote' | 'wisp' | 'ember' | 'ash' | 'mist' | 'cloud' | 'ring' | 'glint';

export function drawAmbient(d: Draw, kind: Ambient, map: MapDef, v = 0): void {
  switch (kind) {
    case 'leaf': {
      const c = [0x7cc04a, 0xa6d45a, 0xe0b040, 0xc9792e][v % 4]!;
      d.p
        .moveTo(-6, 0)
        .quadraticCurveTo(0, -5.5, 6, 0)
        .quadraticCurveTo(0, 5.5, -6, 0)
        .closePath()
        .fill({ color: c });
      d.p
        .moveTo(-6, 0)
        .lineTo(5, 0)
        .stroke({ width: 1, color: shade(c, 0.45), alpha: 0.8 });
      d.p.ellipse(-1.5, -1.6, 2.6, 1).fill({ color: tint(c, 0.5), alpha: 0.7 });
      break;
    }
    case 'butterfly': {
      const c = [0xffd23f, 0xff8fb8, 0x8fd2ff, 0xffffff][v % 4]!;
      for (const sx of [-1, 1]) {
        d.p.ellipse(sx * 4.2, -2.6, 4.4, 3.2).fill({ color: c });
        d.p.ellipse(sx * 3.4, 2.4, 3.2, 2.4).fill({ color: shade(c, 0.12) });
        d.p.ellipse(sx * 4.6, -3, 1.2, 0.9).fill({ color: 0xffffff, alpha: 0.7 });
      }
      d.p.ellipse(0, 0, 1, 4.4).fill({ color: OUTLINE });
      break;
    }
    case 'mote': {
      for (let i = 4; i >= 1; i--) d.p.circle(0, 0, (4 * i) / 4).fill({ color: 0xfff3c0, alpha: 0.12 });
      d.p.circle(0, 0, 1.2).fill({ color: 0xffffff, alpha: 0.95 });
      break;
    }
    case 'wisp': {
      const c = map.id === 'crypt' ? 0x9ff0d8 : 0xbfe8ff;
      for (let i = 6; i >= 1; i--) d.p.circle(0, 0, (9 * i) / 6).fill({ color: c, alpha: 0.1 });
      d.p.circle(0, 0, 2.4).fill({ color: mix(c, 0xffffff, 0.7), alpha: 0.95 });
      break;
    }
    case 'ember': {
      for (let i = 5; i >= 1; i--) d.p.circle(0, 0, (6 * i) / 5).fill({ color: 0xff7a2a, alpha: 0.14 });
      d.p.circle(0, 0, 1.7).fill({ color: 0xffd27a, alpha: 0.95 });
      break;
    }
    case 'ash': {
      d.p.ellipse(0, 0, 3.4, 1.7).fill({ color: 0x3a2e28, alpha: 0.7 });
      break;
    }
    case 'mist': {
      for (let i = 8; i >= 1; i--)
        d.p.ellipse(0, 0, (160 * i) / 8, (60 * i) / 8).fill({ color: 0xdfeaf0, alpha: 0.05 });
      break;
    }
    case 'cloud': {
      // a soft, wide shadow cast on the ground
      for (let i = 10; i >= 1; i--)
        d.p
          .ellipse(0, 0, (300 * i) / 10, (130 * i) / 10)
          .fill({ color: shade(map.theme.ground[1], 0.78), alpha: 0.03 });
      break;
    }
    case 'ring': {
      d.p.ellipse(0, 0, 100, 100).stroke({ width: 4.2, color: 0xffffff, alpha: 1 });
      break;
    }
    case 'glint': {
      d.p.moveTo(-6, 0).lineTo(6, 0).stroke({ width: 1.4, color: 0xffffff, alpha: 0.95, cap: 'round' });
      d.p.moveTo(0, -6).lineTo(0, 6).stroke({ width: 1.4, color: 0xffffff, alpha: 0.95, cap: 'round' });
      d.p.circle(0, 0, 1.8).fill({ color: 0xffffff });
      break;
    }
  }
}
