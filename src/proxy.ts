import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const aesthetic = request.cookies.get('corvo_aesthetic')?.value;

  // The Threshold (chooser) always opens first at the root — even with a
  // saved aesthetic. The cookie only controls theming once inside.
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
