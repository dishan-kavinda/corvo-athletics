# Memory

> Chronological action log. Hooks and AI append to this file automatically.
> Old sessions are consolidated by the daemon weekly.

## Session origin

This OpenWolf project was initialized 2026-05-13. The full multi-day session log lives at `~/.wolf/memory.md` (home-level OpenWolf installed first, before project-level). Highlights consolidated below for context.

## 2026-05-12 — Discovery & rebuild kickoff

| 17:55 | Connected Wix MCP, located Sportique site, renamed to Corvo Athletics via Site Properties API | — | ok |
| 18:00 | Briefed user on Wix REST API ceiling (no canvas/theme/per-page SEO editing) | — | scope narrowed |
| 18:10 | 15 dropship products surveyed via ExecuteWixAPI projection; product rewrite deferred | — | catalog swap planned later |
| 18:20 | Discussed 3 design paths (Velo, Velo+CLI, headless); user picked headless rebuild (option c) | — | path locked |
| 18:26 | Wrote ~/corvo-athletics-rebuild.md plan file | ~/corvo-athletics-rebuild.md | reference |
| 18:50 | Installed pnpm 11.1.0 via npm -g (corepack absent on homebrew node) | — | ok |
| 18:55 | **Phase 2** — Next.js 16 + TS + Tailwind v4 + App Router scaffolded; deps installed | code/corvo-athletics | first git commit |
| 19:10 | **Phase 3** — `src/lib/wix.ts` wired; /test route fetched 15 products via OAuth visitor | src/lib/wix.ts | ✅ pipeline confirmed |
| 19:25 | **Phase 4** — Tailwind tokens, Anton+Inter fonts, Container/Section/Button/ProductCard, Header+Footer, dark hero | — | brand visible |
| 19:55 | **Phase 5** — /shop, /shop/[slug], CartProvider, CartDrawer, AddToCartButton, CartIcon, /about, /account, /thank-you, checkout redirect via @wix/redirects | — | full flow functional |
| 20:15 | **Phase 6** — FadeIn/HeroReveal/Stagger motion primitives, page transition template, animations wired across home/shop/about/product | — | premium feel |

## 2026-05-13 — Deploy & SEO

| 06:50 | **Phase 7** — Pushed to GitHub (dishan-kavinda/corvo-athletics, private), connected Vercel | github + vercel | live at corvo-athletics.vercel.app |
| 07:05 | Vercel build failed once — TS error: `cart.subtotal` doesn't exist on raw `@wix/ecom` Cart. Fix: compute subtotal from line items via Intl.NumberFormat | src/components/cart/CartDrawer.tsx | bug logged |
| 07:20 | Confirmed via direct API testing: Wix Editor SEO settings NOT accessible via any public REST API (Resolve Item SEO Tags returns 400/428) | — | user shared keywords manually |
| 07:30 | **SEO pass** — metadataBase, title template, OG, Twitter, canonical, Organization JSON-LD in root; per-page metadata tuned with brand keywords (gym/athleisure/luxury/sports/Corvo Athletics/Corvo Athletic); /account /thank-you marked noindex; Product JSON-LD on product pages; src/app/robots.ts + src/app/sitemap.ts (includes products w/ lastUpdated) | layout, all pages, robots.ts, sitemap.ts | committed + pushed |
| 07:55 | Smoke-test of live Vercel showed old metadata still serving — Vercel deploy still propagating for latest commit | — | re-verify next |

## Pending right now

- Verify SEO live on `corvo-athletics.vercel.app` once Vercel finishes deploying commit `5a33b51`.
- **Phase 8** — Stage at `new.corvoathletic.com` subdomain (add subdomain in Vercel → set CNAME at Wix DNS).
- **Phase 9** — Production cutover (point `corvoathletic.com` A record at Vercel; old Wix Editor site goes dark).
- Post-launch: submit sitemap to Google Search Console; verify site ownership.
