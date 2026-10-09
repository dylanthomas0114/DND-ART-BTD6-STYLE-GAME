import { render } from 'preact';
import './ui/theme.css';
import { startDemo } from './demo';
import { startBestiary } from './render/bestiary';
import { startGallery } from './render/gallery';
import { TextureBank } from './render/bake';
import { hub } from './render/hub';
import { createPixiApp } from './render/pixiApp';
import { GameScreen } from './ui/GameScreen';
import { Backdrop, MainMenu, MapSelect, SettingsScreen } from './ui/menus';
import { screen } from './ui/store';

const host = document.getElementById('app')!;
const params = new URLSearchParams(location.search);

const screenKeys = new WeakMap<object, number>();
let screenKeySeq = 0;
/** Stable per-navigation key so "Try again" (same map/difficulty) still remounts the game. */
function keyOf(o: object): number {
  let k = screenKeys.get(o);
  if (k === undefined) screenKeys.set(o, (k = ++screenKeySeq));
  return k;
}

function App() {
  const s = screen.value;
  return (
    <>
      {s.name !== 'game' && <Backdrop />}
      {s.name === 'menu' && <MainMenu />}
      {s.name === 'maps' && <MapSelect />}
      {s.name === 'settings' && <SettingsScreen back={s.back} />}
      {s.name === 'game' && <GameScreen key={keyOf(s)} map={s.map} difficulty={s.difficulty} save={s.save} />}
      <div class="rotate">
        Turn your device sideways
        <br />
        to defend the realm
      </div>
    </>
  );
}

async function boot(): Promise<void> {
  const stage = document.createElement('div');
  stage.id = 'stage';
  const ui = document.createElement('div');
  ui.className = 'ui-root';
  host.append(stage, ui);
  const app = await createPixiApp(stage);
  hub.app = app;
  hub.bank = new TextureBank(app, Math.min(2, Math.max(1, window.devicePixelRatio || 1)));
  await document.fonts?.ready;
  render(<App />, ui);
  (window as unknown as { __app: unknown }).__app = { ready: true };
}

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
  void boot();
}
