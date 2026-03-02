import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, message, platform, version } = body;

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const prefix = type === 'bug' ? '🐛 **BUG REPORT**' : '**FEATURE REQUEST**';
        const formattedMessage = `${prefix}\n\n**Message:** ${message}\n*Device: ${platform} | Version: ${version}*`;

        const webhookUrl = process.env.FEEDBACK_WEBHOOK_URL;

        if (webhookUrl) {
            // discord channel
            await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: formattedMessage })
            });
        } else {
            // vercel server console
            console.log('\n--- NEW BETA FEEDBACK ---');
            console.log(formattedMessage);
            console.log('-------------------------\n');
        }

        return NextResponse.json({ success: true, message: "Feedback received successfully." });

    } catch (error) {
        console.error("Feedback API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}