<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules

- The LAWMA 360 dashboard is a standalone vanilla HTML/JS build: edit sources in `lawma/work/`, then run `python3 lawma/build_dashboard.py` to regenerate `public/dashboard.html` (commit the output). Why: the prototype's modules, map engine and storage keys only work as one inlined document.
- The public LAWMA website is TanStack routes built from `src/components/site/*`: `/about` and `/services` are layout routes with `about.*.tsx` pages and `services.$serviceId.tsx`; menus (with drop-downs) come from `src/lib/site/nav.ts`; copy lives in `src/lib/site/content.ts`, `about.ts` and `services.ts`, media in `media.ts`, portraits as asset pointers in `src/assets/people`. `src/routes/workspace.tsx` only hosts `public/dashboard.html` in a full-viewport iframe. Why: real pages for SEO and sharing, while the workspace keeps its hash routes and storage untouched.
- Inner pages share one template: `PageHero` (full-viewport media, headline bottom-left) then `PageBody` with `Panel`s and a sticky aside from `src/components/site/inner.tsx`. Why: every page follows the same reference layout without per-page CSS.
- The workspace build opens on sign-in; its old SmartWaste360 landing (`#productWelcome`) stays in the DOM but is never shown, and its back links go to `/smartwaste360` in the top window. Why: the website now owns the marketing story.
- Website styling uses the ink/paper/ember tokens and `display` (condensed caps headings), `tone-em` (second heading colour), `lede`, `glass`, `eyebrow`, `reveal` utilities in `src/styles.css`; headings go through `SectionHead`/`PageHero` so sizes stay on one scale; scroll scenes (`ExpandMedia`, `TiltIn`, `ScrollMosaic`, `DotNetwork`) read scroll progress hooks in `motion.tsx` and fall back to static under reduced motion; smooth scrolling is Lenis, started in `SiteLayout`. Why: one consistent system across pages without per-page CSS.
- All visual styling of the dashboard lives in `lawma/work/scouts-theme.css` (Open Scouts design layer), injected last; every rule is prefixed `html[data-theme]:root:not(#sc)` so it outranks module CSS. Why: restyle without editing the 9 module stylesheets or their JS-generated markup.
- The workspace sign-in screen (`#productFront`) re-declares light tokens and stays light in dark mode. Why: it always uses the light logo.
- `lawma/build_dashboard.py` hides the "Watch the story" trigger while `public/presentation-assets/release-film/final.mp4` is absent. Why: the film dialog otherwise opens an empty player; adding the file and rebuilding restores it.
- Hub-only features (public reports, service backlog, disposal-site queues, markets & businesses, resident channels) live in `lawma/work/hub.js`, the last layer inside the modules IIFE; it wraps existing screens instead of editing them, and its rule constants stay single-line `const` so `src/test/hub-rules.test.ts` can evaluate them. Why: keeps the layered prototype intact and the rules testable.
- The management hub never hosts the resident/customer workflow; residents appear only as the source of reports, requests and accounts. Why: the customer app is a separate product.
- The website's dumping report (`/report`, rules in `src/lib/site/report.ts`) has no backend yet: it stores reports in browser storage under `SITE_REPORTS_KEY`, and `lawma/work/hub.js` imports them into the Public reports inbox as Website alarms under the same reference. Why: a clickable end-to-end flow until LAWMA approves live connections; keep the key identical in both files (a test checks it).
- Website accessibility toolbar and languages: `src/components/site/AccessibilityPanel.tsx` (mounted in `__root` except `/workspace`), settings in `src/lib/site/a11y.ts` written as `<html>` data attributes styled at the end of `src/styles.css`; site text sizes use rem so the font-size control scales them. Translations are pre-built dictionaries in `src/lib/site/i18n/*.json` keyed by English text and swapped into the DOM by `dom-translate.ts`; after changing copy run `python3 scripts/i18n/extract.py` then `scripts/i18n/translate.py` (existing entries are kept). Components that split text must translate first with `useTr()` and mark the container `data-no-translate`. Why: instant, deterministic switching with no live translation dependency.
