# anatomy.md

> Auto-maintained by OpenWolf. Last scanned: 2026-06-12T07:36:55.632Z
> Files: 95 tracked | Anatomy hits: 0 | Misses: 0

## ../../../../AppData/Local/Temp/

- `corvo-bug163.cjs` — Declares fs (~315 tok)
- `corvo-buglog-156.cjs` — Declares fs (~323 tok)
- `corvo-buglog-append.cjs` — Declares fs (~472 tok)
- `corvo-cinematic-verify.mjs` — Verify the cinematic pinned heroes: console errors + screenshots at (~728 tok)
- `corvo-console-check.mjs` — Declares globalRoot (~366 tok)
- `corvo-final-verify.mjs` — Final verification: scroll the full savage + luxury homepages, capture the (~600 tok)
- `corvo-mobile-shots.mjs` — Mobile screenshot helper — uses openwolf's bundled puppeteer. (~610 tok)
- `corvo-reduce-sim.mjs` — Simulate the user's reduced-motion machine: headless Chrome WITHOUT the (~412 tok)

## ./

- `next.config.ts` — Declares WIX_SITE_URL (~628 tok)
- `PRODUCT-RESEARCH.txt` (~3613 tok)
- `tsconfig.json` — TypeScript configuration (~207 tok)

## .claude/


## .claude/rules/


## src/

- `proxy.ts` — API routes: GET (1 endpoints) (~192 tok)

## src/app/

- `globals.css` — Styles: 46 rules, 64 vars (~4159 tok)
- `layout.tsx` — anton (~1240 tok)
- `page.tsx` — metadata (~73 tok)
- `template.tsx` — EASE (~342 tok)

## src/app/about/

- `page.tsx` — metadata (~3768 tok)

## src/app/account/

- `page.tsx` — metadata (~1844 tok)

## src/app/account/callback/

- `route.ts` — Next.js API route: GET (~500 tok)

## src/app/account/dashboard/

- `page.tsx` — metadata (~4032 tok)

## src/app/account/login/

- `page.tsx` — metadata (~520 tok)
- `route.ts` — Next.js API route: GET (~212 tok)

## src/app/account/logout/

- `route.ts` — Next.js API route: GET (~80 tok)

## src/app/account/register/

- `page.tsx` — metadata (~524 tok)
- `route.ts` — Next.js API route: GET (~217 tok)

## src/app/api/auth/exchange/

- `route.ts` — Next.js API route: POST (~290 tok)

## src/app/api/auth/login/

- `route.ts` — Next.js API route: POST (~550 tok)

## src/app/api/auth/register/

- `route.ts` — Next.js API route: POST (~660 tok)

## src/app/api/auth/reset/

- `route.ts` — Next.js API route: POST (~212 tok)

## src/app/api/auth/verify/

- `route.ts` — Next.js API route: POST (~529 tok)

## src/app/api/preview-aesthetic/

- `route.ts` — TEMPORARY — design-QC helper. Sets the aesthetic cookie via GET then (~154 tok)

## src/app/api/set-aesthetic/

- `route.ts` — POST: validates aesthetic ('savage'|'luxury'), sets corvo_aesthetic cookie (1yr, non-httpOnly), returns {ok:true} (~173 tok)

## src/app/checkout/

- `actions.ts` — Exports CreatePaymentIntentResult, createCheckoutPaymentIntent, CompleteOrderInput, CompleteOrderRes (~4174 tok)
- `CheckoutForm.tsx` — initialShipping — renders form (~4821 tok)

## src/app/contact/

- `page.tsx` — metadata (~905 tok)

## src/app/home/

- `page.tsx` — metadata (~5779 tok)

## src/app/returns/

- `page.tsx` — metadata (~886 tok)

## src/app/shipping/

- `page.tsx` — metadata (~928 tok)

## src/app/shop/

- `page.tsx` — dynamic; serializes Wix products → ShopGrid; luxury-aware copy; newsletter empty state when catalog empty (~1761 tok)

## src/app/shop/[slug]/

- `page.tsx` — dynamic (~4008 tok)

## src/app/thank-you/

- `page.tsx` — metadata (~3073 tok)

## src/components/3d/

- `HeroScene.tsx` — useIsLowEnd (~3876 tok)
- `LuxuryHeroSceneClient.tsx` — LuxuryHeroScene (~84 tok)

## src/components/cart/

- `AddToCartButton.tsx` — AddToCartButton (~236 tok)
- `CartDrawer.tsx` — CartDrawer (~3156 tok)
- `CartIcon.tsx` — CartIcon (~501 tok)
- `CartProvider.tsx` — WIX_STORES_APP_ID (~1631 tok)

