"""Collects every visible English string on the website (text nodes + placeholder/aria-label/alt/title)
into src/lib/site/i18n/strings.json as {key: context}. Run with the dev server on :8080.
Usage: python3 scripts/i18n/extract.py
"""
import asyncio, json, re
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "src/lib/site/i18n/strings.json"
BASE = "http://localhost:8080"
ids = re.findall(r'id: "([a-z-]+)"', (ROOT / "src/lib/site/content.ts").read_text())
ROUTES = ["/", "/about", "/about/principal-officers", "/about/departments", "/about/awards", "/about/md-ceo",
          "/about/past-md-ceos", "/services", "/smartwaste360", "/newsroom", "/contact", "/report"] + [f"/services/{i}" for i in ids]

COLLECT = r"""() => {
  const SKIP = "script,style,noscript,textarea,code,pre,[data-no-translate],[translate='no']";
  const norm = s => s.replace(/\s+/g, " ").trim();
  const ok = k => /[A-Za-z]{2,}/.test(k);
  const out = {};
  const ctx = el => { const b = el.closest("p,h1,h2,h3,h4,h5,li,a,button,label,dd,dt,td,th,figcaption,blockquote,option,legend") || el; return norm(b.textContent || "").slice(0, 260); };
  const tw = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
  for (let n = tw.nextNode(); n; n = tw.nextNode()) {
    const p = n.parentElement; if (!p || p.closest(SKIP)) continue;
    const k = norm(n.nodeValue || ""); if (!ok(k)) continue;
    out[k] = out[k] || ctx(p);
  }
  document.querySelectorAll("[placeholder],[aria-label],[alt],[title]").forEach(e => {
    if (e.closest(SKIP)) return;
    for (const a of ["placeholder","aria-label","alt","title"]) { const v = e.getAttribute(a); if (v) { const k = norm(v); if (ok(k)) out[k] = out[k] || `(${a} attribute)`; } }
  });
  return out;
}"""

async def main():
    found = {}
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        for vp in [{"width": 1440, "height": 1000}, {"width": 390, "height": 844}]:
            pg = await (await b.new_context(viewport=vp)).new_page()
            for r in ROUTES:
                await pg.goto(BASE + r, wait_until="networkidle")
                await pg.wait_for_timeout(600)
                for k, v in (await pg.evaluate(COLLECT)).items(): found.setdefault(k, v)
                if r == "/" :
                    btn = pg.get_by_label("Open accessibility adjustments")
                    await btn.evaluate("e=>e.click()"); await pg.wait_for_timeout(300)
                    for k, v in (await pg.evaluate(COLLECT)).items(): found.setdefault(k, v)
                    await pg.get_by_role("button", name="Hide Toolbar").first.evaluate("e=>e.click()"); await pg.wait_for_timeout(200)
                    for k, v in (await pg.evaluate(COLLECT)).items(): found.setdefault(k, v)
                    await pg.keyboard.press("Escape")
                if vp["width"] < 500:
                    m = pg.get_by_label("Open menu")
                    if await m.count():
                        await m.evaluate("e=>e.click()")
                        for g in await pg.locator("#site-menu button[aria-expanded]").all():
                            await g.evaluate("e=>e.click()"); await pg.wait_for_timeout(100)
                            for k, v in (await pg.evaluate(COLLECT)).items(): found.setdefault(k, v)
                if r == "/report":
                    for _ in range(4):
                        c = pg.get_by_role("button", name=re.compile("Continue|Send report"))
                        if not await c.count(): break
                        await c.first.evaluate("e=>e.click()"); await pg.wait_for_timeout(300)
                        for k, v in (await pg.evaluate(COLLECT)).items(): found.setdefault(k, v)
        await b.close()
    # Strings from the report form's later steps and messages.
    for f in ["src/components/site/ReportFlow.tsx", "src/lib/site/report.ts"]:
        src = (ROOT / f).read_text()
        for m in re.findall(r'"([A-Z][^"{}<>]{3,200})"|>\s*([A-Z][^<>{}]{3,200}?)\s*<', src):
            s = re.sub(r"\s+", " ", m[0] or m[1]).strip()
            if " " in s and re.search(r"[a-z]{2}", s) and not re.search(r"[:=]|\b(flex|grid|rounded|text-|bg-)", s):
                found.setdefault(s, "(report form)")
    OUT.write_text(json.dumps(dict(sorted(found.items())), ensure_ascii=False, indent=1))
    print(len(found), "strings")

asyncio.run(main())
