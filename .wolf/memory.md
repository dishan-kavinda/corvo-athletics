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

## 2026-05-13 (continued) — Vercel auth blocker + staging cutover

| later | Vercel "Blocked" deploy on SEO commit — Hobby plan rejected commits from non-team-member git author (mismatched email) | — | rewrote git history w/ filter-branch + force push, made repo public — fixed |
| later | Staging URL `new.corvoathletic.com` live; verified SEO live (sitemap, robots, JSON-LD all working) | — | ok |
| later | DNS swap: www → Vercel (CNAME `cname.vercel-dns.com`), root stays on Wix | — | ok |
| later | Cart bug: products added with `1380b703-...` appId silently failed. Correct ID is `215238eb-22a5-4c36-9e7b-e7c08025e04e` — bug logged | CartProvider.tsx | ✅ fixed |
| later | Variant bug: Catalog V1 products w/ manageVariants need `catalogReference.options.variantId` (NOT options map) | shop/[slug]/page.tsx | ✅ fixed |
| later | Mobile nav + cart drawer "transparent" — fixed via createPortal to escape Header's z-index stacking context | MobileNav.tsx, CartDrawer.tsx | ✅ fixed |

## 2026-05-14 — Custom checkout pivot

| early | Wix-hosted checkout redirect URL goes to `corvoathletic.com/_api/iam/...` but Wix 301-redirects root → www → Vercel = checkout broken | — | architectural blocker |
| early | Tried Path A (split-domain w/ www→Vercel root→Wix→checkout). Wix's auto 301 from root→www breaks /_api paths | — | dead end via Wix UI/API |
| early | Tried `checkout.corvoathletic.com` subdomain approach — Wix doesn't allow setting subdomain as primary in UI, blocked until Friday May 15 verification | — | dead end |
| early | User picked **Option B (Stripe custom checkout)** — Wix becomes pure backend (catalog + order storage + analytics), Stripe processes payments on Vercel | — | path locked |
| build | Installed `@stripe/stripe-js`, `@stripe/react-stripe-js`, `stripe` v22 | package.json | ok |
| build | Built `/checkout` page: full shipping form + Stripe PaymentElement w/ dark night theme matched to brand | src/app/checkout/* | ok |
| build | Server actions: `createCheckoutPaymentIntent` (prices cart server-side from Wix, creates Stripe PI), `completeCheckoutOrder` (verifies Stripe success, creates Wix Order via Admin API) | src/app/checkout/actions.ts | ok |
| build | `CartProvider.checkout()` now `router.push('/checkout')` — no more Wix redirect | src/components/cart/CartProvider.tsx | ok |
| build | Committed + pushed (commit `e583169`) | — | Vercel auto-deployed |
| env | User added 4 env vars in Vercel: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `WIX_ADMIN_API_KEY`, `WIX_SITE_ID` | (Vercel dashboard) | env vars saved |
| test | User tested checkout → got "Couldn't start checkout" error (server action threw) | — | likely needs redeploy w/ fresh build cache to pick up env vars |
| mcp | Added Vercel MCP to project config (`https://mcp.vercel.com`, HTTP transport) | ~/.claude.json | needs auth + session restart |

## Pending right now — restart Claude Code to continue

1. **Restart Claude Code session** (Ctrl+D, then `cd ~/code/corvo-athletics && claude`)
2. Run `/mcp` and authenticate Vercel (OAuth flow in browser, like Wix earlier)
3. Use Vercel MCP to:
   - Verify all 4 env vars are present on the project
   - Trigger a fresh redeploy (uncheck "Use existing Build Cache") if last deploy was before env vars added
   - Read runtime logs from the failing `/checkout` server action to see exact error
4. Once redeploy is green, retest end-to-end on phone with test card `4242 4242 4242 4242`
5. Verify the order shows up in Wix Dashboard → Sales → Orders

## Key context for restart

- **Premium storefront live at `https://www.corvoathletic.com`** (Vercel)
- **Wix is now pure backend** — catalog, orders, customers, analytics (we use Wix Admin API key server-side to create orders post-Stripe-payment)
- **Repo**: `dishan-kavinda/corvo-athletics` (public, auto-deploys to Vercel on push to main)
- **Latest commit on main**: `e583169` "feat(checkout): Stripe-based custom checkout"
- **Tasks #42 (update /thank-you with real order details) and #43 (end-to-end test) are pending** — verify after redeploy works
- **All 4 env vars locally in `.env.local`** (gitignored) for dev too, but the bug is at Vercel runtime
- **DO NOT** put Stripe secret key or Wix Admin API key in cerebrum/memory/anywhere committed

## Session: 2026-05-14 22:26

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|
| 22:36 | Edited src/app/checkout/actions.ts | added error handling | ~702 |
| 22:36 | Session end: 1 writes across 1 files (actions.ts) | 2 reads | ~702 tok |
| 22:38 | Session end: 1 writes across 1 files (actions.ts) | 2 reads | ~702 tok |
| 22:40 | Session end: 1 writes across 1 files (actions.ts) | 2 reads | ~702 tok |
| 22:41 | Edited src/app/checkout/actions.ts | added nullish coalescing | ~418 |
| 22:42 | Session end: 2 writes across 1 files (actions.ts) | 2 reads | ~1120 tok |
| 18:10 | Edited src/lib/stripe.ts | modified if() | ~86 |
| 18:11 | Session end: 3 writes across 2 files (actions.ts, stripe.ts) | 2 reads | ~1206 tok |
| 18:13 | Session end: 3 writes across 2 files (actions.ts, stripe.ts) | 2 reads | ~1206 tok |
| 18:15 | Edited src/lib/stripe.ts | modified if() | ~107 |
| 18:15 | Edited src/app/checkout/actions.ts | modified reach() | ~503 |
| 18:16 | Session end: 5 writes across 2 files (actions.ts, stripe.ts) | 2 reads | ~1816 tok |
| 18:20 | Session end: 5 writes across 2 files (actions.ts, stripe.ts) | 2 reads | ~1816 tok |
| 18:20 | Session end: 5 writes across 2 files (actions.ts, stripe.ts) | 2 reads | ~1816 tok |
| 18:24 | Session end: 5 writes across 2 files (actions.ts, stripe.ts) | 10 reads | ~6098 tok |
| 18:29 | Edited src/app/checkout/actions.ts | modified createCheckoutPaymentIntent() | ~482 |

## 2026-05-16 — Stripe checkout RESOLVED ✅

Multi-hour debug arc concluded. End-to-end Stripe checkout now working on production: `POST /checkout 200`, `STRIPE_OK pi=...`, user redirected to `/thank-you`. First successful PaymentIntent at 06:26 UTC.

**The arc:**
1. **Phase 1 (2026-05-14):** Built /checkout, server actions, env vars added to Vercel. Cached redeploys didn't pick up env vars — first error was the clear `STRIPE_SECRET_KEY is not set` at module init.
2. **Phase 2 (2026-05-14):** Forced clean rebuild via empty commit. Module init passed but PaymentIntent call threw, masked by Next.js prod boundary as `An error occurred with...`.
3. **Phase 3 (2026-05-16):** Added try/catch + console.error diagnostic. Captured `StripeConnectionError` — but only the type name fit in Vercel runtime_logs preview window (~28 chars).
4. **Phase 4:** Reformatted diagnostic to put critical info at the start, split error fields across multiple `console.error` calls queryable individually. Switched Stripe SDK to `createFetchHttpClient()`. Error persisted — proving the issue wasn't SDK transport.
5. **Phase 5:** Added `.trim().replace(/^["']|["']$/g, '')` defense. Added raw `fetch(api.stripe.com)` sanity check — returned 401 (network FINE). Added `kLen=${len} kTrLen=${trimLen}` probe. User retried — error persisted.
6. **Phase 6 — BREAKTHROUGH:** Tested user's actual key from local terminal against api.stripe.com → HTTP 200, valid. Then probed Vercel env-var length via Vercel runtime_logs `query` param — `kTrLen=107` returned 0 matches, but `pfx=sk_test` matched. CONCLUSION: stored value had right prefix but wrong byte count → contains invisible chars `.trim()` can't strip.
7. **Resolution:** User deleted env var in Vercel UI and re-pasted from Stripe dashboard. Empty commit forced clean rebuild. `kTrLen=107` ✅, `STRIPE_OK` ✅, `POST /checkout 200` ✅.

**Outstanding (non-blocking):** Wix Order sync via `POST https://www.wixapis.com/ecom/v1/orders` failed on first real checkout — payment captured, /thank-you rendered, but order didn't appear in Wix Sales. Tracked as task #12.

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|
| 06:30 | Cleaned diagnostic logging from createCheckoutPaymentIntent | actions.ts | back to lean prod code | ~600 |
| 06:30 | Updated bug-007 root cause + fix; cerebrum learnings for invisible-char paste corruption, Vercel cached redeploy, fetch http client, MCP log preview truncation | buglog.json, cerebrum.md | learnings captured | ~1500 |
| 18:32 | Session end: 6 writes across 2 files (actions.ts, stripe.ts) | 10 reads | ~6580 tok |
| 18:33 | Session end: 6 writes across 2 files (actions.ts, stripe.ts) | 10 reads | ~6580 tok |
| 18:36 | Edited src/app/checkout/actions.ts | modified completeCheckoutOrder() | ~1565 |
| 18:36 | Session end: 7 writes across 2 files (actions.ts, stripe.ts) | 10 reads | ~7550 tok |
| 18:39 | Session end: 7 writes across 2 files (actions.ts, stripe.ts) | 10 reads | ~7550 tok |
| 18:40 | Edited src/app/checkout/actions.ts | modified if() | ~189 |
| 18:41 | Session end: 8 writes across 2 files (actions.ts, stripe.ts) | 10 reads | ~7739 tok |
| 18:42 | Session end: 8 writes across 2 files (actions.ts, stripe.ts) | 10 reads | ~7739 tok |
| 18:43 | Session end: 8 writes across 2 files (actions.ts, stripe.ts) | 10 reads | ~7739 tok |
| 18:46 | Session end: 8 writes across 2 files (actions.ts, stripe.ts) | 10 reads | ~7739 tok |
| 18:46 | Session end: 8 writes across 2 files (actions.ts, stripe.ts) | 10 reads | ~7739 tok |
| 18:51 | Edited src/app/checkout/actions.ts | expanded (+14 lines) | ~348 |
| 18:53 | Session end: 9 writes across 2 files (actions.ts, stripe.ts) | 10 reads | ~8087 tok |
| 18:53 | Session end: 9 writes across 2 files (actions.ts, stripe.ts) | 10 reads | ~8087 tok |
| 18:55 | Session end: 9 writes across 2 files (actions.ts, stripe.ts) | 10 reads | ~8087 tok |
| 18:55 | Edited src/app/checkout/actions.ts | modified if() | ~160 |

## 2026-05-16 — Wix order sync RESOLVED ✅

End-to-end checkout now fully working: Stripe captures payment → server action creates real Wix order via Admin API → order appears in Wix Sales → Orders with `paymentStatus: PAID`. First synced order at 06:54 UTC.

**Two-layer fix:**
1. **Fresh Wix Admin API Key** — user generated a new key in Wix dashboard, replacing the paste-corrupted one (invisible chars rejected by undici with `Headers.append: Invalid header value`). Same defensive `.trim()+dequote` now applied to `WIX_ADMIN_API_KEY` and `WIX_SITE_ID` in code.
2. **Comprehensive Wix Orders v1 payload** — including the previously-missing `taxInfo` per line item (required even when tax is zero), full `priceSummary` (subtotal/shipping/tax/discount/total), `productName.original`, per-line `price`+`lineItemPrice` with both `amount` and `formattedAmount`, `itemType.preset`, `paymentOption`.

**Diagnostic pattern win:** replayed the exact production payload against the Wix Orders API via local curl using the new admin key. Got the FULL validation error (`taxInfo` missing) in one shot instead of waiting for another user retest. After adding taxInfo, the same probe returned HTTP 200 + a real order (#10001). Pushed the fix with high confidence — production retest succeeded first try.

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|
| 06:54 | Resolved Wix order sync end-to-end (commits 8fcde03, 780a4b8, bdf5269, c73dcb1) | src/app/checkout/actions.ts | order #10002+ now landing in Wix Sales | ~2000 |
| 18:58 | Session end: 10 writes across 2 files (actions.ts, stripe.ts) | 10 reads | ~8247 tok |
| 19:00 | Session end: 10 writes across 2 files (actions.ts, stripe.ts) | 10 reads | ~8247 tok |
| 19:04 | Session end: 10 writes across 2 files (actions.ts, stripe.ts) | 10 reads | ~8247 tok |
| 19:06 | Session end: 10 writes across 2 files (actions.ts, stripe.ts) | 10 reads | ~8247 tok |
| 19:24 | Session end: 10 writes across 2 files (actions.ts, stripe.ts) | 10 reads | ~8247 tok |
| 19:27 | Created src/lib/wix-orders.ts | — | ~1158 |
| 19:27 | Created src/app/thank-you/page.tsx | — | ~1601 |
| 19:28 | Session end: 12 writes across 4 files (actions.ts, stripe.ts, wix-orders.ts, page.tsx) | 10 reads | ~11006 tok |
| 19:30 | Session end: 12 writes across 4 files (actions.ts, stripe.ts, wix-orders.ts, page.tsx) | 10 reads | ~11006 tok |
| 19:36 | Edited src/lib/wix-orders.ts | modified getWixOrder() | ~570 |
| 19:37 | Session end: 13 writes across 4 files (actions.ts, stripe.ts, wix-orders.ts, page.tsx) | 10 reads | ~11576 tok |
| 19:38 | Session end: 13 writes across 4 files (actions.ts, stripe.ts, wix-orders.ts, page.tsx) | 10 reads | ~11576 tok |
| 19:40 | Session end: 13 writes across 4 files (actions.ts, stripe.ts, wix-orders.ts, page.tsx) | 10 reads | ~11576 tok |
| 19:45 | Edited src/app/checkout/actions.ts | expanded (+23 lines) | ~464 |
| 19:45 | Created src/lib/wix-orders.ts | — | ~1343 |
| 19:46 | Session end: 15 writes across 4 files (actions.ts, stripe.ts, wix-orders.ts, page.tsx) | 10 reads | ~14349 tok |
| 19:47 | Session end: 15 writes across 4 files (actions.ts, stripe.ts, wix-orders.ts, page.tsx) | 10 reads | ~14349 tok |
| 19:48 | Session end: 15 writes across 4 files (actions.ts, stripe.ts, wix-orders.ts, page.tsx) | 10 reads | ~14349 tok |
| 19:50 | Session end: 15 writes across 4 files (actions.ts, stripe.ts, wix-orders.ts, page.tsx) | 10 reads | ~14349 tok |
| 19:55 | Edited src/app/checkout/actions.ts | 6→8 lines | ~126 |
| 19:57 | Session end: 16 writes across 4 files (actions.ts, stripe.ts, wix-orders.ts, page.tsx) | 10 reads | ~14475 tok |

## 2026-05-16 (later) — /thank-you order details COMPLETE ✅

Real order data now renders on `/thank-you` end-to-end. Required four sequential fixes:

1. **Schema mismatch — `shippingInfo.shipmentDetails` is silently dropped on CREATE.** Replaced with `recipientInfo` + `shippingInfo.logistics.shippingDestination` (both — Wix accepts and persists both).
2. **Transient Wix 400** on the initial GET — cleared on subsequent visits (likely Vercel cached the failing server-component render briefly). `cache: no-store` + `force-dynamic` on the page is the defense.
3. **Verbose diagnostic** (`GETORDER_B1..B7` chunks) added then removed once root cause confirmed.
4. **`id` vs `_id` mismatch** — Wix eCom Orders v1 returns `id` (Wix Stores Products uses `_id`). Our POST response parser was reading `_id`, getting undefined, falling back to synthetic `stripe_<pi_id>` — which `/thank-you` correctly recognised as not-a-real-order and rendered the generic page. Fixed by accepting either field defensively.

Final commits in sequence: 7aabc67 → 0988b4a → b8372c7 → d528c67.

Verified working with real customer orders #10005 (DISHAN BULUGODA, 8 Mt Street Auckland) and #10006 (THISAS GAMAGE, 15 Tay Street Auckland) — both render full SHIPPING TO blocks.

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|
| 19:55 | /thank-you order details + address block fully working end-to-end | actions.ts, wix-orders.ts, thank-you/page.tsx | feature shipped, learnings logged in cerebrum bug-014 + bug-017 | ~3000 |
