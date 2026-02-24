import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    const access = cookieStore.get("shrwd_beta_access")?.value || null;

    return NextResponse.json({ role: access });
}