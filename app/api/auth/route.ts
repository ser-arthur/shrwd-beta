import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// We can move these to a .env file later for max security
const VALID_CODES = ["ALPHA-7X9P", "GUEST-2026"];

export async function POST(request: Request) {
    try {
        const { passcode } = await request.json();

        if (VALID_CODES.includes(passcode)) {
            // Create the secure cookie vault
            const cookieStore = await cookies();

            // Drop a cookie that lasts for 30 days
            cookieStore.set("shrwd_beta_access", "granted", {
                httpOnly: true, // Prevents JavaScript from reading the cookie (XSS protection)
                secure: process.env.NODE_ENV === "production", // Forces HTTPS in production
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
                path: "/",
            });

            return NextResponse.json({ success: true });
        }

        // Wrong code
        return NextResponse.json({ success: false, error: "Invalid code" }, { status: 401 });

    } catch (error) {
        return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
    }
}