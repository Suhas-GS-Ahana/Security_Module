import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  if (pathname === '/login') {
    return NextResponse.next();
  }

  // Check for session cookie
  const session = request.cookies.get('session');

  if (!session) {
    // No session — redirect to login
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Root path — redirect to dashboard if logged in
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on all routes except Next.js internals and static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};
