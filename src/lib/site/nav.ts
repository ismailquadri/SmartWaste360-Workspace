import type { LinkProps } from "@tanstack/react-router";

import { ABOUT_PAGES } from "./about";
import { SERVICES } from "./content";

export type NavLink = {
  label: string;
  to?: LinkProps["to"];
  params?: Record<string, string>;
  href?: string;
};

export type NavItem = NavLink & { children?: NavLink[] };

export const SERVICE_LINKS: NavLink[] = SERVICES.map((s) => ({ label: s.title, to: "/services/$serviceId", params: { serviceId: s.id } }));

export const RESIDENT_LINKS: NavLink[] = [
  { label: "Report illegal dumping", to: "/report" },
  { label: "Find a recycler", to: "/services/$serviceId", params: { serviceId: "recycling" } },
  { label: "Pay your waste bill", href: "https://lawmapay.com/" },
  { label: "Buy a bin", href: "https://lawmasmartbins.com/" },
  { label: "PSP directory", href: "https://lawma.gov.ng/psp-directory-3/" },
  { label: "Healthcare waste PSPs", href: "https://lawma.gov.ng/5667-2/" },
];

export const NAV: NavItem[] = [
  { label: "About", to: "/about", children: ABOUT_PAGES.map((p) => ({ label: p.label, to: p.to })) },
  { label: "Services", to: "/services", children: SERVICE_LINKS },
  { label: "Residents", children: RESIDENT_LINKS },
  { label: "SmartWaste360", to: "/smartwaste360" },
  { label: "Newsroom", to: "/newsroom" },
  { label: "Contact", to: "/contact" },
];

/** The path a nav link points to, for active-state checks. */
export function linkPath(l: NavLink) {
  if (!l.to) return null;
  return Object.entries(l.params ?? {}).reduce((p, [k, v]) => p.replace(`$${k}`, v), String(l.to));
}
