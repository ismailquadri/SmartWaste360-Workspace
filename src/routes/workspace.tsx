import { createFileRoute } from "@tanstack/react-router";

const TITLE = "SmartWaste360 workspace · LAWMA";
const DESCRIPTION = "Sign in to SmartWaste360, LAWMA’s connected workspace for fleet, PSP operations, disposal sites, public reports and service records.";

export const Route = createFileRoute("/workspace")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Workspace,
});

// The workspace is a self-contained build (lawma/build_dashboard.py → public/dashboard.html),
// hosted full-viewport so its own hash routes, storage and map engine run untouched.
function Workspace() {
  return (
    <main className="dashboard-host">
      <h1 className="sr-only">SmartWaste360 workspace</h1>
      <iframe
        src="/dashboard.html"
        title="SmartWaste360 workspace"
        className="dashboard-frame"
        allow="fullscreen; clipboard-write"
        allowFullScreen
      />
    </main>
  );
}
