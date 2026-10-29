import { createFileRoute } from "@tanstack/react-router";

import { ReportFlow } from "@/components/site/ReportFlow";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SITE } from "@/lib/site/content";

const TITLE = "Report illegal dumping · LAWMA";
const DESCRIPTION =
  "Report illegal dumping, an overflowing public bin, a blocked drain or market waste in Lagos. Add a photo and the location and get a reference number.";

export const Route = createFileRoute("/report")({
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
  component: Report,
});

function Report() {
  const tollFree = SITE.tollFree.find((t) => t.value.startsWith("0800"));
  return (
    <SiteLayout>
      <section className="bg-paper">
        <div className="mx-auto max-w-[720px] px-5 pb-28 pt-32 md:pb-36 md:pt-40">
          <h1 className="display text-[clamp(2.1rem,4vw,3rem)]">Report illegal dumping</h1>
          <p className="mt-5 max-w-[56ch] text-[1.0625rem] leading-relaxed text-ink/80">
            Use this form to report dumped waste, an overflowing public bin, a blocked drain or market waste. It takes about two minutes.
          </p>
          <p className="mt-3 max-w-[56ch] text-[0.9375rem] leading-relaxed text-stone">
            If waste is blocking a road or causing flooding, call{" "}
            <a href="tel:617" className="font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
              617
            </a>
            {tollFree && (
              <>
                {" "}or{" "}
                <a href={tollFree.href} className="font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
                  {tollFree.value}
                </a>{" "}
                (free)
              </>
            )}
            .
          </p>
          <div className="mt-14">
            <ReportFlow />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
