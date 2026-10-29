import { useEffect, useRef, useState } from "react";

import { films, photos } from "@/lib/site/media";
import { cn } from "@/lib/utils";
import { SectionHead } from "./SiteLayout";

const CHAPTERS = [
  {
    time: "05:00",
    place: "Lagos Island",
    title: "The first sweep.",
    body: "Before the first danfo, street sweepers are already out on the Marina. By sunrise the city’s busiest roads are clear.",
    image: photos.crewDawn,
    film: films.crewDawn,
  },
  {
    time: "07:30",
    place: "Lekki · Surulere · Ikeja",
    title: "At your gate.",
    body: "Accredited PSP crews work their wards street by street, lifting bins that households set out the night before.",
    image: photos.truckStreet,
  },
  {
    time: "09:00",
    place: "Markets",
    title: "Clean before trade.",
    body: "Sanitation windows clear market lanes before the first customer arrives, so commerce and hygiene open together.",
    image: photos.marketMorning,
  },
  {
    time: "13:00",
    place: "Transfer & disposal",
    title: "Every load, received.",
    body: "Trucks arrive, are weighed and tip at the transfer station, then turn round for the next round. Queues are managed, not endured.",
    image: photos.transferStation,
  },
  {
    time: "16:00",
    place: "Recovery",
    title: "Waste becomes material.",
    body: "Registered recyclers sort PET, cans and paper into bales for local industry: jobs from what the city leaves behind.",
    image: photos.recycling,
  },
  {
    time: "19:00",
    place: "Lagos lagoon",
    title: "Water, cleared.",
    body: "Marine teams lift floating litter from the lagoon and drains, protecting homes from flooding when the rains come.",
    image: photos.lagoonDusk,
  },
  {
    time: "22:00",
    place: "SmartWaste360",
    title: "The city, watched over.",
    body: "In the control room, every route, alarm and disposal receipt comes together, so tomorrow starts with what today left undone.",
    image: photos.controlRoom,
    film: films.controlRoom,
  },
];

/** Sticky, scroll-driven chapter story of a day of LAWMA service. */
export function DayInLagos() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset['index']));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === active) v.play().catch(() => {});
      else v.pause();
    });
  }, [active]);

  return (
    <section className="relative bg-paper-2" aria-labelledby="day-title">
      <div className="mx-auto max-w-[1280px] px-5 pt-24 md:px-10 md:pt-32">
        <SectionHead
          label="A day in Lagos"
          title={
            <span id="day-title">
              Twenty-four hours. <span className="tone-em">One clean city.</span>
            </span>
          }
          aside="Follow the day from the first sweep to the control room."
        />
      </div>

      <div className="mx-auto grid max-w-[1280px] gap-10 px-5 pb-24 pt-14 md:px-10 lg:grid-cols-12 lg:gap-16 lg:pb-32">
        {/* Sticky media column */}
        <div className="lg:col-span-7">
          <div className="sticky top-[12svh] hidden aspect-[4/3] overflow-hidden rounded-2xl bg-paper-3 shadow-lift lg:block">
            {CHAPTERS.map((c, i) =>
              c.film ? (
                <video
                  key={c.time}
                  ref={(el) => {
                    videos.current[i] = el;
                  }}
                  src={c.film}
                  poster={c.image}
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[1200ms] ease-out",
                    i === active ? "scale-100 opacity-100" : "scale-[1.06] opacity-0",
                  )}
                />
              ) : (
                <img
                  key={c.time}
                  src={c.image}
                  alt=""
                  loading="lazy"
                  className={cn(
                    "absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[1200ms] ease-out",
                    i === active ? "scale-100 opacity-100" : "scale-[1.06] opacity-0",
                  )}
                />
              ),
            )}
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-[linear-gradient(0deg,color-mix(in_oklab,var(--ink)_80%,transparent),transparent)] p-6">
              <p className="display text-[clamp(2.5rem,4vw,3.75rem)] leading-none text-paper tabular-nums">{CHAPTERS[active]?.time}</p>
              <p className="eyebrow pb-1 text-paper/85">{CHAPTERS[active]?.place}</p>
            </div>
            <div className="absolute left-6 right-6 top-6 flex gap-1.5" aria-hidden="true">
              {CHAPTERS.map((c, i) => (
                <span key={c.time} className="h-[2px] flex-1 overflow-hidden rounded bg-paper/20">
                  <span className={cn("block h-full bg-ember transition-[width] duration-700", i <= active ? "w-full" : "w-0")} />
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Scrolling chapters */}
        <ol className="lg:col-span-5">
          {CHAPTERS.map((c, i) => (
            <li
              key={c.time}
              data-index={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              className="flex min-h-[70svh] flex-col justify-center border-t border-line-light py-12 first:border-t-0 lg:min-h-[66svh]"
            >
              <img src={c.image} alt="" loading="lazy" className="mb-8 aspect-[4/3] w-full rounded-xl object-cover lg:hidden" />
              <p className={cn("eyebrow transition-colors duration-500", i === active ? "text-ember-text" : "text-stone")}>
                {c.time} · {c.place}
              </p>
              <h3
                className={cn(
                  "display mt-4 text-[clamp(1.75rem,2.6vw,2.5rem)] transition-opacity duration-700",
                  i === active ? "opacity-100" : "lg:opacity-30",
                )}
              >
                {c.title}
              </h3>
              <p
                className={cn(
                  "mt-4 max-w-md text-[1rem] leading-relaxed text-stone transition-opacity duration-700",
                  i === active ? "opacity-100" : "lg:opacity-30",
                )}
              >
                {c.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
