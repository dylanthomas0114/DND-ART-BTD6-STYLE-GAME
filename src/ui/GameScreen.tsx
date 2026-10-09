import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { DIFFICULTIES } from '../core/data/difficulty';
import { roundHasInvisible } from '../core/data/rounds';
import type { MapId } from '../core/data/maps';
import { TOWERS } from '../core/data/towers';
import type { TowerId } from '../core/data/towerTypes';
import type { SaveState } from '../core/game';
import type { DifficultyId, TargetPriority } from '../core/types';
import { hub } from '../render/hub';
import { GameSession, type Speed } from '../session';
import { playSfx, type SfxName } from '../audio/sfx';
import { setMusicIntensity } from '../audio/engine';
import { haptic } from '../platform/haptics';
import { gearIcon, useImage } from './icons';
import { SettingsPanel } from './menus';
import { fmt, Shop, UpgradePanel } from './panels';
import {
  clearGameSave,
  progress,
  recordRound,
  recordWin,
  screen,
  settings,
  storeGameSave,
  updateProgress,
} from './store';
import { IconCoin, IconFast, IconGear, IconHeart, IconHome, IconMedal, IconPause, IconPlay } from './svg';

interface Props {
  map: MapId;
  difficulty: DifficultyId;
  save?: SaveState;
}

type Modal = null | 'pause' | 'settings' | 'over';

interface Placing {
  id: TowerId;
  pointerId: number;
  touch: boolean;
  /** Has the pointer been over the map since grabbing the card? */
  entered: boolean;
}

const TUTORIAL = [
  { text: 'Drag a <b>Ranger</b> from the shop onto the grass beside the road.', at: 'shop' },
  { text: 'Tap <b>▶</b> to send the first wave of slimes!', at: 'go' },
  { text: 'Nice! <b>Tap your Ranger</b> to see its upgrades.', at: 'map' },
  { text: 'Every upgrade gives your hero <b>new gear</b>. Buy one!', at: 'upg' },
] as const;

/** Toast queue entry. */
interface Toast {
  id: number;
  text: string;
}

