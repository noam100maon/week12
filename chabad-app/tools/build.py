"""Build single-file versions of the app.

  python3 tools/build.py            -> ../chabad-path.html (full standalone page)
  python3 tools/build.py --artifact OUT.html
                                    -> page fragment for claude.ai Artifacts
                                       (no doctype/html/head/body; the host wraps it)
"""
import base64, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
read = lambda p: open(os.path.join(ROOT, p), encoding="utf-8").read()

def inline(html):
    html = html.replace('<link rel="stylesheet" href="css/style.css">', "<style>\n" + read("css/style.css") + "\n</style>")
    html = re.sub(r'<script src="([^"]+)"></script>',
                  lambda m: "<script>\n" + read(m.group(1)).replace("</script", "<\\/script") + "\n</script>", html)
    html = html.replace('<link rel="manifest" href="manifest.webmanifest">', "")
    svg = base64.b64encode(read("icons/icon.svg").encode()).decode()
    png = base64.b64encode(open(os.path.join(ROOT, "icons/icon-192.png"), "rb").read()).decode()
    html = html.replace('href="icons/icon.svg"', f'href="data:image/svg+xml;base64,{svg}"')
    html = html.replace('href="icons/icon-192.png"', f'href="data:image/png;base64,{png}"')
    assert 'src="data/' not in html and "css/style.css" not in html
    return html

def artifact(html):
    head = re.search(r"<head>(.*?)</head>", html, re.S).group(1)
    body = re.search(r"<body>(.*?)</body>", html, re.S).group(1)
    title = re.search(r"<title>.*?</title>", head, re.S).group(0)
    keep = "\n".join(l for l in head.splitlines()
                     if ("fonts.g" in l or "<style" in l) and "charset" not in l and "viewport" not in l)
    style = re.search(r"<style>.*?</style>", head, re.S).group(0)
    # The Artifact host pads :root by the safe-area insets, so the sticky bar
    # sits at the inset instead of adding it to its own padding.
    fix = "<style>.topbar{top:env(safe-area-inset-top,0px);padding-top:4px}</style>"
    fonts = "\n".join(l for l in keep.splitlines() if "fonts.g" in l)
    return f"{title}\n{fonts}\n{style}\n{fix}\n{body}"

if __name__ == "__main__":
    html = inline(read("index.html"))
    if len(sys.argv) > 2 and sys.argv[1] == "--artifact":
        open(sys.argv[2], "w", encoding="utf-8").write(artifact(html))
        print("wrote", sys.argv[2])
    else:
        out = os.path.join(os.path.dirname(ROOT), "chabad-path.html")
        open(out, "w", encoding="utf-8").write(html)
        print("wrote", out)
