import { createClient, OAuthStrategy } from '@wix/sdk';
import { products } from '@wix/stores';

const clientId = process.env.NEXT_PUBLIC_WIX_CLIENT_ID;

if (!clientId) {
  throw new Error('NEXT_PUBLIC_WIX_CLIENT_ID is not set in .env.local');
}

export const wixClient = createClient({
  modules: { products },
  auth: OAuthStrategy({ clientId }),
});
