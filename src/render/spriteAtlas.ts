import { Assets, Rectangle, Texture } from 'pixi.js';
import { PAINTED_TOWERS } from './art/painted';

/** Per-frame metadata written by scripts/cut-strip.mjs. */
export interface StripMeta {
  frames: number;
  cellW: number;
  cellH: number;
  baselineY: number;
  pivotX: number;
  anchors?: { headTop?: [number, number][]; grip?: [number, number][] };
}

export interface Strip {
  meta: StripMeta;
  frames: Texture[];
}

export interface GearItem {
  tex: Texture;
  w: number;
  h: number;
}

const BASE = './assets/painted/';

/** Loaded painted assets. Empty until `preloadPainted` resolves; a miss means "use the vector fallback". */
export const painted = {
  strips: new Map<string, Strip>(),
  gear: new Map<string, GearItem>(),
};

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    // Vite's dev server answers unknown paths with index.html, so check the type too.
    if (!res.ok || !(res.headers.get('content-type') ?? '').includes('json')) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function loadStrip(name: string): Promise<void> {
  const meta = await fetchJson<StripMeta>(`${BASE}${name}.json`);
  if (!meta) return;
  const tex = await Assets.load<Texture>(`${BASE}${name}.png`);
  const frames: Texture[] = [];
  for (let i = 0; i < meta.frames; i++) {
    frames.push(
      new Texture({ source: tex.source, frame: new Rectangle(i * meta.cellW, 0, meta.cellW, meta.cellH) }),
    );
  }
  painted.strips.set(name, { meta, frames });
}

async function loadGear(name: string): Promise<void> {
  const meta = await fetchJson<{ items: Record<string, { x: number; y: number; w: number; h: number }> }>(
    `${BASE}${name}.json`,
  );
  if (!meta) return;
  const tex = await Assets.load<Texture>(`${BASE}${name}.png`);
  for (const [id, r] of Object.entries(meta.items)) {
    painted.gear.set(id, {
      tex: new Texture({ source: tex.source, frame: new Rectangle(r.x, r.y, r.w, r.h) }),
      w: r.w,
      h: r.h,
    });
  }
}

let started: Promise<void> | null = null;

/** Loads every painted asset once. Never rejects: any failure just leaves the vector art in use. */
export function preloadPainted(): Promise<void> {
  started ??= (async () => {
    const jobs: Promise<void>[] = [];
    for (const spec of Object.values(PAINTED_TOWERS)) {
      jobs.push(loadStrip(spec.strip));
      for (const g of spec.gearAtlases) jobs.push(loadGear(g));
    }
    await Promise.allSettled(jobs);
  })();
  return started;
}

/** True when a tower has its painted body strip loaded. */
export function hasPaintedTower(id: string): boolean {
  const spec = PAINTED_TOWERS[id];
  return !!spec && painted.strips.has(spec.strip);
}
