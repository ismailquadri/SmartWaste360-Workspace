import { Outlet, createFileRoute } from "@tanstack/react-router";

// Layout for the About section; each page lives in its own about.*.tsx file.
export const Route = createFileRoute("/about")({
  component: () => <Outlet />,
});
