import { createFileRoute } from "@tanstack/react-router";

import { Reveal } from "@/components/site/motion";
import { HelpCard, PageBody, Panel, SectionNav } from "@/components/site/inner";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { ABOUT_PAGES, PAST_MDS, portrait } from "@/lib/site/about";
import { photos } from "@/lib/site/media";
import { pageMeta } from "@/lib/site/seo";

export const Route = createFileRoute("/about/past-md-ceos")({
  head: () =>
    pageMeta(
      "Past MD/CEOs · LAWMA",
      "Every General Manager, Administrator and Managing Director who has led the Lagos Waste Management Authority since 1985.",
    ),
  component: PastMdCeos,
});

function PastMdCeos() {
  return (
    <SiteLayout>
      <PageHero
        title={["Past", <span key="e" className="tone-em">MD/CEOs</span>]}
        intro="The General Managers, Administrators and Managing Directors who have led the Authority since 1985."
        image={photos.lagoonDusk}
        alt="The Lagos lagoon at dusk"
      />
      <PageBody
        aside={
          <>
            <SectionNav title="About LAWMA" links={ABOUT_PAGES} />
            <HelpCard />
          </>
        }
      >
        <Panel
          title={
            <>
              Leaders <span className="tone-em">of the Authority</span>
            </>
          }
        >
          <ol className="relative">
            <span className="absolute bottom-6 left-[6px] top-6 w-px bg-ember/35" aria-hidden="true" />
            {PAST_MDS.map((m) => (
              <Reveal as="li" key={m.name + m.term} className="relative flex items-center gap-5 border-b border-line-light py-5 pl-9 last:border-b-0">
                <span className="absolute left-0 top-1/2 size-[13px] -translate-y-1/2 rounded-full bg-ember ring-4 ring-ember/15" aria-hidden="true" />
                <img src={portrait(m.photo)} alt={m.name} loading="lazy" className="size-20 shrink-0 rounded-xl object-cover md:size-24" />
                <div className="min-w-0">
                  <p className="text-[0.8125rem] tabular-nums text-stone">{m.term}</p>
                  <p className="mt-1 text-[1.0625rem] font-semibold leading-snug text-ink">{m.name}</p>
                  <p className="text-[0.875rem] text-ink/70">{m.title}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Panel>
      </PageBody>
    </SiteLayout>
  );
}
