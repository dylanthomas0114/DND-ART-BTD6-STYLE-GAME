import { settings } from '../ui/store';

/** Short vibration on supported devices (no-op elsewhere or when disabled in settings). */
export function haptic(kind: 'light' | 'medium' | 'heavy' = 'light'): void {
  if (!settings.value.haptics) return;
  const ms = kind === 'light' ? 8 : kind === 'medium' ? 18 : 35;
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* unsupported */
  }
}
