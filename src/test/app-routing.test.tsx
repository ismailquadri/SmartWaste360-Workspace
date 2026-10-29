import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import { SITE } from "@/lib/site/content";
import { ABOUT_PAGES } from "@/lib/site/about";
import { NAV, linkPath } from "@/lib/site/nav";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
const leaf = (path: string) => router.matchRoutes(path).at(-1)?.routeId;

describe("App routing", () => {
  it.each(["/", "/smartwaste360", "/newsroom", "/contact", "/report"])("serves a website page at %s", (path) => {
    expect(leaf(path)).toBe(path);
  });

  it.each(["/about", "/services"])("serves the %s section overview", (path) => {
    expect(leaf(path)).toBe(`${path}/`);
  });

  it("has a page for every About menu entry LAWMA lists", () => {
    expect(ABOUT_PAGES.map((p) => p.label)).toEqual([
      "Who we are",
      "Principal officers",
      "Departments and units",
      "Achievements and awards",
      "Office of the MD/CEO",
      "Past MD/CEOs",
    ]);
    for (const p of ABOUT_PAGES.slice(1)) expect(leaf(p.to)).toBe(p.to);
  });

  it("serves a page for each service", () => {
    expect(leaf("/services/recycling")).toBe("/services/$serviceId");
  });

  it("hosts the SmartWaste360 workspace at /workspace", () => {
    expect(leaf("/workspace")).toBe("/workspace");
  });

  it("links every main and drop-down navigation item to a real page or an outside site", () => {
    for (const item of NAV)
      for (const l of [item, ...(item.children ?? [])]) {
        const path = linkPath(l);
        if (path) expect(leaf(path)).not.toBe(rootRouteId);
        else if (!item.children || l !== item) expect(l.href).toMatch(/^https:\/\//);
      }
  });

  it("credits Sparkr Digitals as the builder", () => {
    expect(SITE.builder).toEqual({ name: "Sparkr Digitals", href: "https://sparkrdigitals.com" });
  });
});
