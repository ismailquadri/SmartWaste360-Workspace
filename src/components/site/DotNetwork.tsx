import { useMemo } from "react";

import { useReducedMotion, useStickyProgress } from "./motion";

const COLS = 26;
const ROWS = 11;
const LIT = 57; // 20 Local Governments + 37 LCDAs

/** Deterministic shuffle so server and browser light the same dots. */
function order(n: number) {
  const idx = Array.from({ length: n }, (_, i) => i);
  let seed = 1977;
  for (let i = n - 1; i > 0; i--) {
    seed = (seed * 16807) % 2147483647;
    const j = seed % (i + 1);
    [idx[i], idx[j]] = [idx[j]!, idx[i]!];
  }
  return idx;
}

/** Pinned dark panel: one dot per council area lights up as you scroll, and the count follows. */
export function DotNetwork() {
  const [ref, p] = useStickyProgress<HTMLElement>();
  const reduced = useReducedMotion();
  const lit = useMemo(() => new Set(order(COLS * ROWS).slice(0, LIT)), []);
  const rank = useMemo(() => {
    const m = new Map<number, number>();
    order(COLS * ROWS)
      .slice(0, LIT)
      .forEach((d, i) => m.set(d, i));
    return m;
  }, []);
  const k = reduced ? 1 : Math.min(1, Math.max(0, (p - 0.08) / 0.7));
  const shown = Math.round(k * LIT);

  return (
    <section ref={ref} className="relative h-[220svh] px-3 md:px-6">
      <div className="sticky top-0 flex h-[100svh] items-center py-6">
        <div className="relative mx-auto h-full max-h-[820px] w-full max-w-[1280px] overflow-hidden rounded-[1.75rem] bg-ink text-paper">
          <svg
            viewBox={`0 0 ${COLS * 40} ${ROWS * 40}`}
            className="absolute inset-x-0 bottom-0 h-[50%] w-full [mask-image:linear-gradient(180deg,transparent,black_45%)]"
            preserveAspectRatio="xMidYMax slice"
            aria-hidden="true"
          >
            {Array.from({ length: COLS * ROWS }, (_, i) => {
              const x = (i % COLS) * 40 + 20;
              const y = Math.floor(i / COLS) * 40 + 20;
              const r = rank.get(i);
              const on = lit.has(i) && r !== undefined && r < shown;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={on ? 7 : 3}
                  className="transition-[r,fill] duration-500"
                  style={{ fill: on ? "var(--ember)" : "color-mix(in oklab, var(--paper) 14%, transparent)" }}
                />
              );
            })}
          </svg>
          <div className="relative flex flex-col items-center px-6 pt-14 text-center md:pt-20">
            <p className="eyebrow inline-flex items-center gap-2 text-mist">
              <span className="size-1.5 rounded-full bg-ember" /> One network
            </p>
            <p className="display mt-6 text-[clamp(5rem,13vw,10rem)] leading-none tabular-nums" aria-label={`${LIT} council areas`}>
              {shown}
            </p>
            <p className="display mt-3 text-[clamp(1.1rem,1.8vw,1.5rem)] text-paper/90">Council areas served</p>
            <p className="mt-5 max-w-md text-[0.9375rem] leading-relaxed text-paper/65">
              20 Local Governments and 37 LCDAs, each with accredited PSP operators allocated ward by ward and watched over from one control room.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
