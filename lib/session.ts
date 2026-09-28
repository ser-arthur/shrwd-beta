/*
  Signed session cookies.

  The cookie value is `role.signature`, where the signature is an HMAC of the
  role under SESSION_SECRET. Verifying it on each request means the access
  level can be trusted server-side rather than taken on faith from the client.

  Web Crypto rather than node:crypto, because the middleware runs on the edge
  runtime where the node module is unavailable.
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

/* no early return, so the time taken does not reveal how much of the value matched */
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
  Returns the role only when the signature verifies, and null for anything
  else. A missing SESSION_SECRET also returns null: failing closed means a
  misconfigured deploy locks the portal rather than opening it.
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
