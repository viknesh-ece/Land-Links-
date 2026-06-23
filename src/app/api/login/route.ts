import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const user = await (prisma as any).user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const passwordMatch = await bcrypt.compare(
      body.password,
      user.password
    );

    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Wrong password" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Login successful",
      user,
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}