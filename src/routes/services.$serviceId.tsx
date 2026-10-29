import { createFileRoute, notFound } from "@tanstack/react-router";

import { DotList, HelpCard, PageBody, Panel, Prose, SectionNav, StatCard } from "@/components/site/inner";
import { ParallaxImage } from "@/components/site/motion";
import { RecyclerFinder } from "@/components/site/RecyclerFinder";
import { EmberLink, LineLink, PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { SERVICE_LINKS } from "@/lib/site/nav";
import { pageMeta } from "@/lib/site/seo";
import { servicePage } from "@/lib/site/services";

export const Route = createFileRoute("/services/$serviceId")({
  loader: ({ params }) => {
    const page = servicePage(params.serviceId);
    if (!page) throw notFound();
    return { id: page.id };
  },
  head: ({ loaderData }) => {
    const page = loaderData ? servicePage(loaderData.id) : undefined;
    if (!page) return { meta: [{ title: "Service · LAWMA" }, { name: "robots", content: "noindex" }] };
    return pageMeta(`${page.title} · LAWMA`, `${page.subline} ${page.intro[0] ?? ""}`.slice(0, 158));
  },
  component: ServicePage,
  notFoundComponent: () => (
    <SiteLayout>
      <section className="mx-auto max-w-[720px] px-5 pb-32 pt-40">
        <h1 className="display text-[2.4rem]">Service not found</h1>
        <p className="mt-4 text-[1rem] text-stone">That service page doesn’t exist.</p>
        <div className="mt-8">
          <EmberLink to="/services">All services</EmberLink>
        </div>
      </section>
    </SiteLayout>
  ),
});

function ServicePage() {
  const { id } = Route.useLoaderData();
  const page = servicePage(id)!;
  return (
    <SiteLayout>
      <PageHero
        title={[page.heading[0], <span key="e" className="tone-em">{page.heading[1]}</span>]}
        intro={page.subline}
        image={page.image}
        alt={page.title}
      />
      <PageBody
        aside={
          <>
            <StatCard value={page.stat.value} label={page.stat.label} />
            <SectionNav title="Our services" links={SERVICE_LINKS} />
            <HelpCard />
          </>
        }
      >
        <Panel
          title={
            <>
              About <span className="tone-em">this service</span>
            </>
          }
        >
          <Prose>
            {page.intro.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </Prose>
          <ParallaxImage src={page.image} alt={page.title} className="mt-8 aspect-[16/9] rounded-xl" />
        </Panel>

        <Panel title={page.points.title}>
          <DotList items={page.points.items} />
          {page.cta && (
            <div className="mt-7">
              {page.cta.href ? <LineLink href={page.cta.href}>{page.cta.label}</LineLink> : <LineLink to={page.cta.to}>{page.cta.label}</LineLink>}
            </div>
          )}
        </Panel>

        {page.more && (
          <Panel title={page.more.title}>
            <Prose>
              <p>{page.more.body}</p>
            </Prose>
          </Panel>
        )}

        {page.id === "recycling" && (
          <Panel
            id="finder"
            title={
              <>
                Find a registered recycler <span className="tone-em">near you</span>
              </>
            }
          >
            <RecyclerFinder />
          </Panel>
        )}
      </PageBody>
    </SiteLayout>
  );
}
