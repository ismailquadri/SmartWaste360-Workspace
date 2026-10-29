"""Re-translates two-part headings (plain part + coloured part) together so they read as one phrase.
Usage: python3 scripts/i18n/pairs.py   (run after translate.py)"""
import json, sys
from concurrent.futures import ThreadPoolExecutor
sys.path.insert(0, __file__.rsplit("/", 1)[0])
from translate import DIR, LANGS, SYSTEM, call, glossary
S = json.loads((DIR / "strings.json").read_text())
pairs = []
for a, ctx in S.items():
    if ctx == a or not ctx.startswith(a + " "): continue
    b = ctx[len(a) + 1:]
    if b in S and S[b] == ctx: pairs.append((a, b))
SCHEMA = {"type": "object", "additionalProperties": False, "required": ["items"], "properties": {"items": {"type": "array", "items": {
    "type": "object", "additionalProperties": False, "required": ["id", "first", "second"],
    "properties": {"id": {"type": "integer"}, "first": {"type": "string"}, "second": {"type": "string"}}}}}}
def run(lang):
    d = json.loads((DIR / f"{lang}.json").read_text())
    g = "\n".join(f"- {k} = {v}" for k, v in glossary(lang).items())
    msg = ("Each item is a two-part heading shown as one phrase; the second part is shown in a highlight colour. "
           "Translate the whole phrase naturally, then split it into first and second so that first + ' ' + second is the full natural translation. "
           "Neither part may be empty and words must not repeat across the parts.\n" +
           json.dumps([{"id": i, "first": a, "second": b} for i, (a, b) in enumerate(pairs)], ensure_ascii=False))
    out = call([{"role": "system", "content": SYSTEM.format(lang=LANGS[lang], glossary=g)}, {"role": "user", "content": msg}], SCHEMA)
    for it in out["items"]:
        if 0 <= it["id"] < len(pairs) and it["first"].strip() and it["second"].strip():
            a, b = pairs[it["id"]]; d[a] = it["first"].strip(); d[b] = it["second"].strip()
    (DIR / f"{lang}.json").write_text(json.dumps(dict(sorted(d.items())), ensure_ascii=False, indent=1))
    print(lang, len(pairs), "pairs")
with ThreadPoolExecutor(4) as ex: list(ex.map(run, list(LANGS)))
