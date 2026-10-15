import { useEffect, useState } from 'preact/hooks';
import { Container, Graphics, Rectangle } from 'pixi.js';
import { DIFFICULTIES } from '../core/data/difficulty';
import { MAP_LIST, type MapId } from '../core/data/maps';
import type { TowerId, Tiers } from '../core/data/towerTypes';
import type { DifficultyId } from '../core/types';
import { drawMapGround, drawRoads } from '../render/art/mapArt';
import { Draw } from '../render/art/pen';
import { hub } from '../render/hub';
import { GameSession } from '../session';
import { playSfx } from '../audio/sfx';
import {
  clearGameSave,
  progress,
  savedGame,
  screen,
  type Screen,
  settings,
  updateProgress,
  updateSettings,
} from './store';
import { IconClose, IconGear, IconMedal } from './svg';

const click = () => playSfx('click');

/** Attract-mode backdrop: a showcase defence playing on Goblin Glade behind the menus. */
export function Backdrop() {
  useEffect(() => {
    const app = hub.app;
    if (!app) return;
    const s = new GameSession(app, { mapId: 'glade', difficulty: 'easy', seed: 11 }, hub.bank!);
    const g = s.game;
    g.cash = 1e7;
    g.lives = 1e7;
    const build: [TowerId, number, number, Tiers][] = [
      ['fighter', 410, 300, [2, 3, 0]],
      ['ranger', 180, 300, [3, 0, 2]],
      ['wizard', 760, 330, [0, 2, 4]],
      ['bombardier', 470, 610, [4, 0, 2]],
      ['druid', 820, 470, [2, 4, 0]],
      ['cleric', 1140, 300, [0, 3, 2]],
      ['rogue', 1180, 600, [2, 3, 0]],
      ['ballista', 1520, 300, [3, 2, 0]],
    ];
    for (const [id, x, y, tiers] of build) {
      const r = g.placeTower(id, x, y);
      if (!r.ok) continue;
      for (let p = 0; p < 3; p++) for (let i = 0; i < tiers[p]!; i++) g.upgradeTower(r.uid, p);
    }
    g.round = 21;
    s.autoStart = true;
    g.startRound();
    const fit = () => {
      // cover the whole screen (crop) for the backdrop
      const w = app.screen.width;
      const h = app.screen.height;
      const sc = Math.max(w / 1600, h / 900);
      s.view.root.scale.set(sc);
      s.view.root.position.set((w - 1600 * sc) / 2, (h - 900 * sc) / 2);
    };
    fit();
    app.renderer.on('resize', fit);
    return () => {
      app.renderer.off('resize', fit);
      s.destroy();
    };
  }, []);
  return null;
}

function Logo() {
  const [painted, setPainted] = useState(false);
  useEffect(() => {
    const img = new Image();
    img.onload = () => setPainted(true);
    img.src = './assets/ui/logo.webp';
  }, []);
  if (painted)
    return <img src="./assets/ui/logo.webp" alt="Arcane Ramparts" style={{ width: 'min(70vw, 30em)' }} />;
  return (
    <h1 class="logo">
      Arcane
      <br />
      Ramparts
      <small>A Tower Defense Saga</small>
    </h1>
  );
}

export function MainMenu() {
  const save = savedGame.value;
  return (
    <div class="screen dim">
      <div class="menu-col">
        <Logo />
        <div style={{ height: '0.6em' }} />
        <button
          class="btn green"
          onClick={() => {
            click();
            screen.value = { name: 'maps' };
          }}
        >
          Play
        </button>
        {save && (
          <button
            class="btn"
            onClick={() => {
              click();
              screen.value = { name: 'game', map: save.mapId, difficulty: save.difficulty, save };
            }}
          >
            Continue · Round {save.round + 1}
          </button>
        )}
        <button
          class="btn wood"
          onClick={() => {
            click();
            screen.value = { name: 'settings', back: { name: 'menu' } };
          }}
        >
          Settings
        </button>
      </div>
    </div>
  );
}

const thumbCache = new Map<MapId, string>();

async function mapThumb(id: MapId): Promise<string> {
  const hit = thumbCache.get(id);
  if (hit) return hit;
  const app = hub.app!;
  const map = MAP_LIST.find((m) => m.id === id)!;
  const g = new Graphics();
  const d = new Draw(g, 3);
  drawMapGround(d, map, false);
  drawRoads(d, map);
  const wrap = new Container();
  wrap.addChild(g);
  g.scale.set(0.25);
  const tex = app.renderer.generateTexture({
    target: wrap,
    frame: new Rectangle(0, 0, 400, 225),
    resolution: 1,
  });
  const url = await app.renderer.extract.base64(tex);
  tex.destroy(true);
  wrap.destroy({ children: true });
  thumbCache.set(id, url);
  return url;
}

