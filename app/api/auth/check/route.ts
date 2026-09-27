import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { readSession } from "../../../../lib/session";

/*
  Verifies the signature before reporting a role. Previously this returned the
  raw cookie value, so a visitor who set their own cookie to "granted" was told
  they were a granted user and the dashboard rendered the tester UI.
*/
export async function GET() {
    const cookieStore = await cookies();
    const role = await readSession(
        cookieStore.get("shrwd_beta_access")?.value,
        process.env.SESSION_SECRET,
    );

    return NextResponse.json({ role });
}
