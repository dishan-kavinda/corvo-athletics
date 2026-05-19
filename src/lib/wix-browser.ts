import { createClient, OAuthStrategy } from '@wix/sdk';
import { members } from '@wix/members';

// Module singleton preserves internal OAuth state (e.g. stateToken for email verification).
let _client: ReturnType<typeof createClient> | null = null;

export function getWixBrowserClient() {
  if (!_client) {
    _client = createClient({
      modules: { members },
      auth: OAuthStrategy({ clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID! }),
    });
  }
  return _client;
}
