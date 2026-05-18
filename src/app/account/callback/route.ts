import { NextRequest, NextResponse } from 'next/server';
import { createServerMemberClient, type WixTokens, type WixOAuthData } from '@/lib/wix-member-client';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const oauthDataRaw = request.cookies.get('wix_oauth_data')?.value;

  if (!code || !state || !oauthDataRaw) {
    return NextResponse.redirect(new URL('/account?error=1', request.url));
  }

  try {
    const oauthData = JSON.parse(oauthDataRaw) as WixOAuthData;
    const client = createServerMemberClient();
    const tokens = (await client.auth.getMemberTokens(code, state, oauthData)) as WixTokens;

    const memberClient = createServerMemberClient(tokens);
    const { member } = await memberClient.members.getCurrentMember();

    const displayName =
      member?.profile?.nickname ??
      member?.contact?.firstName ??
      member?.loginEmail?.split('@')[0] ??
      'Member';

    const res = NextResponse.redirect(new URL('/account/dashboard', request.url));

    res.cookies.set('wix_member_tokens', JSON.stringify(tokens), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    res.cookies.set('wix_member_name', displayName, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    res.cookies.delete('wix_oauth_data');
    return res;
  } catch (e) {
    console.error('[auth callback]', e);
    return NextResponse.redirect(new URL('/account?error=1', request.url));
  }
}
