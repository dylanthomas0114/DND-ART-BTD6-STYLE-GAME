// Cuts a green-screen frame strip into an aligned, transparent atlas.
// Usage: node scripts/cut-strip.mjs <in.png> <outBase> <frames> [targetHeight=256]
// Writes <outBase>.png (single-row atlas, feet on a shared baseline) and <outBase>.json.
import { writeFileSync } from 'node:fs';
import sharp from 'sharp';

const [inPath, outBase, framesArg, heightArg] = process.argv.slice(2);
if (!inPath || !outBase || !framesArg) {
  console.error('usage: cut-strip.mjs <in.png> <outBase> <frames> [targetHeight]');
  process.exit(1);
}
const frames = Number(framesArg);
const targetH = Number(heightArg ?? 256);

const { data, info } = await sharp(inPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;

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

// Column occupancy -> split into `frames` runs separated by empty columns.
const colHas = new Uint8Array(W);
for (let x = 0; x < W; x++) {
  for (let y = 0; y < H; y++) {
    if (data[(y * W + x) * 4 + 3] > 128) {
      colHas[x] = 1;
      break;
    }
  }
}
const runs = [];
for (let x = 0; x < W; x++) {
  if (colHas[x] && (x === 0 || !colHas[x - 1])) runs.push([x, x]);
  if (colHas[x]) runs[runs.length - 1][1] = x;
}
// Drop specks, then merge the closest gaps until we have exactly `frames` runs.
let spans = runs.filter(([a, b]) => b - a > 12);
while (spans.length > frames) {
  let best = 0;
  let gap = Infinity;
  for (let i = 0; i < spans.length - 1; i++) {
    const g = spans[i + 1][0] - spans[i][1];
    if (g < gap) {
      gap = g;
      best = i;
    }
  }
  spans.splice(best, 2, [spans[best][0], spans[best + 1][1]]);
}
if (spans.length !== frames) {
  console.error(`found ${spans.length} frames, expected ${frames}`);
  process.exit(2);
}

const full = sharp(data, { raw: { width: W, height: H, channels: 4 } });
const crops = [];
for (const [x0, x1] of spans) {
  const w = x1 - x0 + 1;
  const buf = await full.clone().extract({ left: x0, top: 0, width: w, height: H }).png().toBuffer();
  const raw = await sharp(buf).raw().toBuffer();
  let top = H;
  let bot = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < w; x++) {
      if (raw[(y * w + x) * 4 + 3] > 128) {
        top = Math.min(top, y);
        bot = Math.max(bot, y);
        break;
      }
    }
  }
  crops.push({ buf, w, top, bot });
}

// One shared scale (from the tallest frame) so the body never pulses in size.
const maxH = Math.max(...crops.map((c) => c.bot - c.top + 1));
const scale = targetH / maxH;
const cellW = Math.ceil(Math.max(...crops.map((c) => c.w)) * scale) + 8;
const cellH = targetH + 8;
const comps = [];
for (let i = 0; i < crops.length; i++) {
  const c = crops[i];
  const h = c.bot - c.top + 1;
  const sw = Math.max(1, Math.round(c.w * scale));
  const sh = Math.max(1, Math.round(h * scale));
  const piece = await sharp(c.buf)
    .extract({ left: 0, top: c.top, width: c.w, height: h })
    .resize(sw, sh, { kernel: 'lanczos3' })
    .png()
    .toBuffer();
  comps.push({
    input: piece,
    left: i * cellW + Math.round((cellW - sw) / 2),
    top: cellH - 4 - sh, // feet on a shared baseline
  });
}
await sharp({
  create: { width: cellW * frames, height: cellH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
})
  .composite(comps)
  .png({ compressionLevel: 9 })
  .toFile(`${outBase}.png`);

// Per-frame anchors measured from the opaque pixels: headTop (top-most row, mean x) and
// grip (right-most extremity = the leading hand; mean y of the right-most columns).
const flat = await sharp(`${outBase}.png`).raw().toBuffer();
const SW = cellW * frames;
const anchors = { headTop: [], grip: [] };
for (let f = 0; f < frames; f++) {
  const x0 = f * cellW;
  let topY = cellH;
  let topXs = [];
  let maxX = 0;
  for (let y = 0; y < cellH; y++) {
    for (let x = 0; x < cellW; x++) {
      if (flat[(y * SW + x0 + x) * 4 + 3] > 128) {
        if (y < topY) {
          topY = y;
          topXs = [];
        }
        if (y === topY) topXs.push(x);
        if (x > maxX) maxX = x;
      }
    }
  }
  let sumY = 0;
  let n = 0;
  for (let y = 0; y < cellH; y++) {
    for (let x = Math.max(0, maxX - 8); x <= maxX; x++) {
      if (flat[(y * SW + x0 + x) * 4 + 3] > 128) {
        sumY += y;
        n++;
      }
    }
  }
  anchors.headTop.push([Math.round(topXs.reduce((a, b) => a + b, 0) / Math.max(1, topXs.length)), topY]);
  anchors.grip.push([Math.max(0, maxX - 6), Math.round(sumY / Math.max(1, n))]);
}
writeFileSync(
  `${outBase}.json`,
  JSON.stringify({ frames, cellW, cellH, baselineY: cellH - 4, pivotX: 0.5, anchors }, null, 2),
);
console.log(`${outBase}.png ${cellW * frames}x${cellH} (${frames} frames)`);
