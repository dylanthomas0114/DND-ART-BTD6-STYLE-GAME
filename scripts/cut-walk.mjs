// Cuts a walk-cycle sheet (green or magenta screen) into an aligned, transparent atlas for enemies.
// Unlike cut-strip.mjs it (a) erases a thin ground line or cast shadow the generator draws under the
// figures, (b) splits frames at the emptiest columns (and rows) near evenly spaced boundaries, so
// frames that nearly touch still separate, and (c) aligns each frame by the centre of its opaque
// pixels instead of its bounding box, so swinging swords and shields do not make the body jitter.
//
// Usage: node scripts/cut-walk.mjs <in.png> <outBase> <frames> [targetHeight=112] [options]
//   --key=green|magenta   backdrop colour (default green)
//   --rows=N              the sheet is a grid of N rows, read left to right, top to bottom
//   --take=N              keep only the first N frames (e.g. a sheet of copies of one pose)
//   --ground=Y            row of a ground line to erase (green key; found automatically otherwise)
// Writes <outBase>.png (single-row atlas, feet on a shared baseline) and <outBase>.json.
import { writeFileSync } from 'node:fs';
import sharp from 'sharp';

const args = process.argv.slice(2);
const opts = Object.fromEntries(
  args
    .filter((a) => a.startsWith('--'))
    .map((a) => {
      const [k, v] = a.slice(2).split('=');
      return [k, v ?? 'true'];
    }),
);
const [inPath, outBase, framesArg, heightArg] = args.filter((a) => !a.startsWith('--'));
if (!inPath || !outBase || !framesArg) {
  console.error(
    'usage: cut-walk.mjs <in.png> <outBase> <frames> [targetHeight] [--key= --rows= --take= --ground=]',
  );
  process.exit(1);
}
const frames = Number(framesArg);
const targetH = Number(heightArg ?? 112);
const key = opts.key ?? 'green';
const rows = Number(opts.rows ?? 1);
const take = Number(opts.take ?? frames);
if (frames % rows !== 0) {
  console.error(`${frames} frames do not fit ${rows} rows`);
  process.exit(1);
}
const perRow = frames / rows;

const { data, info } = await sharp(inPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const at = (x, y) => (y * W + x) * 4;

if (key === 'green') {
  // Ground row: the generator draws a 1px dark-green line under the feet. Find it (or take it from
  // the option), then recolour any dark-green pixels within one row of it back to the key green.
  const isLine = (i) => data[i + 1] > data[i] + 20 && data[i + 1] < 140 && data[i + 2] < 70;
  let ground = opts.ground === undefined ? -1 : Number(opts.ground);
  if (ground < 0) {
    let best = 0;
    for (let y = 0; y < H; y++) {
      let n = 0;
      for (let x = 0; x < W; x++) if (isLine(at(x, y))) n++;
      if (n > best) {
        best = n;
        ground = y;
      }
    }
    if (best < W * 0.3) ground = -1;
  }
  if (ground >= 0) {
    for (let y = ground - 1; y <= ground + 1; y++) {
      for (let x = 0; x < W; x++) {
        const i = at(x, y);
        if (isLine(i)) {
          data[i] = 0;
          data[i + 1] = 255;
          data[i + 2] = 0;
        }
      }
    }
  }
  // Chroma key: green dominance -> transparent, with soft edge and despill.
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const spill = g - Math.max(r, b);
    if (spill > 60) {
      data[i + 3] = 0;
    } else if (spill > 15) {
      data[i + 3] = Math.round(255 * (1 - (spill - 15) / 45));
      data[i + 1] = Math.max(r, b);
    } else if (spill > 0) {
      data[i + 1] = Math.max(r, b);
    }
  }
} else if (key === 'magenta') {
  // Hue key. The generator's "magenta" is a pink-red with a darker maroon cast shadow, so a
  // distance-from-colour key eats warm art colours; red and blue dominating green does not.
  const gone = new Uint8Array(W * H);
  const bg = (i) => data[i + 2] - data[i + 1] > 25 && data[i] - data[i + 1] > 50;
  const shadow = (i) => data[i] - data[i + 1] > 50 && data[i + 2] - data[i + 1] > 8 && data[i] < 200;
  const queue = [];
  for (let p = 0; p < W * H; p++) {
    if (bg(p * 4)) {
      gone[p] = 1;
      queue.push(p);
    }
  }
  // Grow into the shadow pixels that touch the removed backdrop.
  for (let q = 0; q < queue.length; q++) {
    const p = queue[q];
    const x = p % W;
    const y = (p / W) | 0;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const np = ny * W + nx;
      if (!gone[np] && shadow(np * 4)) {
        gone[np] = 1;
        queue.push(np);
      }
    }
  }
  // One halo pass: pixels beside removed ones that still lean pink are anti-aliasing fringe.
  const halo = [];
  for (let p = 0; p < W * H; p++) {
    if (gone[p]) continue;
    const x = p % W;
    const y = (p / W) | 0;
    const i = p * 4;
    if (!(data[i] - data[i + 1] > 35 && data[i + 2] - data[i + 1] > 0 && data[i] < 200)) continue;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < W && ny < H && gone[ny * W + nx]) {
        halo.push(p);
        break;
      }
    }
  }
  for (const p of halo) gone[p] = 1;
  for (let p = 0; p < W * H; p++) if (gone[p]) data[p * 4 + 3] = 0;
} else {
  console.error(`unknown key ${key}`);
  process.exit(1);
}

