# anatomy.md

> Auto-maintained by OpenWolf. Last scanned: 2026-05-18T13:21:24.002Z
> Files: 31 tracked | Anatomy hits: 0 | Misses: 0

## ./

- `PRODUCT-RESEARCH.txt` (~3613 tok)

## .claude/


## .claude/rules/


## src/app/

- `globals.css` — Styles: 19 rules, 52 vars (~1584 tok)
- `layout.tsx` — anton (~955 tok)
- `page.tsx` — categories (~8726 tok)

## src/app/about/

- `page.tsx` — metadata (~2909 tok)

## src/app/account/

- `page.tsx` — Sign In / Create Account page. Checks wix_member_tokens cookie; redirects to /account/dashboard if already logged in (~700 tok)

## src/app/account/callback/

- `route.ts` — Next.js API route: GET (~500 tok)

## src/app/account/dashboard/

- `page.tsx` — metadata (~1755 tok)

## src/app/account/login/

- `route.ts` — GET: Initiates Wix OAuth. Generates PKCE oauthData, stores in cookie (10min), redirects to Wix auth URL (~200 tok)

## src/app/account/logout/

- `route.ts` — GET: Clears wix_member_tokens and wix_member_name cookies, redirects to / (~60 tok)

## src/app/checkout/

- `actions.ts` — Exports CreatePaymentIntentResult, createCheckoutPaymentIntent, CompleteOrderInput, CompleteOrderRes (~3020 tok)
- `CheckoutForm.tsx` — initialShipping — renders form (~4831 tok)

## src/app/contact/

- `page.tsx` — ContactPage (~32 tok)

## src/app/returns/

- `page.tsx` — ReturnsPage (~32 tok)

## src/app/shipping/

- `page.tsx` — ShippingPage (~32 tok)

## src/app/shop/

- `page.tsx` — dynamic (~2005 tok)

## src/app/shop/[slug]/

- `page.tsx` — dynamic (~3372 tok)

## src/app/thank-you/

- `page.tsx` — metadata (~3057 tok)

## src/components/3d/

- `HeroScene.tsx` — dodecVerts (~1860 tok)

## src/components/cart/

- `AddToCartButton.tsx` — AddToCartButton (~236 tok)
- `CartDrawer.tsx` — CartDrawer (~2575 tok)
- `CartIcon.tsx` — CartIcon (~500 tok)
- `CartProvider.tsx` — WIX_STORES_APP_ID (~1631 tok)

## src/components/layout/

- `Footer.tsx` — footerLinks (~1433 tok)
- `Header.tsx` — navItems (~1225 tok)
- `MobileNav.tsx` — navItems (~1757 tok)

## src/components/motion/


## src/components/ui/

- `Button.tsx` — variants (~517 tok)
- `MarqueeStrip.tsx` — WORDS (~453 tok)
- `NewsletterForm.tsx` — NewsletterForm — renders form (~1187 tok)
- `ProductCard.tsx` — ProductCard (~1153 tok)

## src/lib/

- `wix-member-client.ts` — Exports WixTokens, WixOAuthData, createServerMemberClient (~190 tok)

## src/providers/

