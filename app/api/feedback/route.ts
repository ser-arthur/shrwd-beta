import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { readSession } from "../../../lib/session";
import { clientKey, rateLimit } from "../../../lib/rateLimit";

const MAX_MESSAGE = 2000;

/* Requires a session, caps the payload and rate limits per address, since this
   forwards to a webhook. */
export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const role = await readSession(
            cookieStore.get("shrwd_beta_access")?.value,
            process.env.SESSION_SECRET,
        );
        if (!role) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!rateLimit(clientKey(request, "feedback"), 5, 10 * 60_000)) {
            return NextResponse.json(
                { error: "Too much feedback too quickly. Try again later." },
                { status: 429 },
            );
        }

        const body = await request.json();
        const { type, message, platform, version } = body;

        if (typeof message !== "string" || !message.trim()) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }
        if (message.length > MAX_MESSAGE) {
            return NextResponse.json(
                { error: `Message must be under ${MAX_MESSAGE} characters.` },
                { status: 400 },
            );
        }

        /* strip backticks and @ so a report cannot break Discord formatting or ping the channel */
        const clean = (value: unknown, limit: number) =>
            String(value ?? "unknown").replace(/[`@]/g, "").slice(0, limit);

        const prefix = type === "bug" ? "🐛 **BUG REPORT**" : "**FEATURE REQUEST**";
        const formattedMessage =
            `${prefix}\n\n**Message:** ${clean(message, MAX_MESSAGE)}\n` +
            `*Device: ${clean(platform, 40)} | Version: ${clean(version, 40)} | Access: ${role}*`;

        const webhookUrl = process.env.FEEDBACK_WEBHOOK_URL;

        if (webhookUrl) {
            await fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: formattedMessage, allowed_mentions: { parse: [] } }),
            });
        } else {
            console.log("\n--- NEW BETA FEEDBACK ---");
            console.log(formattedMessage);
            console.log("-------------------------\n");
        }

        return NextResponse.json({ success: true, message: "Feedback received successfully." });

    } catch (error) {
        console.error("Feedback API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
