import { useState } from "react";

import { product } from "@/lib/site/media";
import { cn } from "@/lib/utils";
import { TiltIn } from "./motion";

const VIEWS = [
  { id: "overview", label: "City overview", note: "Backlog by area, operator scores and the day’s exceptions at a glance.", src: product.overview },
  { id: "fleet", label: "Live fleet", note: "Every truck on a road-level map, with collection evidence linked to each stop.", src: product.fleet },
  { id: "reports", label: "Public reports", note: "Dumps, blocked drains and overflowing bins from the app, WhatsApp and USSD — tracked to a cleared photo.", src: product.reports },
  { id: "facility", label: "Disposal sites", note: "Arrivals, weighbridge tickets and queue times at every site, oldest truck first.", src: product.facility },
] as const;

/** Tabbed browser frame showing real SmartWaste360 screens; tilts into place on scroll. */
export function ProductShowcase() {
  const [view, setView] = useState<(typeof VIEWS)[number]["id"]>("overview");
  const current = VIEWS.find((v) => v.id === view)!;
  return (
    <div className="flex flex-col items-center">
      <div className="inline-flex flex-wrap justify-center gap-1 rounded-xl border border-line-light bg-card p-1" role="tablist" aria-label="SmartWaste360 screens">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            role="tab"
            aria-selected={v.id === view}
            onClick={() => setView(v.id)}
            className={cn(
              "rounded-lg px-4 py-2 text-[0.875rem] font-medium transition-colors",
              v.id === view ? "bg-ink text-paper" : "text-ink/65 hover:text-ink",
            )}
          >
            {v.label}
          </button>
        ))}
      </div>
      <p className="mt-5 max-w-lg text-center text-[0.9375rem] text-stone" aria-live="polite">
        {current.note}
      </p>
      <TiltIn className="mt-10 w-full">
        <div className="overflow-hidden rounded-2xl border border-line-light bg-card shadow-lift">
          <div className="flex items-center gap-2 border-b border-line-light px-4 py-3">
            <span className="size-2.5 rounded-full bg-paper-3" />
            <span className="size-2.5 rounded-full bg-paper-3" />
            <span className="size-2.5 rounded-full bg-paper-3" />
            <span className="eyebrow ml-3 truncate text-stone">smartwaste360 · {current.label}</span>
          </div>
          <div className="relative aspect-[16/10] bg-paper">
            {VIEWS.map((v) => (
              <img
                key={v.id}
                src={v.src}
                alt={`SmartWaste360 ${v.label} screen`}
                loading="lazy"
                className={cn(
                  "absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700",
                  v.id === view ? "opacity-100" : "opacity-0",
                )}
              />
            ))}
          </div>
        </div>
      </TiltIn>
    </div>
  );
}
