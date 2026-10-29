"""Build the standalone LAWMA 360 operations dashboard into public/dashboard.html.

Run from anywhere:  python3 lawma/build_dashboard.py
Sources live in lawma/work. The Open Scouts design layer (work/scouts-theme.css)
is injected last so it restyles every module without changing behaviour.
"""
from pathlib import Path
import base64
import sys

ROOT = Path(__file__).resolve().parent
WORK = ROOT / "work"
OUT = ROOT.parent / "public" / "dashboard.html"
SKIP_THEME = "--no-theme" in sys.argv

FONT_LINKS = (
    '<link rel="preconnect" href="https://fonts.googleapis.com">'
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;450;500;600&family=Geist+Mono:wght@400;500&display=swap">'
)


def read(rel: str) -> str:
    return (ROOT / rel).read_text()


s = read("work/dashboard-v3.html")
parts = {
    "/*ICONLIB*/": read("work/illustrations/smartwaste-icons.js"),
    "/*MAPCSS*/": read("outputs/dashboard-assets/maplibre-gl.css"),
    "/*APPCSS*/": read("work/dashboard-v3.css"),
    "/*MAPJS*/": read("outputs/dashboard-assets/maplibre-gl.js"),
    "/*APPJS*/": read("work/dashboard-v3.js"),
    "/*ROUTES*/": read("work/routes.json"),
    "/*LOGO*/": "data:image/jpeg;base64,"
    + base64.b64encode((ROOT / "outputs/lawma-logo.jpg").read_bytes()).decode(),
    "/*JOURNEYCSS*/": read("work/journeys.css"),
    "/*JOURNEYJS*/": read("work/journeys.js"),
    "/*POLISHCSS*/": read("work/polish.css"),
    "/*POLISHJS*/": read("work/polish.js"),
    "/*MODULECSS*/": read("work/modules.css"),
    "/*MODULEDATA*/": read("work/module-data.js"),
    "/*MODULEJS*/": read("work/modules.js"),
    "/*SIMULATIONJS*/": read("work/simulation.js"),
    "/*SIMULATIONCSS*/": read("work/simulation.css"),
    "/*MOBILEJS*/": read("work/mobile-app.js"),
    "/*MOBILECSS*/": read("work/mobile-app.css"),
    "/*PRESENTATIONCSS*/": read("work/presentation.css"),
    "/*PRESENTATIONJS*/": read("work/presentation.js"),
    "/*TLSJS*/": read("work/tls.js"),
    "/*TLSENTRYJS*/": read("work/tls-entry.js"),
    "/*TLSLIFECYCLEJS*/": read("work/tls-lifecycle.js"),
    "/*TLSCSS*/": read("work/tls.css") + read("work/experience.css"),
    "/*EXPERIENCEJS*/": read("work/experience.js"),
    "/*HUBJS*/": read("work/hub.js"),
}
for key, name, mime in [
    ("PRODUCTLOGO", "smartwaste360.svg", "image/svg+xml"),
    ("PRODUCTLOGODARK", "smartwaste360-dark.svg", "image/svg+xml"),
    ("FLEETPHOTO", "lawma-fleet.jpg", "image/jpeg"),
    ("PRODUCTMOCKUP", "mobile-preview.png", "image/png"),
    ("PRODUCTVIDEO", "product-tour.mp4", "video/mp4"),
    ("PRODUCTCAPTIONS", "product-tour.vtt", "text/vtt"),
]:
    p = ROOT / "outputs/presentation-assets" / name
    parts["/*" + key + "*/"] = (
        "data:" + mime + ";base64," + base64.b64encode(p.read_bytes()).decode() if p.exists() else ""
    )

# Public-report photos are inlined as one JSON map read by hub.js.
import json
parts["/*HUBPHOTOS*/"] = json.dumps({
    n: "data:image/jpeg;base64," + base64.b64encode((ROOT / "outputs/report-photos" / (n + ".jpg")).read_bytes()).decode()
    for n in ["dump", "drain", "bin", "cleared"]
})

for k, v in parts.items():
    s = s.replace(k, v)

if not SKIP_THEME:
    theme = read("work/scouts-theme.css")
    # The story film plays /presentation-assets/release-film/final.mp4 from public/.
    # Until that file is supplied, hide its trigger instead of opening an empty player.
    if not (ROOT.parent / "public/presentation-assets/release-film/final.mp4").exists():
        theme += "\n#playProductTour{display:none!important}\n"
    # Fonts load via <link>; the theme stylesheet is the final cascade layer.
    s = s.replace("</head>", FONT_LINKS + "<style id=\"scouts-theme\">" + theme + "</style></head>", 1)

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(s)
print("Built", OUT.relative_to(ROOT.parent), f"({len(s):,} characters, theme={'off' if SKIP_THEME else 'on'})")
