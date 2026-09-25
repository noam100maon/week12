#!/usr/bin/env bash
# Builds holdout.html: the whole game (code, three.js, CSS, model) in one file that opens without a server.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
D="$ROOT/docs"
TMP="$(mktemp -d)"
npx --yes esbuild@0.24 "$D/js/main.js" --bundle --format=esm --minify \
  --alias:three="$D/vendor/three.module.js" --alias:three/addons="$D/vendor/jsm" --outfile="$TMP/game.js" --log-level=warning
python3 - "$D" "$TMP/game.js" "$ROOT/holdout.html" <<'PY'
import base64, re, sys
D, js_path, out = sys.argv[1] + '/', sys.argv[2], sys.argv[3]
js = open(js_path).read().replace('</script', '<\\/script')
glb = base64.b64encode(open(D + 'models/RobotExpressive.glb', 'rb').read()).decode()
icon = base64.b64encode(open(D + 'icon-192.png', 'rb').read()).decode()
html = open(D + 'index.html').read()
html = re.sub(r'<link rel="manifest"[^>]*>\n', '', html)
html = re.sub(r'<link rel="(icon|apple-touch-icon)"[^>]*>', lambda m: f'<link rel="{m.group(1)}" href="data:image/png;base64,{icon}">', html)
html = html.replace('<link rel="stylesheet" href="style.css">', '<style>\n' + open(D + 'style.css').read() + '\n</style>')
html = re.sub(r'<script type="importmap">.*?</script>\n', '', html, flags=re.S)
html = html.replace('<script type="module" src="js/main.js"></script>',
                    '<script>window.__EMBED_GLB = "' + glb + '";</script>\n<script type="module">\n' + js + '\n</script>')
open(out, 'w').write(html)
PY
rm -rf "$TMP"
echo "wrote $ROOT/holdout.html"
