# anatomy.md

> Auto-maintained by OpenWolf. Last scanned: 2026-05-19T13:04:01.364Z
> Files: 58 tracked | Anatomy hits: 0 | Misses: 0

## ./

- `next.config.ts` — Declares WIX_SITE_URL (~136 tok)
- `PRODUCT-RESEARCH.txt` (~3613 tok)

## .claude/


## .claude/rules/


## src/

- `proxy.ts` — Next.js 16 proxy (formerly middleware): injects x-pathname header; redirects `/`→`/home` if corvo_aesthetic cookie set, `/home`→`/` if not (~188 tok)

## src/app/

- `globals.css` — Styles: 23 rules, 87 vars (~2395 tok)
- `layout.tsx` — anton (~1097 tok)
- `page.tsx` — metadata (~73 tok)

## src/app/about/

- `page.tsx` — metadata (~3712 tok)

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

## src/app/api/set-aesthetic/

- `route.ts` — POST: validates aesthetic ('savage'|'luxury'), sets corvo_aesthetic cookie (1yr, non-httpOnly), returns {ok:true} (~173 tok)

## src/app/checkout/

- `actions.ts` — Exports CreatePaymentIntentResult, createCheckoutPaymentIntent, CompleteOrderInput, CompleteOrderRes (~2988 tok)
- `CheckoutForm.tsx` — initialShipping — renders form (~4821 tok)

## src/app/contact/

- `page.tsx` — ContactPage (~32 tok)

## src/app/home/

- `page.tsx` — metadata (~8593 tok)

## src/app/returns/

- `page.tsx` — ReturnsPage (~32 tok)

## src/app/shipping/

- `page.tsx` — ShippingPage (~32 tok)

## src/app/shop/

- `page.tsx` — dynamic (~2030 tok)

## src/app/shop/[slug]/

- `page.tsx` — dynamic (~3715 tok)

## src/app/thank-you/

- `page.tsx` — metadata (~3073 tok)

## src/components/3d/

- `HeroScene.tsx` — useIsLowEnd (~2720 tok)
- `LuxuryHeroSceneClient.tsx` — LuxuryHeroScene (~84 tok)

## src/components/cart/

- `AddToCartButton.tsx` — AddToCartButton (~236 tok)
- `CartDrawer.tsx` — CartDrawer (~2572 tok)
- `CartIcon.tsx` — CartIcon (~501 tok)
- `CartProvider.tsx` — WIX_STORES_APP_ID (~1631 tok)

## src/components/layout/

- `Footer.tsx` — footerLinks (~1480 tok)
- `Header.tsx` — navItems (~1704 tok)
- `MobileNav.tsx` — navItems (~1855 tok)

## src/components/motion/


## src/components/ui/

- `AuthForm.tsx` — LABEL — renders form (~3924 tok)
- `Button.tsx` — variants (~476 tok)
- `MarqueeStrip.tsx` — WORDS (~455 tok)
- `NewsletterForm.tsx` — NewsletterForm — renders form (~1093 tok)
- `ProductCard.tsx` — ProductCard (~1821 tok)
- `QuickView.tsx` — QuickView (~1920 tok)
- `RestockNotify.tsx` — RestockNotify — renders form (~1068 tok)
- `SearchModal.tsx` — SearchModal (~2247 tok)
- `SizeGuideButton.tsx` — SizeGuideButton (~338 tok)
- `SizeGuideModal.tsx` — sizes — renders table (~2490 tok)
- `SplitChooser.tsx` — EASE (~4360 tok)
- `StickyAddToCart.tsx` — StickyAddToCart (~1011 tok)
- `ThemeToggle.tsx` — ThemeToggle (~241 tok)
- `WishlistButton.tsx` — WishlistButton (~471 tok)

## src/hooks/

- `useWishlist.ts` — Exports useWishlist (~220 tok)

## src/lib/

- `format.ts` — Exports fmtMoney, fmtDate (~113 tok)
- `wix-browser.ts` — Module singleton preserves internal OAuth state (e.g. stateToken for email verification). (~137 tok)
- `wix-member-client.ts` — Exports WixTokens, WixOAuthData, createServerMemberClient (~190 tok)
- `wix-orders.ts` — Exports WixOrderSummary, getMemberOrders, getWixOrder (~1709 tok)

## src/providers/

