import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { settings } from '../ui/store';

/** Short haptic tap: native Taptic/vibration in the app, navigator.vibrate on the web. */
export function haptic(kind: 'light' | 'medium' | 'heavy' = 'light'): void {
  if (!settings.value.haptics) return;
  if (Capacitor.isNativePlatform()) {
    const style =
      kind === 'light' ? ImpactStyle.Light : kind === 'medium' ? ImpactStyle.Medium : ImpactStyle.Heavy;
    void Haptics.impact({ style }).catch(() => undefined);
    return;
  }
  try {
    navigator.vibrate?.(kind === 'light' ? 8 : kind === 'medium' ? 18 : 35);
  } catch {
    /* unsupported */
  }
}
