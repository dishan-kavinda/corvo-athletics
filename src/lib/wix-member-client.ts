import { createClient, OAuthStrategy } from '@wix/sdk';
import { members } from '@wix/members';

const clientId = process.env.NEXT_PUBLIC_WIX_CLIENT_ID!;

export type WixTokens = {
  accessToken: { value: string; expiresAt: number };
  refreshToken: { value: string; role: string };
};

export type WixOAuthData = {
  codeVerifier: string;
  codeChallenge: string;
  state: string;
  originalUri: string;
  redirectUri: string;
};

export function createServerMemberClient(tokens?: WixTokens) {
  const client = createClient({
    modules: { members },
    auth: OAuthStrategy({ clientId }),
  });
  if (tokens) client.auth.setTokens(tokens);
  return client;
}
