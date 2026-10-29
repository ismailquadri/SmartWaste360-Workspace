import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

import { MediaGrid } from "@/components/site/MediaGrid";
import { LineRise, Reveal } from "@/components/site/motion";
import { SectionHead, SiteLayout } from "@/components/site/SiteLayout";
import { NEWS, formatNewsDate } from "@/lib/site/content";
import { pageMeta } from "@/lib/site/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/newsroom")({
  head: () => pageMeta("Newsroom · LAWMA news, events and broadcasts", "Press releases, events and television appearances from the Lagos Waste Management Authority."),
  component: Newsroom,
});

const FILTERS = ["All", "News", "Events"] as const;

function Newsroom() {
  const [f, setF] = useState<(typeof FILTERS)[number]>("All");
  const items = [...NEWS].sort((a, b) => b.date.localeCompare(a.date)).filter((n) => f === "All" || n.category === f);
  return (
    <SiteLayout>
      <section className="bg-paper-2">
        <div className="mx-auto max-w-[1180px] px-5 pb-10 pt-36 md:px-10 md:pt-44">
          <h1 className="display text-[clamp(3rem,7vw,6rem)]">
            <LineRise lines="Newsroom" />
          </h1>
          <p className="mt-4 animate-fade-in text-[1rem] text-ink/70 [animation-delay:350ms]">Press releases, campaigns and events from LAWMA.</p>
          <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Filter stories">
            {FILTERS.map((x) => (
              <button
                key={x}
                type="button"
                role="tab"
                aria-selected={f === x}
                onClick={() => setF(x)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-[0.875rem] font-medium transition-colors",
                  f === x ? "border-ember bg-ember text-ember-foreground" : "border-line-light bg-card text-ink/70 hover:text-ink",
                )}
              >
                {x}
              </button>
            ))}
          </div>
        </div>
        <ul className="border-t border-line-light">
          {items.map((n) => (
            <Reveal as="li" key={n.href} className="border-b border-line-light">
              <a href={n.href} target="_blank" rel="noopener" className="group block transition-colors hover:bg-card">
                <div className="mx-auto flex max-w-[1180px] items-center gap-6 px-5 py-7 md:px-10">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2 text-[0.75rem]">
                      <span className="rounded-full border border-line-light bg-card px-2.5 py-0.5 text-ink/70">{n.category}</span>
                      <span className="rounded-full border border-line-light bg-card px-2.5 py-0.5 tabular-nums text-ink/70">{formatNewsDate(n.date)}</span>
                    </div>
                    <p className="mt-3 max-w-[40ch] text-[1.1875rem] font-semibold leading-snug tracking-tight text-ink md:text-[1.3125rem]">{n.title}</p>
                  </div>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line-light bg-card transition-colors group-hover:border-ember group-hover:bg-ember">
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </ul>
        <p className="mx-auto max-w-[1180px] px-5 py-8 text-[0.875rem] text-stone md:px-10">Stories open on lawma.gov.ng.</p>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-[1180px] px-5 py-24 md:px-10 md:py-28">
          <SectionHead
            label="On air"
            title={
              <>
                Watch <span className="tone-em">the conversation.</span>
              </>
            }
          />
          <div className="mt-14">
            <MediaGrid />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
