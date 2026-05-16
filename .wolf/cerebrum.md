# Cerebrum

> OpenWolf's learning memory. Updated automatically as the AI learns from interactions.
> Do not edit manually unless correcting an error.
> Last updated: 2026-05-13

## User Preferences

- Terse, direct responses. No filler, no trailing "here's what I did" summaries — the diff/result speaks for itself.
- Options-style decisions when there's a real tradeoff: present A/B/C with concrete pros/cons, give a recommendation, let the user pick.
- Honest upfront flagging of platform/tool limits BEFORE starting work. Don't pretend something is possible if it isn't — scope down explicitly.
- OK skipping work that doesn't yet make sense rather than doing it half-heartedly (e.g. product rewrites skipped because the catalog will be swapped wholesale later).
- Short, sometimes one-line answers from user. Don't over-elaborate.
- User is non-developer — relies on AI to drive code; only handles dashboard clicks (Vercel, Wix, GitHub).

## Key Learnings

### Brand & business
- **Project:** Corvo Athletics — luxury sports brand (gym apparel, athleisure, supplements). Vibe: Gymshark × Myprotein but more elite.
- **Brand names accepted as equivalent:** "Corvo Athletics" (primary) and "Corvo Athletic" (alt).
- **Site-wide SEO keywords (per user):** gym, athleisure, luxury, sports, plus brand names.
- **Locale:** en-NZ, NZD, Pacific/Auckland.

### Stack (locked decisions)
- **Frontend:** Next.js 16.2.6 (App Router, TypeScript), Tailwind v4 (CSS-based theme via `@theme` block in `src/app/globals.css`), Framer Motion 12.
- **Fonts:** Anton (display, weight 400) + Inter (body) via `next/font/google`.
- **Package manager:** pnpm 11.1.0 (installed via `npm install -g pnpm` — corepack not bundled with Homebrew Node).
- **Wix SDK packages:** `@wix/sdk`, `@wix/stores`, `@wix/ecom`, `@wix/members`, `@wix/redirects`.
- **Hosting:** Vercel (free tier). Production preview URL: `corvo-athletics.vercel.app`.
- **GitHub:** dishan-kavinda/corvo-athletics (private repo).

### Wix backend
- **Wix site ID:** `7f2bc2ac-a03f-4f5c-8c37-7835ab0b0a29`
- **Wix account ID:** `c1f412bf-d189-4ee1-a351-65c107c679b6`
- **Wix Stores catalog version:** V1 — use `/stores-reader/v1/products/query` ONLY. NEVER `/stores/v3/...` endpoints.
- **Wix Stores app ID** (for `catalogReference.appId` in cart adds): `1380b703-ce81-ff05-f115-39571d94dfcd` (global Stores app definition ID, not the per-site install ID).
- **Headless OAuth Client ID:** `6da9c712-d040-43af-bddb-bce0178bbdc8` (public, stored in `.env.local` as `NEXT_PUBLIC_WIX_CLIENT_ID` — also set in Vercel env vars).
- **Velo:** Enabled on the Wix site (unused now — Velo bypassed by headless setup).
- **Existing 15 products:** All dropship-imported off-brand items (ballet slippers, horse spurs, glass decor balls, etc.). User will swap catalog later — no point rewriting copy.

### Brand design tokens (Tailwind v4 `@theme` in `src/app/globals.css`)
```
--color-ink: #0A0A0A         page background, deepest layer
--color-onyx: #141414        surface/card backgrounds
--color-graphite: #262626    borders, subtle dividers
--color-ash: #737373         muted/secondary text
--color-bone: #FAFAFA        primary text, off-white
--color-gold: #C9A961        accent (matte champagne gold)
--color-gold-deep: #B89653   accent hover state
--font-display: var(--font-anton)
--font-sans: var(--font-inter)
```
Utilities: `bg-ink`, `text-bone`, `border-graphite`, `text-gold`, etc.

