#!/usr/bin/env python3
"""Calls a Gradio Space's text-to-image endpoint over HTTP (no connector needed).
Usage: hf-gen.py <space-host> <out.png> <prompt> [aspect=16:9] [steps=16] [seed]"""
import json, sys, urllib.request, time

host, out, prompt = sys.argv[1:4]
aspect = sys.argv[4] if len(sys.argv) > 4 else "16:9"
steps = int(sys.argv[5]) if len(sys.argv) > 5 else 16
seed = int(sys.argv[6]) if len(sys.argv) > 6 else 0
neg = "text, watermark, blurry, low resolution, ground shadow, grass, ground"
body = json.dumps({"data": [prompt, seed, seed == 0, aspect, neg, 4.0, steps]}).encode()
req = urllib.request.Request(f"https://{host}/gradio_api/call/generate_image", body, {"Content-Type": "application/json"})
eid = json.load(urllib.request.urlopen(req, timeout=60))["event_id"]
stream = urllib.request.urlopen(f"https://{host}/gradio_api/call/generate_image/{eid}", timeout=300)
event = data = None
for raw in stream:
    line = raw.decode().strip()
    if line.startswith("event:"):
        event = line[6:].strip()
    elif line.startswith("data:"):
        data = line[5:].strip()
        if event in ("complete", "error"):
            break
if event != "complete":
    sys.exit(f"failed: {event} {data}")
img = json.loads(data)[0]
urllib.request.urlretrieve(img["url"], out)
print(out, json.loads(data)[1])
