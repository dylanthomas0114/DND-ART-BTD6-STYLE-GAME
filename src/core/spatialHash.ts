/**
 * Uniform grid for broad-phase queries. Rebuilt every tick for moving entities; stores
 * indices into a caller-owned array to avoid allocation.
 */
export class SpatialHash {
  private readonly cols: number;
  private readonly rows: number;
  private readonly cells: number[][];
  private readonly stampCells: number[] = [];

  constructor(
    readonly width: number,
    readonly height: number,
    readonly cellSize: number,
    private readonly margin = 200,
  ) {
    this.cols = Math.ceil((width + margin * 2) / cellSize);
    this.rows = Math.ceil((height + margin * 2) / cellSize);
    this.cells = Array.from({ length: this.cols * this.rows }, () => []);
  }

  clear(): void {
    for (const c of this.stampCells) this.cells[c]!.length = 0;
    this.stampCells.length = 0;
  }

  private cellIndex(x: number, y: number): number {
    const cx = Math.min(this.cols - 1, Math.max(0, Math.floor((x + this.margin) / this.cellSize)));
    const cy = Math.min(this.rows - 1, Math.max(0, Math.floor((y + this.margin) / this.cellSize)));
    return cy * this.cols + cx;
  }

  insert(index: number, x: number, y: number): void {
    const c = this.cellIndex(x, y);
    const cell = this.cells[c]!;
    if (cell.length === 0) this.stampCells.push(c);
    cell.push(index);
  }

  /** Calls `fn(index)` for every item in cells overlapping the circle's bounding box. */
  query(x: number, y: number, radius: number, fn: (index: number) => void): void {
    const m = this.margin;
    const cs = this.cellSize;
    const x0 = Math.max(0, Math.floor((x - radius + m) / cs));
    const x1 = Math.min(this.cols - 1, Math.floor((x + radius + m) / cs));
    const y0 = Math.max(0, Math.floor((y - radius + m) / cs));
    const y1 = Math.min(this.rows - 1, Math.floor((y + radius + m) / cs));
    for (let cy = y0; cy <= y1; cy++) {
      for (let cx = x0; cx <= x1; cx++) {
        const cell = this.cells[cy * this.cols + cx]!;
        for (let i = 0; i < cell.length; i++) fn(cell[i]!);
      }
    }
  }
}
