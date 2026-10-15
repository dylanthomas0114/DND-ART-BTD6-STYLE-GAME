# Generating the AI art (agent runbook)

Every asset is optional. If a file is missing, the game uses its code-drawn art.

1. Start the dev server: `npx vite --port 5173`.
2. Export the layout guides: `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium node scripts/export-guides.mjs` (writes `art/guides/*.png`).
3. Call Krea `get_upload_url` and POST each guide: `curl -X POST "$URL" -F file=@art/guides/glade.png`.
4. For each entry in `art/prompts.json`, call Krea `generate_image` with its `model` and with `prompt`, `aspect_ratio`, `resolution`, `background` (if set) and `image_urls: [<uploaded guide URL>]` (maps only).
5. Poll `get_job` until the job completes, then download the result URL to the entry's `source` path.
6. Run `npm run art:process`, review the result in-game (`?demo=glade`), and commit `public/assets/**` (plus `art/source/**` if size allows).

Stop-loss: about 15 generations in total. On an error or a poor style match, keep the fallback. Never retry blindly.
