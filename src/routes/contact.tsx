import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { DotList, PageBody, Panel } from "@/components/site/inner";
import { EmberLink, LineLink, OutlineLink, PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { DISTRICTS, HEAD_OFFICE } from "@/lib/site/about";
import { SITE } from "@/lib/site/content";
import { photos } from "@/lib/site/media";
import { pageMeta } from "@/lib/site/seo";

export const Route = createFileRoute("/contact")({
  head: () =>
    pageMeta(
      "Contact LAWMA · Report illegal dumping, find your PSP",
      "Call 617 (Glo), 0800 005 2962 toll-free or 0708 060 1020. Head office at No. 3 Iddo Yard, Ijora Olopa. Report illegal dumping, blocked drains and missed collections.",
    ),
  component: Contact,
});

function Contact() {
  return (
    <SiteLayout>
      <PageHero
        title={["Contact", <span key="e" className="tone-em">us</span>]}
        intro="Illegal dumping, an overflowing public bin, a blocked drain or a missed collection: tell us and the right team takes ownership."
        image={photos.household}
        alt="A Lagos household bringing out its bin for collection"
      >
        <EmberLink to="/report">Report illegal dumping</EmberLink>
        <OutlineLink href="tel:617" className="border-paper/25 bg-paper/10 text-paper backdrop-blur hover:border-paper/60">
          Call 617
        </OutlineLink>
      </PageHero>

      <PageBody
        aside={
          <div className="rounded-2xl bg-card p-6">
            <img src={photos.transferStation} alt="" className="aspect-[16/10] w-full rounded-xl object-cover" />
            <DotList
              className="mt-5"
              items={[
                <>
                  <span className="block font-semibold text-ink">Head office</span>
                  {HEAD_OFFICE}
                </>,
                <>
                  <span className="block font-semibold text-ink">Email</span>
                  <a href={`mailto:${SITE.email}`} className="underline decoration-ink/20 underline-offset-4 hover:decoration-ink">
                    {SITE.email}
                  </a>
                </>,
                <>
                  <span className="block font-semibold text-ink">Office hours</span>
                  {SITE.hours}
                </>,
              ]}
            />
          </div>
        }
      >
        <Panel
          title={
            <>
              Call <span className="tone-em">us</span>
            </>
          }
        >
          <ul className="grid gap-px overflow-hidden rounded-xl bg-line-light sm:grid-cols-3">
            {SITE.tollFree.map((t) => (
              <li key={t.value} className="bg-card">
                <a href={t.href} className="group flex h-full flex-col p-5 transition-colors hover:bg-paper-2">
                  <span className="text-[0.8125rem] text-stone">{t.label}</span>
                  <span className="display mt-6 whitespace-nowrap text-[clamp(1.7rem,2.4vw,2.2rem)] tabular-nums">{t.value}</span>
                </a>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title={
            <>
              Report <span className="tone-em">a problem</span>
            </>
          }
        >
          <p className="max-w-[60ch] text-[1rem] leading-relaxed text-ink/75">
            Add a photo and the location of dumped waste, an overflowing public bin or a blocked drain, and get a reference number to follow it to cleared.
          </p>
          <div className="mt-6 flex flex-wrap gap-6">
            <LineLink to="/report">Report online</LineLink>
            <LineLink href={SITE.customerApp}>Use the SmartWaste360 app</LineLink>
          </div>
        </Panel>

        <Panel
          title={
            <>
              Your <span className="tone-em">district office</span>
            </>
          }
        >
          <ul className="border-t border-line-light">
            {DISTRICTS.map((d) => (
              <li key={d.name} className="grid gap-1 border-b border-line-light py-4 sm:grid-cols-[110px_1fr_auto] sm:items-baseline sm:gap-4">
                <span className="font-semibold text-ink">{d.name}</span>
                <span className="text-[0.9375rem] text-ink/75">{d.head}</span>
                <a href={`mailto:${d.email}`} className="text-[0.875rem] text-ink/75 underline decoration-ink/20 underline-offset-4 hover:decoration-ink">
                  {d.email}
                </a>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title={
            <>
              Follow <span className="tone-em">LAWMA</span>
            </>
          }
        >
          <ul className="border-t border-line-light">
            {[...SITE.social, { label: "LAWMA Academy", href: SITE.academy }].map((s) => (
              <li key={s.href} className="border-b border-line-light">
                <a href={s.href} target="_blank" rel="noopener" className="group flex items-center justify-between py-4 text-[1.0625rem] font-semibold">
                  <span className="transition-transform duration-500 group-hover:translate-x-1.5">{s.label}</span>
                  <ArrowUpRight className="size-4 opacity-40 transition group-hover:opacity-100" />
                </a>
              </li>
            ))}
          </ul>
        </Panel>
      </PageBody>
    </SiteLayout>
  );
}
