# anatomy.md

> Auto-maintained by OpenWolf. Last scanned: 2026-06-12T05:13:30.393Z
> Files: 81 tracked | Anatomy hits: 0 | Misses: 0

## ../../../../AppData/Local/Temp/

- `corvo-console-check.mjs` — Declares globalRoot (~366 tok)
- `corvo-mobile-shots.mjs` — Mobile screenshot helper — uses openwolf's bundled puppeteer. (~610 tok)

## ./

- `next.config.ts` — Declares WIX_SITE_URL (~628 tok)
- `PRODUCT-RESEARCH.txt` (~3613 tok)
- `tsconfig.json` — TypeScript configuration (~207 tok)

## .claude/


## .claude/rules/


## src/

- `proxy.ts` — Next.js 16 proxy (formerly middleware): injects x-pathname header; redirects `/`→`/home` if corvo_aesthetic cookie set, `/home`→`/` if not (~188 tok)

## src/app/

- `globals.css` — Styles: 44 rules, 87 vars (~3560 tok)
- `layout.tsx` — anton (~1178 tok)
- `page.tsx` — metadata (~73 tok)
- `template.tsx` — Template (~110 tok)

## src/app/about/

- `page.tsx` — metadata (~3842 tok)

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

- `page.tsx` — metadata (~8299 tok)

## src/app/returns/

- `page.tsx` — metadata (~886 tok)

## src/app/shipping/

- `page.tsx` — metadata (~928 tok)

## src/app/shop/

- `page.tsx` — dynamic; serializes Wix products → ShopGrid; luxury-aware copy; newsletter empty state when catalog empty (~1761 tok)

## src/app/shop/[slug]/

- `page.tsx` — dynamic (~3834 tok)

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

## src/components/layout/

- `BackToTop.tsx` — BackToTop (~356 tok)
- `Footer.tsx` — footerLinks (~2036 tok)
- `Header.tsx` — navItems (~2052 tok)
- `Logo.tsx` — inline SVG React component; path1 fill=currentColor (raven body), path2 fill=#FF0000 (red eye); viewBox "700 240 2400 1200"; aspect 2:1 (~8154 tok)
- `MobileNav.tsx` — navItems (~2249 tok)
- `SmoothScroll.tsx` — SmoothScroll (~198 tok)

## src/components/motion/

- `FadeIn.tsx` — FadeIn (~214 tok)
- `ParallaxImage.tsx` — ParallaxImage (~578 tok)
- `RevealImage.tsx` — Parallax image reveal — scales from 1.1 to 1 as the image scrolls into view. (~265 tok)
- `RevealText.tsx` — Clip-mask text reveal — container clips at its border, text slides up into view. (~246 tok)

## src/components/svg/

- `DustField.tsx` — DustField (~360 tok)
- `EKGPulse.tsx` — Primary runner color (~552 tok)
- `GoldFlourish.tsx` — Delay before the draw starts (s) (~477 tok)
- `Reticle.tsx` — Reticle (~833 tok)
- `ScrollSpine.tsx` — H (~1717 tok)

## src/components/ui/

- `AuthForm.tsx` — LABEL — renders form (~3924 tok)
- `Button.tsx` — variants (~476 tok)
- `CategoryGrid.tsx` — Client component: 2×2 grid (sm:grid-cols-2) of Framer Motion category cards using motion.create(Link) with variant propagation for hover effects (blade, glow, label lift, bottom line) (~850 tok)
- `FeaturedProducts.tsx` — async server section for /home: fetches catalog, 4-product grid; returns null on empty/error (~674 tok)
- `InfoAccordion.tsx` — client accordion (single-open, height animation) for product detail shipping/returns/quality (~635 tok)
- `MarqueeStrip.tsx` — WORDS (~455 tok)
- `NewsletterForm.tsx` — NewsletterForm — renders form (~1093 tok)
- `ProductCard.tsx` — ProductCard (~1910 tok)
- `ProductGallery.tsx` — client gallery: crossfade main image + clickable thumbnails, sticky top-[72px] (~903 tok)
- `QuickView.tsx` — QuickView (~1920 tok)
- `RestockNotify.tsx` — RestockNotify — renders form (~1068 tok)
- `SearchModal.tsx` — SearchModal (~2244 tok)
- `ShopGrid.tsx` — client grid: live search, sort (featured/price asc-desc/name), aria-live count, animated empty state (~1685 tok)
- `SizeGuideButton.tsx` — SizeGuideButton (~338 tok)
- `SizeGuideModal.tsx` — sizes — renders table (~2490 tok)
- `SplitChooser.tsx` — EASE (~5004 tok)
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

