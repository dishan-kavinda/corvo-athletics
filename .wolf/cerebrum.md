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
- [2026-05-13] **Wix Catalog V1 cart adds for products with `manageVariants: true` silently succeed (return 200 OK, lineItems=0) when variant options are not provided.** No error is thrown — Wix just refuses to add anything. Detect via `product.manageVariants && product.productOptions?.length > 0`. Must include `catalogReference.options.options` as a `Record<optionName, choiceValue>` map (e.g. `{ Color: 'White', Size: 'M' }`). For v1 quick fix, auto-pick the first in-stock + visible choice of each option group on the product detail page and pass via `defaultOptions` prop to AddToCartButton. Proper variant selector UI deferred.
- [2026-05-13] **WIX_STORES_APP_ID for catalogReference is `215238eb-22a5-4c36-9e7b-e7c08025e04e`, NOT `1380b703-ce81-ff05-f115-39571d94dfcd`.** Confirmed from the `@wix/auto_sdk_ecom_current-cart` `CatalogReference` JSDoc — official current value. The 1380b703 ID is outdated/wrong (came from older Wix Headless docs / memory). Wix silently swallows requests with unknown appIds — returns 200 OK with empty cart, no error thrown. This was the actual cart-add bug, NOT missing variants. Hours of debugging the variant-options theory wasted. ALWAYS verify constants like appId from the live SDK type definitions (`grep -nA 20 "interface CatalogReference" node_modules/.pnpm/@wix+auto_sdk_ecom_current-cart*/.../index.typings.d.ts`) before trusting memory.

## Decision Log

- [2026-05-12] **Headless rebuild chosen (option c) over Editor+Velo or Wix CLI.** User confirmed Corvo Athletics is a long-term brand commitment, so the Editor's design ceiling was unacceptable. Path: Next.js 16 + Tailwind v4 + Framer Motion + Wix Headless SDK, hosted on Vercel. Domain `corvoathletic.com` stays at Wix as registrar; DNS A/CNAME records will repoint to Vercel at cutover. Staging at `new.corvoathletic.com` subdomain planned before final cutover.
- [2026-05-12] **Product rewrites deferred.** 15 existing products are dropship items unrelated to the Corvo brand. User will swap catalog wholesale later — rewriting names/descriptions now would be throwaway work. Accepted: storefront looks off-brand until catalog swap.
- [2026-05-12] **v1 checkout = Wix-hosted redirect.** Custom on-domain checkout deferred to v2. Tradeoff accepted: brand visual breaks at checkout step (Wix-default UI), saves 1+ day of work, lets us ship.
- [2026-05-12] **v1 blog = stays on Wix.** Not migrating Wix Blog posts to MDX. Blog data accessible later if we change our mind.
- [2026-05-12] **Members auth deferred to v2.** `/account` is a placeholder. Cart is browser-session only (localStorage-backed visitor token) until we wire Wix Members auth properly.
- [2026-05-13] **Premium SEO setup chosen over minimal SEO migration.** Even though Wix Editor SEO can't be auto-migrated, we added structured data (Organization + Product JSON-LD), auto-sitemap with products, robots.txt, per-page canonical + OG + Twitter — net SEO is *better* than the Wix Editor version.
- [2026-05-13] **Matte gold (`#C9A961`) confirmed as accent.** Premium feel, hardest to make look cheap, classic on dark.
