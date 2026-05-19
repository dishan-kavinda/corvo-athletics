import { NextRequest, NextResponse } from 'next/server';
import { createServerMemberClient } from '@/lib/wix-member-client';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export async function POST(req: NextRequest) {
  const { email } = (await req.json()) as { email?: string };
  if (!email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 });
  }

  try {
    const client = createServerMemberClient();
    await client.auth.sendPasswordResetEmail(email, `${siteUrl}/account`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[/api/auth/reset]', err);
    return NextResponse.json({ error: 'Could not send reset email.' }, { status: 500 });
  }
}
