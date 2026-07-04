import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ message: "userId query parameter is required" }, { status: 400 });
        }

        // Fetch all threads for the user
        const threads = await prisma.inboxThread.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" }
        });

        // For each thread, load its messages
        const threadsWithMessages = await Promise.all(
            threads.map(async (thread) => {
                const messages = await prisma.message.findMany({
                    where: { threadId: thread.id },
                    orderBy: { createdAt: "asc" }
                });
                return {
                    ...thread,
                    messages
                };
            })
        );

        return NextResponse.json(threadsWithMessages, { status: 200 });
    } catch (error) {
        console.error("Inbox GET Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const {
            name,
            role,
            propertyName,
            propertyPrice,
            location,
            lastMessage,
            unread,
            status,
            myOffer,
            counterOffer,
            userId,
            initialMessages
        } = body;

        if (!userId) {
            return NextResponse.json({ message: "userId is required" }, { status: 400 });
        }

        // Check if thread for this property already exists for this user
        let thread = await prisma.inboxThread.findFirst({
            where: {
                userId,
                propertyName
            }
        });

        if (!thread) {
            // Create new thread
            thread = await prisma.inboxThread.create({
                data: {
                    name,
                    role,
                    propertyName,
                    propertyPrice: Number(propertyPrice),
                    location,
                    lastMessage,
                    unread: !!unread,
                    status: status || "pending",
                    myOffer: Number(myOffer || 0),
                    counterOffer: counterOffer ? Number(counterOffer) : null,
                    userId
                }
            });

            // Insert initial messages if provided
            if (initialMessages && initialMessages.length > 0) {
                await prisma.message.createMany({
                    data: initialMessages.map(m => ({
                        threadId: thread.id,
                        sender: m.sender,
                        text: m.text,
                        time: m.time,
                        system: !!m.system
                    }))
                });
            }
        } else {
            // Update offer or counterOffer if provided
            thread = await prisma.inboxThread.update({
                where: { id: thread.id },
                data: {
                    lastMessage,
                    status: status || thread.status,
                    myOffer: myOffer ? Number(myOffer) : thread.myOffer,
                    counterOffer: counterOffer ? Number(counterOffer) : thread.counterOffer
                }
            });
        }

        // Return thread with messages
        const messages = await prisma.message.findMany({
            where: { threadId: thread.id },
            orderBy: { createdAt: "asc" }
        });

        return NextResponse.json({
            ...thread,
            messages
        }, { status: 201 });
    } catch (error) {
        console.error("Inbox POST Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
