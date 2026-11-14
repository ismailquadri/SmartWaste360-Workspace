import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { DayInLagos } from "@/components/site/DayInLagos";
import { DotNetwork } from "@/components/site/DotNetwork";
import { MediaGrid } from "@/components/site/MediaGrid";
import { LagosClock, LineRise, ParallaxImage, Reveal, ScrollWords, TiltIn } from "@/components/site/motion";
import { NewsList } from "@/components/site/NewsList";
import { ScrollMosaic } from "@/components/site/ScrollMosaic";
import { EmberLink, Eyebrow, LineLink, OutlineLink, SectionHead, SiteLayout } from "@/components/site/SiteLayout";
import { NEWS, SERVICES, SITE } from "@/lib/site/content";
import { films, photos, product } from "@/lib/site/media";

const TITLE = "LAWMA · Every street. Every day. Every Lagosian.";
const DESCRIPTION =
  "Lagos Waste Management Authority keeps Lagos clean: household collection with PSP operators, disposal, recycling, waterways and SmartWaste360.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
  }),
  component: Home,
});

const SERVICE_IMAGES: Record<string, string> = {
  collection: photos.truckStreet,
  commercial: photos.marketMorning,
  disposal: photos.transferStation,
  recycling: photos.recycling,
  marine: photos.lagoonDusk,
  academy: photos.academy,
};

const PLATFORM = [
  { n: "01", t: "Road-level fleet tracking", b: "Every truck and stop on one live map." },
  { n: "02", t: "Public dump alarms", b: "Photo, pin and a cleared photo to close." },
  { n: "03", t: "Weighbridge receipts", b: "Every load weighed and receipted at the site." },
  { n: "04", t: "WhatsApp and USSD", b: "Reports from any phone, no data needed." },
];

