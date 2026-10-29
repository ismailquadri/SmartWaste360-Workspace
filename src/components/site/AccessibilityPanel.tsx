import { useRouterState } from "@tanstack/react-router";
import {
  Accessibility,
  Bold,
  CaseSensitive,
  Check,
  ChevronDown,
  ChevronLeft,
  CirclePause,
  Contrast,
  Droplet,
  ImageOff,
  Link2,
  Minus,
  MousePointer2,
  MoveHorizontal,
  Plus,
  ScanLine,
  SeparatorHorizontal,
  SquareDashed,
  Sun,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignJustify,
  TextAlignStart,
  X,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";

import {
  A11Y_HIDE_KEY,
  A11Y_KEY,
  DEFAULT_A11Y,
  FONT_MAX,
  FONT_MIN,
  HIDE_CHOICES,
  LINE_MAX,
  applyA11y,
  fontLabel,
  hideUntil,
  isHidden,
  lineLabel,
  nextAlign,
  readSettings,
  stepFont,
  stepLine,
  type A11ySettings,
  type Contrast as ContrastMode,
  type HideChoice,
} from "@/lib/site/a11y";
import { setPageDictionary, whenPageHydrated } from "@/lib/site/dom-translate";
import { LANGS, i18nStore, savedLang, useI18n, type Lang } from "@/lib/site/i18n";
import { cn } from "@/lib/utils";

/** Fired by the footer's "Accessibility" link to bring the toolbar back. */
export const OPEN_A11Y_EVENT = "lawma:open-accessibility";

const ALIGN_ICON = { default: TextAlignJustify, left: TextAlignStart, center: TextAlignCenter, right: TextAlignEnd } as const;
const ALIGN_LABEL = { default: "", left: "Left", center: "Centre", right: "Right" } as const;

function Tile({
  icon: Icon,
  label,
  sub,
  active,
  onClick,
  className,
}: {
  icon: LucideIcon;
  label: string;
  sub?: string | undefined;
  active: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex min-h-[132px] flex-col items-center justify-center gap-[12px] rounded-[12px] border-2 bg-paper px-[10px] py-[18px] text-center text-[14px] leading-[1.3] text-ink transition-colors hover:border-lemon/50",
        active ? "border-lemon" : "border-transparent",
        className,
      )}
    >
      <span
        className={cn(
          "grid size-[40px] place-items-center rounded-full shadow-[0_1px_4px_oklch(0.17_0.004_260/0.12)] transition-colors",
          active ? "bg-lemon text-lemon-foreground" : "bg-card text-ink",
        )}
      >
        <Icon className="size-[18px]" strokeWidth={1.75} />
      </span>
      <span>
        {label}
        {sub && <span className="mt-[2px] block text-[12px] text-stone">{sub}</span>}
      </span>
    </button>
  );
}

function Stepper({
  label,
  value,
  onUp,
  onDown,
  canUp,
  canDown,
  active,
}: {
  label: string;
  value: string;
  onUp: () => void;
  onDown: () => void;
  canUp: boolean;
  canDown: boolean;
  active: boolean;
}) {
  const btn =
    "grid size-[34px] place-items-center rounded-full bg-lemon text-lemon-foreground transition-opacity hover:bg-lemon-deep disabled:cursor-not-allowed disabled:opacity-40";
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "col-span-2 flex min-h-[132px] flex-col items-center justify-center gap-[14px] rounded-[12px] border-2 bg-paper px-[10px] py-[18px]",
        active ? "border-lemon" : "border-transparent",
      )}
    >
      <p className="text-[15px] font-medium text-ink">{label}</p>
      <div className="flex items-center rounded-full bg-card shadow-[0_1px_4px_oklch(0.17_0.004_260/0.08)]">
        <button type="button" className={btn} onClick={onUp} disabled={!canUp} aria-label={`Increase ${label.toLowerCase()}`}>
          <Plus className="size-[18px]" strokeWidth={2.25} />
        </button>
        <span className="min-w-[96px] px-[8px] text-center text-[13px] text-ink" aria-live="polite">
          {value}
        </span>
        <button type="button" className={btn} onClick={onDown} disabled={!canDown} aria-label={`Decrease ${label.toLowerCase()}`}>
          <Minus className="size-[18px]" strokeWidth={2.25} />
        </button>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[18px] bg-card p-[24px] shadow-[0_1px_2px_oklch(0.17_0.004_260/0.04)]">
      <h3 className="mb-[18px] flex items-center gap-[10px] text-[18px] font-medium text-ink">
        <span className="size-[8px] shrink-0 rounded-[2px] bg-ember" aria-hidden="true" />
        {title}
      </h3>
      {children}
    </section>
  );
}

