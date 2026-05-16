import Stripe from 'stripe';

const rawSecretKey = process.env.STRIPE_SECRET_KEY;
if (!rawSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}
const secretKey = rawSecretKey.trim().replace(/^["']|["']$/g, '');

export const stripe = new Stripe(secretKey, {
  apiVersion: '2026-04-22.dahlia',
  typescript: true,
  httpClient: Stripe.createFetchHttpClient(),
});
