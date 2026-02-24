import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { passcode } = await request.json();

        let accessLevel = null;

        const alphaCode = process.env.ALPHA_PASSCODE;
        const guestCode = process.env.GUEST_PASSCODE;

        if (passcode === alphaCode) {
            accessLevel = "granted";
        } else if (passcode === guestCode) {
            accessLevel = "guest";
        }

        if (accessLevel) {
            const cookieStore = await cookies();

            cookieStore.set("shrwd_beta_access", accessLevel, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 30,
                path: "/",
            });

            return NextResponse.json({ success: true, role: accessLevel });
        }

        return NextResponse.json({ success: false, error: "Invalid code" }, { status: 401 });

    } catch (error) {
        return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
    }
}