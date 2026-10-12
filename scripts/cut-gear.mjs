// Cuts a green-screen prop sheet laid out on a cols x rows grid into a packed transparent atlas.
// Usage: node scripts/cut-gear.mjs <in.png> <outBase> <cols> <rows> <id1,id2,...> [maxItemPx=200] [flipIds]
// ids are row-major; use "-" to skip a cell. Items share ONE scale (tallest item = maxItemPx).
// Writes <outBase>.png and <outBase>.json ({ items: { id: {x,y,w,h} }, scale }).
import { writeFileSync } from 'node:fs';
import sharp from 'sharp';

const [inPath, outBase, colsArg, rowsArg, idsArg, maxArg] = process.argv.slice(2);
if (!inPath || !outBase || !colsArg || !rowsArg || !idsArg) {
  console.error('usage: cut-gear.mjs <in.png> <outBase> <cols> <rows> <ids> [maxItemPx]');
  process.exit(1);
}
const cols = Number(colsArg);
const rows = Number(rowsArg);
const ids = idsArg.split(',');
const maxPx = Number(maxArg ?? 200);
const PAD = 3;

const { data, info } = await sharp(inPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const spill = g - Math.max(r, b);
  if (spill > 60) data[i + 3] = 0;
  else if (spill > 15) {
    data[i + 3] = Math.round(255 * (1 - (spill - 15) / 45));
    data[i + 1] = Math.max(r, b);
  } else if (spill > 0) data[i + 1] = Math.max(r, b);
}
const keyed = sharp(data, { raw: { width: W, height: H, channels: 4 } });

const cells = [];
const cw = Math.floor(W / cols);
const ch = Math.floor(H / rows);
for (let k = 0; k < cols * rows; k++) {
  const id = ids[k];
  if (!id || id === '-') continue;
  const cx = (k % cols) * cw;
  const cy = Math.floor(k / cols) * ch;
  const raw = await keyed.clone().extract({ left: cx, top: cy, width: cw, height: ch }).raw().toBuffer();
  let x0 = cw;
  let y0 = ch;
  let x1 = -1;
  let y1 = -1;
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      if (raw[(y * cw + x) * 4 + 3] > 40) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  if (x1 < 0) {
    console.error(`cell ${k} (${id}) is empty`);
    process.exit(2);
  }
  // bleed check: an opaque pixel on the cell border means the item crosses into a neighbour
  if (x0 === 0 || y0 === 0 || x1 === cw - 1 || y1 === ch - 1)
    console.warn(`warn: ${id} touches its cell edge`);
  cells.push({ id, left: cx + x0, top: cy + y0, w: x1 - x0 + 1, h: y1 - y0 + 1 });
}

const scale = maxPx / Math.max(...cells.map((c) => c.h));
const pieces = [];
for (const c of cells) {
  const w = Math.max(1, Math.round(c.w * scale));
  const h = Math.max(1, Math.round(c.h * scale));
  const buf = await keyed
    .clone()
    .extract({ left: c.left, top: c.top, width: c.w, height: c.h })
    .resize(w, h, { kernel: 'lanczos3' })
    .png()
    .toBuffer();
  pieces.push({ id: c.id, w, h, buf });
}

// shelf pack into a page at most 1024 wide
const pageW = 1024;
let x = PAD;
let y = PAD;
let rowH = 0;
const items = {};
const comps = [];
for (const p of pieces.sort((a, b) => b.h - a.h)) {
  if (x + p.w + PAD > pageW) {
    x = PAD;
    y += rowH + PAD;
    rowH = 0;
  }
  items[p.id] = { x, y, w: p.w, h: p.h };
  comps.push({ input: p.buf, left: x, top: y });
  x += p.w + PAD;
  rowH = Math.max(rowH, p.h);
}
const pageH = y + rowH + PAD;
await sharp({
  create: { width: pageW, height: pageH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
})
  .composite(comps)
  .png({ compressionLevel: 9 })
  .toFile(`${outBase}.png`);
writeFileSync(`${outBase}.json`, JSON.stringify({ page: [pageW, pageH], scale, items }, null, 2));
console.log(`${outBase}.png ${pageW}x${pageH}, ${pieces.length} items, scale ${scale.toFixed(3)}`);
