import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    // Don't use secure in development
    secureCookie: process.env.NODE_ENV === 'production',
  });

  // Your authentication logic here
  // For example:
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

// Optionally configure which paths the middleware runs on
export const config = {
  matcher: [
    // Skip static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};