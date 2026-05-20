import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { isDevAuthBypassEnabled } from './lib/dev-auth';

const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/signup(.*)',
  '/test-bypass(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  if (isDevAuthBypassEnabled()) {
    return NextResponse.next();
  }

  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  return auth.protect();
});

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
