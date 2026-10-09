import { Application } from 'pixi.js';

/** Creates the Pixi application filling `host`. */
export async function createPixiApp(host: HTMLElement, background = 0x1b1410): Promise<Application> {
  const app = new Application();
  await app.init({
    resizeTo: host,
    background,
    antialias: true,
    autoDensity: true,
    resolution: Math.min(window.devicePixelRatio || 1, 2),
    preference: 'webgl',
    powerPreference: 'high-performance',
  });
  host.appendChild(app.canvas);
  return app;
}
