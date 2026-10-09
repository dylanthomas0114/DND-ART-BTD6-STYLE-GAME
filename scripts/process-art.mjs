// Converts generated art in art/source/ into optimised WebP files under public/assets/.
// Usage: npm run art:process        (skips entries whose source file is missing)
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import sharp from 'sharp';

const manifest = JSON.parse(readFileSync('art/prompts.json', 'utf8'));
let done = 0;
for (const a of manifest.assets) {
  if (!existsSync(a.source)) {
    console.log(`skip ${a.id}: ${a.source} not found (code-drawn fallback stays in use)`);
    continue;
  }
  mkdirSync(dirname(a.output), { recursive: true });
  const [w, h] = a.size;
  await sharp(a.source)
    .resize(w, h, { fit: 'cover' })
    .webp({ quality: 82, alphaQuality: 90 })
    .toFile(a.output);
  console.log(`wrote ${a.output}`);
  done++;
}
console.log(`${done}/${manifest.assets.length} assets processed`);
