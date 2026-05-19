import { NextResponse } from 'next/server';
import { createServerMemberClient } from '@/lib/wix-member-client';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export async function GET() {
  const callbackUrl = `${siteUrl}/account/callback`;

  const client = createServerMemberClient();
  const oauthData = client.auth.generateOAuthData(callbackUrl);
  const { authUrl } = await client.auth.getAuthUrl(oauthData, { responseMode: 'query' } as never);

  const res = NextResponse.redirect(authUrl);
  res.cookies.set('wix_oauth_data', JSON.stringify(oauthData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  });
  return res;
}
