import { NextRequest, NextResponse } from 'next/server';
import { createServerMemberClient } from '@/lib/wix-member-client';
import { LoginState } from '@wix/sdk';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

async function generateAuthUrl(sessionToken: string) {
  const client = createServerMemberClient();
  const oauthData = client.auth.generateOAuthData(`${siteUrl}/account/callback`);
  const { authUrl } = await client.auth.getAuthUrl(oauthData, {
    prompt: 'none',
    responseMode: 'query',
    sessionToken,
  } as never);
  return { authUrl, oauthData };
}

export async function POST(req: NextRequest) {
  const { email, password, name, captchaToken } = (await req.json()) as {
    email?: string;
    password?: string;
    name?: string;
    captchaToken?: string;
  };
  if (!email || !password) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
  }

  try {
    const client = createServerMemberClient();
    const result = await client.auth.register({
      email,
      password,
      ...(name ? { profile: { nickname: name } } : {}),
      ...(captchaToken ? { captchaTokens: { invisibleRecaptchaToken: captchaToken } } : {}),
    });

    if (result.loginState === LoginState.SUCCESS) {
      const { authUrl, oauthData } = await generateAuthUrl(result.data.sessionToken!);
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

    if (result.loginState === LoginState.EMAIL_VERIFICATION_REQUIRED) {
      return NextResponse.json({
        loginState: 'EMAIL_VERIFICATION_REQUIRED',
        stateToken: (result.data as { stateToken?: string }).stateToken,
      });
    }

    if (result.loginState === LoginState.OWNER_APPROVAL_REQUIRED) {
      return NextResponse.json({ loginState: 'OWNER_APPROVAL_REQUIRED' });
    }

    const errorCode = 'errorCode' in result ? (result as { errorCode?: string }).errorCode : undefined;
    return NextResponse.json(
      { loginState: 'FAILURE', errorCode },
      { status: 400 },
    );
  } catch {
    return NextResponse.json({ loginState: 'FAILURE', error: 'Could not create account.' }, { status: 500 });
  }
}