function MapCard({ id }: { id: MapId }) {
  const map = MAP_LIST.find((m) => m.id === id)!;
  const [thumb, setThumb] = useState<string | null>(null);
  useEffect(() => {
    let live = true;
    // prefer painted art when available
    const painted = `./assets/maps/${id}.webp`;
    const img = new Image();
    img.onload = () => live && setThumb(painted);
    img.onerror = () => void mapThumb(id).then((u) => live && setThumb(u));
    img.src = painted;
    return () => {
      live = false;
    };
  }, [id]);
  const start = (diff: DifficultyId) => {
    click();
    if (savedGame.value) clearGameSave();
    screen.value = { name: 'game', map: id, difficulty: diff };
  };
  return (
    <div class="panel map-card">
      <div class="thumb" style={thumb ? { backgroundImage: `url(${thumb})` } : undefined}>
        <span class="tier">{map.tier}</span>
      </div>
      <h3>{map.name}</h3>
      <p>{map.blurb}</p>
      <div class="diff-row">
        {(['easy', 'medium', 'hard'] as DifficultyId[]).map((d) => (
          <button
            class={`btn ${d === 'easy' ? 'green' : d === 'medium' ? 'blue' : 'red'}`}
            onClick={() => start(d)}
            title={`${DIFFICULTIES[d].finalRound} rounds`}
          >
            {DIFFICULTIES[d].name}
            {progress.value.medals[`${id}:${d}`] && (
              <IconMedal color={d === 'easy' ? '#d8a868' : d === 'medium' ? '#d9e4ee' : '#ffd36b'} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export function MapSelect() {
  return (
    <div class="screen dim" style={{ flexDirection: 'column', gap: '0.8em' }}>
      <div class="topbar">
        <button
          class="btn wood small"
          onClick={() => {
            click();
            screen.value = { name: 'menu' };
          }}
        >
          ← Back
        </button>
        <span class="title" style={{ color: '#fff', fontSize: '1.6em', textShadow: '0 2px 0 #000' }}>
          Choose your battlefield
        </span>
        <span style={{ width: '5em' }} />
      </div>
      <div class="map-grid" style={{ marginTop: '2.4em' }}>
        {MAP_LIST.map((m) => (
          <MapCard id={m.id} />
        ))}
      </div>
    </div>
  );
}

export function SettingsPanel({ onClose }: { onClose: () => void }) {
  const s = settings.value;
  const seg = <T extends string>(value: T, opts: [T, string][], set: (v: T) => void) => (
    <div class="seg">
      {opts.map(([v, label]) => (
        <button
          class={`btn small ${v === value ? 'on' : ''}`}
          onClick={() => {
            click();
            set(v);
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
  return (
    <div class="panel modal" onPointerDown={(e) => e.stopPropagation()}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <IconGear />
        <h2 style={{ flex: 1, margin: 0 }}>Settings</h2>
        <button
          class="btn round red"
          style={{ width: '2.4em', height: '2.4em' }}
          onClick={onClose}
          aria-label="Close"
        >
          <IconClose />
        </button>
      </div>
      <div class="settings-grid" style={{ marginTop: '0.8em' }}>
        <span>Music</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={s.music}
          onInput={(e) => updateSettings({ music: +(e.target as HTMLInputElement).value })}
        />
        <span>Sound effects</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={s.sfx}
          onInput={(e) => updateSettings({ sfx: +(e.target as HTMLInputElement).value })}
        />
        <span>Graphics</span>
        {seg(
          s.quality,
          [
            ['auto', 'Auto'],
            ['low', 'Low'],
            ['medium', 'Med'],
            ['high', 'High'],
          ],
          (q) => updateSettings({ quality: q }),
        )}
        <span>Vibration</span>
        {seg(
          s.haptics ? 'on' : 'off',
          [
            ['on', 'On'],
            ['off', 'Off'],
          ],
          (v) => updateSettings({ haptics: v === 'on' }),
        )}
        <span>Auto-start rounds</span>
        {seg(
          s.autoStart ? 'on' : 'off',
          [
            ['on', 'On'],
            ['off', 'Off'],
          ],
          (v) => updateSettings({ autoStart: v === 'on' }),
        )}
        <span>Show FPS</span>
        {seg(
          s.showFps ? 'on' : 'off',
          [
            ['on', 'On'],
            ['off', 'Off'],
          ],
          (v) => updateSettings({ showFps: v === 'on' }),
        )}
        <span>Tutorial</span>
        <button class="btn small" onClick={() => updateProgress({ tutorialDone: false })}>
          Replay tutorial
        </button>
      </div>
    </div>
  );
}

export function SettingsScreen({ back }: { back: Screen }) {
  return (
    <div class="screen dim">
      <SettingsPanel
        onClose={() => {
          click();
          screen.value = back;
        }}
      />
    </div>
  );
}
