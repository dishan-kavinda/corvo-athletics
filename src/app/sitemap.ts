import type { MetadataRoute } from 'next';
import { getAllProducts } from '@/lib/wix-products';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://corvoathletic.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${siteUrl}/shop`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];

  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await getAllProducts();
    productPages = products
      .filter((p) => p.slug && p.visible !== false)
      .map((p) => ({
        url: `${siteUrl}/shop/${p.slug}`,
        lastModified: p.lastUpdated ? new Date(p.lastUpdated) : now,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
  } catch {
    // if Wix is unreachable at build time, ship a sitemap with static pages only
  }

  return [...staticPages, ...productPages];
}
