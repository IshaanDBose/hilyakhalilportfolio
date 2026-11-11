"""Side-by-side comparison of the local site against the reference screenshots.

Usage:
  python3 tools/serve.py &                         # start the preview server
  python3 tools/compare.py [page ...] [--width W]  # e.g. compare.py about --width 390

Writes tools/out/compare/<page>-<width>.png  (left: reference/live Framer, right: local).
With no pages given it compares all pages at all widths.
"""
import argparse, os, subprocess, sys
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = ['home', 'about', 'sales-rules-v2', 'mp-v2', 'srx', 'healthian']
WIDTHS = [1440, 1100, 390]

p = argparse.ArgumentParser()
p.add_argument('pages', nargs='*', default=PAGES)
p.add_argument('--width', type=int, action='append')
p.add_argument('--base', default='http://localhost:8080')
a = p.parse_args()
widths = a.width or WIDTHS

local = os.path.join(ROOT, 'tools/out/local')
out = os.path.join(ROOT, 'tools/out/compare')
os.makedirs(out, exist_ok=True)
subprocess.run(['node', os.path.join(ROOT, 'tools/screenshot.js'), a.base, local,
                '--pages', ','.join(a.pages), '--widths', ','.join(map(str, widths))], check=True)

for page in a.pages:
    for w in widths:
        ref_path = os.path.join(ROOT, 'reference', f'{page}-{w}.webp')
        if not os.path.exists(ref_path):
            ref_path = ref_path[:-5] + '.png'
        ref = Image.open(ref_path).convert('RGB')
        loc = Image.open(os.path.join(local, f'{page}-{w}.png')).convert('RGB')
        gap = 40
        img = Image.new('RGB', (ref.width + loc.width + gap, max(ref.height, loc.height) + 30), 'white')
        img.paste(ref, (0, 30)); img.paste(loc, (ref.width + gap, 30))
        d = ImageDraw.Draw(img)
        d.text((10, 8), f'REFERENCE {ref.height}px tall', fill='red')
        d.text((ref.width + gap + 10, 8), f'LOCAL {loc.height}px tall', fill='red')
        d.line([(ref.width + gap // 2, 0), (ref.width + gap // 2, img.height)], fill='red', width=2)
        path = os.path.join(out, f'{page}-{w}.png'); img.save(path)
        print(path, f'height ref={ref.height} local={loc.height}')
