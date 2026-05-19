import { NextRequest, NextResponse } from 'next/server';
import { createServerMemberClient } from '@/lib/wix-member-client';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { sessionToken?: string };
  if (!body.sessionToken) {
    return NextResponse.json({ error: 'Missing sessionToken' }, { status: 400 });
  }

  const callbackUrl = `${siteUrl}/account/callback`;
  const client = createServerMemberClient();
  const oauthData = client.auth.generateOAuthData(callbackUrl);
  const { authUrl } = await client.auth.getAuthUrl(oauthData, {
    prompt: 'none',
    responseMode: 'query',
    sessionToken: body.sessionToken,
  } as never);

  const res = NextResponse.json({ authUrl });
  res.cookies.set('wix_oauth_data', JSON.stringify(oauthData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  });
  return res;
}
