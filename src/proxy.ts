import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;
  const path = request.nextUrl.pathname;

  let sessionData = null;
  if (sessionCookie) {
    try {
      sessionData = JSON.parse(sessionCookie);
    } catch {
      // invalid cookie
    }
  }

  // Protect Admin routes
  if (path.startsWith('/admin')) {
    if (!sessionData) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (sessionData.role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Protect Vendor routes
  if (path.startsWith('/vendor')) {
    if (!sessionData) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (sessionData.role !== 'VENDOR_ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/vendor/:path*'],
};
