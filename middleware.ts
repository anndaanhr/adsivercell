import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired
  await supabase.auth.getSession();

  // Check auth state for protected routes
  const { pathname } = req.nextUrl;

  // Protected routes that require authentication
  const protectedRoutes = [
    '/account',
    '/account/orders',
    '/account/payment',
    '/account/wishlist',
    '/account/keys',
    '/account/notifications',
    '/account/security',
    '/account/settings',
    '/checkout',
  ];

  // Routes that are only accessible to non-authenticated users
  const authRoutes = [
    '/auth/login',
    '/auth/register',
  ];

  // Check if the pathname starts with any of the protected routes
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check if the pathname starts with any of the auth routes
  const isAuthRoute = authRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Get the current session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If the route is protected and the user is not authenticated,
  // redirect to the login page
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/auth/login', req.url);
    redirectUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If the route is an auth route and the user is authenticated,
  // redirect to the account page
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/account', req.url));
  }

  return res;
}

// Only run the middleware on the routes we want to protect
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes that don't need authentication
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/public).*)',
  ],
};
