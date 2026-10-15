import { describe, expect, it } from 'vitest';
import { BOW_TIMING, sampleAttackClip } from '../../src/render/clip';

describe('sampleAttackClip', () => {
  it('idles when waiting with no wind-up', () => {
    expect(sampleAttackClip(0, 99).phase).toBe('idle');
    expect(sampleAttackClip(-0.5, 99).frame).toBe(0);
    expect(sampleAttackClip(2, 99).phase).toBe('idle');
  });

  it('winds up in the last windup seconds before the shot, frames 0..2', () => {
    const frames = [0.29, 0.15, 0.01].map((r) => sampleAttackClip(r, 99));
    expect(frames.every((f) => f.phase === 'windup')).toBe(true);
    expect(frames.map((f) => f.frame)).toEqual([0, 1, 2]);
    expect(frames[2]!.draw).toBeGreaterThan(0.9);
  });

  it('shows the release frame exactly when the sim fires', () => {
    const s = sampleAttackClip(0.95, 0);
    expect(s.phase).toBe('release');
    expect(s.frame).toBe(3);
  });

  it('plays follow-through then recovery, then returns to idle', () => {
    const { release, follow, recover } = BOW_TIMING;
    expect(sampleAttackClip(0.9, release + 0.01).frame).toBe(4);
    expect(sampleAttackClip(0.9, release + follow + 0.01).frame).toBe(5);
    expect(sampleAttackClip(0.9, release + follow + recover + 0.01).phase).toBe('idle');
  });

  it('post-shot frames win over a wind-up for very fast attackers', () => {
    expect(sampleAttackClip(0.1, 0.1).phase).toBe('follow');
  });
});
