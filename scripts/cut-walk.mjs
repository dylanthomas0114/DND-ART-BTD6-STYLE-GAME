// Cuts a green-screen walk-cycle strip into an aligned, transparent atlas for enemies.
// Unlike cut-strip.mjs it (a) erases a thin ground line the generator may draw under the
// figures, (b) splits frames at the emptiest columns near evenly spaced boundaries, so frames
// that nearly touch still separate, and (c) aligns each frame by the centre of its opaque
// pixels instead of its bounding box, so swinging swords and shields do not make the body jitter.
// Usage: node scripts/cut-walk.mjs <in.png> <outBase> <frames> [targetHeight=112] [groundRow]
// Writes <outBase>.png (single-row atlas, feet on a shared baseline) and <outBase>.json.
import { writeFileSync } from 'node:fs';
import sharp from 'sharp';

const [inPath, outBase, framesArg, heightArg, lineArg] = process.argv.slice(2);
if (!inPath || !outBase || !framesArg) {
  console.error('usage: cut-walk.mjs <in.png> <outBase> <frames> [targetHeight] [groundRow]');
  process.exit(1);
}
const frames = Number(framesArg);
const targetH = Number(heightArg ?? 112);

const { data, info } = await sharp(inPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const at = (x, y) => (y * W + x) * 4;

// Ground row: the generator draws a 1px dark-green line under the feet. Find it (or take it from
// the argument), then recolour any dark-green pixels within one row of it back to the key green.
const isLine = (i) => data[i + 1] > data[i] + 20 && data[i + 1] < 140 && data[i + 2] < 70;
let ground = lineArg === undefined ? -1 : Number(lineArg);
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

// Frame boundaries: the emptiest column within +-35% of a cell of each even split point.
const colCount = new Uint32Array(W);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (data[at(x, y) + 3] > 128) colCount[x]++;
let left = 0;
let right = W - 1;
while (left < W && colCount[left] === 0) left++;
while (right > 0 && colCount[right] === 0) right--;
const cell = (right - left + 1) / frames;
const cuts = [left];
for (let k = 1; k < frames; k++) {
  const nominal = Math.round(left + cell * k);
  const reach = Math.round(cell * 0.35);
  let best = nominal;
  for (let x = nominal - reach; x <= nominal + reach; x++) {
    if (
      colCount[x] < colCount[best] ||
      (colCount[x] === colCount[best] && Math.abs(x - nominal) < Math.abs(best - nominal))
    )
      best = x;
  }
  cuts.push(best);
}
cuts.push(right + 1);

const crops = [];
for (let f = 0; f < frames; f++) {
  const x0 = cuts[f];
  const x1 = cuts[f + 1];
  const w = x1 - x0;
  let top = H;
  let bot = 0;
  let minX = w;
  let maxX = 0;
  let sumX = 0;
  let n = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < w; x++) {
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
  // Feet stand on the ground row when there is one; otherwise on the lowest opaque pixel.
  const base = ground >= 0 ? Math.min(ground, bot) : bot;
  crops.push({ x0, w, top, bot: base, minX, maxX, cx: sumX / Math.max(1, n) });
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
  create: { width: cellW * frames, height: cellH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
})
  .composite(comps)
  .png({ compressionLevel: 9 })
  .toFile(`${outBase}.png`);
writeFileSync(
  `${outBase}.json`,
  JSON.stringify({ frames, cellW, cellH, baselineY: cellH - 4, pivotX: 0.5 }, null, 2),
);
console.log(
  `${outBase}.png ${cellW * frames}x${cellH} (${frames} frames), ground row ${ground}, cuts ${cuts.join(',')}`,
);
