import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    const cookieStore = await cookies();

    // Destroy the cookie by setting it to empty and expiring it immediately
    cookieStore.set("shrwd_beta_access", "", {
        maxAge: 0,
        path: "/",
    });

    return NextResponse.json({ success: true });
}