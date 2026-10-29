import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { HelpCard, PageBody, Panel } from "@/components/site/inner";
import { Reveal } from "@/components/site/motion";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { photos } from "@/lib/site/media";
import { pageMeta } from "@/lib/site/seo";
import { SERVICE_PAGES } from "@/lib/site/services";

export const Route = createFileRoute("/services/")({
  head: () =>
    pageMeta(
      "Services · Collection, disposal, recycling and waterways | LAWMA",
      "Household PSP collection, market and business sanitation, disposal sites, registered recyclers, drain and marine clean-ups, and LAWMA Academy.",
    ),
  component: Services,
});

function Services() {
  return (
    <SiteLayout>
      <PageHero
        title={["Our", <span key="e" className="tone-em">services</span>]}
        intro="From your gate to the disposal site, from a market lane to the lagoon: how LAWMA serves Lagos."
        image={photos.marketMorning}
        alt="A Lagos market lane cleared before trading"
      />
      <PageBody>
        <Panel
          title={
            <>
              Find the service <span className="tone-em">you need</span>
            </>
          }
        >
          <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICE_PAGES.map((s, i) => (
              <Reveal as="li" key={s.id} delay={(i % 3) * 80}>
                <Link to="/services/$serviceId" params={{ serviceId: s.id }} className="group block">
                  <div className="aspect-[4/3] overflow-hidden rounded-xl bg-paper-2">
                    <img src={s.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]" />
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[1.125rem] font-semibold leading-snug text-ink">{s.title}</p>
                      <p className="mt-1 text-[0.875rem] leading-snug text-stone">{s.subline}</p>
                    </div>
                    <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line-light transition-colors group-hover:border-ember group-hover:bg-ember">
                      <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </Panel>
        <div className="grid gap-6 md:grid-cols-2">
          <Panel
            title={
              <>
                Not sure who <span className="tone-em">to call?</span>
              </>
            }
          >
            <p className="text-[1rem] leading-relaxed text-ink/75">
              Dial 617 from a Glo line, or 0800 005 2962 toll-free. Customer care will put you through to the right team or your PSP operator.
            </p>
          </Panel>
          <HelpCard />
        </div>
      </PageBody>
    </SiteLayout>
  );
}
