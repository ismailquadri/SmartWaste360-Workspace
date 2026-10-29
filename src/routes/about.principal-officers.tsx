import { createFileRoute } from "@tanstack/react-router";

import { Reveal } from "@/components/site/motion";
import { PageBody, Panel } from "@/components/site/inner";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { OFFICERS, portrait } from "@/lib/site/about";
import { photos } from "@/lib/site/media";
import { pageMeta } from "@/lib/site/seo";

export const Route = createFileRoute("/about/principal-officers")({
  head: () =>
    pageMeta(
      "Principal officers · LAWMA",
      "The directors and heads of department who lead the Lagos Waste Management Authority’s finance, operations, services and districts.",
    ),
  component: PrincipalOfficers,
});

function PrincipalOfficers() {
  return (
    <SiteLayout>
      <PageHero
        title={["Principal", <span key="e" className="tone-em">officers</span>]}
        intro="The directors and heads of department who run LAWMA’s finance, operations, services and districts."
        image={photos.controlRoom}
        alt="LAWMA operations team at work"
      />
      <PageBody>
        <Panel
          title={
            <>
              Management <span className="tone-em">team</span>
            </>
          }
        >
          <ul className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-4">
            {OFFICERS.map((o, i) => (
              <Reveal as="li" key={o.name} delay={(i % 4) * 60}>
                <div className="aspect-[4/5] overflow-hidden rounded-xl bg-paper-2">
                  <img src={portrait(o.photo)} alt={o.name} loading="lazy" className="h-full w-full object-cover" />
                </div>
                <p className="mt-4 text-[1rem] font-semibold leading-snug text-ink">{o.name}</p>
                <p className="mt-1 flex gap-2 text-[0.875rem] leading-snug text-stone">
                  <span className="mt-[0.45em] size-1.5 shrink-0 rounded-full bg-ember" aria-hidden="true" />
                  {o.role}
                </p>
              </Reveal>
            ))}
          </ul>
        </Panel>
      </PageBody>
    </SiteLayout>
  );
}
