import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

/**
 * Native lifecycle hooks: the Android back button pauses (or goes back) instead of closing the app.
 * Pausing on background is handled through `visibilitychange`, which also fires in Capacitor.
 */
export function initLifecycle(onBack: () => boolean): void {
  if (!Capacitor.isNativePlatform()) return;
  void App.addListener('backButton', () => {
    if (!onBack()) void App.minimizeApp();
  });
}
