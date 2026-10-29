import { createFileRoute } from "@tanstack/react-router";

import { DotList, HelpCard, PageBody, Panel, SectionNav, StatCard } from "@/components/site/inner";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { ABOUT_PAGES, DEPARTMENT_GROUPS, DISTRICTS } from "@/lib/site/about";
import { photos } from "@/lib/site/media";
import { pageMeta } from "@/lib/site/seo";

export const Route = createFileRoute("/about/departments")({
  head: () =>
    pageMeta(
      "Departments, units and districts · LAWMA",
      "LAWMA’s departments and units, from Operations and PSP Services to Enforcement and LAWMA Academy, and the heads of its six operational districts.",
    ),
  component: Departments,
});

const COUNT = DEPARTMENT_GROUPS.reduce((n, g) => n + g.items.length, 0);

function Departments() {
  return (
    <SiteLayout>
      <PageHero
        title={["Departments", <span key="e" className="tone-em">and units</span>]}
        intro="How the Authority is organised, and who to contact in each of its six operational districts."
        image={photos.transferStation}
        alt="Trucks at a LAWMA transfer loading station"
      />
      <PageBody
        aside={
          <>
            <SectionNav title="About LAWMA" links={ABOUT_PAGES} />
            <StatCard value={String(COUNT)} label="Departments and units" />
            <HelpCard />
          </>
        }
      >
        <Panel
          title={
            <>
              Departments <span className="tone-em">and units</span>
            </>
          }
        >
          <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
            {DEPARTMENT_GROUPS.map((g) => (
              <div key={g.title}>
                <h3 className="text-[0.9375rem] font-semibold text-ink">{g.title}</h3>
                <DotList className="mt-3" items={g.items} />
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          id="districts"
          title={
            <>
              Operational <span className="tone-em">districts</span>
            </>
          }
        >
          <p className="max-w-[64ch] text-[1rem] leading-relaxed text-ink/75">Each district has a District Head who oversees collection, PSP operators and compliance in the area.</p>
          <div className="mt-6 grid gap-px overflow-hidden rounded-xl bg-line-light sm:grid-cols-2">
            {DISTRICTS.map((d) => (
              <div key={d.name} className="bg-card p-5">
                <p className="display text-[1.6rem] leading-none">{d.name}</p>
                <p className="mt-3 text-[0.9375rem] font-semibold text-ink">{d.head}</p>
                <p className="text-[0.8125rem] text-stone">District Head</p>
                <div className="mt-3 space-y-1 text-[0.875rem]">
                  <a href={`mailto:${d.email}`} className="block text-ink/80 underline decoration-ink/20 underline-offset-4 hover:decoration-ink">
                    {d.email}
                  </a>
                  {d.phones.map((p) => (
                    <a key={p} href={`tel:+234${p.replace(/\s/g, "").slice(1)}`} className="block tabular-nums text-ink/80 hover:text-ink">
                      {p}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </PageBody>
    </SiteLayout>
  );
}