## src/components/hero/

- `HoloRaven.tsx` — LAYERS (~1558 tok)
- `LuxuryHeroCinematic.tsx` — EASE (~2882 tok)
- `SavageHeroCinematic.tsx` — EASE (~2968 tok)

## src/components/layout/

- `BackToTop.tsx` — BackToTop (~356 tok)
- `Footer.tsx` — footerLinks (~2036 tok)
- `Header.tsx` — navItems (~2052 tok)
- `Logo.tsx` — inline SVG React component; path1 fill=currentColor (raven body), path2 fill=#FF0000 (red eye); viewBox "700 240 2400 1200"; aspect 2:1 (~8154 tok)
- `MobileNav.tsx` — navItems (~2249 tok)
- `SmoothScroll.tsx` — SmoothScroll (~198 tok)

## src/components/motion/

- `CurtainReveal.tsx` — Panel color — defaults to the page background (~686 tok)
- `FadeIn.tsx` — FadeIn (~214 tok)
- `ParallaxImage.tsx` — ParallaxImage (~578 tok)
- `RevealImage.tsx` — Parallax image reveal — scales from 1.1 to 1 as the image scrolls into view. (~265 tok)
- `RevealText.tsx` — Clip-mask text reveal — container clips at its border, text slides up into view. (~246 tok)
- `ScrubReveal.tsx` — Curtain panel color — match the section background (~1207 tok)
- `SlashReveal.tsx` — Accepted for interchangeability with CurtainReveal; unused here. (~514 tok)
- `VelocityWarp.tsx` — 1 = savage (pronounced), ~0.35 = luxury (restrained) (~358 tok)

## src/components/svg/

- `DustField.tsx` — DustField (~360 tok)
- `EKGPulse.tsx` — Primary runner color (~552 tok)
- `GoldBezel.tsx` — GoldBezel (~665 tok)
- `GoldFlourish.tsx` — Delay before the draw starts (s) (~477 tok)
- `Reticle.tsx` — Reticle (~833 tok)
- `ScrollSpine.tsx` — H (~1585 tok)

## src/components/ui/

- `AuthForm.tsx` — LABEL — renders form (~3924 tok)
- `Button.tsx` — variants (~476 tok)
- `CategoryGrid.tsx` — Client component: 2×2 grid (sm:grid-cols-2) of Framer Motion category cards using motion.create(Link) with variant propagation for hover effects (blade, glow, label lift, bottom line) (~850 tok)
- `FeaturedProducts.tsx` — async server section for /home: fetches catalog, 4-product grid; returns null on empty/error (~674 tok)
- `InfoAccordion.tsx` — client accordion (single-open, height animation) for product detail shipping/returns/quality (~635 tok)
- `MarqueeStrip.tsx` — WORDS (~514 tok)
- `NewsletterForm.tsx` — NewsletterForm — renders form (~1093 tok)
- `ProductCard.tsx` — ProductCard (~1910 tok)
- `ProductGallery.tsx` — client gallery: crossfade main image + clickable thumbnails, sticky top-[72px] (~903 tok)
- `QuickView.tsx` — QuickView (~1920 tok)
- `RestockNotify.tsx` — RestockNotify — renders form (~1068 tok)
- `SearchModal.tsx` — SearchModal (~2244 tok)
- `ShopGrid.tsx` — client grid: live search, sort (featured/price asc-desc/name), aria-live count, animated empty state (~1685 tok)
- `SizeGuideButton.tsx` — SizeGuideButton (~338 tok)
- `SizeGuideModal.tsx` — sizes — renders table (~2490 tok)
- `SplitChooser.tsx` — EASE (~6041 tok)
- `StickyAddToCart.tsx` — StickyAddToCart (~1011 tok)
- `ThemeToggle.tsx` — ThemeToggle (~432 tok)
- `WishlistButton.tsx` — WishlistButton (~471 tok)

## src/hooks/

- `useWishlist.ts` — Exports useWishlist (~220 tok)

## src/lib/

- `format.ts` — Exports fmtMoney, fmtDate (~113 tok)
- `sanitize.ts` — Exports sanitizeHtml (~294 tok)
- `wix-browser.ts` — Module singleton preserves internal OAuth state (e.g. stateToken for email verification). (~137 tok)
- `wix-member-client.ts` — Exports WixTokens, WixOAuthData, createServerMemberClient (~190 tok)
- `wix-orders.ts` — Exports WixOrderSummary, getMemberOrders, getWixOrder (~1709 tok)

## src/providers/

