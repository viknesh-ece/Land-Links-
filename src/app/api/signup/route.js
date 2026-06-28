import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
export async function POST(req) {
    try {
        const body = await req.json();
        const existingUser = await prisma.user.findUnique({
            where: {
                email: body.email,
            },
        });
        if (existingUser) {
            return NextResponse.json({ message: "Email already in use" }, { status: 400 });
        }
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const user = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                password: hashedPassword,
                role: body.role,
            },
        });
        return NextResponse.json({
            message: "User created successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        }, { status: 201 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}
