# Building everything as an agent

Every step is a CLI command. Steps marked **HUMAN** need the owner's accounts or credentials.

## 1. Web game

```bash
npm ci
npm run lint && npm run typecheck && npm test && npm run sim:balance
npm run build          # dist/
npm run e2e            # Playwright; set PLAYWRIGHT_BROWSERS_PATH if Chromium lives elsewhere
```

## 2. Art

- Code-drawn art needs no pipeline: it is baked at runtime by `src/render/art`.
- AI art: follow `art/prompts.json`. Each entry lists model, prompt, seed and output file, and is generated with the Krea connector. Then run `npm run art:process` to convert `art/source/*.png` into `public/assets/` WebP.
- If Krea is unavailable, delete the asset and the game falls back to code-drawn art automatically.

## 3. Android (debug APK)

```bash
bash scripts/setup-android-sdk.sh   # downloads cmdline-tools, platform, build-tools into ~/android-sdk
npm run android:debug               # builds web, syncs Capacitor, runs Gradle → android/app/build/outputs/apk/debug/app-debug.apk
```

Requirements: JDK 21 and network access to dl.google.com and maven.google.com.

## 4. Release builds

- Android release AAB: `cd android && ./gradlew bundleRelease`. This needs a keystore. **HUMAN**: create and store the keystore and passwords securely, and provide them as CI secrets.
- iOS: `npx cap sync ios`, then build on macOS (GitHub `macos` runner). **HUMAN**: an Apple Developer Program account plus signing certificates and profiles.
- Store listings: **HUMAN**: a Google Play Console account and App Store Connect access.

## 5. Instant phone playtest (claude.ai Artifact)

`npm run build:artifact` builds into `dist-artifact/` with the service worker off. Publish a page that links `assets/index-*.css` and `assets/index-*.js`, and pass every file in `dist-artifact/` as supporting files.

## 6. Performance checks

- `npm run sim:balance` includes a dense late round that must stay under 1.5 ms per sim step (measured: about 0.08 ms with about 300 enemies).
- `node scripts/perf-js.mjs` measures JS time per frame in Chromium, excluding GPU work (measured: 0.6 ms median with 200+ enemies).
- `node scripts/perf-render.mjs` reports FPS under load. Software GL in containers is not representative of phone GPUs.

## 7. CI

`.github/workflows/ci.yml` runs lint, typecheck, unit tests, balance runs, build and e2e. `android.yml` uploads a debug APK artifact.
