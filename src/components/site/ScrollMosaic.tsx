import { useEffect, useRef, useState, type ReactNode } from "react";

import { field, photos } from "@/lib/site/media";
import { cn } from "@/lib/utils";
import { CountUp, useReducedMotion, useStickyProgress } from "./motion";

type Tile = { src: string; alt: string; stat?: { value: number; suffix?: string; label: string } };
type Column = { kind: "tall" | "stack" | "wide"; tiles: Tile[]; width: string };

const COLUMNS: Column[] = [
  {
    kind: "tall",
    width: "w-[64vw] sm:w-[34vw] lg:w-[23vw]",
    tiles: [{ src: photos.crewDawn, alt: "Street sweepers in LAWMA hi-vis at dawn", stat: { value: 3500, suffix: "+", label: "PSP staff on Lagos streets" } }],
  },
  {
    kind: "stack",
    width: "w-[58vw] sm:w-[30vw] lg:w-[21vw]",
    tiles: [
      { src: field.bridgeSweep, alt: "Sweepers clearing a bridge at first light" },
      { src: field.binDrive2, alt: "Field officers meeting residents and traders on a bin drive" },
    ],
  },
  {
    kind: "wide",
    width: "w-[88vw] sm:w-[52vw] lg:w-[40vw]",
    tiles: [
      { src: photos.truckStreet, alt: "PSP crew lifting a household bin into a compactor truck" },
      { src: field.recyclingTour, alt: "Inspecting PET bales at a recovery facility" },
      { src: photos.academy, alt: "Pupils sorting recyclables into colour-coded bins" },
    ],
  },
  {
    kind: "tall",
    width: "w-[64vw] sm:w-[34vw] lg:w-[23vw]",
    tiles: [{ src: field.olusosun, alt: "Disposal trucks at the rehabilitated Olusosun site", stat: { value: 364, label: "Accredited PSP operators" } }],
  },
  {
    kind: "stack",
    width: "w-[58vw] sm:w-[30vw] lg:w-[21vw]",
    tiles: [
      { src: photos.marketMorning, alt: "Market lane cleared before trading opens" },
      { src: field.binDrive1, alt: "Bin enforcement drive with field officers" },
    ],
  },
  {
    kind: "tall",
    width: "w-[64vw] sm:w-[34vw] lg:w-[23vw]",
    tiles: [{ src: photos.lagoonDusk, alt: "Marine team on the lagoon at dusk", stat: { value: 6, label: "Operational districts across the state" } }],
  },
  {
    kind: "stack",
    width: "w-[58vw] sm:w-[30vw] lg:w-[21vw]",
    tiles: [
      { src: field.binDrive3, alt: "Collection crew on a compliance round" },
      { src: photos.recycling, alt: "Recyclers sorting PET into bales" },
    ],
  },
  {
    kind: "tall",
    width: "w-[64vw] sm:w-[34vw] lg:w-[23vw]",
    tiles: [{ src: photos.transferStation, alt: "Trucks tipping at a transfer loading station", stat: { value: 1977, label: "Serving Lagos since" } }],
  },
];

function Img({ tile, className }: { tile: Tile; className?: string }) {
  return (
    <figure className={cn("relative overflow-hidden rounded-2xl bg-paper-3", className)}>
      <img src={tile.src} alt={tile.alt} loading="lazy" decoding="async" draggable={false} className="absolute inset-0 h-full w-full object-cover" />
      {tile.stat && (
        <figcaption className="glass absolute inset-x-2 bottom-2 rounded-xl p-5 text-paper md:inset-x-3 md:bottom-3 md:p-6">
          <CountUp value={tile.stat.value} suffix={tile.stat.suffix} className="display block text-[clamp(2.2rem,3.4vw,3.25rem)] leading-none tabular-nums" />
          <span className="mt-2 block text-[0.8125rem] text-paper/80">{tile.stat.label}</span>
        </figcaption>
      )}
    </figure>
  );
}

function ColumnView({ col }: { col: Column }) {
  const [a, b, c] = col.tiles;
  return (
    <div className={cn("grid h-full shrink-0 gap-2 md:gap-3", col.width, col.kind !== "tall" && "grid-rows-2")}>
      {col.kind === "tall" && a && <Img tile={a} />}
      {col.kind === "stack" && (
        <>
          {a && <Img tile={a} />}
          {b && <Img tile={b} />}
        </>
      )}
      {col.kind === "wide" && (
        <>
          {a && <Img tile={a} />}
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            {b && <Img tile={b} />}
            {c && <Img tile={c} />}
          </div>
        </>
      )}
    </div>
  );
}

/** Pinned photo mosaic that travels sideways while you scroll down, with key figures on frosted cards. */
export function ScrollMosaic({ heading }: { heading?: ReactNode }) {
  const [section, p] = useStickyProgress<HTMLElement>();
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const measure = () => {
      const el = track.current;
      if (el) setDistance(Math.max(0, el.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, []);

  if (reduced) {
    return (
      <section className="bg-paper py-24">
        {heading}
        <div className="no-scrollbar mt-12 flex h-[70svh] gap-3 overflow-x-auto px-5 md:px-10">
          {COLUMNS.map((c, i) => (
            <ColumnView key={i} col={c} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={section} className="relative bg-paper" style={{ height: `calc(100svh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden pt-20">
        {heading}
        <div
          ref={track}
          className="mt-10 flex h-[min(62svh,620px)] w-max gap-2 px-5 will-change-transform md:mt-12 md:gap-3 md:px-10"
          style={{ transform: `translate3d(${-p * distance}px,0,0)` }}
        >
          {COLUMNS.map((c, i) => (
            <ColumnView key={i} col={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
