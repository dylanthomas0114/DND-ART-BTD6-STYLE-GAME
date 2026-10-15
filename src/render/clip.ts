/**
 * Pure animation timing for painted tower clips. No Pixi imports, so it is unit-testable.
 *
 * The sim owns damage timing. These helpers only *read* sim state (seconds until the next
 * shot, seconds since the last shot) and pick a frame, so pausing or changing game speed can
 * never desync the animation from the shot.
 */
export interface AttackTiming {
  /** Seconds of anticipation shown before the shot. */
  windup: number;
  /** Seconds the release frame is held after the shot. */
  release: number;
  /** Seconds of follow-through after the release frame. */
  follow: number;
  /** Seconds of recovery back to the ready pose. */
  recover: number;
}

export const BOW_TIMING: AttackTiming = { windup: 0.3, release: 0.06, follow: 0.14, recover: 0.12 };

export type ClipPhase = 'idle' | 'windup' | 'release' | 'follow' | 'recover';

export interface ClipSample {
  /** Frame index in the 6-frame attack strip: 0 ready, 1 anticipate, 2 full draw, 3 release, 4 follow, 5 recover. */
  frame: number;
  phase: ClipPhase;
  /** 0..1 how far the string is drawn (windup progress, 1 at release, then falling). */
  draw: number;
}

export function sampleAttackClip(readyIn: number, since: number, t: AttackTiming = BOW_TIMING): ClipSample {
  const afterRelease = since - t.release;
  if (since >= 0 && since < t.release) return { frame: 3, phase: 'release', draw: 1 };
  if (afterRelease >= 0 && afterRelease < t.follow) {
    return { frame: 4, phase: 'follow', draw: 1 - 0.7 * (afterRelease / t.follow) };
  }
  const afterFollow = afterRelease - t.follow;
  if (afterFollow >= 0 && afterFollow < t.recover) {
    return { frame: 5, phase: 'recover', draw: 0.3 * (1 - afterFollow / t.recover) };
  }
  // A tower that is simply waiting for a target has readyIn <= 0: no wind-up.
  if (readyIn > 0 && readyIn <= t.windup) {
    const p = 1 - readyIn / t.windup;
    return { frame: Math.min(2, Math.floor(p * 3)), phase: 'windup', draw: p };
  }
  return { frame: 0, phase: 'idle', draw: 0 };
}
