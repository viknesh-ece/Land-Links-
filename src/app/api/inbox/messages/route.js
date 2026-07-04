import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const { threadId, sender, text, time, system } = body;

        if (!threadId || !sender || !text) {
            return NextResponse.json({ message: "threadId, sender, and text are required" }, { status: 400 });
        }

        // Insert message
        const message = await prisma.message.create({
            data: {
                threadId,
                sender,
                text,
                time: time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                system: !!system
            }
        });

        // Update last message in the thread
        await prisma.inboxThread.update({
            where: { id: threadId },
            data: {
                lastMessage: text,
                unread: sender === "them" // If incoming, mark thread unread
            }
        });

        return NextResponse.json(message, { status: 201 });
    } catch (error) {
        console.error("Messages POST Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
