import { describe, expect, it } from "vitest";

import strings from "@/lib/site/i18n/strings.json";
import ha from "@/lib/site/i18n/ha.json";
import ig from "@/lib/site/i18n/ig.json";
import pcm from "@/lib/site/i18n/pcm.json";
import yo from "@/lib/site/i18n/yo.json";
import { A11Y_BOOT_SCRIPT, A11Y_KEY, DEFAULT_A11Y, applyA11y, fontLabel, hideUntil, isHidden, nextAlign, stepFont } from "@/lib/site/a11y";
import { LANGS, translateText } from "@/lib/site/i18n";

const DICTS: Record<string, Record<string, string>> = { yo, ha, ig, pcm };

describe("languages", () => {
  it("offers English, Yoruba, Hausa, Igbo and Pidgin", () => {
    expect(LANGS.map((l) => l.code)).toEqual(["en", "yo", "ha", "ig", "pcm"]);
  });

  for (const [code, dict] of Object.entries(DICTS)) {
    it(`${code} covers every website string`, () => {
      const missing = Object.keys(strings).filter((k) => !dict[k]?.trim());
      expect(missing).toEqual([]);
    });
    it(`${code} keeps every number from the English`, () => {
      const nums = (s: string) => (s.match(/\d+/g) ?? []).sort().join(",");
      const bad = Object.entries(dict).filter(([k, v]) => nums(k) !== nums(v));
      expect(bad).toEqual([]);
    });
  }

  it("keeps the surrounding spaces of a fragment", () => {
    expect(translateText("  Continue ", { Continue: "Tẹ̀síwájú" })).toBe("  Tẹ̀síwájú ");
    expect(translateText("617", { "617": "x" })).toBe("617");
  });
});

describe("accessibility settings", () => {
  it("font size moves 10% per press, between 80% and 150%", () => {
    expect(fontLabel(stepFont(0, 1))).toBe("110%");
    expect(stepFont(5, 1)).toBe(5);
    expect(stepFont(-2, -1)).toBe(-2);
  });

  it("align cycles left, centre, right, then back to default", () => {
    expect([nextAlign("default"), nextAlign("left"), nextAlign("center"), nextAlign("right")]).toEqual(["left", "center", "right", "default"]);
  });

  it("hiding lasts 24 hours or a week; session hiding has no end time", () => {
    const now = 1_000_000;
    expect(hideUntil("day", now)).toBe(now + 86_400_000);
    expect(hideUntil("week", now)).toBe(now + 7 * 86_400_000);
    expect(hideUntil("session", now)).toBeNull();
    expect(isHidden(String(now + 1), null, now)).toBe(true);
    expect(isHidden(String(now - 1), null, now)).toBe(false);
  });

  it("early-paint script applies the same attributes as the panel", () => {
    const s = { ...DEFAULT_A11Y, fontSize: 2, lineHeight: 1, bigCursor: true, align: "center" as const, contrast: "mono" as const };
    const a = document.createElement("html");
    applyA11y(a, s);
    localStorage.setItem(A11Y_KEY, JSON.stringify(s));
    const root = document.documentElement;
    new Function(A11Y_BOOT_SCRIPT)();
    for (const name of a.getAttributeNames()) if (name !== "style") expect(root.getAttribute(name)).toBe(a.getAttribute(name));
    expect(root.style.fontSize).toBe("120%");
  });
});
