import { Link, useRouterState, type LinkProps } from "@tanstack/react-router";
import Lenis from "lenis";
import { ArrowRight, ArrowUpRight, ChevronDown, Menu, Phone, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { ABOUT_PAGES, HEAD_OFFICE } from "@/lib/site/about";
import { SITE } from "@/lib/site/content";
import { NAV, RESIDENT_LINKS, SERVICE_LINKS, linkPath, type NavItem, type NavLink } from "@/lib/site/nav";
import { logos } from "@/lib/site/media";
import { cn } from "@/lib/utils";
import { LagosClock, LineRise } from "./motion";
import { openAccessibility } from "./AccessibilityPanel";
import { signalPageHydrated } from "@/lib/site/dom-translate";

export function LawmaLogo({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <img
      src={tone === "dark" ? logos.onDark : logos.onLight}
      alt="LAWMA — Lagos Waste Management Authority"
      width={913}
      height={308}
      className={cn("h-7 w-auto md:h-8", className)}
    />
  );
}

type To = { to?: LinkProps["to"]; params?: Record<string, string>; hash?: string; href?: string };

function Anchor({ to, params, hash, href, className, children }: To & { className: string; children: ReactNode }) {
  if (href)
    return (
      <a href={href} className={className} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener">
        {children}
      </a>
    );
  return (
    <Link to={to ?? "/"} params={params as never} {...(hash ? { hash } : {})} className={className}>
      {children}
    </Link>
  );
}

/** Primary call to action: the only filled orange control in a view. */
export function EmberLink({ children, className, ...to }: To & { children: ReactNode; className?: string }) {
  return (
    <Anchor
      {...to}
      className={cn(
        "group inline-flex h-11 items-center gap-2 rounded-xl bg-ember px-5 text-[0.875rem] font-semibold text-ember-foreground shadow-[inset_0_1px_0_oklch(1_0_0/0.35)] transition-colors hover:bg-ember-deep",
        className,
      )}
    >
      {children}
      <ArrowRight className="size-4" />
    </Anchor>
  );
}

/** Secondary bordered control. */
export function OutlineLink({ children, className, ...to }: To & { children: ReactNode; className?: string }) {
  return (
    <Anchor
      {...to}
      className={cn(
        "group inline-flex h-11 items-center gap-2 rounded-xl border border-line-light bg-card px-5 text-[0.875rem] font-medium text-ink transition-colors hover:border-ink/30",
        className,
      )}
    >
      {children}
    </Anchor>
  );
}

/** Quiet text link with an underline that draws on hover. */
export function LineLink({ children, className, ...to }: To & { children: ReactNode; className?: string }) {
  return (
    <Anchor {...to} className={cn("group inline-flex items-center gap-2 text-[0.875rem] font-medium", className)}>
      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
        {children}
      </span>
      <ArrowUpRight className="size-4" />
    </Anchor>
  );
}

function useSmoothScroll() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [lenis, setLenis] = useState<Lenis | null>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.documentElement.hasAttribute("data-a11y-still")) return;
    const l = new Lenis({ autoRaf: true, duration: 1.2, anchors: { offset: -96 } });
    setLenis(l);
    return () => {
      l.destroy();
      setLenis(null);
    };
  }, []);
  useEffect(() => {
    if (window.location.hash) return;
    lenis?.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);
}

function isActive(pathname: string, l: NavLink) {
  const path = linkPath(l);
  if (!path) return false;
  return path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(path + "/");
}

