import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Phone, Smartphone } from "lucide-react";

import { ParallaxImage, Reveal } from "@/components/site/motion";
import { ProductShowcase } from "@/components/site/ProductShowcase";
import { EmberLink, OutlineLink, PageHero, SectionHead, SiteLayout } from "@/components/site/SiteLayout";
import { SITE } from "@/lib/site/content";
import { films, photos } from "@/lib/site/media";

const TITLE = "SmartWaste360 · LAWMA’s connected waste service platform";
const DESCRIPTION =
  "SmartWaste360 connects households, PSP crews, fleet, disposal sites and the LAWMA control room in one record, from request to final receipt.";

export const Route = createFileRoute("/smartwaste360")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SmartWaste360,
});

const STEPS = [
  { n: "01", t: "Request", b: "A household books, pays monthly or raises a dump alarm from the app, WhatsApp or USSD." },
  { n: "02", t: "Assign", b: "The right PSP crew and truck take ownership, with a time to respond." },
  { n: "03", t: "Collect", b: "GPS, photos and stop-by-stop evidence follow the crew along the route." },
  { n: "04", t: "Weigh", b: "At the disposal site: arrival, gross, tare, net and the scale ticket." },
  { n: "05", t: "Receipt", b: "The record closes with a receipt the resident, partner and LAWMA all see." },
];

const ROLES = [
  "Management",
  "Operations supervisors",
  "PSP dispatchers",
  "Field crews",
  "Disposal site teams",
  "Revenue & finance",
  "Citizen care",
  "Enforcement",
  "Recovery operators",
  "Auditors",
];

const CHANNELS = [
  { i: Smartphone, t: "SmartWaste360 app", b: "Photo, pin and live status, for smartphones." },
  { i: MessageCircle, t: "WhatsApp", b: "Send a photo and location; get updates in the chat." },
  { i: Phone, t: "USSD and 617", b: "Works on any phone, no data needed." },
];

function SmartWaste360() {
  return (
    <SiteLayout>
      <PageHero
        title={["One record,", <span key="e" className="tone-em">from gate to receipt</span>]}
        intro="SmartWaste360 gives everyone who keeps Lagos clean the same picture: what was asked, who is on it, where the truck is and where the load went."
        image={photos.controlRoom}
        film={films.controlRoom}
        alt="Operators in the SmartWaste360 control room"
      >
        <EmberLink to="/workspace">Open SmartWaste360</EmberLink>
        <OutlineLink href={SITE.customerApp} className="border-paper/25 bg-paper/10 text-paper backdrop-blur hover:border-paper/60">
          Customer app
        </OutlineLink>
      </PageHero>

      <section className="bg-paper">
        <div className="mx-auto max-w-[1180px] px-5 py-24 md:px-10 md:py-32">
          <SectionHead
            label="Inside the workspace"
            title={
              <>
                See it <span className="tone-em">for yourself.</span>
              </>
            }
          />
          <div className="mt-12">
            <ProductShowcase />
          </div>
        </div>
      </section>

      <section className="px-3 md:px-6">
        <div className="mx-auto max-w-[1280px] rounded-[1.75rem] bg-paper-2 px-5 py-20 md:px-12 md:py-28">
          <SectionHead
            label="The record that follows the load"
            title={
              <>
                Five steps. <span className="tone-em">No guesswork.</span>
              </>
            }
            aside="Every service in Lagos moves through the same five steps, so nothing is lost between a resident, a partner and LAWMA."
          />
          <ol className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 100} className="flex min-h-[240px] flex-col rounded-2xl border border-line-light bg-card p-6">
                <span className="eyebrow text-ember-text">{s.n}</span>
                <span className="display mt-auto text-[1.75rem]">{s.t}</span>
                <span className="mt-3 text-[0.875rem] leading-relaxed text-stone">{s.b}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto grid max-w-[1180px] gap-12 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <SectionHead
              align="left"
              label="Every Lagosian, every phone"
              title={
                <>
                  Report it <span className="tone-em">your way.</span>
                </>
              }
            />
            <ul className="mt-10 border-t border-line-light">
              {CHANNELS.map(({ i: Icon, t, b }) => (
                <li key={t} className="flex gap-4 border-b border-line-light py-5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-paper-2">
                    <Icon className="size-4 text-ember-text" />
                  </span>
                  <span>
                    <span className="block text-[1rem] font-semibold">{t}</span>
                    <span className="text-[0.875rem] text-stone">{b}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <Reveal className="lg:col-span-6 lg:col-start-7">
            <ParallaxImage src={photos.truckStreet} alt="LAWMA crew lifting a household bin into a compactor truck" className="aspect-[4/5] rounded-2xl" />
          </Reveal>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-[1180px] px-5 pb-24 md:px-10 md:pb-32">
          <SectionHead
            label="Built for every role"
            title={
              <>
                Ten workspaces. <span className="tone-em">One truth.</span>
              </>
            }
            aside="Each team sees what it needs to act on, from authority-wide priorities to a single crew’s next stop. Households use the separate customer app."
          />
          <ul className="mx-auto mt-12 flex max-w-3xl flex-wrap justify-center gap-2">
            {ROLES.map((r, i) => (
              <Reveal as="li" key={r} delay={i * 50} className="rounded-xl border border-line-light bg-card px-4 py-2.5 text-[0.875rem] font-medium">
                {r}
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-3 md:px-6">
        <div className="grain relative mx-auto max-w-[1280px] overflow-hidden rounded-[1.75rem] bg-ink text-paper">
          <img src={photos.skylineNight} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-45" />
          <div className="relative z-[2] flex flex-col items-center px-5 py-24 text-center md:py-32">
            <SectionHead
              tone="dark"
              label="Staff and partners"
              title={
                <>
                  Step inside <span className="text-ember">SmartWaste360.</span>
                </>
              }
              aside="Sign in with your workspace role."
            />
            <div className="mt-9">
              <EmberLink to="/workspace">Open SmartWaste360</EmberLink>
            </div>
          </div>
        </div>
      </section>
      <div className="h-6 md:h-10" />
    </SiteLayout>
  );
}