function Home() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative isolate flex h-[100svh] min-h-[640px] items-end overflow-hidden bg-ink text-paper">
        <video
          className="absolute inset-0 -z-10 h-full w-full object-cover"
          src={films.heroBridge}
          poster={photos.heroBridge}
          autoPlay
          muted
          loop
          playsInline
          aria-label="LAWMA trucks crossing a Lagos bridge at sunrise"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/10" aria-hidden="true" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/55 via-ink/10 to-transparent" aria-hidden="true" />
        <div className="mx-auto w-full max-w-[1180px] px-5 pb-16 md:px-10 md:pb-24">
          <h1 className="display max-w-[16ch] text-[clamp(2.8rem,6.4vw,5.75rem)] [&_.tone-em]:text-ember">
            <LineRise lines={["Every street.", "Every day.", <span key="l" className="tone-em">Every Lagosian.</span>]} />
          </h1>
          <p className="mt-6 max-w-lg animate-fade-in text-[1rem] leading-relaxed text-paper/85 [animation-delay:500ms] md:text-[1.125rem]">
            From the first sweep at dawn to the last load at the disposal site, LAWMA keeps Lagos moving, and keeps it clean.
          </p>
          <div className="mt-8 flex animate-fade-in flex-wrap items-center gap-3 [animation-delay:650ms]">
            <EmberLink to="/report">Report illegal dumping</EmberLink>
            <OutlineLink to="/services/$serviceId" params={{ serviceId: "collection" }} className="border-paper/25 bg-paper/10 text-paper backdrop-blur hover:border-paper/60">
              Find your collection service
            </OutlineLink>
            <span className="eyebrow ml-auto hidden items-center gap-2 text-paper/70 md:inline-flex">
              <span className="size-1.5 animate-pulse rounded-full bg-ember" />
              Lagos <LagosClock />
            </span>
          </div>
        </div>
      </section>

      {/* STATEMENT */}
      <section className="bg-paper">
        <div className="mx-auto flex max-w-[1180px] flex-col items-center px-5 pb-6 pt-28 text-center md:pb-10 md:pt-40">
          <Eyebrow>Since 1977</Eyebrow>
          <ScrollWords
            className="lede mt-8 max-w-[30ch] text-[clamp(1.55rem,2.9vw,2.6rem)]"
            text="Nigeria’s pioneer waste authority, keeping a city of millions clean with partners in every ward, and advising states and nations across Africa."
          />
          <div className="mt-10">
            <LineLink to="/about">Our story</LineLink>
          </div>
        </div>
      </section>

      {/* FIELD MOSAIC */}
      <ScrollMosaic
        heading={
          <SectionHead
            className="px-5"
            label="From the field"
            title={
              <>
                The people <span className="tone-em">behind the clean.</span>
              </>
            }
          />
        }
      />

      {/* A DAY IN LAGOS */}
      <DayInLagos />

      {/* SERVICES */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[1280px] px-5 py-24 md:px-10 md:py-32">
          <SectionHead
            label="What we do"
            title={
              <>
                Six services. <span className="tone-em">One promise.</span>
              </>
            }
            aside="Collection, disposal, recovery and education: the full life of Lagos’ waste, managed in one place."
          />
          <div className="mt-16 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => (
              <Reveal key={s.id} delay={(i % 3) * 90}>
                <Link to="/services/$serviceId" params={{ serviceId: s.id }} className="group block">
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-paper-3">
                    <img
                      src={SERVICE_IMAGES[s.id]}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div>
                      <p className="display text-[1.5rem]">{s.title}</p>
                      <p className="mt-1.5 text-[0.9375rem] text-stone">{s.line}</p>
                    </div>
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-line-light transition-colors group-hover:border-lemon group-hover:bg-lemon group-hover:text-lemon-foreground">
                      <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SMARTWASTE360 */}
      <section className="px-3 md:px-6">
        <div className="mx-auto max-w-[1280px] overflow-hidden rounded-[1.75rem] bg-paper-2 px-5 pb-16 pt-20 md:px-12 md:pb-20 md:pt-28">
          <SectionHead
            label="SmartWaste360"
            title={
              <>
                One record. <span className="tone-em">From gate to receipt.</span>
              </>
            }
            aside="SmartWaste360 connects households, PSP crews, trucks, disposal sites and the control room. Every pickup, alarm and load becomes part of one record."
          />
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <EmberLink to="/workspace">Open SmartWaste360</EmberLink>
            <OutlineLink to="/smartwaste360">Explore the platform</OutlineLink>
          </div>
          <TiltIn className="mx-auto mt-16 max-w-[1060px]">
            <div className="overflow-hidden rounded-2xl border border-line-light bg-card shadow-lift">
              <img src={product.overview} alt="SmartWaste360 city overview with backlog by area and operator scores" loading="lazy" className="w-full" />
            </div>
          </TiltIn>
          <ul className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line-light bg-line-light sm:grid-cols-2 lg:grid-cols-4">
            {PLATFORM.map((x) => (
              <li key={x.n} className="bg-paper-2 p-6">
                <span className="eyebrow text-ember-text">{x.n}</span>
                <p className="mt-6 text-[1rem] font-semibold">{x.t}</p>
                <p className="mt-1.5 text-[0.875rem] leading-relaxed text-stone">{x.b}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* NETWORK */}
      <DotNetwork />

      {/* AT YOUR GATE */}
      <section className="bg-paper">
        <div className="mx-auto flex max-w-[1180px] flex-col items-center px-5 pt-16 text-center md:pt-24">
          <SectionHead
            label="For households"
            title={
              <>
                A clean street starts <span className="tone-em">at your gate.</span>
              </>
            }
            aside="Know your PSP, keep a covered bin, and follow every pickup and report in the SmartWaste360 app."
          />
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <EmberLink href={SITE.customerApp}>Get the SmartWaste360 app</EmberLink>
            <OutlineLink to="/services/$serviceId" params={{ serviceId: "collection" }}>
              Know your PSP
            </OutlineLink>
          </div>
        </div>
        <div className="mx-auto mt-14 max-w-[1280px] px-5 md:px-10">
          <ParallaxImage
            src={photos.household}
            alt="A Surulere mother wheels her bin to the gate with her son on the way to school"
            className="aspect-[4/3] rounded-[1.75rem] md:aspect-[21/9]"
            strength={14}
          />
        </div>
      </section>

      {/* NEWSROOM */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[1280px] px-5 py-24 md:px-10 md:py-32">
          <SectionHead
            label="Newsroom"
            title={
              <>
                LAWMA <span className="tone-em">on air.</span>
              </>
            }
          />
          <div className="mt-14">
            <MediaGrid />
          </div>
          <div className="mt-20">
            <NewsList items={NEWS.slice(0, 5)} />
          </div>
          <div className="mt-10 flex justify-center">
            <OutlineLink to="/newsroom">All news & events</OutlineLink>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
