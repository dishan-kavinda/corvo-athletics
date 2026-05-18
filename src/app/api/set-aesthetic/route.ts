import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json() as { aesthetic?: string };
  const { aesthetic } = body;

  if (aesthetic !== 'savage' && aesthetic !== 'luxury') {
    return NextResponse.json({ error: 'Invalid aesthetic' }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set('corvo_aesthetic', aesthetic, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 365 * 24 * 60 * 60,
    path: '/',
  });
  return res;
}
