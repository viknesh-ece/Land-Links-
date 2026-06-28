import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
// DELETE PROPERTY
export async function DELETE(req, { params }) {
    try {
        const { id } = await params;
        await prisma.property.delete({
            where: {
                id: id,
            },
        });
        return NextResponse.json({
            message: "Property deleted successfully",
        });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}
// UPDATE PROPERTY
export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const property = await prisma.property.update({
            where: {
                id: id,
            },
            data: {
                title: body.title,
                description: body.description,
                price: Number(body.price),
                location: body.location,
            },
        });
        return NextResponse.json({
            message: "Property updated successfully",
            property,
        });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}
