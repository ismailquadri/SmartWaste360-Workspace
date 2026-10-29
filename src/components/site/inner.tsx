import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { linkPath, type NavLink } from "@/lib/site/nav";
import { SITE } from "@/lib/site/content";
import { cn } from "@/lib/utils";
import { Reveal } from "./motion";
import { EmberLink } from "./SiteLayout";

/** Inner-page body: a main column of white panels on grey, with a sticky aside. */
export function PageBody({ children, aside, className }: { children: ReactNode; aside?: ReactNode; className?: string }) {
  return (
    <section className={cn("bg-paper-2", className)}>
      <div className="mx-auto grid max-w-[1180px] gap-6 px-5 py-14 md:px-10 md:py-20 lg:grid-cols-12">
        <div className={cn("min-w-0 space-y-6", aside ? "lg:col-span-8" : "lg:col-span-12")}>{children}</div>
        {aside && (
          <aside className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-28">{aside}</div>
          </aside>
        )}
      </div>
    </section>
  );
}

export function Panel({ title, children, className, id }: { title?: ReactNode; children: ReactNode; className?: string; id?: string }) {
  return (
    <Reveal as="article" id={id} className={cn("scroll-mt-28 rounded-2xl bg-card p-6 md:p-9", className)}>
      {title && <h2 className="text-balance text-[clamp(1.35rem,2vw,1.7rem)] font-semibold leading-tight tracking-tight text-ink [&_.tone-em]:text-ember-text">{title}</h2>}
      <div className={cn(title && "mt-5")}>{children}</div>
    </Reveal>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return <div className="max-w-[64ch] space-y-4 text-[1rem] leading-relaxed text-ink/75">{children}</div>;
}

export function DotList({ items, className }: { items: ReactNode[]; className?: string }) {
  return (
    <ul className={cn("border-t border-line-light", className)}>
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 border-b border-line-light py-3.5 text-[0.9375rem] leading-relaxed text-ink/85">
          <span className="mt-[0.55em] size-2 shrink-0 rounded-[3px] bg-lemon" aria-hidden="true" />
          <span className="min-w-0">{it}</span>
        </li>
      ))}
    </ul>
  );
}

export function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <Reveal className="rounded-2xl bg-card px-6 py-8 text-center">
      <p className="text-[0.875rem] text-stone">{label}</p>
      <p className="display mt-3 text-[2.6rem] leading-none tabular-nums text-ink">{value}</p>
    </Reveal>
  );
}

/** Dark call-to-action card: the aside's equivalent of a quote form. */
export function HelpCard() {
  return (
    <div className="rounded-2xl bg-ink p-7 text-paper">
      <h3 className="display text-[1.8rem] leading-[0.95]">
        Need help <span className="text-ember">now?</span>
      </h3>
      <p className="mt-3 text-[0.875rem] leading-relaxed text-paper/70">Report dumping online, or call us. Lines are open {SITE.hours.replace(" · ", ", ")}.</p>
      <ul className="mt-5 border-t border-line-dark text-[0.9375rem]">
        {SITE.tollFree.map((t) => (
          <li key={t.value} className="border-b border-line-dark">
            <a href={t.href} className="flex items-baseline justify-between gap-3 py-3 transition-colors hover:text-lemon-text">
              <span className="font-semibold tabular-nums">{t.value}</span>
              <span className="text-[0.8125rem] text-paper/55">{t.label}</span>
            </a>
          </li>
        ))}
      </ul>
      <EmberLink to="/report" className="mt-6 w-full justify-center">
        Report illegal dumping
      </EmberLink>
    </div>
  );
}

/** Sibling pages of a section, with the current one marked. */
export function SectionNav({ title, links }: { title: string; links: readonly NavLink[] }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname.replace(/\/$/, "") || "/" });
  return (
    <nav aria-label={title} className="rounded-2xl bg-card p-6">
      <p className="text-[0.875rem] font-semibold text-ink">{title}</p>
      <ul className="mt-3">
        {links.map((l) => {
          const active = linkPath(l) === pathname;
          return (
            <li key={l.label}>
              <Link
                to={l.to ?? "/"}
                params={l.params as never}
                aria-current={active ? "page" : undefined}
                className={cn("flex items-center gap-3 rounded-lg py-2 text-[0.9375rem] transition-colors", active ? "font-semibold text-ember-text" : "text-ink/75 hover:text-ink")}
              >
                <span className={cn("size-2 shrink-0 rounded-[3px]", active ? "bg-lemon" : "bg-ink/15")} aria-hidden="true" />
                {l.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export type TimelineYear = { year: string; items: { when?: string; text: ReactNode; by?: string }[] };

/** Vertical timeline: a year on the left, its entries on the right, joined by one rule. */
export function VTimeline({ years }: { years: TimelineYear[] }) {
  return (
    <ol className="relative">
      <span className="absolute bottom-3 left-[6px] top-3 w-px bg-lemon/35" aria-hidden="true" />
      {years.map((y) => (
        <Reveal as="li" key={y.year} className="relative grid gap-2 pl-9 md:grid-cols-[150px_1fr] md:gap-8">
          <span className="absolute left-0 top-[1.15rem] size-[13px] rounded-full bg-lemon ring-4 ring-lemon/15" aria-hidden="true" />
          <p className="display pt-2.5 text-[2.3rem] leading-none tabular-nums text-ink md:pt-3">{y.year}</p>
          <ul>
            {y.items.map((it, i) => (
              <li key={i} className="border-b border-line-light py-4">
                {it.when && <p className="text-[0.75rem] text-stone">{it.when}</p>}
                <p className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink/85">
                  <span className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-lemon" aria-hidden="true" />
                  <span>
                    {it.text}
                    {it.by && <span className="block text-[0.875rem] text-stone">{it.by}</span>}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      ))}
    </ol>
  );
}
