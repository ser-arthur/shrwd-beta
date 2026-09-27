/*
  Signed session cookies.

  The previous cookie stored the access level as plain text and the middleware
  only checked that a cookie of that name existed. Any visitor could add
  `shrwd_beta_access=granted` in devtools and reach the dashboard with tester
  privileges. httpOnly does not prevent this: it stops scripts reading the
  cookie, not a person setting one.

  The value is now `role.signature`, where the signature is an HMAC of the role
  under SESSION_SECRET. A forged or edited cookie fails verification, so the
  role can be trusted on the server.

  Web Crypto rather than node:crypto because the middleware runs on the edge
  runtime, where the node module is unavailable.
*/

const enc = new TextEncoder();

export type Role = 'granted' | 'guest';

function base64url(buffer: ArrayBuffer): string {
    let binary = '';
    for (const byte of new Uint8Array(buffer)) binary += String.fromCharCode(byte);
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function hmacKey(secret: string): Promise<CryptoKey> {
    return crypto.subtle.importKey(
        'raw',
        enc.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign'],
    );
}

/* compare without an early return, so the time taken does not reveal how much
   of the value was correct */
export function safeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return diff === 0;
}

export async function signSession(role: Role, secret: string): Promise<string> {
    const key = await hmacKey(secret);
    const signature = await crypto.subtle.sign('HMAC', key, enc.encode(role));
    return `${role}.${base64url(signature)}`;
}

/*
  Returns the role only if the signature verifies. Returns null for a missing,
  malformed, forged or unsigned cookie, and also when SESSION_SECRET is unset:
  failing closed is the right default, so a missing variable locks the portal
  rather than opening it.
*/
export async function readSession(
    token: string | undefined,
    secret: string | undefined,
): Promise<Role | null> {
    if (!token || !secret) return null;

    const dot = token.indexOf('.');
    if (dot < 1) return null;

    const role = token.slice(0, dot);
    if (role !== 'granted' && role !== 'guest') return null;

    const expected = await signSession(role, secret);
    return safeEqual(token, expected) ? role : null;
}
