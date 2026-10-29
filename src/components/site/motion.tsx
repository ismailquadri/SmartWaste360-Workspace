import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { useTr } from "@/lib/site/i18n";

/** Fades and lifts its children into place the first time they scroll into view. */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className,
  style,
  id,
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string | undefined;
  style?: CSSProperties;
  id?: string | undefined;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref}
      id={id}
      data-in={shown ? "true" : "false"}
      className={cn("reveal", className)}
      style={{ ...style, ["--reveal-delay" as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/** Headline whose lines rise out of a mask on page load. */
export function LineRise({ lines, className, baseDelay = 150 }: { lines: ReactNode | ReactNode[]; className?: string; baseDelay?: number }) {
  const list = Array.isArray(lines) ? lines : [lines];
  return (
    <span className={className}>
      {list.map((line, i) => (
        <span key={i} className="line-mask">
          <span className="block animate-line-up" style={{ animationDelay: `${baseDelay + i * 110}ms` }}>
            {line}
          </span>
        </span>
      ))}
    </span>
  );
}

/** 0 → 1 as the element travels through the viewport. */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (vh - r.top) / (vh + r.height);
      setProgress(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return [ref, progress] as const;
}

/** Image that drifts slower than the page for depth. */
export function ParallaxImage({
  src,
  alt,
  className,
  imgClassName,
  strength = 12,
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  strength?: number;
  eager?: boolean;
}) {
  const [ref, p] = useScrollProgress<HTMLDivElement>();
  const shift = (p - 0.5) * strength;
  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={cn("absolute inset-0 h-[115%] w-full object-cover will-change-transform", imgClassName)}
        style={{ transform: `translate3d(0, ${-7.5 + shift}%, 0)` }}
      />
    </div>
  );
}

/** Statement that lights up word by word as you scroll past it. */
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const [ref, p] = useScrollProgress<HTMLParagraphElement>();
  const tr = useTr();
  const words = tr(text).split(" ");
  const lit = Math.round(Math.min(1, Math.max(0, (p - 0.18) / 0.42)) * words.length);
  return (
    <p ref={ref} className={className} data-no-translate data-scroll-words>
      {words.map((w, i) => (
        <span key={i} className="transition-opacity duration-500" style={{ opacity: i < lit ? 1 : 0.16 }}>
          {w}{" "}
        </span>
      ))}
    </p>
  );
}

/** Counts up to a number once visible. */
export function CountUp({ value, suffix = "", className }: { value: number; suffix?: string | undefined; className?: string | undefined }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(value);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setN(value > 1900 && value < 2100 ? 1900 : 0);
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      const from = value > 1900 && value < 2100 ? 1900 : 0;
      const start = performance.now();
      const dur = 1600;
      const tick = (t: number) => {
        const k = Math.min(1, (t - start) / dur);
        const eased = 1 - Math.pow(1 - k, 4);
        setN(Math.round(from + (value - from) * eased));
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  const shown = value > 1900 && value < 2100 ? String(n) : n.toLocaleString("en-GB");
  return (
    <span ref={ref} className={className}>
      {shown}
      {suffix}
    </span>
  );
}

/** Muted looping film that only plays while on screen. */
export function FilmLoop({ src, poster, className, label }: { src: string; poster: string; className?: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      }
    });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
    />
  );
}

/** Live Lagos time (WAT). Renders a stable placeholder until hydrated. */
export function LagosClock({ className }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Africa/Lagos" });
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return <span className={className}>{time ?? "--:--:--"} WAT</span>;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** True when the visitor asked for reduced motion (false during SSR). */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/** 0 → 1 while a tall section scrolls under its sticky child (pinned scenes). */
export function useStickyProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      setProgress(span > 0 ? clamp01(-r.top / span) : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return [ref, progress] as const;
}

/** Rounded, inset media that opens out to the full width as it scrolls into view. */
export function ExpandMedia({
  image,
  film,
  alt,
  className,
  children,
}: {
  image: string;
  film?: string | undefined;
  alt: string;
  className?: string | undefined;
  children?: ReactNode;
}) {
  const [ref, p] = useScrollProgress<HTMLDivElement>();
  const reduced = useReducedMotion();
  const k = reduced ? 1 : clamp01((p - 0.12) / 0.38);
  const inset = (1 - k) * 4.5; // vw on each side
  const radius = 28 - k * 20;
  return (
    <div ref={ref} className={cn("relative", className)}>
      <div
        className="relative h-full w-full overflow-hidden bg-paper-2 will-change-[clip-path]"
        style={{ clipPath: `inset(0 ${inset}vw round ${radius}px)` }}
      >
        {film ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            style={{ transform: `scale(${1.08 - k * 0.08})` }}
            src={film}
            poster={image}
            autoPlay
            muted
            loop
            playsInline
            aria-label={alt}
          />
        ) : (
          <img
            src={image}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ transform: `scale(${1.08 - k * 0.08})` }}
          />
        )}
        <div className="absolute inset-0" style={{ paddingInline: `${inset}vw` }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/** Screen or card that tilts up from the page and settles flat as you scroll to it. */
export function TiltIn({ children, className }: { children: ReactNode; className?: string }) {
  const [ref, p] = useScrollProgress<HTMLDivElement>();
  const reduced = useReducedMotion();
  const k = reduced ? 1 : clamp01((p - 0.05) / 0.4);
  return (
    <div ref={ref} className={cn("[perspective:1800px]", className)}>
      <div
        className="origin-top will-change-transform"
        style={{ transform: `rotateX(${(1 - k) * 22}deg) scale(${0.9 + k * 0.1}) translateY(${(1 - k) * 40}px)`, opacity: 0.35 + k * 0.65 }}
      >
        {children}
      </div>
    </div>
  );
}
