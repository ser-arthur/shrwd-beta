import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Check if they have the VIP pass
    const hasAccess = request.cookies.has('shrwd_beta_access');

    // 1. If trying to enter the portal without access -> kick to login
    if (!hasAccess && request.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 2. If sitting on the login screen but ALREADY logged in -> skip to dashboard
    if (hasAccess && request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

// Tell the middleware exactly which pages to guard
export const config = {
    matcher: ['/', '/dashboard/:path*'],
}