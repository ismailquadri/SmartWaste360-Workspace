import { createFileRoute } from "@tanstack/react-router";

import { DotList, HelpCard, PageBody, Panel, Prose, SectionNav, StatCard, VTimeline } from "@/components/site/inner";
import { LineLink, PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { ABOUT_PAGES, HISTORY, MISSION, OPERATIONS, PROFILE, VISION } from "@/lib/site/about";
import { PSP_GROWTH } from "@/lib/site/content";
import { films, photos } from "@/lib/site/media";
import { pageMeta } from "@/lib/site/seo";

export const Route = createFileRoute("/about/")({
  head: () =>
    pageMeta(
      "Who we are · LAWMA, Nigeria’s pioneer waste authority since 1977",
      "LAWMA’s profile, vision and mission, history from the 1977 Refuse Disposal Board to today’s regulator, and the operations that keep Lagos clean.",
    ),
  component: WhoWeAre,
});

function WhoWeAre() {
  const max = Math.max(...PSP_GROWTH.map((g) => g.psp));
  return (
    <SiteLayout>
      <PageHero
        title={["Who", <span key="e" className="tone-em">we are</span>]}
        intro="Created in 1977 to keep pace with a growing capital, LAWMA has kept pace with Lagos ever since."
        image={photos.crewDawn}
        film={films.crewDawn}
        alt="LAWMA street sweepers at dawn"
      />
      <PageBody
        aside={
          <>
            <SectionNav title="About LAWMA" links={ABOUT_PAGES} />
            <StatCard value="1977" label="Year founded, ahead of FESTAC ’77" />
            <HelpCard />
          </>
        }
      >
        <Panel
          title={
            <>
              LAWMA’s <span className="tone-em">profile</span>
            </>
          }
        >
          <Prose>
            {PROFILE.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </Prose>
        </Panel>

        <Panel
          title={
            <>
              Vision <span className="tone-em">and mission</span>
            </>
          }
        >
          <div className="grid gap-px overflow-hidden rounded-xl bg-line-light sm:grid-cols-2">
            {[
              ["Vision", VISION],
              ["Mission", MISSION],
            ].map(([k, v]) => (
              <div key={k} className="bg-paper-2 p-6">
                <p className="text-[0.8125rem] font-semibold uppercase tracking-wide text-ember-text">{k}</p>
                <p className="mt-3 text-[1rem] leading-relaxed text-ink/85">{v}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title={
            <>
              From a board <span className="tone-em">to a regulator</span>
            </>
          }
        >
          <VTimeline years={HISTORY} />
        </Panel>

        <Panel
          title={
            <>
              Core operations <span className="tone-em">and initiatives</span>
            </>
          }
        >
          <p className="max-w-[64ch] text-[1rem] leading-relaxed text-ink/75">
            Waste in Lagos keeps growing with its population, industry and trade. These are the programmes LAWMA runs to keep the city clean and liveable.
          </p>
          <DotList
            className="mt-6"
            items={OPERATIONS.map((o) => (
              <>
                <span className="font-semibold text-ink">{o.t}.</span> {o.b}
              </>
            ))}
          />
        </Panel>

        <Panel
          title={
            <>
              Private Sector Participation <span className="tone-em">at a glance</span>
            </>
          }
        >
          <p className="max-w-[64ch] text-[1rem] leading-relaxed text-ink/75">
            Since PSP operators moved under LAWMA in 2007, the network of accredited operators, and the Lagosians they employ, has grown more than threefold.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {PSP_GROWTH.map((g) => (
              <div key={g.period}>
                <div className="flex h-40 items-end rounded-xl bg-paper-2 p-1.5">
                  <div className="w-full rounded-lg bg-ember" style={{ height: `${Math.max(12, (g.psp / max) * 100)}%` }} />
                </div>
                <p className="mt-3 text-[0.8125rem] text-stone">{g.period}</p>
                <p className="display text-[1.7rem] leading-tight">{g.psp}</p>
                <p className="text-[0.8125rem] text-stone">operators · {g.staff === 3500 ? "over 3,500" : g.staff.toLocaleString("en-GB")} staff</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <LineLink to="/about/awards">Achievements and awards</LineLink>
          </div>
        </Panel>
      </PageBody>
    </SiteLayout>
  );
}
