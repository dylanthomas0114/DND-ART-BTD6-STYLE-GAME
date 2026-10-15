import {
  type Application,
  type Container,
  Graphics,
  Matrix,
  type Rectangle,
  RenderTexture,
  type Texture,
} from 'pixi.js';
import { Draw } from './art/pen';

export interface Baked {
  texture: Texture;
  /** Anchor so that the drawing's (0,0) lands on the sprite position. */
  ax: number;
  ay: number;
}

/**
 * Lazily rasterises vector drawings to textures at a fixed resolution and caches them by key.
 * Drawing happens once; sprites then render the cached texture (fast and batchable).
 */
export class TextureBank {
  private readonly cache = new Map<string, Baked>();

  constructor(
    private readonly app: Application,
    public resolution: number,
  ) {}

  get(key: string, draw: (d: Draw) => void, lineWidth = 3): Baked {
    const hit = this.cache.get(key);
    if (hit) return hit;
    const g = new Graphics();
    draw(new Draw(g, lineWidth));
    const b = g.getLocalBounds();
    const texture = this.app.renderer.generateTexture({
      target: g,
      resolution: this.resolution,
      antialias: true,
    });
    g.destroy();
    const baked: Baked = {
      texture,
      ax: b.width > 0 ? -b.x / b.width : 0.5,
      ay: b.height > 0 ? -b.y / b.height : 0.5,
    };
    this.cache.set(key, baked);
    return baked;
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  get size(): number {
    return this.cache.size;
  }
}

/**
 * Rasterises a large static drawing once, without multisampling. `generateTexture` always turns
 * antialiasing on for this app, and a multisampled target keeps a 4x renderbuffer alive for as
 * long as the texture exists (hundreds of MB for a map). The map is baked at or above its on-screen
 * size, so the plain target looks the same and costs a quarter of the memory.
 */
export function bakeFlat(app: Application, target: Container, frame: Rectangle, resolution: number): Texture {
  const rt = RenderTexture.create({
    width: Math.ceil(frame.width),
    height: Math.ceil(frame.height),
    resolution,
    antialias: false,
  });
  app.renderer.render({
    container: target,
    target: rt,
    transform: new Matrix().translate(-frame.x, -frame.y),
    clearColor: [0, 0, 0, 0],
  });
  return rt;
}
