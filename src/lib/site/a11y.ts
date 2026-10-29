/**
 * Accessibility adjustments for the public website (modelled on the Sweeping Corp toolbar).
 * Settings live in browser storage and are written to <html> as data attributes;
 * the matching CSS is in src/styles.css under "Accessibility adjustments".
 * `A11Y_BOOT_SCRIPT` repeats `applyA11y` in plain JS so saved choices apply before first paint.
 */

export const A11Y_KEY = "lawma.a11y.v1";
export const A11Y_HIDE_KEY = "lawma.a11y.hidden";
export const LANG_KEY = "lawma.lang";

export const FONT_STEP = 10; // percent per press
export const FONT_MIN = -2;
export const FONT_MAX = 5;
export const LINE_MAX = 4;
export const BASE_LINE = 1.5;
export const LINE_STEP = 0.25;

export type Align = "default" | "left" | "center" | "right";
export type Contrast = "default" | "light" | "high" | "mono";

export type A11ySettings = {
  fontSize: number;
  lineHeight: number;
  readableFont: boolean;
  bigCursor: boolean;
  letterSpacing: boolean;
  align: Align;
  fontWeight: boolean;
  contrast: Contrast;
  readingLine: boolean;
  readingMask: boolean;
  hideImages: boolean;
  highlightContent: boolean;
  stopAnimations: boolean;
  highlightLinks: boolean;
};

export const DEFAULT_A11Y: A11ySettings = {
  fontSize: 0,
  lineHeight: 0,
  readableFont: false,
  bigCursor: false,
  letterSpacing: false,
  align: "default",
  fontWeight: false,
  contrast: "default",
  readingLine: false,
  readingMask: false,
  hideImages: false,
  highlightContent: false,
  stopAnimations: false,
  highlightLinks: false,
};

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export function stepFont(current: number, dir: 1 | -1) {
  return clamp(current + dir, FONT_MIN, FONT_MAX);
}
export function stepLine(current: number, dir: 1 | -1) {
  return clamp(current + dir, 0, LINE_MAX);
}
export function fontPercent(step: number) {
  return 100 + step * FONT_STEP;
}
export function lineValue(step: number) {
  return BASE_LINE + step * LINE_STEP;
}
export function fontLabel(step: number) {
  return step === 0 ? "Default" : `${fontPercent(step)}%`;
}
export function lineLabel(step: number) {
  return step === 0 ? "Default" : `${Math.round((lineValue(step) / BASE_LINE) * 100)}%`;
}

const ALIGN_ORDER: Align[] = ["default", "left", "center", "right"];
export function nextAlign(a: Align): Align {
  return ALIGN_ORDER[(ALIGN_ORDER.indexOf(a) + 1) % ALIGN_ORDER.length]!;
}

export function readSettings(raw: string | null): A11ySettings {
  if (!raw) return { ...DEFAULT_A11Y };
  try {
    const v = JSON.parse(raw) as Partial<A11ySettings>;
    const s = { ...DEFAULT_A11Y, ...v };
    s.fontSize = clamp(Math.round(Number(s.fontSize) || 0), FONT_MIN, FONT_MAX);
    s.lineHeight = clamp(Math.round(Number(s.lineHeight) || 0), 0, LINE_MAX);
    if (!ALIGN_ORDER.includes(s.align)) s.align = "default";
    if (!["default", "light", "high", "mono"].includes(s.contrast)) s.contrast = "default";
    return s;
  } catch {
    return { ...DEFAULT_A11Y };
  }
}

export function isDefault(s: A11ySettings) {
  return (Object.keys(DEFAULT_A11Y) as (keyof A11ySettings)[]).every((k) => s[k] === DEFAULT_A11Y[k]);
}

