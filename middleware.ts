/**
 * Next.js Middleware
 *
 * Note: Supabase auth middleware has been removed due to Vercel Edge Runtime compatibility issues.
 * Auth protection is now handled at the page level in Server Components.
 */

import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Simply pass through - auth is handled in Server Components
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
