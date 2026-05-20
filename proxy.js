import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isDevAuthBypassEnabled =
  process.env.DEV_AUTH_BYPASS === 'true' || process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === 'true';

const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/signup(.*)',
  '/test-bypass(.*)',
]);

const proxy = isDevAuthBypassEnabled
  ? function proxy() {
      return NextResponse.next();
    }
  : clerkMiddleware(async (auth, request) => {
      if (isPublicRoute(request)) {
        return NextResponse.next();
      }

      return auth.protect();
    });

export default proxy;
export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
