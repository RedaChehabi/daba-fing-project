import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define allowed routes for electron
const electronAllowedRoutes = [
  '/auth',
  '/auth/login',
  '/auth/register',
  '/dashboard',
  '/dashboard/admin',
  '/dashboard/verify',
  '/dashboard/settings',
  '/dashboard/upload',
  '/dashboard/profile',
  '/dashboard/history',
  '/dashboard/scan',
];

function isElectronUserAgent(userAgent: string): boolean {
  return userAgent.toLowerCase().includes('electron');
}

function isRouteAllowedInElectron(pathname: string): boolean {
  return electronAllowedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';

  // Check if this is an electron request
  if (isElectronUserAgent(userAgent)) {
    // If the route is not allowed in electron, redirect to login
    if (!isRouteAllowedInElectron(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 