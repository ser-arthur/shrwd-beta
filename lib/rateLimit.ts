/*
  Fixed-window rate limiting, held in the memory of a single serverless
  instance. Counters reset on cold start and are not shared between instances,
  so the effective limit is looser than it looks. Adequate for slowing a
  passcode guesser or a feedback flood from one source; a shared store such as
  Vercel KV would be the upgrade if this ever needs to be strict.
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
