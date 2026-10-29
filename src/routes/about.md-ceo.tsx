import { createFileRoute } from "@tanstack/react-router";

import { DotList, HelpCard, PageBody, Panel, Prose, SectionNav } from "@/components/site/inner";
import { LineLink, PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { ABOUT_PAGES, MD_OFFICE } from "@/lib/site/about";
import { photos } from "@/lib/site/media";
import { pageMeta } from "@/lib/site/seo";

export const Route = createFileRoute("/about/md-ceo")({
  head: () =>
    pageMeta(
      "Office of the Managing Director/CEO · LAWMA",
      "The role of LAWMA’s Managing Director/CEO, who leads the Authority’s management team, departments and six operational districts.",
    ),
  component: MdCeo,
});

function MdCeo() {
  return (
    <SiteLayout>
      <PageHero
        title={["Office of", <span key="e" className="tone-em">the MD/CEO</span>]}
        intro="The Managing Director/CEO leads the Authority and is accountable for a clean Lagos."
        image={photos.heroBridge}
        alt="LAWMA trucks crossing a Lagos bridge at sunrise"
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
              The <span className="tone-em">office</span>
            </>
          }
        >
          <Prose>
            <p>{MD_OFFICE.lead}</p>
          </Prose>
          <DotList className="mt-6" items={MD_OFFICE.duties} />
        </Panel>
        <Panel
          title={
            <>
              Leadership <span className="tone-em">since 1985</span>
            </>
          }
        >
          <Prose>
            <p>Fifteen appointments have led the Authority and the boards before it, from General Managers to Managing Directors.</p>
          </Prose>
          <div className="mt-6 flex flex-wrap gap-6">
            <LineLink to="/about/past-md-ceos">Past MD/CEOs</LineLink>
            <LineLink to="/about/principal-officers">Principal officers</LineLink>
          </div>
        </Panel>
      </PageBody>
    </SiteLayout>
  );
}
