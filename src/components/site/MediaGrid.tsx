import { Play, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { MEDIA } from "@/lib/site/content";
import { Reveal } from "./motion";

/** LAWMA on air: interview cards that open the broadcast in a cinema-style player. */
export function MediaGrid() {
  const [active, setActive] = useState<(typeof MEDIA)[number] | null>(null);
  useEffect(() => {
    document.documentElement.classList.toggle("lenis-stopped", !!active);
  }, [active]);

  return (
    <>
      <div className="grid gap-5 md:grid-cols-3">
        {MEDIA.map((m, i) => (
          <Reveal key={m.id} delay={i * 120}>
            <button
              type="button"
              onClick={() => setActive(m)}
              className="group block w-full text-left"
              aria-label={`Play: ${m.title}`}
            >
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-ink-3">
                <img
                  src={`https://i.ytimg.com/vi/${m.id}/maxresdefault.jpg`}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid size-16 place-items-center rounded-full bg-paper/90 text-ink backdrop-blur transition-transform duration-500 group-hover:scale-110">
                    <Play className="ml-0.5 size-5 fill-current" />
                  </span>
                </span>
              </div>
              <p className="eyebrow mt-5 text-ember-text">
                {m.outlet} · {m.date}
              </p>
              <p className="mt-2 text-[1.0625rem] font-semibold leading-snug tracking-tight">{m.title}</p>
            </button>
          </Reveal>
        ))}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-[min(1100px,94vw)] gap-0 overflow-hidden border-line-dark bg-ink p-0 text-paper sm:rounded-2xl [&>button:last-child]:hidden">
          <DialogTitle className="sr-only">{active?.title}</DialogTitle>
          {active && (
            <>
              <div className="aspect-video w-full bg-ink">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${active.id}?autoplay=1&rel=0`}
                  title={active.title}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              </div>
              <div className="flex items-center justify-between gap-4 px-6 py-4">
                <div>
                  <p className="eyebrow text-ember">{active.outlet}</p>
                  <p className="mt-1 font-medium">{active.title}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  className="grid size-10 shrink-0 place-items-center rounded-full border border-line-dark hover:bg-paper/10"
                  aria-label="Close player"
                >
                  <X className="size-4" />
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
