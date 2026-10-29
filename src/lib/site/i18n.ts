/**
 * Website languages. English is the source text; the other four are pre-translated
 * dictionaries (src/lib/site/i18n/<code>.json) keyed by the normalised English string,
 * so switching is instant and never depends on a live translation call.
 * Regenerate with scripts/i18n/extract.py then scripts/i18n/translate.py.
 */
import { useSyncExternalStore } from "react";

import { LANG_KEY } from "./a11y";

export type Lang = "en" | "yo" | "ha" | "ig" | "pcm";
export type Dict = Record<string, string>;

export const LANGS: { code: Lang; name: string; english: string; badge: string }[] = [
  { code: "en", name: "English", english: "English", badge: "EN" },
  { code: "yo", name: "Yorùbá", english: "Yoruba", badge: "YO" },
  { code: "ha", name: "Hausa", english: "Hausa", badge: "HA" },
  { code: "ig", name: "Igbo", english: "Igbo", badge: "IG" },
  { code: "pcm", name: "Naijá Pidgin", english: "Nigerian Pidgin", badge: "PCM" },
];

export function isLang(v: unknown): v is Lang {
  return LANGS.some((l) => l.code === v);
}

/** Dictionary key for a piece of English text: whitespace collapsed and trimmed. */
export function normalizeKey(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

/** Only text with letters is worth translating (skips numbers, phone lines, punctuation). */
export function hasWords(key: string) {
  return /[A-Za-z]{2,}/.test(key);
}

/** Translates one string, keeping the original's leading and trailing whitespace. */
export function translateText(src: string, dict: Dict | null) {
  if (!dict) return src;
  const key = normalizeKey(src);
  if (!key || !hasWords(key)) return src;
  const out = dict[key];
  if (!out) return src;
  const lead = /^\s*/.exec(src)![0];
  const trail = /\s*$/.exec(src)![0];
  return lead + out + trail;
}

const loaders: Record<Exclude<Lang, "en">, () => Promise<{ default: Dict }>> = {
  yo: () => import("./i18n/yo.json"),
  ha: () => import("./i18n/ha.json"),
  ig: () => import("./i18n/ig.json"),
  pcm: () => import("./i18n/pcm.json"),
};

const cache = new Map<Lang, Dict>();
export async function loadDict(lang: Lang): Promise<Dict | null> {
  if (lang === "en") return null;
  const hit = cache.get(lang);
  if (hit) return hit;
  const mod = await loaders[lang]();
  cache.set(lang, mod.default);
  return mod.default;
}

/* ---------- Store shared by the translator and React components ---------- */

type State = { lang: Lang; dict: Dict | null };
let state: State = { lang: "en", dict: null };
const listeners = new Set<() => void>();

export const i18nStore = {
  get: () => state,
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  async setLang(lang: Lang) {
    const dict = await loadDict(lang);
    state = { lang, dict };
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      /* storage blocked: still switch for this visit */
    }
    listeners.forEach((l) => l());
  },
};

export function savedLang(): Lang {
  try {
    const v = localStorage.getItem(LANG_KEY);
    return isLang(v) ? v : "en";
  } catch {
    return "en";
  }
}

const serverState: State = { lang: "en", dict: null };
export function useI18n() {
  return useSyncExternalStore(i18nStore.subscribe, i18nStore.get, () => serverState);
}

/** For components that split text themselves (e.g. word-by-word reveals). */
export function useTr() {
  const { dict } = useI18n();
  return (text: string) => translateText(text, dict);
}