/** Writes settings onto the document root. Keep in step with A11Y_BOOT_SCRIPT below. */
export function applyA11y(root: HTMLElement, s: A11ySettings) {
  const flag = (name: string, on: boolean) => (on ? root.setAttribute(name, "") : root.removeAttribute(name));
  root.style.fontSize = s.fontSize ? `${fontPercent(s.fontSize)}%` : "";
  if (s.lineHeight) root.style.setProperty("--a11y-lh", String(lineValue(s.lineHeight)));
  else root.style.removeProperty("--a11y-lh");
  flag("data-a11y-lh", s.lineHeight > 0);
  flag("data-a11y-font", s.readableFont);
  flag("data-a11y-cursor", s.bigCursor);
  flag("data-a11y-spacing", s.letterSpacing);
  flag("data-a11y-bold", s.fontWeight);
  flag("data-a11y-noimg", s.hideImages);
  flag("data-a11y-highlight", s.highlightContent);
  flag("data-a11y-still", s.stopAnimations);
  flag("data-a11y-links", s.highlightLinks);
  if (s.align === "default") root.removeAttribute("data-a11y-align");
  else root.setAttribute("data-a11y-align", s.align);
  if (s.contrast === "default") root.removeAttribute("data-a11y-contrast");
  else root.setAttribute("data-a11y-contrast", s.contrast);
}

/* ---------- Hiding the toolbar ---------- */

export type HideChoice = "session" | "day" | "week";
export const HIDE_CHOICES: { value: HideChoice; label: string }[] = [
  { value: "session", label: "Only for this session" },
  { value: "day", label: "24 hours" },
  { value: "week", label: "A week" },
];

const DAY = 24 * 60 * 60 * 1000;
/** Time (ms) until which the toolbar stays hidden; null means "until the tab closes". */
export function hideUntil(choice: HideChoice, now: number): number | null {
  if (choice === "day") return now + DAY;
  if (choice === "week") return now + 7 * DAY;
  return null;
}
export function isHidden(stored: string | null, sessionFlag: string | null, now: number) {
  if (sessionFlag === "1") return true;
  const until = Number(stored);
  return Number.isFinite(until) && until > now;
}

/* ---------- Early paint ---------- */

/**
 * Inline script for <head>: applies saved adjustments and hides the page briefly while a
 * saved language loads, so visitors never see a flash of the wrong size or language.
 */
export const A11Y_BOOT_SCRIPT = `(function(){try{
var d=document.documentElement,s=JSON.parse(localStorage.getItem(${JSON.stringify(A11Y_KEY)})||"null");
if(s){
var f=function(n,on){on?d.setAttribute(n,""):d.removeAttribute(n)};
var fs=Math.max(${FONT_MIN},Math.min(${FONT_MAX},Math.round(+s.fontSize||0)));
var lh=Math.max(0,Math.min(${LINE_MAX},Math.round(+s.lineHeight||0)));
if(fs)d.style.fontSize=(100+fs*${FONT_STEP})+"%";
if(lh)d.style.setProperty("--a11y-lh",String(${BASE_LINE}+lh*${LINE_STEP}));
f("data-a11y-lh",lh>0);f("data-a11y-font",!!s.readableFont);f("data-a11y-cursor",!!s.bigCursor);
f("data-a11y-spacing",!!s.letterSpacing);f("data-a11y-bold",!!s.fontWeight);f("data-a11y-noimg",!!s.hideImages);
f("data-a11y-highlight",!!s.highlightContent);f("data-a11y-still",!!s.stopAnimations);f("data-a11y-links",!!s.highlightLinks);
if(s.align==="left"||s.align==="center"||s.align==="right")d.setAttribute("data-a11y-align",s.align);
if(s.contrast==="light"||s.contrast==="high"||s.contrast==="mono")d.setAttribute("data-a11y-contrast",s.contrast);
}
var l=localStorage.getItem(${JSON.stringify(LANG_KEY)});
if(l&&l!=="en"&&location.pathname.indexOf("/workspace")!==0){d.setAttribute("data-i18n-pending","");setTimeout(function(){d.removeAttribute("data-i18n-pending")},2500);}
}catch(e){}})();`;
