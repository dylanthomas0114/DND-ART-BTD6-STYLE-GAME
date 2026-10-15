import { MeshPlane, type Texture } from 'pixi.js';
import type { PaintedBossSpec } from './art/painted';
import { poseGrid } from './bossRig';

/**
 * A painted boss as one bendable mesh: a single draw call, and the position buffer is reused
 * every frame so posing allocates nothing. The art is one flat painting, so wings, tail and feet
 * are moved by bending it (see `bossRig.ts`) rather than by cutting it into pieces.
 */
export class PaintedBossBody {
  readonly mesh: MeshPlane;
  /** World units per image pixel. */
  readonly scale: number;
  private readonly positions: Float32Array;
  private readonly w: number;
  private readonly h: number;

  constructor(
    readonly spec: PaintedBossSpec,
    texture: Texture,
  ) {
    this.w = texture.width;
    this.h = texture.height;
    this.scale = spec.height / this.h;
    this.mesh = new MeshPlane({ texture, verticesX: spec.rig.cols, verticesY: spec.rig.rows });
    this.mesh.scale.set(this.scale);
    this.positions = this.mesh.geometry.positions;
    this.pose(0, 0, false);
  }

  pose(t: number, stride: number, moving: boolean): void {
    poseGrid(this.positions, this.spec.rig, this.w, this.h, this.spec.pivotY, { t, stride, moving });
    this.mesh.geometry.getBuffer('aPosition').update();
  }
}
