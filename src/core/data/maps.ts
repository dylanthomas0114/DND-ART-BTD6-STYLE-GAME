import type { Vec2 } from '../types';

export interface Ellipse {
  x: number;
  y: number;
  rx: number;
  ry: number;
}

export interface Circle {
  x: number;
  y: number;
  r: number;
}

export type MapId = 'glade' | 'crypt' | 'pass';

export interface MapTheme {
  /** Base terrain gradient (top to bottom) for the code-drawn fallback background. */
  ground: [number, number];
  road: number;
  roadEdge: number;
  water: number;
  /** Decor kinds scattered by the renderer (deterministic). */
  decor: ('tree' | 'pine' | 'rock' | 'mushroom' | 'grave' | 'pillar' | 'crystal' | 'bush' | 'bones')[];
}

export interface MapDef {
  id: MapId;
  name: string;
  tier: 'Beginner' | 'Intermediate' | 'Advanced';
  blurb: string;
  paths: Vec2[][];
  roadWidth: number;
  water: Ellipse[];
  /** Unplaceable decor/obstacles. */
  blockers: Circle[];
  theme: MapTheme;
}

export const MAPS: Record<MapId, MapDef> = {
  glade: {
    id: 'glade',
    name: 'Goblin Glade',
    tier: 'Beginner',
    blurb: 'A long, winding forest road. Plenty of room to build.',
    roadWidth: 46,
    paths: [
      [
        { x: -60, y: 180 },
        { x: 240, y: 175 },
        { x: 330, y: 260 },
        { x: 320, y: 420 },
        { x: 220, y: 560 },
        { x: 250, y: 720 },
        { x: 430, y: 790 },
        { x: 600, y: 700 },
        { x: 640, y: 520 },
        { x: 560, y: 360 },
        { x: 640, y: 200 },
        { x: 820, y: 145 },
        { x: 1000, y: 220 },
        { x: 1040, y: 400 },
        { x: 960, y: 560 },
        { x: 1020, y: 730 },
        { x: 1200, y: 790 },
        { x: 1380, y: 700 },
        { x: 1420, y: 520 },
        { x: 1340, y: 360 },
        { x: 1400, y: 200 },
        { x: 1560, y: 140 },
        { x: 1680, y: 140 },
      ],
    ],
    water: [{ x: 820, y: 470, rx: 70, ry: 48 }],
    blockers: [
      { x: 120, y: 420, r: 34 },
      { x: 800, y: 760, r: 30 },
      { x: 1200, y: 420, r: 36 },
      { x: 1520, y: 820, r: 32 },
    ],
    theme: {
      ground: [0x6fa64a, 0x4f8a3a],
      road: 0xc9a46b,
      roadEdge: 0x7a5a32,
      water: 0x3f8fc4,
      decor: ['tree', 'tree', 'bush', 'mushroom', 'rock'],
    },
  },
  crypt: {
    id: 'crypt',
    name: 'Sunken Crypt',
    tier: 'Intermediate',
    blurb: 'Flooded catacombs. Only the Frost Druid can stand in the water.',
    roadWidth: 44,
    paths: [
      [
        { x: -60, y: 700 },
        { x: 200, y: 705 },
        { x: 320, y: 600 },
        { x: 360, y: 400 },
        { x: 300, y: 220 },
        { x: 420, y: 110 },
        { x: 640, y: 130 },
        { x: 760, y: 260 },
        { x: 800, y: 450 },
        { x: 900, y: 640 },
        { x: 1100, y: 730 },
        { x: 1300, y: 640 },
        { x: 1360, y: 440 },
        { x: 1280, y: 260 },
        { x: 1380, y: 120 },
        { x: 1680, y: 110 },
      ],
    ],
    water: [
      { x: 560, y: 470, rx: 150, ry: 115 },
      { x: 1060, y: 380, rx: 140, ry: 120 },
      { x: 120, y: 260, rx: 90, ry: 120 },
    ],
    blockers: [
      { x: 560, y: 820, r: 32 },
      { x: 1500, y: 380, r: 34 },
      { x: 1500, y: 800, r: 30 },
    ],
    theme: {
      ground: [0x5b5f6b, 0x3c3f4a],
      road: 0x9c9384,
      roadEdge: 0x4b4538,
      water: 0x2d7c8a,
      decor: ['grave', 'pillar', 'bones', 'rock', 'mushroom'],
    },
  },
  pass: {
    id: 'pass',
    name: 'Dragon’s Pass',
    tier: 'Advanced',
    blurb: 'Two short roads through scorched mountains. Little time to react.',
    roadWidth: 44,
    paths: [
      [
        { x: -60, y: 250 },
        { x: 300, y: 240 },
        { x: 520, y: 330 },
        { x: 720, y: 300 },
        { x: 900, y: 180 },
        { x: 1100, y: 220 },
        { x: 1300, y: 380 },
        { x: 1680, y: 410 },
      ],
      [
        { x: -60, y: 680 },
        { x: 280, y: 690 },
        { x: 500, y: 590 },
        { x: 740, y: 620 },
        { x: 920, y: 740 },
        { x: 1120, y: 700 },
        { x: 1320, y: 540 },
        { x: 1680, y: 520 },
      ],
    ],
    water: [],
    blockers: [
      { x: 640, y: 460, r: 40 },
      { x: 1180, y: 470, r: 36 },
      { x: 200, y: 470, r: 30 },
      { x: 1480, y: 140, r: 34 },
      { x: 1480, y: 800, r: 34 },
    ],
    theme: {
      ground: [0xa0764a, 0x6b4a33],
      road: 0x5a4636,
      roadEdge: 0x2e221a,
      water: 0xd2501f,
      decor: ['rock', 'rock', 'crystal', 'bones', 'pine'],
    },
  },
};

export const MAP_LIST: readonly MapDef[] = [MAPS.glade, MAPS.crypt, MAPS.pass];

export function inEllipse(e: Ellipse, x: number, y: number, pad = 0): boolean {
  const dx = (x - e.x) / (e.rx + pad);
  const dy = (y - e.y) / (e.ry + pad);
  return dx * dx + dy * dy <= 1;
}
