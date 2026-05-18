import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const aesthetic = request.cookies.get('corvo_aesthetic')?.value;

  // Redirect logic
  if (aesthetic && pathname === '/') {
    return NextResponse.redirect(new URL('/home', request.url));
  }
  if (!aesthetic && pathname.startsWith('/home')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const res = NextResponse.next();
  res.headers.set('x-pathname', pathname);
  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon\\.ico|.*\\..*).*)'],
};
