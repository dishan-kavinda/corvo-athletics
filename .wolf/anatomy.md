# anatomy.md

> Auto-maintained by OpenWolf. Last scanned: 2026-05-18T14:40:05.576Z
> Files: 37 tracked | Anatomy hits: 0 | Misses: 0

## ./

- `PRODUCT-RESEARCH.txt` (~3613 tok)

## .claude/


## .claude/rules/


## src/

- `proxy.ts` — Next.js 16 proxy (formerly middleware): injects x-pathname header; redirects `/`→`/home` if corvo_aesthetic cookie set, `/home`→`/` if not (~188 tok)

## src/app/

- `globals.css` — Styles: 19 rules, 81 vars (~2118 tok)
- `layout.tsx` — anton (~1105 tok)
- `page.tsx` — metadata (~73 tok)

## src/app/about/

- `page.tsx` — metadata (~3712 tok)

## src/app/account/

- `page.tsx` — metadata (~1841 tok)

## src/app/account/callback/

- `route.ts` — Next.js API route: GET (~500 tok)

## src/app/account/dashboard/

- `page.tsx` — metadata (~1773 tok)

## src/app/account/login/

- `route.ts` — GET: Initiates Wix OAuth. Generates PKCE oauthData, stores in cookie (10min), redirects to Wix auth URL (~200 tok)

## src/app/account/logout/

- `route.ts` — GET: Clears wix_member_tokens and wix_member_name cookies, redirects to / (~60 tok)

## src/app/api/set-aesthetic/

- `route.ts` — POST: validates aesthetic ('savage'|'luxury'), sets corvo_aesthetic cookie (1yr, non-httpOnly), returns {ok:true} (~173 tok)

## src/app/checkout/

- `actions.ts` — Exports CreatePaymentIntentResult, createCheckoutPaymentIntent, CompleteOrderInput, CompleteOrderRes (~3020 tok)
- `CheckoutForm.tsx` — initialShipping — renders form (~4831 tok)

## src/app/contact/

- `page.tsx` — ContactPage (~32 tok)

## src/app/home/

- `page.tsx` — metadata (~8593 tok)

## src/app/returns/

- `page.tsx` — ReturnsPage (~32 tok)

## src/app/shipping/

- `page.tsx` — ShippingPage (~32 tok)

## src/app/shop/

- `page.tsx` — dynamic (~2018 tok)

## src/app/shop/[slug]/

- `page.tsx` — dynamic (~3380 tok)

## src/app/thank-you/

- `page.tsx` — metadata (~3057 tok)

## src/components/3d/

- `HeroScene.tsx` — dodecVerts (~2550 tok)
- `LuxuryHeroSceneClient.tsx` — LuxuryHeroScene (~84 tok)

## src/components/cart/

- `AddToCartButton.tsx` — AddToCartButton (~236 tok)
- `CartDrawer.tsx` — CartDrawer (~2575 tok)
- `CartIcon.tsx` — CartIcon (~500 tok)
- `CartProvider.tsx` — WIX_STORES_APP_ID (~1631 tok)

## src/components/layout/

- `Footer.tsx` — footerLinks (~1480 tok)
- `Header.tsx` — navItems (~1226 tok)
- `MobileNav.tsx` — navItems (~1757 tok)

## src/components/motion/


## src/components/ui/

- `Button.tsx` — variants (~517 tok)
- `MarqueeStrip.tsx` — WORDS (~453 tok)
- `NewsletterForm.tsx` — NewsletterForm — renders form (~1187 tok)
- `ProductCard.tsx` — ProductCard (~1160 tok)
- `SplitChooser.tsx` — T (~1906 tok)
- `ThemeToggle.tsx` — ThemeToggle (~241 tok)

## src/lib/

- `wix-member-client.ts` — Exports WixTokens, WixOAuthData, createServerMemberClient (~190 tok)

## src/providers/

