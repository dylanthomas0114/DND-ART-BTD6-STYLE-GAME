// Generates web, Android and iOS icons from art/icon/icon.svg (run after editing the icon).
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

const svg = 'art/icon/icon.svg';
const png = (size, out, opts = {}) => {
  mkdirSync(out.split('/').slice(0, -1).join('/'), { recursive: true });
  let img = sharp(svg, { density: 300 }).resize(size, size);
  if (opts.round) {
    const mask = Buffer.from(
      `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}"/></svg>`,
    );
    img = img.composite([{ input: mask, blend: 'dest-in' }]);
  }
  return img.png().toFile(out);
};

await png(192, 'public/icons/icon-192.png');
await png(512, 'public/icons/icon-512.png');
await png(180, 'public/icons/apple-touch-icon.png');
const android = { mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 };
for (const [dpi, size] of Object.entries(android)) {
  const dir = `android/app/src/main/res/mipmap-${dpi}`;
  await png(size, `${dir}/ic_launcher.png`);
  await png(size, `${dir}/ic_launcher_round.png`, { round: true });
  await png(Math.round(size * 2.25), `${dir}/ic_launcher_foreground.png`);
}
await png(1024, 'ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png');
console.log('icons written');