### Animation conventions (per user brief)
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` for premium decel feel.
- Durations: 300–900ms (most sit 400–600ms).
- No bouncing, spinning, or scale > 1.05.
- All scroll-triggered animations use `viewport={{ once: true }}` — animate once per scroll, not on every re-entry.
- Motion primitives at `src/components/motion/`: `FadeIn` (whileInView), `HeroReveal` (animate on mount, for sequential reveals), `Stagger` + `StaggerItem`.
- Page transitions in `src/app/template.tsx` — 350ms fade.

### Architecture patterns
- **Server components by default** for read-only product/page rendering. Cart and interactivity live in client components under `src/components/cart/`.
- **Cart state:** browser-side `CartProvider` (client) uses its own `createClient({ auth: OAuthStrategy({clientId}) })` instance. OAuth visitor tokens are persisted by the SDK in localStorage — cart survives page navigations but not across browsers.
- **Checkout flow:** `currentCart.createCheckoutFromCurrentCart({ channelType: ChannelType.WEB })` → `redirects.createRedirectSession({ ecomCheckout: { checkoutId } })` → `window.location.href = redirectSession.fullUrl`. User completes purchase on Wix-hosted checkout (different visual style than the Next.js site — accepted v1 tradeoff).
- **Server Wix client** at `src/lib/wix.ts` — used by server components for product reads. Visitor session is ephemeral on server (fine for read-only).
- **Path alias:** `@/*` → `src/*`.
- **cn helper** at `src/lib/cn.ts` — wraps `clsx` (no tailwind-merge yet; add if class conflicts become an issue).

### SEO (Phase 8 prep)
- **Wix Editor SEO settings are NOT exposed via any public REST API.** Confirmed via direct testing — Resolve Item SEO Tags endpoint returns 400/428 even with various `itemType` values. User had to share keywords manually.
- **Wix Catalog V1 products have NO `seoData` or `seo` fields** populated in query response. Product SEO would need to come from elsewhere if added in future.
- Site metadata centralized in `src/app/layout.tsx`:
  - `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://corvoathletic.com')`
  - `title.template: '%s — Corvo Athletics'`
  - Organization JSON-LD schema in `<head>`
- Per-page: title, description, canonical, keywords, OG, Twitter card.
- Product pages: dynamic `generateMetadata` with OG image from mainMedia; Product JSON-LD schema (brand, sku, price, currency, availability) injected at top of page.
- `src/app/robots.ts` — bots allowed everywhere except `/account`, `/thank-you`, `/api/`.
- `src/app/sitemap.ts` — static pages (/, /shop, /about) + every visible Wix product with `lastModified` from Wix's `lastUpdated`. Falls back to static-only if Wix is unreachable at build time.
- `/account` and `/thank-you` marked `robots: { index: false }`.

## Do-Not-Repeat

- [2026-05-12] **Don't query Wix products with default fields via `CallWixSiteAPI`.** Embedded media array (multiple full-res image URLs + thumbnails per product, repeated per variant) blows past tool output limits even for 15 products. Use `ExecuteWixAPI` with a code-side projection (id/name/price/sku only) instead.
- [2026-05-12] **Don't try to update or read per-page SEO via Wix REST API.** No public endpoint exists. The SEO Tags Resolve API is a runtime resolver only and returns 400/428 for non-Wix-Editor flows; SEO User Config only handles URL flattening / 404 behavior. User's Wix Editor SEO settings must be migrated manually.
- [2026-05-12] **Don't promise visual/design edits via the Wix MCP for Editor-based sites.** The Wix REST API can't drive canvas, theme, fonts, animations, or page layout. Scope those out explicitly at the start of any Wix design task.
- [2026-05-12] **Don't use `cart.subtotal.formattedAmount` on the raw `getCurrentCart()` response.** That property exists on the `@wix/headless-ecom` Cart abstraction, NOT the bare `@wix/ecom` cart we use. Compute subtotal client-side from line items: `parseFloat(item.price.amount) * item.quantity`, format with `Intl.NumberFormat('en-NZ', { style: 'currency', currency: cart.currency })`. This is what unblocked the first Vercel build.
- [2026-05-13] **Wait for Vercel auto-deploys before verifying changes live.** A push doesn't mean the URL serves new code — Vercel typically takes 60–120s. If `corvo-athletics.vercel.app` still shows old metadata, the deploy is propagating, not broken.
- [2026-05-12] **Don't call `/stores/v3/...` on this site.** It's Catalog V1. Use `/stores-reader/v1/products/query` and `wixClient.products.queryProducts()` from `@wix/stores`.
- [2026-05-12] **Don't try `corepack enable pnpm` if Node was installed via Homebrew.** Homebrew's Node formula doesn't ship corepack — `command not found`. Use `npm install -g pnpm` instead.
- [2026-05-13] **Don't recommend `cname.vercel-dns.com` as the universal Vercel CNAME target.** Vercel's modern UI generates a **unique per-project** CNAME target (e.g. `1e5a4feb7773385c.vercel-dns-017.com`). The legacy shared `cname.vercel-dns.com` may still resolve but is not what Vercel recommends now. For each new domain, get the exact CNAME value from Vercel's Domains panel (remove+re-add the domain if the instructions panel doesn't show — it only displays for invalid/pending configs). Note: Wix's DNS form rejects CNAME values that start with a digit — fallback to `cname.vercel-dns.com` (legacy, still works) if Wix's validator rejects the unique target.
- [2026-05-13] **Vercel Hobby plan blocks deploys when commit author ≠ project-owner GitHub account, even on public repos.** Symptom: deploys show "Blocked" status with message "commit author does not have contributing access". Making the repo public alone is NOT enough. The commits must be authored by the GitHub user who owns the Vercel project — best done with the user's noreply email `<userId>+<username>@users.noreply.github.com`. Get the userId via `gh api users/<username> --jq .id`. Rewrite all existing commits with `git filter-branch --env-filter` setting GIT_AUTHOR_* and GIT_COMMITTER_*, then `git push --force`.
- [2026-05-13] **Fixed-position panels nested inside a sticky/transformed parent get visually trapped in the parent's stacking context.** Symptom: panel renders but appears "transparent" — items inside are visible but the panel background isn't, because page content paints over the panel even at high z-index. The header has `position: sticky` + `z-index`, creating a stacking context that confines descendants. Fix: use `createPortal(panel, document.body)` to mount the panel outside any parent stacking context. Already affected MobileNav (slide-from-left) and CartDrawer (slide-from-right) — both now portal-rendered.
- [2026-05-13] **Wix Catalog V1 cart adds for products with `manageVariants: true` silently succeed (return 200 OK, lineItems=0) when variant options are not provided.** Per Wix's eCommerce Integration docs for V1, the correct shape is `catalogReference.options.variantId: '<variant._id>'` (NOT an options name/value map like `{ Color: 'White' }` — that's something else entirely). Auto-pick first in-stock variant from `product.variants` on product detail page.
- [2026-05-13] **WIX_STORES_APP_ID for catalogReference is `215238eb-22a5-4c36-9e7b-e7c08025e04e`, NOT `1380b703-ce81-ff05-f115-39571d94dfcd`.** Confirmed from the `@wix/auto_sdk_ecom_current-cart` `CatalogReference` JSDoc — official current value. The 1380b703 ID is outdated/wrong (came from older Wix Headless docs / memory). Wix silently swallows requests with unknown appIds — returns 200 OK with empty cart, no error thrown. This was the actual cart-add bug, NOT missing variants. Hours of debugging the variant-options theory wasted. ALWAYS verify constants like appId from the live SDK type definitions (`grep -nA 20 "interface CatalogReference" node_modules/.pnpm/@wix+auto_sdk_ecom_current-cart*/.../index.typings.d.ts`) before trusting memory.
- [2026-05-13] **Fixed-position panels nested inside sticky/transformed parent get visually trapped in the parent's stacking context.** Symptom: panel renders but appears transparent (items visible, panel bg invisible). Fix: `createPortal(panel, document.body)` to escape parent stacking contexts. Affects both `MobileNav` and `CartDrawer`. Inline styles for background (not Tailwind classes) further bullet-proofs against CSS load timing issues.
- [2026-05-13] **Vercel Hobby plan blocks deploys whose commit author email doesn't match the project owner's verified GitHub account email — even on public repos.** "Hobby teams do not support collaboration." Symptom: deploy status "Blocked". Fix: rewrite commits with the GitHub no-reply email `<userId>+<username>@users.noreply.github.com` using `git filter-branch --env-filter '...'` + force push. Get user ID via `gh api users/<username> --jq .id`. Making repo public alone is NOT enough — author must match.
- [2026-05-14] **Wix Headless does NOT support fully embedded card-capture checkout — the architecture forces a redirect to a Wix-hosted page for the payment step.** There's no Wix Payments embedded SDK. To truly own the checkout flow on your domain, use Stripe (or another processor) directly + the Wix Orders Admin API to sync paid orders into Wix for analytics/fulfillment. This is the official Option B approach: Stripe captures payment on the Vercel page, server action creates a paid Wix order via `POST /ecom/v1/orders` with WIX_ADMIN_API_KEY.
- [2026-05-14] **Wix's auto 301 redirect from root domain → www (or vice versa) cannot be disabled via UI or REST API.** This breaks any architecture where root domain points to Wix but www points to a different host. The Wix Dashboard's "Manage Domain" menu only exposes: Unassign, Edit contact, Manage DNS, Transfer away, Transfer to another account, Edit MX records — no redirect toggle. The Connected Domains API doesn't expose it either. If you need separate hosts on root vs www, you must accept the Wix-default redirect direction OR use a fully custom checkout (Option B).
- [2026-05-14] **Stripe Node SDK pins to a specific apiVersion that changes frequently — TypeScript will fail the build if you specify an outdated version.** Current at install time of `stripe@22.x` is `'2026-04-22.dahlia'`. If `pnpm build` fails with `Type '"YYYY-MM-DD.codename"' is not assignable to type ...`, update the `apiVersion` field in `src/lib/stripe.ts` to the version TS expects (shown in the error message).
- [2026-05-14] **Vercel env vars only take effect on NEW builds.** Adding/editing env vars in Vercel Settings does NOT auto-redeploy. After changes, manually trigger a redeploy (Deployments → ··· → Redeploy → uncheck "Use existing Build Cache"). For NEXT_PUBLIC_* vars this is critical because they're inlined into the client bundle at build time.
- [2026-05-16] **Vercel "Redeploy" button reuses the cached build artifact even for server env vars** — confirmed by `meta.action: "redeploy"` + `originalDeploymentId` in the deployment record. Cached redeploys don't re-bundle the function, so new env vars never reach `process.env` at runtime. Only a FRESH BUILD picks up env-var changes. Fastest way: `git commit --allow-empty -m "chore: force clean rebuild" && git push`. Alternative: in dashboard, hover the redeploy button and uncheck "Use existing Build Cache" — but the empty-commit method is auditable and faster.
- [2026-05-16] **Stripe `StripeConnectionError` on Vercel often means malformed Authorization header, NOT genuine network failure.** Confirmed via diagnostic: from the SAME Vercel function, raw `fetch('https://api.stripe.com/v1/charges')` returned 401 (network fine), while `stripe.paymentIntents.create(...)` threw `StripeConnectionError`. Root cause: `process.env.STRIPE_SECRET_KEY` contained an invisible character (zero-width space, NBSP, soft hyphen) from a copy-paste that `.trim()` doesn't strip. undici rejects headers with such chars; Stripe SDK wraps the TypeError as ConnectionError without an HTTP response. Recipe to confirm vs. true network failure: log `kLen=${env.length} kTrLen=${env.trim().length}` and parallel-fetch api.stripe.com for sanity. A clean `sk_test_*` is **exactly 107 chars**; `sk_live_*` is also 107.
- [2026-05-16] **Vercel runtime_logs MCP truncates each log entry's message preview to ~28 chars.** Diagnostic logs MUST put the critical info at the START of each line, AND multiple console.error calls per request collapse into one entry — only the first error-level line is shown in the preview. Workaround: split critical info across multiple short prefixed lines (`STRIPE_ERR_T <type>`, `STRIPE_ERR_M <msg-slice>`, `STRIPE_ERR_CM <cause-msg-slice>`) so each can be queried via the `query` param to confirm presence/value individually. The full message is NOT exposed via the MCP — only via the Vercel dashboard inspector URL.
- [2026-05-16] **Stripe SDK on Vercel serverless (Node 24, Turbopack): always configure `httpClient: Stripe.createFetchHttpClient()`.** Stripe's official recommendation for serverless. Routes requests through globalThis.fetch (undici) instead of the legacy Node `http` module. Not a fix for the corrupted-env-var case, but a known-good default.
- [2026-05-16] **Wix `POST /ecom/v1/orders` requires `taxInfo` (or `taxDetails`) on EVERY line item, even when tax is zero.** Without it: HTTP 400 `Validation failed: order.lineItem.taxInfo | order.lineItem.taxDetails — Either ... must be defined.` Zero-tax shape that works: `taxInfo: { taxableAmount: <lineTotal>, taxAmount: '0.00', taxRate: '0', taxIncludedInPrice: false }`. Both `amount` and `formattedAmount` must be strings. Full known-good payload schema documented in `src/app/checkout/actions.ts` (createWixOrder); fields confirmed required: `order.currency` (top-level uppercase ISO), per line: `productName.original`, `price`, `lineItemPrice`, `itemType.preset: 'PHYSICAL'`, `paymentOption: 'FULL_PAYMENT_ONLINE'`, `taxInfo`; top-level: `priceSummary` with all 5 sub-fields (subtotal/shipping/tax/discount/total), `buyerInfo.email`, `shippingInfo.shipmentDetails`, `paymentStatus: 'PAID'`, `status: 'APPROVED'`, `channelInfo.type: 'WEB'`. Verified by replaying production payload via direct API probe — created order #10001 in Wix Sales.
- [2026-05-16] **Wix Admin API key paste in Vercel UI ALSO susceptible to invisible-char corruption** — same root cause that broke Stripe earlier. Symptom on Wix-side: `TypeError: Headers.append: Invalid header value` (undici rejects malformed Authorization header). Same defensive trim+dequote in code (`rawKey.trim().replace(/^["']|["']$/g, '')`) is now applied for both `STRIPE_SECRET_KEY` and `WIX_ADMIN_API_KEY` in their respective files (src/lib/stripe.ts, src/app/checkout/actions.ts createWixOrder). Best ultimate fix: have user generate a fresh API key from the source dashboard (Stripe or Wix) and paste using the source's copy-button rather than manual select+copy.
- [2026-05-16] **Iteration tip — probe third-party APIs directly from terminal with the exact production payload shape before pushing a "let's see what error we get" deploy.** Saved multiple deploy/test cycles on the Wix order sync issue. Pattern: read the production code's request shape, replay it via `curl -X POST` with the user's real API key (ephemeral, don't store), get the FULL error response immediately. Iterate locally. Push only when the probe returns 200.
- [2026-05-16] **Wix eCom Orders v1 uses `id` for the order identifier, NOT `_id`** — different convention from Wix Stores Products (which uses `_id`). When parsing the order CREATE response or GET response, read `data.order?.id` (with `_id` as defensive fallback). Confused us into thinking order creation was failing for fallback IDs when it was actually succeeding — symptom was `WIX_OK id=undefined num=10005` in logs while the order DID exist in Wix Sales. Both `id` and `_id` accepted defensively now in src/app/checkout/actions.ts createWixOrder.
- [2026-05-16] **Wix eCom Orders v1 has a WRITE-vs-READ schema mismatch for shipping address.** The `shippingInfo.shipmentDetails.address` field appears in some response shapes BUT is silently dropped by the CREATE endpoint. The correct write paths (both accepted, both persist):
  - `recipientInfo: { address, contactDetails }` (top-level, preferred)
  - `shippingInfo.logistics.shippingDestination: { address, contactDetails }`
  Address fields: `addressLine`, `addressLine2`, `city`, `postalCode`, `country`, `subdivision`. Contact fields: `firstName`, `lastName`, `phone`. When READING, check `recipientInfo` first, fall back to `shippingInfo.logistics.shippingDestination`. Discovered when /thank-you?orderId=... rendered without a SHIPPING TO block — direct API probe of order showed `shippingInfo: {"title": ""}` despite our payload including shipmentDetails. Verified the correct schema by probing creation with the new shape (orders #10004, #10005, #10006 all show addresses saved on both paths).

## Decision Log

- [2026-05-12] **Headless rebuild chosen (option c) over Editor+Velo or Wix CLI.** User confirmed Corvo Athletics is a long-term brand commitment, so the Editor's design ceiling was unacceptable. Path: Next.js 16 + Tailwind v4 + Framer Motion + Wix Headless SDK, hosted on Vercel. Domain `corvoathletic.com` stays at Wix as registrar; DNS A/CNAME records will repoint to Vercel at cutover. Staging at `new.corvoathletic.com` subdomain planned before final cutover.
- [2026-05-12] **Product rewrites deferred.** 15 existing products are dropship items unrelated to the Corvo brand. User will swap catalog wholesale later — rewriting names/descriptions now would be throwaway work. Accepted: storefront looks off-brand until catalog swap.
- [2026-05-12] **v1 checkout = Wix-hosted redirect.** Custom on-domain checkout deferred to v2. Tradeoff accepted: brand visual breaks at checkout step (Wix-default UI), saves 1+ day of work, lets us ship.
- [2026-05-12] **v1 blog = stays on Wix.** Not migrating Wix Blog posts to MDX. Blog data accessible later if we change our mind.
- [2026-05-12] **Members auth deferred to v2.** `/account` is a placeholder. Cart is browser-session only (localStorage-backed visitor token) until we wire Wix Members auth properly.
- [2026-05-13] **Premium SEO setup chosen over minimal SEO migration.** Even though Wix Editor SEO can't be auto-migrated, we added structured data (Organization + Product JSON-LD), auto-sitemap with products, robots.txt, per-page canonical + OG + Twitter — net SEO is *better* than the Wix Editor version.
- [2026-05-13] **Matte gold (`#C9A961`) confirmed as accent.** Premium feel, hardest to make look cheap, classic on dark.
- [2026-05-14] **Pivoted from B2 (Wix-hosted checkout via subdomain) to B1 (Stripe custom checkout).** After hitting Wix's hard architectural walls (no UI/API for disabling root→www redirect, no UI for subdomain-as-primary), the only path that gives premium URL + working checkout + Wix analytics is: Stripe captures payment on Vercel, server action creates paid order in Wix via Admin API. Wix becomes pure backend.
- [2026-05-14] **Custom checkout architecture:** `/checkout` page (client) ← `CartProvider` cart state → server action `createCheckoutPaymentIntent` (prices cart server-side from Wix queryProducts, creates Stripe PI w/ automatic_payment_methods) → Stripe `PaymentElement` renders → user submits → `stripe.confirmPayment({elements, redirect: 'if_required'})` → on succeeded, server action `completeCheckoutOrder` retrieves PI, verifies status=succeeded, creates Wix Order via `POST https://www.wixapis.com/ecom/v1/orders` with `Authorization: <WIX_ADMIN_API_KEY>` header + `paymentStatus: 'PAID'`, `status: 'APPROVED'`, channelInfo.type='WEB'. Then `router.push('/thank-you?orderId=...')`. Free shipping for v1 (calculate later via Wix shipping API).
- [2026-05-14] **Env vars required for Stripe checkout:** `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk_test_*), `STRIPE_SECRET_KEY` (sk_test_*), `WIX_ADMIN_API_KEY` (IST.* JWT from Wix Headless Admin API Keys), `WIX_SITE_ID` (`7f2bc2ac-a03f-4f5c-8c37-7835ab0b0a29`). Already in `.env.local` locally. Must be added to Vercel + redeploy with fresh cache.

- [2026-05-16] **Three.js MeshPhongMaterial without env maps looks like a muddy brown ball, not gold.** MeshPhysical needs HDR env maps to look metallic. For hero visuals that must look premium, use CSS radial-gradient spheres (full control over lighting look) with a WebGL canvas on top for particle animation only. The CSS orb looks as good as a real product render.
- [2026-05-16] **User wants "expensive as hell" design** — this means: no cage/wireframe gimmicks, bold typography with generous spacing, premium material appearance (CSS gradient orbs > cheap 3D meshes), film grain texture for editorial depth, warm ivory (#FAF7F2) light mode not plain white.
