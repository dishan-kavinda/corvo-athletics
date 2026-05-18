import type { NextConfig } from 'next';

const WIX_SITE_URL = 'https://dishanbulugoda.wixsite.com/my-site';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.wixstatic.com',
      },
    ],
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
