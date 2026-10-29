/**
 * Swaps the page's visible English for the chosen language in place, text node by text
 * node, and keeps doing so as React renders new content. React keeps ownership of every
 * node: when it writes new English, the observer sees it and translates again.
 * Anything inside [data-no-translate] or translate="no" is left alone.
 */
import { hasWords, normalizeKey, translateText, type Dict } from "./i18n";

type Rec = { src: string; out: string };

const ATTRS = ["placeholder", "aria-label", "alt", "title"] as const;
const SKIP = "script,style,noscript,textarea,code,pre,[data-no-translate],[translate='no']";

const textRecs = new WeakMap<Text, Rec>();
const attrRecs = new WeakMap<Element, Map<string, Rec>>();

let dict: Dict | null = null;
let observer: MutationObserver | null = null;
const missing = new Set<string>();

function skipped(el: Element | null) {
  return !el || !!el.closest(SKIP);
}

function note(src: string) {
  if (!dict || !import.meta.env.DEV) return;
  const key = normalizeKey(src);
  if (key && hasWords(key) && !dict[key]) {
    missing.add(key);
    (window as unknown as { __i18nMissing?: string[] }).__i18nMissing = [...missing];
  }
}

function doText(node: Text) {
  if (skipped(node.parentElement)) return;
  const cur = node.nodeValue ?? "";
  let rec = textRecs.get(node);
  if (!rec || cur !== rec.out) {
    rec = { src: cur, out: cur };
    textRecs.set(node, rec);
  }
  const next = translateText(rec.src, dict);
  if (next === rec.src) note(rec.src);
  rec.out = next;
  if (next !== cur) node.nodeValue = next;
}

function doAttr(el: Element, name: string) {
  const cur = el.getAttribute(name);
  if (cur == null || skipped(el)) return;
  let map = attrRecs.get(el);
  if (!map) attrRecs.set(el, (map = new Map()));
  let rec = map.get(name);
  if (!rec || cur !== rec.out) {
    rec = { src: cur, out: cur };
    map.set(name, rec);
  }
  const next = translateText(rec.src, dict);
  if (next === rec.src) note(rec.src);
  rec.out = next;
  if (next !== cur) el.setAttribute(name, next);
}

function walk(root: Node) {
  if (root.nodeType === Node.TEXT_NODE) return doText(root as Text);
  if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
  const el = root as Element;
  if (el.nodeType === Node.ELEMENT_NODE) for (const a of ATTRS) if (el.hasAttribute(a)) doAttr(el, a);
  const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n = tw.nextNode(); n; n = tw.nextNode()) doText(n as Text);
  const sel = ATTRS.map((a) => `[${a}]`).join(",");
  (root as ParentNode).querySelectorAll?.(sel).forEach((e) => {
    for (const a of ATTRS) if (e.hasAttribute(a)) doAttr(e, a);
  });
}

function onMutations(list: MutationRecord[]) {
  for (const m of list) {
    if (m.type === "characterData") doText(m.target as Text);
    else if (m.type === "attributes" && m.attributeName) doAttr(m.target as Element, m.attributeName);
    else m.addedNodes.forEach((n) => walk(n));
  }
}

/** Sets the active dictionary (null = English) and re-renders the whole document. */
export function setPageDictionary(next: Dict | null) {
  dict = next;
  missing.clear();
  walk(document.documentElement);
  if (!observer) {
    observer = new MutationObserver(onMutations);
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...ATTRS],
    });
  }
}

export function stopPageTranslation() {
  if (dict) {
    dict = null;
    walk(document.documentElement);
  }
  observer?.disconnect();
  observer = null;
}

/* The page may only be rewritten once React has hydrated the route's content. */
let ready = false;
const waiting = new Set<() => void>();
export function signalPageHydrated() {
  ready = true;
  waiting.forEach((f) => f());
  waiting.clear();
}
export function whenPageHydrated(fn: () => void) {
  if (ready) fn();
  else waiting.add(fn);
  return () => {
    waiting.delete(fn);
  };
}
