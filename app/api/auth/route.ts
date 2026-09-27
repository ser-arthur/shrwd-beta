import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { signSession, safeEqual, type Role } from "../../../lib/session";
import { clientKey, rateLimit } from "../../../lib/rateLimit";

export async function POST(request: Request) {
    try {
        /* a passcode endpoint with no limit is a passcode endpoint that can be
           guessed; ten attempts a minute leaves normal use untouched */
        if (!rateLimit(clientKey(request, "auth"), 10, 60_000)) {
            return NextResponse.json(
                { success: false, error: "Too many attempts. Try again shortly." },
                { status: 429 },
            );
        }

        const { passcode } = await request.json();
        if (typeof passcode !== "string" || passcode.length > 128) {
            return NextResponse.json({ success: false, error: "Invalid code" }, { status: 401 });
        }

        const secret = process.env.SESSION_SECRET;
        const alphaCode = process.env.ALPHA_PASSCODE;
        const guestCode = process.env.GUEST_PASSCODE;

        if (!secret) {
            /* fail closed rather than issue a cookie nothing can verify */
            console.error("SESSION_SECRET is not set; refusing to issue a session.");
            return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
        }

        let accessLevel: Role | null = null;
        if (alphaCode && safeEqual(passcode, alphaCode)) accessLevel = "granted";
        else if (guestCode && safeEqual(passcode, guestCode)) accessLevel = "guest";

        if (accessLevel) {
            const cookieStore = await cookies();
            cookieStore.set("shrwd_beta_access", await signSession(accessLevel, secret), {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 30,
                path: "/",
            });
            return NextResponse.json({ success: true, role: accessLevel });
        }

        return NextResponse.json({ success: false, error: "Invalid code" }, { status: 401 });

    } catch {
        return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
    }
}