// Grid boundaries: the emptiest row (then column) near each even split point.
function emptiest(count, lo, hi, parts) {
  const cell = (hi - lo + 1) / parts;
  const cuts = [lo];
  for (let k = 1; k < parts; k++) {
    const nominal = Math.round(lo + cell * k);
    const reach = Math.round(cell * 0.35);
    let best = nominal;
    for (let v = nominal - reach; v <= nominal + reach; v++) {
      if (
        count[v] < count[best] ||
        (count[v] === count[best] && Math.abs(v - nominal) < Math.abs(best - nominal))
      )
        best = v;
    }
    cuts.push(best);
  }
  cuts.push(hi + 1);
  return cuts;
}
function extent(count) {
  let lo = 0;
  let hi = count.length - 1;
  while (lo < count.length && count[lo] === 0) lo++;
  while (hi > 0 && count[hi] === 0) hi--;
  return [lo, hi];
}
const rowCount = new Uint32Array(H);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (data[at(x, y) + 3] > 128) rowCount[y]++;
const [top0, bot0] = extent(rowCount);
const rowCuts = emptiest(rowCount, top0, bot0, rows);

const cells = [];
const cuts = [];
for (let r = 0; r < rows; r++) {
  const y0 = rowCuts[r];
  const y1 = rowCuts[r + 1];
  const colCount = new Uint32Array(W);
  for (let y = y0; y < y1; y++) for (let x = 0; x < W; x++) if (data[at(x, y) + 3] > 128) colCount[x]++;
  const [l, rt] = extent(colCount);
  const colCuts = emptiest(colCount, l, rt, perRow);
  cuts.push(colCuts.join(','));
  for (let c = 0; c < perRow; c++) cells.push({ x0: colCuts[c], x1: colCuts[c + 1], y0, y1 });
}

const crops = [];
for (const { x0, x1, y0, y1 } of cells.slice(0, take)) {
  let top = H;
  let bot = 0;
  let minX = x1 - x0;
  let maxX = 0;
  let sumX = 0;
  let n = 0;
  for (let y = y0; y < y1; y++) {
    for (let x = 0; x < x1 - x0; x++) {
      if (data[at(x0 + x, y) + 3] > 128) {
        top = Math.min(top, y);
        bot = Math.max(bot, y);
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        sumX += x;
        n++;
      }
    }
  }
  crops.push({ x0, top, bot, minX, maxX, cx: sumX / Math.max(1, n) });
}

// One shared scale (from the tallest frame) so the body never pulses in size.
const maxH = Math.max(...crops.map((c) => c.bot - c.top + 1));
const scale = targetH / maxH;
const halfW = Math.max(...crops.map((c) => Math.max(c.cx - c.minX, c.maxX - c.cx))) * scale;
const cellW = Math.ceil(halfW * 2) + 8;
const cellH = targetH + 8;
const full = sharp(data, { raw: { width: W, height: H, channels: 4 } });
const comps = [];
for (let i = 0; i < crops.length; i++) {
  const c = crops[i];
  const h = c.bot - c.top + 1;
  const sw = Math.max(1, Math.round((c.maxX - c.minX + 1) * scale));
  const sh = Math.max(1, Math.round(h * scale));
  const piece = await full
    .clone()
    .extract({ left: c.x0 + c.minX, top: c.top, width: c.maxX - c.minX + 1, height: h })
    .resize(sw, sh, { kernel: 'lanczos3' })
    .png()
    .toBuffer();
  comps.push({
    input: piece,
    left: i * cellW + Math.round(cellW / 2 - (c.cx - c.minX) * scale),
    top: cellH - 4 - sh, // feet on a shared baseline
  });
}
await sharp({
  create: {
    width: cellW * crops.length,
    height: cellH,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite(comps)
  .png({ compressionLevel: 9 })
  .toFile(`${outBase}.png`);
writeFileSync(
  `${outBase}.json`,
  JSON.stringify({ frames: crops.length, cellW, cellH, baselineY: cellH - 4, pivotX: 0.5 }, null, 2),
);
console.log(
  `${outBase}.png ${cellW * crops.length}x${cellH} (${crops.length} frames), key ${key}, row cuts ${rowCuts.join(',')}, col cuts ${cuts.join(' | ')}`,
);
