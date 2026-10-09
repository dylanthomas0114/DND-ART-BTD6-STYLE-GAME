import { render } from 'preact';
import { startGallery } from './render/gallery';
import { startDemo } from './demo';
import { startBestiary } from './render/bestiary';

const host = document.getElementById('app')!;
const params = new URLSearchParams(location.search);

if (params.has('gallery')) {
  host.style.cssText = 'position:fixed;inset:0;';
  void startGallery(host, params.get('gallery') ?? '');
} else if (params.has('bestiary')) {
  host.style.cssText = 'position:fixed;inset:0;';
  void startBestiary(host);
} else if (params.has('demo')) {
  host.style.cssText = 'position:fixed;inset:0;';
  void startDemo(host, params);
} else {
  render(<p>Arcane Ramparts is booting…</p>, host);
}
