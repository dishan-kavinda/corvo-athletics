import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const res = NextResponse.redirect(new URL('/', request.url));
  res.cookies.delete('wix_member_tokens');
  res.cookies.delete('wix_member_name');
  return res;
}
