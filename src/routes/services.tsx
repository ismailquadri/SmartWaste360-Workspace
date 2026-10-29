import { Outlet, createFileRoute } from "@tanstack/react-router";

// Layout for the Services section: the overview and one page per service.
export const Route = createFileRoute("/services")({
  component: () => <Outlet />,
});
