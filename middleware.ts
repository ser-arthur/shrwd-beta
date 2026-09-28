import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { readSession } from './lib/session';

/*
  Access control for the portal.

  Two earlier mistakes are fixed here, and both were failures of the same kind:
  the gate named what to protect instead of naming what to expose.

    - the matcher listed '/dashboard' only, so '/releases' was never checked
    - the logic redirected only for paths under '/dashboard', so even a matched
      path outside it would have fallen through

  Now everything is protected except the paths named below, which means a page
  added tomorrow is gated by default. Forgetting to add a route to a list is a
  much easier mistake to make than forgetting to remove one.
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

    /* an unverifiable cookie is cleared, so a tampered value does not leave the
       visitor stuck in a redirect loop */
    const response = NextResponse.next();
    if (!hasAccess && request.cookies.has('shrwd_beta_access')) {
        response.cookies.set('shrwd_beta_access', '', { maxAge: 0, path: '/' });
    }
    return response;
}

export const config = {
    /*
      Everything except the API routes, Next's own assets and files with an
      extension. The API routes verify sessions themselves, and /api/auth has
      to stay reachable or nobody could ever sign in.
    */
    matcher: ['/((?!api|_next/static|_next/image|.*\\..*).*)'],
};