function LanguageMenu() {
  const { lang } = useI18n();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<Lang | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const listId = useId();
  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0]!;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
      }
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey, true);
    };
  }, [open]);

  const choose = async (code: Lang) => {
    setBusy(code);
    try {
      await i18nStore.setLang(code);
    } finally {
      setBusy(null);
      setOpen(false);
    }
  };

  return (
    <div ref={ref} className="relative" data-no-translate>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`Language: ${current.name}`}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-[40px] items-center gap-[8px] rounded-full border border-ink/25 pl-[6px] pr-[14px] text-[15px] font-medium text-ink transition-colors hover:bg-ink/5"
      >
        <span className="grid size-[28px] place-items-center rounded-full bg-card text-[10px] font-semibold tracking-[0.04em] text-ink">{current.badge}</span>
        {current.name}
        <ChevronDown className={cn("size-[16px] transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Choose a language"
          className="absolute left-0 top-[calc(100%+8px)] z-10 w-[260px] rounded-[12px] border border-line-light bg-card p-[8px] shadow-float"
        >
          {LANGS.map((l) => {
            const on = l.code === lang;
            return (
              <li key={l.code} role="option" aria-selected={on}>
                <button
                  type="button"
                  lang={l.code}
                  onClick={() => void choose(l.code)}
                  className={cn(
                    "flex w-full items-center gap-[12px] rounded-[8px] px-[10px] py-[9px] text-left text-[15px] text-ink transition-colors hover:bg-paper-2",
                    on && "bg-paper-2",
                  )}
                >
                  <span className="grid size-[28px] place-items-center rounded-full border border-line-light text-[10px] font-semibold tracking-[0.04em]">
                    {l.badge}
                  </span>
                  <span className="flex-1">
                    {l.name}
                    {l.name !== l.english && <span className="block text-[12px] text-stone">{l.english}</span>}
                  </span>
                  {busy === l.code ? (
                    <span className="size-[14px] animate-spin rounded-full border-2 border-ink/20 border-t-ink" aria-hidden="true" />
                  ) : (
                    on && <Check className="size-[16px] text-ember-text" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function HideView({ onBack, onHide }: { onBack: () => void; onHide: (c: HideChoice) => void }) {
  const [choice, setChoice] = useState<HideChoice>("session");
  return (
    <div className="p-[24px]">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-[6px] text-[15px] font-medium text-ink hover:underline">
        <ChevronLeft className="size-[18px]" />
        Back
      </button>
      <div className="mt-[24px] rounded-[18px] bg-card p-[24px]">
        <h3 className="text-[20px] font-medium leading-[1.3] text-ink">How long do you want to hide the toolbar?</h3>
        <fieldset className="mt-[20px]">
          <legend className="text-[14px] text-stone">Hide Toolbar Duration</legend>
          <div className="mt-[12px] space-y-[8px]">
            {HIDE_CHOICES.map((c) => (
              <label
                key={c.value}
                className={cn(
                  "flex cursor-pointer items-center gap-[12px] rounded-[10px] border-2 bg-paper px-[14px] py-[12px] text-[15px] text-ink",
                  choice === c.value ? "border-lemon" : "border-transparent",
                )}
              >
                <input
                  type="radio"
                  name="a11y-hide"
                  value={c.value}
                  checked={choice === c.value}
                  onChange={() => setChoice(c.value)}
                  className="size-[18px] accent-[var(--ink)]"
                />
                {c.label}
              </label>
            ))}
          </div>
        </fieldset>
        <p className="mt-[16px] text-[14px] leading-[1.5] text-stone">You can bring it back at any time from “Accessibility” at the foot of every page.</p>
        <div className="mt-[22px] flex flex-wrap gap-[10px]">
          <button type="button" onClick={onBack} className="h-[44px] flex-1 rounded-[10px] border border-line-light px-[18px] text-[15px] font-medium text-ink hover:border-ink/30">
            Not Now
          </button>
          <button
            type="button"
            onClick={() => onHide(choice)}
            className="h-[44px] flex-1 rounded-[10px] bg-lemon px-[18px] text-[15px] font-semibold text-lemon-foreground hover:bg-lemon-deep"
          >
            Hide Toolbar
          </button>
        </div>
      </div>
    </div>
  );
}

function ReadingAids({ line, mask }: { line: boolean; mask: boolean }) {
  const [y, setY] = useState<number | null>(null);
  useEffect(() => {
    if (!line && !mask) return;
    const move = (e: PointerEvent) => setY(e.clientY);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", move);
    };
  }, [line, mask]);
  if ((!line && !mask) || y == null) return null;
  const band = 64;
  return (
    <div className="a11y-ui pointer-events-none fixed inset-0 z-[75]" aria-hidden="true">
      {mask && (
        <>
          <div className="absolute inset-x-0 top-0 bg-ink/70" style={{ height: Math.max(0, y - band) }} />
          <div className="absolute inset-x-0 bottom-0 bg-ink/70" style={{ top: y + band }} />
        </>
      )}
      {line && (
        <div className="absolute inset-x-0 h-[10px] -translate-y-1/2 border-y-2 border-ink bg-lemon" style={{ top: y }} />
      )}
    </div>
  );
}

export function SiteAccessibility() {
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<A11ySettings>(DEFAULT_A11Y);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"main" | "hide">("main");
  const [hidden, setHidden] = useState(false);
  const { dict } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const skipId = useId();

  // Restore saved choices once in the browser.
  useEffect(() => {
    const root = document.documentElement;
    try {
      setSettings(readSettings(localStorage.getItem(A11Y_KEY)));
      setHidden(isHidden(localStorage.getItem(A11Y_HIDE_KEY), sessionStorage.getItem(A11Y_HIDE_KEY), Date.now()));
    } catch {
      /* storage blocked */
    }
    const lang = savedLang();
    if (lang === "en") root.removeAttribute("data-i18n-pending");
    else void i18nStore.setLang(lang).catch(() => root.removeAttribute("data-i18n-pending"));
    setMounted(true);
  }, []);

  // Keep the page text in the chosen language.
  useEffect(() => {
    if (!mounted) return;
    return whenPageHydrated(() => {
      document.documentElement.lang = i18nStore.get().lang;
      setPageDictionary(dict);
      document.documentElement.removeAttribute("data-i18n-pending");
    });
  }, [dict, mounted]);

  // Write settings to the page and storage.
  useEffect(() => {
    if (!mounted) return;
    applyA11y(document.documentElement, settings);
    try {
      localStorage.setItem(A11Y_KEY, JSON.stringify(settings));
    } catch {
      /* storage blocked */
    }
  }, [settings, mounted]);

  // Load the readable typeface only when someone asks for it.
  useEffect(() => {
    if (!settings.readableFont || document.getElementById("a11y-readable-font")) return;
    const link = document.createElement("link");
    link.id = "a11y-readable-font";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap";
    document.head.appendChild(link);
  }, [settings.readableFont]);

  // Pause films while animations are stopped, including on pages opened later.
  useEffect(() => {
    if (!mounted) return;
    const vids = document.querySelectorAll<HTMLVideoElement>("main video, video[autoplay]");
    vids.forEach((v) => {
      if (settings.stopAnimations) v.pause();
      else if (v.autoplay) void v.play().catch(() => {});
    });
  }, [settings.stopAnimations, pathname, mounted]);

  // Footer link reopens (and un-hides) the toolbar.
  useEffect(() => {
    const show = () => {
      try {
        localStorage.removeItem(A11Y_HIDE_KEY);
        sessionStorage.removeItem(A11Y_HIDE_KEY);
      } catch {
        /* storage blocked */
      }
      setHidden(false);
      setView("main");
      setOpen(true);
    };
    window.addEventListener(OPEN_A11Y_EVENT, show);
    return () => window.removeEventListener(OPEN_A11Y_EVENT, show);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setView("main");
    requestAnimationFrame(() => toggleRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  const set = <K extends keyof A11ySettings>(k: K, v: A11ySettings[K]) => setSettings((s) => ({ ...s, [k]: v }));
  const flip = (k: keyof A11ySettings) => setSettings((s) => ({ ...s, [k]: !s[k] }));
  const contrast = (c: ContrastMode) => set("contrast", settings.contrast === c ? "default" : c);

  const hide = (choice: HideChoice) => {
    try {
      const until = hideUntil(choice, Date.now());
      if (until == null) sessionStorage.setItem(A11Y_HIDE_KEY, "1");
      else localStorage.setItem(A11Y_HIDE_KEY, String(until));
    } catch {
      /* storage blocked */
    }
    setHidden(true);
    setOpen(false);
    setView("main");
  };

  const skipTo = (target: string) => {
    const el =
      target === "main"
        ? document.getElementById("main")
        : target === "menu"
          ? document.querySelector<HTMLElement>("header nav")
          : document.querySelector<HTMLElement>("footer");
    if (!el) return;
    close();
    el.setAttribute("tabindex", "-1");
    el.scrollIntoView({ block: "start" });
    el.focus({ preventScroll: true });
  };

  if (!mounted) return null;

  return (
    <>
      <ReadingAids line={settings.readingLine} mask={settings.readingMask} />

      {!hidden && !open && (
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open accessibility adjustments"
          aria-expanded={open}
          className="a11y-ui fixed left-[15px] top-1/2 z-[60] grid size-[56px] -translate-y-1/2 place-items-center rounded-full border-[3px] border-card bg-lemon text-lemon-foreground shadow-[0_8px_24px_-8px_oklch(0.17_0.004_260/0.45)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ink/40"
        >
          <Accessibility className="size-[28px]" strokeWidth={2} />
        </button>
      )}

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-labelledby="a11y-title"
          data-lenis-prevent
          className="a11y-ui fixed inset-y-0 left-0 z-[80] w-full max-w-[580px] animate-in overflow-y-auto overscroll-contain bg-paper-2 font-sans text-[16px] leading-[1.4] text-ink shadow-lift slide-in-from-left duration-300"
        >
          <div className="bg-lemon px-[18px] pb-[96px] pt-[16px] text-lemon-foreground">
            <div className="flex items-center justify-between">
              <LanguageMenu />
              <button
                type="button"
                data-autofocus
                onClick={close}
                aria-label="Close accessibility adjustments"
                className="grid size-[34px] place-items-center rounded-full bg-ink/12 text-ink transition-colors hover:bg-ink/20"
              >
                <X className="size-[18px]" strokeWidth={2.5} />
              </button>
            </div>
            {view === "main" && (
              <div className="mt-[18px] flex flex-col items-center text-center">
                <span className="grid size-[48px] place-items-center rounded-full bg-card text-ember-text">
                  <Accessibility className="size-[28px]" strokeWidth={2.25} />
                </span>
                <h2 id="a11y-title" className="mt-[22px] text-[28px] font-semibold leading-[1.15] tracking-[-0.01em]">
                  Accessibility Adjustments
                </h2>
                <button type="button" onClick={() => setView("hide")} className="mt-[12px] text-[16px] text-ink/75 underline-offset-4 hover:underline">
                  Hide Toolbar
                </button>
              </div>
            )}
            {view === "hide" && (
              <h2 id="a11y-title" className="mt-[24px] text-center text-[28px] font-semibold leading-[1.15]">
                Hide Toolbar
              </h2>
            )}
          </div>

          {view === "hide" ? (
            <div className="-mt-[80px]">
              <HideView onBack={() => setView("main")} onHide={hide} />
            </div>
          ) : (
            <div className="-mt-[80px] space-y-[24px] px-[14px] pb-[28px]">
              <Card title="Content Modules">
                <div className="grid grid-cols-3 gap-[10px]">
                  <Stepper
                    label="Font Size"
                    value={fontLabel(settings.fontSize)}
                    active={settings.fontSize !== 0}
                    canUp={settings.fontSize < FONT_MAX}
                    canDown={settings.fontSize > FONT_MIN}
                    onUp={() => set("fontSize", stepFont(settings.fontSize, 1))}
                    onDown={() => set("fontSize", stepFont(settings.fontSize, -1))}
                  />
                  <Tile icon={CaseSensitive} label="Readable Font" active={settings.readableFont} onClick={() => flip("readableFont")} />
                  <Stepper
                    label="Line Height"
                    value={lineLabel(settings.lineHeight)}
                    active={settings.lineHeight !== 0}
                    canUp={settings.lineHeight < LINE_MAX}
                    canDown={settings.lineHeight > 0}
                    onUp={() => set("lineHeight", stepLine(settings.lineHeight, 1))}
                    onDown={() => set("lineHeight", stepLine(settings.lineHeight, -1))}
                  />
                  <Tile icon={MousePointer2} label="Big Cursor" active={settings.bigCursor} onClick={() => flip("bigCursor")} />
                  <Tile icon={MoveHorizontal} label="Letter Spacing" active={settings.letterSpacing} onClick={() => flip("letterSpacing")} />
                  <Tile
                    icon={ALIGN_ICON[settings.align]}
                    label="Align Text"
                    sub={ALIGN_LABEL[settings.align] || undefined}
                    active={settings.align !== "default"}
                    onClick={() => set("align", nextAlign(settings.align))}
                  />
                  <Tile icon={Bold} label="Font Weight" active={settings.fontWeight} onClick={() => flip("fontWeight")} />
                </div>
              </Card>

              <Card title="Color Modules">
                <div className="grid grid-cols-3 gap-[10px]">
                  <Tile icon={Sun} label="Light Contrast" active={settings.contrast === "light"} onClick={() => contrast("light")} />
                  <Tile icon={Contrast} label="High Contrast" active={settings.contrast === "high"} onClick={() => contrast("high")} />
                  <Tile icon={Droplet} label="Monochrome" active={settings.contrast === "mono"} onClick={() => contrast("mono")} />
                </div>
              </Card>

              <Card title="Orientation Modules">
                <div className="grid grid-cols-3 gap-[10px]">
                  <Tile icon={SeparatorHorizontal} label="Reading Line" active={settings.readingLine} onClick={() => flip("readingLine")} />
                  <Tile icon={ScanLine} label="Reading Mask" active={settings.readingMask} onClick={() => flip("readingMask")} />
                  <Tile icon={ImageOff} label="Hide Images" active={settings.hideImages} onClick={() => flip("hideImages")} />
                  <Tile icon={SquareDashed} label="Highlight Content" active={settings.highlightContent} onClick={() => flip("highlightContent")} />
                  <Tile icon={CirclePause} label="Stop Animations" active={settings.stopAnimations} onClick={() => flip("stopAnimations")} />
                  <Tile icon={Link2} label="Highlight Links" active={settings.highlightLinks} onClick={() => flip("highlightLinks")} />
                </div>
              </Card>

              <section className="rounded-[18px] bg-card p-[24px]">
                <label htmlFor={skipId} className="text-[15px] font-medium text-ink">
                  Skip To Content
                </label>
                <div className="relative mt-[12px]">
                  <select
                    id={skipId}
                    value=""
                    onChange={(e) => skipTo(e.target.value)}
                    className="h-[46px] w-full appearance-none rounded-[10px] border border-line-light bg-card px-[14px] pr-[40px] text-[15px] text-ink outline-none focus:border-ink focus:ring-2 focus:ring-lemon/30"
                  >
                    <option value="">Choose…</option>
                    <option value="main">Main content</option>
                    <option value="menu">Menu</option>
                    <option value="footer">Footer</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-[14px] top-1/2 size-[16px] -translate-y-1/2 text-stone" />
                </div>
              </section>

              <button
                type="button"
                onClick={() => setSettings({ ...DEFAULT_A11Y })}
                className="h-[48px] w-full rounded-[12px] bg-lemon text-[16px] font-semibold text-lemon-foreground transition-colors hover:bg-lemon-deep"
              >
                Reset Settings
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

/** Opens the toolbar from anywhere (e.g. the footer link). */
export function openAccessibility() {
  window.dispatchEvent(new Event(OPEN_A11Y_EVENT));
}
