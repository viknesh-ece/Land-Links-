import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const properties = await prisma.property.findMany();

    return NextResponse.json(properties);

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const property = await prisma.property.create({
      data: {
        title: body.title,
        description: body.description,
        price: Number(body.price),
        location: body.location,
      },
    });

    return NextResponse.json({
      message: "Property created successfully",
      property,
    });
  } catch (error) {
    console.log("ERROR:", error);

    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}