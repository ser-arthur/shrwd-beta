import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { readSession } from './lib/session';

/*
  Route protection.

  Everything is gated except the paths named below, so a page added later is
  protected by default rather than needing to be remembered.
*/

const PUBLIC_PATHS = new Set(['/']);

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const role = await readSession(
        request.cookies.get('shrwd_beta_access')?.value,
        process.env.SESSION_SECRET,
    );
    const hasAccess = role !== null;

    if (!hasAccess && !PUBLIC_PATHS.has(pathname)) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (hasAccess && pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    /* clear an unverifiable cookie, so a tampered value cannot cause a redirect loop */
    const response = NextResponse.next();
    if (!hasAccess && request.cookies.has('shrwd_beta_access')) {
        response.cookies.set('shrwd_beta_access', '', { maxAge: 0, path: '/' });
    }
    return response;
}

export const config = {
    /* API routes verify sessions themselves, and /api/auth must stay reachable
       for sign-in to work */
    matcher: ['/((?!api|_next/static|_next/image|.*\\..*).*)'],
};
