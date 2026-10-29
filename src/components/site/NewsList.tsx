import { ArrowUpRight } from "lucide-react";
import { useRef, useState, type MouseEvent } from "react";

import { formatNewsDate, type NewsItem } from "@/lib/site/content";
import { field } from "@/lib/site/media";
import { cn } from "@/lib/utils";

/** Headline list with a photo that follows the cursor on wide screens. */
export function NewsList({ items, tone = "light" }: { items: NewsItem[]; tone?: "light" | "dark" }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<{ src: string; x: number; y: number } | null>(null);
  const dark = tone === "dark";

  const onMove = (e: MouseEvent, item: NewsItem) => {
    if (!item.image || !wrap.current) return setHover(null);
    const r = wrap.current.getBoundingClientRect();
    setHover({ src: field[item.image], x: e.clientX - r.left, y: e.clientY - r.top });
  };

  return (
    <div ref={wrap} className="relative" onMouseLeave={() => setHover(null)}>
      <ul className={cn("border-t", dark ? "border-line-dark" : "border-line-light")}>
        {items.map((n) => (
          <li key={n.href} className={cn("border-b", dark ? "border-line-dark" : "border-line-light")}>
            <a
              href={n.href}
              target="_blank"
              rel="noopener"
              onMouseMove={(e) => onMove(e, n)}
              className="group grid gap-3 py-6 md:grid-cols-12 md:items-baseline md:gap-6"
            >
              <span className={cn("eyebrow md:col-span-2", dark ? "text-mist" : "text-stone")}>{formatNewsDate(n.date)}</span>
              <span className="eyebrow text-ember-text md:col-span-1">{n.category}</span>
              <span className="text-[1.0625rem] font-medium leading-snug tracking-tight transition-transform duration-500 group-hover:translate-x-2 md:col-span-8 md:text-[1.1875rem]">
                {n.title}
              </span>
              <ArrowUpRight className="hidden size-5 justify-self-end opacity-40 transition group-hover:opacity-100 md:col-span-1 md:block" />
            </a>
          </li>
        ))}
      </ul>
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute left-0 top-0 z-10 hidden h-48 w-64 overflow-hidden rounded-xl shadow-2xl transition-opacity duration-300 lg:block",
          hover ? "opacity-100" : "opacity-0",
        )}
        style={{ transform: hover ? `translate3d(${hover.x + 24}px, ${hover.y - 96}px, 0) rotate(-2deg)` : undefined }}
      >
        {hover && <img src={hover.src} alt="" className="h-full w-full object-cover" />}
      </div>
    </div>
  );
}
