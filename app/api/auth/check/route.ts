import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { readSession } from "../../../../lib/session";

/* Reports the access level, verified from the signature rather than read from
   the cookie value. */
export async function GET() {
    const cookieStore = await cookies();
    const role = await readSession(
        cookieStore.get("shrwd_beta_access")?.value,
        process.env.SESSION_SECRET,
    );

    return NextResponse.json({ role });
}
