"""Fills src/lib/site/i18n/<lang>.json for every key in strings.json that is missing.
Uses the Lovable AI Gateway (LOVABLE_API_KEY in the sandbox). Existing entries are kept,
so hand corrections by native speakers survive re-runs.
Usage: python3 scripts/i18n/translate.py [yo ha ig pcm]
"""
import json, os, re, sys, time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import requests

ROOT = Path(__file__).resolve().parents[2]
DIR = ROOT / "src/lib/site/i18n"
MODEL = "openai/gpt-6-astra"
URL = "https://ai.gateway.lovable.dev/v1/chat/completions"

LANGS = {
    "yo": "Standard Yoruba (Yorùbá) with full, correct tone marks and under-dots (ẹ, ọ, ṣ), precomposed Unicode where possible",
    "ha": "Standard Nigerian Hausa in Boko Latin script with the hooked letters ɓ, ɗ, ƙ and ʼy where the spelling requires them",
    "ig": "Standard Igbo (Igbo Izugbe) with the dotted vowels ị, ọ, ụ and ṅ as required",
    "pcm": "Nigerian Pidgin (Naijá) as written by BBC News Pidgin: clear, respectful, public-service register, not slang or comedic",
}

SYSTEM = """You translate the public website of LAWMA (Lagos Waste Management Authority, Lagos State Government) from English into {lang}.
Tone: formal, warm, plain-spoken government public service; it must read as if written by a native-speaking communications officer, not as a literal translation.
Rules:
- Keep unchanged: LAWMA, SmartWaste360, PSP, Lagos State Government agency names, people's names and titles of honour (Dr., Engr., Mr., Mrs.), place and LGA names, street addresses, phone numbers, email addresses, URLs, reference codes, numbers, years and units.
- Lagos as a place may use the usual native name where natural (e.g. Èkó in Yoruba), but keep "Lagos" inside official names.
- Each item may be a fragment of a longer sentence; the context shows the full sentence. Translate only the fragment so that the fragments, joined in their original order, read naturally. Keep leading/trailing punctuation behaviour similar.
- Short UI labels (buttons, menu items) stay short. Keep Title Case only where English uses it for a label.
- Never add explanations, quotes or notes. Never leave English words where a common native term exists; well-established loanwords (e.g. "recycling" equivalents) are acceptable when no natural native term exists.
Use this glossary consistently:
{glossary}"""

def call(messages, schema):
    body = {"model": MODEL, "messages": messages, "reasoning_effort": "medium",
            "response_format": {"type": "json_schema", "json_schema": {"name": "out", "strict": True, "schema": schema}}}
    for attempt in range(5):
        r = requests.post(URL, json=body, headers={"Authorization": f"Bearer {os.environ['LOVABLE_API_KEY']}"}, timeout=300)
        if r.status_code in (429,) or r.status_code >= 500:
            time.sleep(5 * (attempt + 1)); continue
        r.raise_for_status()
        return json.loads(r.json()["choices"][0]["message"]["content"])
    raise RuntimeError(f"gateway failed: {r.status_code} {r.text[:200]}")

ITEMS = {"type": "object", "additionalProperties": False, "required": ["items"], "properties": {"items": {"type": "array", "items": {
    "type": "object", "additionalProperties": False, "required": ["id", "text"], "properties": {"id": {"type": "integer"}, "text": {"type": "string"}}}}}}

TERMS = ["waste", "waste collection", "illegal dumping", "report", "recycling", "disposal site", "landfill", "transfer loading station",
         "Private Sector Participation (PSP) operator", "resident", "district", "service", "bin", "street sweeping", "clean Lagos",
         "Managing Director / Chief Executive Officer", "principal officers", "departments and units", "achievements and awards",
         "newsroom", "contact us", "accessibility", "font size", "line height", "contrast", "Continue", "Back", "Send report", "Home", "About", "Services", "Residents"]

def glossary(lang):
    p = DIR / f"glossary.{lang}.json"
    if p.exists(): return json.loads(p.read_text())
    out = call([{"role": "system", "content": SYSTEM.format(lang=LANGS[lang], glossary="(none yet)")},
                {"role": "user", "content": "Give the best formal term for each of these items: " + json.dumps(list(enumerate(TERMS)))}], ITEMS)
    g = {TERMS[i["id"]]: i["text"] for i in out["items"] if 0 <= i["id"] < len(TERMS)}
    p.write_text(json.dumps(g, ensure_ascii=False, indent=1)); return g

def nums(s): return sorted(re.findall(r"\d+", s))

def run(lang):
    strings = json.loads((DIR / "strings.json").read_text())
    path = DIR / f"{lang}.json"
    have = json.loads(path.read_text()) if path.exists() else {}
    have = {k: v for k, v in have.items() if k in strings}
    todo = [k for k in strings if k not in have]
    g = "\n".join(f"- {k} = {v}" for k, v in glossary(lang).items())
    sys_msg = SYSTEM.format(lang=LANGS[lang], glossary=g)
    batches = [todo[i:i + 40] for i in range(0, len(todo), 40)]
    def one(batch):
        items = [{"id": i, "text": k, "context": strings[k] if strings[k] != k else ""} for i, k in enumerate(batch)]
        out = call([{"role": "system", "content": sys_msg}, {"role": "user", "content": json.dumps(items, ensure_ascii=False)}], ITEMS)
        res = {}
        for it in out["items"]:
            if 0 <= it["id"] < len(batch):
                src, t = batch[it["id"]], it["text"].strip()
                if t and nums(t) == nums(src): res[src] = t
        return res
    with ThreadPoolExecutor(4) as ex:
        for res in ex.map(one, batches):
            have.update(res)
            path.write_text(json.dumps(dict(sorted(have.items())), ensure_ascii=False, indent=1))
    print(lang, len(have), "/", len(strings), flush=True)

if __name__ == "__main__":
    langs = sys.argv[1:] or list(LANGS)
    for _ in range(2):  # second pass retries anything rejected by the checks
        with ThreadPoolExecutor(len(langs)) as ex: list(ex.map(run, langs))