function NavAnchor({ link, className, children, onClick }: { link: NavLink; className?: string; children: ReactNode; onClick?: () => void }) {
  if (link.href)
    return (
      <a href={link.href} target="_blank" rel="noopener" className={className} onClick={onClick}>
        {children}
      </a>
    );
  return (
    <Link to={link.to ?? "/"} params={link.params as never} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

function Dropdown({ item, pathname, claimed }: { item: NavItem; pathname: string; claimed: boolean }) {
  // A menu without its own page (Residents) only lights up when no other menu owns the current page.
  const active = item.to ? isActive(pathname, item) : !claimed && (item.children ?? []).some((c) => linkPath(c) === pathname);
  const trigger = cn(
    "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-[0.875rem] font-medium transition-colors",
    active ? "text-ember-text" : "text-ink/70 hover:text-ink",
  );
  return (
    <div className="group/dd relative">
      {item.to ? (
        <NavAnchor link={item} className={trigger}>
          {item.label}
          <ChevronDown className="size-3.5 opacity-50 transition-transform duration-300 group-hover/dd:rotate-180 group-focus-within/dd:rotate-180" />
        </NavAnchor>
      ) : (
        <button type="button" className={trigger} aria-haspopup="true">
          {item.label}
          <ChevronDown className="size-3.5 opacity-50 transition-transform duration-300 group-hover/dd:rotate-180 group-focus-within/dd:rotate-180" />
        </button>
      )}
      <div className="invisible absolute left-0 top-full z-10 translate-y-1 pt-3 opacity-0 transition-all duration-200 group-hover/dd:visible group-hover/dd:translate-y-0 group-hover/dd:opacity-100 group-focus-within/dd:visible group-focus-within/dd:translate-y-0 group-focus-within/dd:opacity-100">
        <ul className="min-w-[270px] rounded-2xl border border-line-light bg-card p-2 shadow-float">
          {item.children?.map((c) => {
            const on = linkPath(c) === pathname;
            return (
              <li key={c.label}>
                <NavAnchor
                  link={c}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.9375rem] transition-colors hover:bg-paper-2",
                    on ? "font-medium text-ember-text" : "text-ink/80 hover:text-ink",
                  )}
                >
                  <span className="size-2 shrink-0 rounded-[3px] bg-ember" aria-hidden="true" />
                  <span className="flex-1">{c.label}</span>
                  {c.href && <ArrowUpRight className="size-3.5 opacity-40" aria-label="Opens another site" />}
                </NavAnchor>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [group, setGroup] = useState<string | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname.replace(/\/$/, "") || "/" });

  useEffect(() => {
    setOpen(false);
    setGroup(null);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6",
      )}
    >
      <div className="mx-auto max-w-[1180px] rounded-2xl border border-line-light bg-card/95 backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between gap-4 pl-4 pr-2 md:h-16 md:pl-5">
          <Link to="/" aria-label="LAWMA home" className="shrink-0">
            <LawmaLogo tone="light" />
          </Link>
          <nav aria-label="Main" className="hidden items-center lg:flex">
            {NAV.map((n) =>
              n.children ? (
                <Dropdown key={n.label} item={n} pathname={pathname} claimed={NAV.some((x) => x.to && isActive(pathname, x))} />
              ) : (
                <div key={n.label} className="relative">
                  <NavAnchor
                    link={n}
                    className={cn(
                      "inline-flex rounded-lg px-3 py-2 text-[0.875rem] font-medium transition-colors",
                      isActive(pathname, n) ? "text-ember-text" : "text-ink/70 hover:text-ink",
                    )}
                  >
                    {n.label}
                  </NavAnchor>
                </div>
              ),
            )}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="tel:617"
              className="hidden h-10 items-center gap-2 rounded-xl border border-line-light px-4 text-[0.875rem] font-medium text-ink transition-colors hover:border-ink/30 sm:inline-flex"
            >
              <Phone className="size-3.5" />
              617
            </a>
            <Link
              to="/workspace"
              className="hidden h-10 items-center gap-2 rounded-xl bg-ember px-4 text-[0.875rem] font-semibold text-ember-foreground shadow-[inset_0_1px_0_oklch(1_0_0/0.35)] transition-colors hover:bg-ember-deep md:inline-flex"
            >
              Open SmartWaste360
            </Link>
            <button
              type="button"
              className="grid size-10 place-items-center rounded-xl border border-line-light lg:hidden"
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>

        <div id="site-menu" hidden={!open} className="max-h-[calc(100svh-6rem)] overflow-y-auto border-t border-line-light px-4 pb-5 pt-2 lg:hidden">
          <nav aria-label="Mobile" className="flex flex-col">
            <NavAnchor link={{ label: "Home", to: "/" }} className="border-b border-line-light py-3.5 text-[1.5rem] display">
              Home
            </NavAnchor>
            {NAV.map((n) =>
              n.children ? (
                <div key={n.label} className="border-b border-line-light">
                  <button
                    type="button"
                    aria-expanded={group === n.label}
                    onClick={() => setGroup((g) => (g === n.label ? null : n.label))}
                    className="flex w-full items-center justify-between py-3.5 text-left text-[1.5rem] display"
                  >
                    {n.label}
                    <ChevronDown className={cn("size-5 transition-transform", group === n.label && "rotate-180")} />
                  </button>
                  {group === n.label && (
                    <ul className="pb-3">
                      {n.to && !n.children.some((c) => linkPath(c) === linkPath(n)) && (
                        <li>
                          <NavAnchor link={n} className="flex items-center gap-3 py-2 text-[0.9375rem] font-medium text-ink">
                            <span className="size-2 rounded-[3px] bg-ember" aria-hidden="true" />
                            {n.label} overview
                          </NavAnchor>
                        </li>
                      )}
                      {n.children.map((c) => (
                        <li key={c.label}>
                          <NavAnchor link={c} className="flex items-center gap-3 py-2 text-[0.9375rem] text-ink/80">
                            <span className="size-2 rounded-[3px] bg-ember" aria-hidden="true" />
                            {c.label}
                            {c.href && <ArrowUpRight className="size-3.5 opacity-40" />}
                          </NavAnchor>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <NavAnchor key={n.label} link={n} className="border-b border-line-light py-3.5 text-[1.5rem] display">
                  {n.label}
                </NavAnchor>
              ),
            )}
          </nav>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <EmberLink to="/workspace">Open SmartWaste360</EmberLink>
            <OutlineLink href="tel:617">Call 617</OutlineLink>
          </div>
          <p className="eyebrow mt-4 text-stone">{SITE.hours}</p>
        </div>
      </div>
    </header>
  );
}

function FooterColumn({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <div>
      <p className="eyebrow text-mist">{title}</p>
      <ul className="mt-5 space-y-3 text-[0.875rem]">
        {links.map((l) => (
          <li key={l.label}>
            <NavAnchor link={l} className="text-paper/75 transition-colors hover:text-paper">
              {l.label}
            </NavAnchor>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="px-3 pb-3 md:px-6 md:pb-6">
      <div className="grain relative overflow-hidden rounded-[1.75rem] bg-ink text-paper">
        <div className="relative z-[2] mx-auto max-w-[1280px] px-6 pb-8 pt-20 md:px-12">
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <LawmaLogo />
              <p className="lede mt-8 max-w-sm text-2xl text-paper/90">A cleaner Lagos is a city that works together.</p>
              <p className="mt-6 text-[0.875rem] leading-relaxed text-paper/60">
                Head office: {HEAD_OFFICE}
                <br />
                <a href={`mailto:${SITE.email}`} className="hover:text-paper">
                  {SITE.email}
                </a>
              </p>
              <div className="mt-8">
                <EmberLink to="/report">Report illegal dumping</EmberLink>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-8">
              <FooterColumn title="About" links={ABOUT_PAGES.map((p) => ({ label: p.label, to: p.to }))} />
              <FooterColumn title="Services" links={SERVICE_LINKS} />
              <FooterColumn
                title="Residents"
                links={[...RESIDENT_LINKS.slice(0, 4), { label: "Newsroom", to: "/newsroom" }, { label: "Staff & partner sign-in", to: "/workspace" }]}
              />
              <div>
                <p className="eyebrow text-mist">Talk to us</p>
                <ul className="mt-5 space-y-3 text-[0.875rem]">
                  {SITE.tollFree.map((t) => (
                    <li key={t.value}>
                      <a href={t.href} className="text-paper/75 hover:text-paper">
                        {t.value}
                      </a>
                    </li>
                  ))}
                  <li className="eyebrow pt-1 text-mist">{SITE.hours}</li>
                  {SITE.social.map((s) => (
                    <li key={s.href}>
                      <a href={s.href} target="_blank" rel="noopener" className="text-paper/75 hover:text-paper">
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <p
            aria-hidden="true"
            className="display mt-20 select-none whitespace-nowrap text-center text-[18.5vw] leading-[0.78] text-paper/[0.07] lg:text-[16.5vw] xl:text-[15rem]"
          >
            Clean Lagos
          </p>

          <div className="mt-8 flex flex-col gap-4 border-t border-line-dark pt-6 text-[0.8125rem] text-mist md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} Lagos Waste Management Authority. Lagos State Government.</p>
            <div className="flex items-center gap-6">
              <button type="button" onClick={openAccessibility} className="hover:text-paper">
                Accessibility
              </button>
              <LagosClock className="eyebrow" />
              <a href={SITE.builder.href} target="_blank" rel="noopener" className="hover:text-paper">
                Built with {SITE.builder.name}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  useSmoothScroll();
  useEffect(() => {
    // Let the language switcher rewrite text only after this page has hydrated.
    const t = setTimeout(signalPageHydrated, 0);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="min-h-screen bg-paper text-ink">
      <a
        href="#main"
        className="sr-only z-[60] rounded-xl bg-ember px-4 py-2 text-ember-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </div>
  );
}

/** Small mono label with LAWMA's orange dot. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string | undefined }) {
  return (
    <p className={cn("eyebrow inline-flex items-center gap-2 text-stone", className)}>
      <span className="size-1.5 rounded-full bg-ember" aria-hidden="true" />
      {children}
    </p>
  );
}

/** Full-screen opener for inner pages: photo or film edge to edge, headline set low on the left. */
export function PageHero({
  title,
  intro,
  image,
  film,
  alt = "",
  children,
}: {
  title: ReactNode | ReactNode[];
  intro: string;
  image: string;
  film?: string;
  alt?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate flex h-[100svh] min-h-[600px] items-end overflow-hidden bg-ink text-paper">
      {film ? (
        <video className="absolute inset-0 -z-10 h-full w-full object-cover" src={film} poster={image} autoPlay muted loop playsInline aria-label={alt} />
      ) : (
        <img src={image} alt={alt} className="absolute inset-0 -z-10 h-full w-full animate-slow-zoom object-cover" />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 via-ink/35 to-ink/10" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/55 via-ink/10 to-transparent" aria-hidden="true" />
      <div className="mx-auto w-full max-w-[1180px] px-5 pb-16 md:px-10 md:pb-24">
        <h1 className="display max-w-[16ch] text-balance text-[clamp(2.6rem,5.6vw,5rem)] [&_.tone-em]:text-ember">
          <LineRise lines={title} />
        </h1>
        <p className="mt-6 max-w-xl animate-fade-in text-[1rem] leading-relaxed text-paper/85 [animation-delay:450ms] md:text-[1.125rem]">{intro}</p>
        {children && <div className="mt-8 flex animate-fade-in flex-wrap gap-3 [animation-delay:600ms]">{children}</div>}
      </div>
    </section>
  );
}

/** Section header: mono label, two-tone condensed headline and an optional short aside. */
export function SectionHead({
  label,
  title,
  aside,
  align = "center",
  tone = "light",
  className,
}: {
  label: string;
  title: ReactNode;
  aside?: ReactNode;
  align?: "center" | "left";
  tone?: "light" | "dark";
  className?: string;
}) {
  const center = align === "center";
  return (
    <div className={cn("flex flex-col", center ? "items-center text-center" : "items-start", className)}>
      <Eyebrow className={tone === "dark" ? "text-mist" : undefined}>{label}</Eyebrow>
      <h2 className={cn("display mt-5 max-w-[24ch] text-balance text-[clamp(2rem,3.6vw,3.25rem)] [&_.tone-em]:block", center && "mx-auto")}>{title}</h2>
      {aside && (
        <div className={cn("mt-5 max-w-xl text-[1rem] leading-relaxed", tone === "dark" ? "text-paper/70" : "text-stone")}>
          {aside}
        </div>
      )}
    </div>
  );
}