export function GameScreen({ map, difficulty, save }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [session, setSession] = useState<GameSession | null>(null);
  const [, setTick] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [placing, setPlacing] = useState<Placing | null>(null);
  const [modal, setModal] = useState<Modal>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [banner, setBanner] = useState<{ id: number; text: string } | null>(null);
  const [panelW, setPanelW] = useState(180);
  const [tut, setTut] = useState(() => (!progress.value.tutorialDone && map === 'glade' && !save ? 0 : -1));
  const placingRef = useRef<Placing | null>(null);
  placingRef.current = placing;
  const selectedRef = useRef<number | null>(null);
  selectedRef.current = selected;
  const tutRef = useRef(tut);
  tutRef.current = tut;

  const toast = (text: string) => {
    const id = Math.random();
    setToasts((t) => [...t.slice(-2), { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 1700);
  };

  // ---------------------------------------------------------------------- session lifecycle
  useEffect(() => {
    const app = hub.app!;
    const s = new GameSession(
      app,
      save ? { save } : { mapId: map, difficulty, seed: (Date.now() & 0xffff) + 1 },
      hub.bank!,
    );
    s.autoStart = settings.value.autoStart;
    const g = s.game;
    let frame = 0;
    s.onFrame = () => {
      frame++;
      if (frame % 6 === 0) setTick((t) => t + 1);
    };
    const offs = [
      g.events.on('roundEnd', (e) => {
        playSfx('roundEnd');
        recordRound(map, difficulty, e.round);
        if (!g.over) storeGameSave(g.serialize());
        if (tutRef.current === 1 && e.round === 1) setTut(2);
        setTick((t) => t + 1);
      }),
      g.events.on('roundStart', (e) => {
        playSfx('roundStart');
        if (e.round % 10 === 0 || e.round === g.finalRound)
          setBanner({
            id: Math.random(),
            text: e.round === g.finalRound ? 'Final Round!' : `Round ${e.round}`,
          });
        else if (roundHasInvisible(e.round) && !g.towers.some((t) => g.seesInvisible(t)))
          toast('Invisible foes! You need True Sight (Rogue, Cleric…)');
      }),
      g.events.on('gameOver', (e) => {
        playSfx(e.won ? 'win' : 'lose');
        haptic('heavy');
        if (e.won) recordWin(map, difficulty);
        clearGameSave();
        setModal('over');
      }),
      g.events.on('leak', () => haptic('light')),
      g.events.on('pop', (e) => playSfx(e.boss ? 'popBig' : 'pop', e.boss ? 1 : 0.5)),
      g.events.on('immune', () => playSfx('immune', 0.4)),
      g.events.on('explode', () => playSfx('boom', 0.6)),
      g.events.on('ability', () => playSfx('ability')),
      g.events.on('cash', () => playSfx('coin')),
      g.events.on('leak', () => playSfx('leak', 0.6)),
      g.events.on('attack', (e) => {
        const t = g.towerByUid(e.towerUid);
        if (!t) return;
        const a = t.stats.attacks.find((x) => x.id === e.attackId);
        const name: SfxName =
          e.kind === 'aura'
            ? 'freeze'
            : e.kind === 'instant'
              ? a?.dtype === 'piercing' || a?.dtype === 'true'
                ? 'shoot'
                : 'beam'
              : e.kind === 'melee'
                ? 'blade'
                : a?.dtype === 'blast'
                  ? 'shoot'
                  : a?.dtype === 'piercing'
                    ? 'bow'
                    : a?.dtype === 'slashing'
                      ? 'blade'
                      : 'magic';
        playSfx(name, 0.35);
      }),
      g.events.on('roundStart', () => setMusicIntensity(1)),
      g.events.on('roundEnd', () => setMusicIntensity(0)),
    ];
    const resize = () => {
      const w = app.screen.width;
      const h = app.screen.height;
      const pw = Math.round(Math.min(250, Math.max(150, w * 0.2)));
      setPanelW(pw);
      s.view.setLayout(0, 0, w - pw, h);
    };
    resize();
    app.renderer.on('resize', resize);
    setSession(s);
    (window as unknown as { __game: unknown }).__game = {
      ready: true,
      session: s,
      game: g,
      stats: () => ({
        fps: s.fps,
        enemies: g.enemies.length,
        projectiles: g.projectiles.length,
        particles: s.view.particles.count,
        round: g.round,
        quality: s.view.quality,
      }),
    };
    const vis = () => {
      if (document.hidden) {
        s.paused = true;
        setModal((m) => m ?? 'pause');
        if (g.canSave()) storeGameSave(g.serialize());
      }
    };
    document.addEventListener('visibilitychange', vis);
    const back = () => setModal((m) => (m === 'over' ? m : m ? null : 'pause'));
    window.addEventListener('ar:back', back);
    return () => {
      window.removeEventListener('ar:back', back);
      setMusicIntensity(0);
      offs.forEach((o) => o());
      document.removeEventListener('visibilitychange', vis);
      app.renderer.off('resize', resize);
      s.destroy();
    };
  }, [map, difficulty, save]);

  useEffect(() => {
    if (!session) return;
    session.paused = modal !== null && modal !== 'over';
  }, [modal, session]);

  useEffect(() => {
    if (session) session.view.setSelected(selected);
  }, [selected, session]);

  useEffect(() => {
    if (session) session.autoStart = settings.value.autoStart;
  }, [settings.value.autoStart, session]);

  useEffect(() => {
    if (session) session.qualityMode = settings.value.quality;
  }, [settings.value.quality, session]);

  // ---------------------------------------------------------------------- input
  const worldPoint = (e: PointerEvent, lift: boolean) => {
    const rect = (hub.app!.canvas as HTMLCanvasElement).getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top - (lift ? 56 : 0);
    return { sx, sy, w: session!.view.toWorld(sx, sy) };
  };

  const inWorld = (sx: number) => sx < hub.app!.screen.width - panelW;

  const tryPlace = (p: Placing, e: PointerEvent): boolean => {
    const s = session!;
    const { sx, w } = worldPoint(e, p.touch);
    if (!inWorld(sx)) return false;
    const r = s.game.placeTower(p.id, w.x, w.y);
    if (r.ok) {
      playSfx('place');
      haptic('medium');
      setPlacing(null);
      s.view.setGhost(null);
      if (tutRef.current === 0) setTut(1);
      return true;
    }
    playSfx('error');
    toast(r.reason);
    return false;
  };

  useEffect(() => {
    if (!session) return;
    const move = (e: PointerEvent) => {
      const p = placingRef.current;
      if (!p) return;
      const { sx, w } = worldPoint(e, p.touch);
      const over = inWorld(sx);
      if (over && !p.entered) setPlacing({ ...p, entered: true });
      const ok = session.game.canPlace(p.id, w.x, w.y).ok;
      session.view.setGhost(p.id, w.x, w.y, ok && session.game.cash >= session.game.towerCost(p.id), over);
    };
    const up = (e: PointerEvent) => {
      const p = placingRef.current;
      if (!p) return;
      const { sx } = worldPoint(e, p.touch);
      if (inWorld(sx)) tryPlace(p, e);
      // released over the panel without visiting the map: stay armed for tap-to-place
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [session, panelW]);

  const onCanvasDown = (e: PointerEvent) => {
    if (!session || modal) return;
    const p = placingRef.current;
    if (p) {
      // armed tap-to-place: show the ghost where the finger lands, place on release
      const { w } = worldPoint(e, p.touch);
      session.view.setGhost(p.id, w.x, w.y, session.game.canPlace(p.id, w.x, w.y).ok, true);
      return;
    }
    const { sx, w } = worldPoint(e, false);
    if (!inWorld(sx)) return;
    const t = session.view.pickTower(w.x, w.y);
    if (t) {
      playSfx('click');
      setSelected(t.uid);
      if (tutRef.current === 2) setTut(3);
    } else setSelected(null);
  };

  const grab = (id: TowerId, e: PointerEvent) => {
    if (!session) return;
    e.preventDefault();
    if (placing?.id === id) {
      setPlacing(null);
      session.view.setGhost(null);
      return;
    }
    if (session.game.cash < session.game.towerCost(id)) {
      playSfx('error');
      toast('Not enough gold');
      return;
    }
    playSfx('click');
    setSelected(null);
    setPlacing({ id, pointerId: e.pointerId, touch: e.pointerType === 'touch', entered: false });
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  // ---------------------------------------------------------------------- actions
  const g = session?.game;
  const tower = g && selected !== null ? g.towerByUid(selected) : undefined;

  const goPressed = () => {
    if (!session || !g) return;
    playSfx('click');
    if (!g.roundActive) {
      g.startRound();
      if (tutRef.current === 1) setTut(-2); // wait for round end
      return;
    }
    const next = ((session.speed % 3) + 1) as Speed;
    session.speed = next;
    setTick((t) => t + 1);
  };

  const abilityTowers = useMemo(
    () => (g ? g.towers.filter((t) => t.stats.ability) : []),
    [g, g?.towers.length, tower?.tiers.join('')],
  );

  const finishTutorial = () => {
    setTut(-1);
    updateProgress({ tutorialDone: true });
  };

  if (!g || !session) return <div class="ui" ref={hostRef} />;

  const diff = DIFFICULTIES[g.difficulty];
  const speed = session.speed;
  return (
    <div class="ui" ref={hostRef}>
      {/* map input layer */}
      <div
        style={{ position: 'absolute', left: 0, top: 0, bottom: 0, right: `${panelW}px` }}
        onPointerDown={(e) => onCanvasDown(e as PointerEvent)}
        data-testid="map"
      />

      <div class="hud">
        <span class="pill">
          <IconHeart />
          {fmt(g.lives)}
        </span>
        <span class="pill">
          <IconCoin />
          {fmt(g.cash)}
        </span>
        <span class="pill round">
          Round {g.round}/{g.freeplay ? '∞' : diff.finalRound}
        </span>
      </div>
      <div class="hud-right" style={{ right: `${panelW + 8}px` }}>
        <button
          class="btn round wood"
          aria-label="Pause"
          onClick={() => {
            playSfx('click');
            setModal('pause');
          }}
        >
          <IconPause />
        </button>
      </div>

      {abilityTowers.length > 0 && <AbilityBar towers={abilityTowers} session={session} />}

      <div class="side wood-bg" style={{ width: `${panelW}px` }}>
        {tower ? (
          <UpgradePanel
            game={g}
            tower={tower}
            onClose={() => setSelected(null)}
            onBuy={(p) => {
              const r = g.upgradeTower(tower.uid, p);
              if (r.ok) {
                playSfx('upgrade');
                haptic('medium');
                if (tutRef.current === 3) finishTutorial();
              } else {
                playSfx('error');
                toast(r.reason ?? 'Cannot upgrade');
              }
              setTick((t) => t + 1);
            }}
            onSell={() => {
              playSfx('sell');
              g.sellTower(tower.uid);
              setSelected(null);
            }}
            onPriority={(pr: TargetPriority) => {
              playSfx('click');
              g.setPriority(tower.uid, pr);
              setTick((t) => t + 1);
            }}
            onAbility={() => g.activateAbility(tower.uid)}
          />
        ) : (
          <Shop game={g} placing={placing?.id ?? null} onGrab={grab} />
        )}
        <div class="go" data-testid="go">
          {placing ? (
            <button
              class="btn red"
              onClick={() => {
                setPlacing(null);
                session.view.setGhost(null);
              }}
            >
              Cancel
            </button>
          ) : (
            <button
              class={`btn round ${g.roundActive ? 'blue' : 'green'}`}
              onClick={goPressed}
              aria-label={g.roundActive ? 'Change speed' : 'Start round'}
              data-testid="go-btn"
            >
              {g.roundActive ? <IconFast n={speed === 3 ? 3 : 2} /> : <IconPlay />}
            </button>
          )}
          {g.roundActive && !placing && (
            <span class="pill" style={{ alignSelf: 'center', fontSize: '0.9em' }}>
              {speed}×
            </span>
          )}
        </div>
      </div>

      {settings.value.showFps && (
        <div class="fps">
          {Math.round(session.fps)} fps · {g.enemies.length} foes · {session.view.quality}
        </div>
      )}

      {toasts.map((t) => (
        <div class="toast" key={t.id}>
          {t.text}
        </div>
      ))}
      {banner && (
        <div class="banner" key={banner.id}>
          {banner.text}
        </div>
      )}

      {tut >= 0 && tut < TUTORIAL.length && <Coach step={tut} panelW={panelW} onSkip={finishTutorial} />}

      {modal === 'pause' && (
        <div class="modal-bg">
          <div class="panel modal">
            <h2>Paused</h2>
            <div class="stack">
              <button class="btn green" onClick={() => setModal(null)}>
                Resume
              </button>
              <button class="btn wood" onClick={() => setModal('settings')}>
                <span style={{ display: 'inline-flex', gap: '0.4em', alignItems: 'center' }}>
                  <IconGear /> Settings
                </span>
              </button>
              <button
                class="btn red"
                onClick={() => {
                  if (g.canSave()) storeGameSave(g.serialize());
                  screen.value = { name: 'menu' };
                }}
              >
                <span style={{ display: 'inline-flex', gap: '0.4em', alignItems: 'center' }}>
                  <IconHome /> Save &amp; quit
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
      {modal === 'settings' && (
        <div class="modal-bg">
          <SettingsPanel onClose={() => setModal('pause')} />
        </div>
      )}
      {modal === 'over' && g.over && (
        <div class="modal-bg">
          <div class="panel modal">
            <h2>{g.over.won ? 'Victory!' : 'Defeat'}</h2>
            {g.over.won && (
              <div style={{ width: '4em', height: '4em', margin: '0 auto', position: 'relative' }}>
                <IconMedal
                  color={
                    g.difficulty === 'easy' ? '#d8a868' : g.difficulty === 'medium' ? '#d9e4ee' : '#ffd36b'
                  }
                />
              </div>
            )}
            <p style={{ fontWeight: 800 }}>
              {g.over.won
                ? `You held ${TOWERS ? '' : ''}the line for all ${diff.finalRound} rounds on ${diff.name}!`
                : `The horde broke through on round ${g.round}.`}
              <br />
              {fmt(g.popCount)} foes popped.
            </p>
            <div class="stack">
              {g.over.won && (
                <button
                  class="btn green"
                  onClick={() => {
                    g.continueFreeplay();
                    setModal(null);
                  }}
                >
                  Continue in Freeplay
                </button>
              )}
              {!g.over.won && (
                <button class="btn green" onClick={() => (screen.value = { name: 'game', map, difficulty })}>
                  Try again
                </button>
              )}
              <button class="btn wood" onClick={() => (screen.value = { name: 'menu' })}>
                Main menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AbilityButton({
  t,
  session,
}: {
  t: NonNullable<ReturnType<GameSession['game']['towerByUid']>>;
  session: GameSession;
}) {
  const g = session.game;
  const ab = t.stats.ability!;
  const upgrade = t.def.paths
    .flatMap((p, pi) => p.upgrades.slice(0, t.tiers[pi]!))
    .reverse()
    .find((u) => u.mods.some((m) => m.kind === 'ability'));
  const art = upgrade?.gear.find((x) => !x.aura)?.art ?? t.def.baseGear[0]?.art ?? '';
  const icon = useImage(() => gearIcon(art, 80), [art]);
  const ready = g.abilityReady(t);
  const p = ready ? 0 : Math.min(100, (t.abilityCd / ab.cooldown) * 100);
  return (
    <button
      class={`ability ${ready ? 'ready' : ''}`}
      title={ab.name}
      onClick={() => {
        if (g.activateAbility(t.uid)) haptic('heavy');
      }}
    >
      {icon && <img src={icon} alt={ab.name} />}
      {!ready && <div class="cd" style={{ '--p': `${p}%` } as never} />}
    </button>
  );
}

function AbilityBar({
  towers,
  session,
}: {
  towers: ReturnType<GameSession['game']['towerByUid']>[];
  session: GameSession;
}) {
  return (
    <div class="abilities">
      {towers.slice(0, 8).map((t) => (t ? <AbilityButton key={t.uid} t={t} session={session} /> : null))}
    </div>
  );
}

function Coach({ step, panelW, onSkip }: { step: number; panelW: number; onSkip: () => void }) {
  const s = TUTORIAL[step]!;
  const style: Record<string, string> =
    s.at === 'shop' || s.at === 'upg'
      ? { right: `${panelW + 12}px`, top: '22%' }
      : s.at === 'go'
        ? { right: `${panelW + 12}px`, bottom: '1.2em' }
        : { left: '30%', top: '16%' };
  return (
    <>
      <div class="panel coach" style={style} dangerouslySetInnerHTML={{ __html: s.text }} />
      <button
        class="btn small wood"
        style={{ position: 'absolute', left: '0.6em', bottom: '0.6em' }}
        onClick={onSkip}
      >
        Skip tutorial
      </button>
    </>
  );
}
