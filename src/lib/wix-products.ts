import { wixClient } from './wix';

export async function getAllProducts() {
  const result = await wixClient.products.queryProducts().find();
  return result.items;
}

export async function getProductBySlug(slug: string) {
  const result = await wixClient.products.queryProducts().eq('slug', slug).find();
  return result.items[0] ?? null;
}
