import type { NextConfig } from 'next';

const WIX_SITE_URL = 'https://dishanbulugoda.wixsite.com/my-site';

const isProd = process.env.NODE_ENV === 'production';

/* Content-Security-Policy.
   - 'unsafe-inline' for scripts is required by Next.js inline bootstrap
     scripts (no nonce support without middleware-based CSP); still blocks
     loading script files from any foreign origin.
   - 'unsafe-eval' is dev-only (Turbopack HMR needs it).
   - Stripe entries follow Stripe's official CSP guide for Elements.
   - Wix entries cover the browser SDK (cart) + product images. */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProd ? '' : " 'unsafe-eval'"} https://js.stripe.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://static.wixstatic.com https://*.stripe.com",
  "font-src 'self' data:",
  "connect-src 'self' https://api.stripe.com https://m.stripe.network https://*.stripe.com https://*.wixapis.com https://*.wix.com",
  "frame-src https://js.stripe.com https://hooks.stripe.com https://m.stripe.network",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  ...(isProd ? ['upgrade-insecure-requests'] : []),
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(self "https://js.stripe.com")',
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.wixstatic.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/_api/:path*',
        destination: `${WIX_SITE_URL}/_api/:path*`,
      },
    ];
  },
};

export default nextConfig;
