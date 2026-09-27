/*
  A small fixed-window rate limiter.

  Honest about what this is: state lives in the memory of one serverless
  instance, so a burst spread across instances gets a higher effective limit,
  and counters reset on cold start. That makes it useless against a determined
  distributed attacker and perfectly adequate against the two cases that
  actually matter here, someone brute-forcing a passcode from one machine and
  someone hammering the feedback webhook.

  A shared store (Upstash, Vercel KV) is the upgrade if this ever needs to be
  strict.
*/

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();

export function clientKey(request: Request, scope: string): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
    return `${scope}:${ip}`;
}

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const existing = windows.get(key);

    if (!existing || now > existing.resetAt) {
        windows.set(key, { count: 1, resetAt: now + windowMs });
        return true;
    }

    if (existing.count >= limit) return false;

    existing.count += 1;
    return true;
}
