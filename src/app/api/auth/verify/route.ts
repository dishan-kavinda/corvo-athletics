import { NextRequest, NextResponse } from 'next/server';
import { createServerMemberClient } from '@/lib/wix-member-client';
import { LoginState } from '@wix/sdk';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export async function POST(req: NextRequest) {
  const { verificationCode, stateToken } = (await req.json()) as {
    verificationCode?: string;
    stateToken?: string;
  };
  if (!verificationCode || !stateToken) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  try {
    const client = createServerMemberClient();
    // Reconstruct the state object the SDK expects
    const pendingState = {
      loginState: LoginState.EMAIL_VERIFICATION_REQUIRED,
      data: { stateToken },
    };
    const result = await client.auth.processVerification(
      { verificationCode: verificationCode.trim() },
      pendingState as never,
    );

    if (result.loginState === LoginState.SUCCESS) {
      const oauthData = client.auth.generateOAuthData(`${siteUrl}/account/callback`);
      const { authUrl } = await client.auth.getAuthUrl(oauthData, {
        prompt: 'none',
        responseMode: 'query',
        sessionToken: result.data.sessionToken!,
      } as never);
      const res = NextResponse.json({ loginState: 'SUCCESS', authUrl });
      res.cookies.set('wix_oauth_data', JSON.stringify(oauthData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 600,
        path: '/',
      });
      return res;
    }

    return NextResponse.json({ loginState: 'FAILURE', error: 'Invalid or expired code.' }, { status: 400 });
  } catch (err) {
    console.error('[/api/auth/verify]', err);
    return NextResponse.json({ loginState: 'FAILURE', error: 'Verification failed.' }, { status: 500 });
  }
}
