import { MapPin, Phone, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { RECYCLERS } from "@/lib/site/content";
import { cn } from "@/lib/utils";

/** Search LAWMA's register of household recyclers by Local Government or LCDA. */
export function RecyclerFinder({ tone = "light" }: { tone?: "light" | "dark" }) {
  const areas = useMemo(() => Array.from(new Set(RECYCLERS.map((r) => r.area))), []);
  const [area, setArea] = useState(areas[0]);
  const [q, setQ] = useState("");
  const shown = areas.filter((a) => a.toLowerCase().includes(q.trim().toLowerCase()));
  const matches = RECYCLERS.filter((r) => r.area === area);
  const dark = tone === "dark";

  return (
    <div className={cn("grid overflow-hidden rounded-2xl border lg:grid-cols-[1fr_1.1fr]", dark ? "border-line-dark bg-ink-2" : "border-line-light bg-card")}>
      <div className={cn("border-b p-6 lg:border-b-0 lg:border-r md:p-8", dark ? "border-line-dark" : "border-line-light")}>
        <label className={cn("flex h-12 items-center gap-3 rounded-xl border px-5", dark ? "border-line-dark" : "border-line-light")}>
          <Search className="size-4 opacity-60" />
          <span className="sr-only">Find your area</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Type your area, e.g. Surulere"
            className="h-full w-full bg-transparent text-[0.9375rem] outline-none placeholder:opacity-50"
          />
        </label>
        <div className="mt-6 flex max-h-[300px] flex-wrap gap-2 overflow-y-auto pr-1" role="listbox" aria-label="Local Government or LCDA">
          {shown.map((a) => (
            <button
              key={a}
              type="button"
              role="option"
              aria-selected={a === area}
              onClick={() => setArea(a)}
              className={cn(
                "rounded-lg border px-3.5 py-2 text-[0.875rem] transition-colors",
                a === area
                  ? "border-ink bg-ink text-paper"
                  : dark
                    ? "border-line-dark text-paper/80 hover:border-paper/40"
                    : "border-line-light text-ink/80 hover:border-ink/40",
              )}
            >
              {a}
            </button>
          ))}
          {!shown.length && <p className="text-[0.9375rem] opacity-60">No registered recycler listed for that area yet. Call 617 and we’ll point you to the nearest one.</p>}
        </div>
      </div>
      <div className="p-6 md:p-8" aria-live="polite">
        <p className={cn("eyebrow", dark ? "text-mist" : "text-stone")}>Registered recycler · {area}</p>
        <ul className="mt-6 space-y-6">
          {matches.map((r) => (
            <li key={r.name + r.phone}>
              <p className="text-xl font-semibold tracking-tight md:text-2xl">{r.name}</p>
              <p className={cn("mt-3 flex items-start gap-2 text-[0.9375rem]", dark ? "text-paper/70" : "text-stone")}>
                <MapPin className="mt-0.5 size-4 shrink-0 text-lemon-text" />
                {r.address}
              </p>
              <a href={`tel:+234${r.phone.replace(/\s/g, "").slice(1)}`} className="mt-2 inline-flex items-center gap-2 text-[0.9375rem] font-medium hover:text-lemon-text">
                <Phone className="size-4 text-lemon-text" />
                {r.phone}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
