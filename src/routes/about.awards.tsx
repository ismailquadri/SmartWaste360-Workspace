import { createFileRoute } from "@tanstack/react-router";

import { DotList, HelpCard, PageBody, Panel, SectionNav, VTimeline } from "@/components/site/inner";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { ABOUT_PAGES, ACHIEVEMENTS, ACHIEVEMENT_NOTES, AWARDS_BY_YEAR } from "@/lib/site/about";
import { photos } from "@/lib/site/media";
import { pageMeta } from "@/lib/site/seo";

export const Route = createFileRoute("/about/awards")({
  head: () =>
    pageMeta(
      "Achievements and awards · LAWMA",
      "LAWMA’s recent achievements in recycling, PSP, street sweeping and enforcement, and the awards it has received since 2006.",
    ),
  component: Awards,
});

function Awards() {
  return (
    <SiteLayout>
      <PageHero
        title={["Achievements", <span key="e" className="tone-em">and awards</span>]}
        intro="What has changed on Lagos’ streets, and the recognition LAWMA has received along the way."
        image={photos.skylineNight}
        alt="The Lagos skyline at night"
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
              Recent <span className="tone-em">achievements</span>
            </>
          }
        >
          <div className="grid gap-px overflow-hidden rounded-xl bg-line-light sm:grid-cols-2 md:grid-cols-3">
            {ACHIEVEMENTS.map((a) => (
              <div key={a.label} className="bg-paper-2 p-5">
                <p className="display text-[2.2rem] leading-none tabular-nums">{a.value}</p>
                <p className="mt-2 text-[0.875rem] leading-snug text-ink/75">{a.label}</p>
              </div>
            ))}
          </div>
          <DotList className="mt-6" items={ACHIEVEMENT_NOTES} />
        </Panel>

        <Panel
          title={
            <>
              Awards <span className="tone-em">by year</span>
            </>
          }
        >
          <VTimeline years={AWARDS_BY_YEAR.map((y) => ({ year: y.year, items: y.items.map((it) => ({ text: it.title, by: it.by })) }))} />
        </Panel>
      </PageBody>
    </SiteLayout>
  );
}
