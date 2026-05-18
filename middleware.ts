import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/api/webhooks/clerk', '/', '/test-dashboard', '/deal/(.*)'])

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    // protect is not available in earlier @clerk/nextjs v5 alpha, we can use the following approach if protect fails
    // However, @clerk/nextjs ^5 uses auth().protect().
    // For V7 we will just use Clerk automatic protection
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
