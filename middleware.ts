import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { readSession } from './lib/session';

/*
  The previous version called cookies.has('shrwd_beta_access'), which is true
  for any value at all. The cookie is now verified, so only a signature issued
  by this server grants access.
*/
export async function middleware(request: NextRequest) {
    const role = await readSession(
        request.cookies.get('shrwd_beta_access')?.value,
        process.env.SESSION_SECRET,
    );
    const hasAccess = role !== null;

    if (!hasAccess && request.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (hasAccess && request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    /* an unverifiable cookie is cleared, so a tampered value does not leave the
       visitor stuck in a redirect loop */
    const response = NextResponse.next();
    if (!hasAccess && request.cookies.has('shrwd_beta_access')) {
        response.cookies.set('shrwd_beta_access', '', { maxAge: 0, path: '/' });
    }
    return response;
}

export const config = {
    matcher: ['/', '/dashboard/:path*'],
};
