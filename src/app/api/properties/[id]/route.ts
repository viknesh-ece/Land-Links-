import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// DELETE PROPERTY
export async function DELETE(
req: Request,
{ params }: { params: Promise<{ id: string }> }
): Promise<Response> {
try {
const { id } = await params;
await prisma.property.delete({
where: {
id: Number(id),
},
});


return NextResponse.json({
  message: "Property deleted successfully",
});


} catch (error) {
console.log(error);

return NextResponse.json(
  { message: "Server Error" },
  { status: 500 }
);


}
}

// UPDATE PROPERTY
export async function PUT(
req: Request,
{ params }: { params: { id: string } }
): Promise<Response> {
try {
const body = await req.json();


const property = await prisma.property.update({
  where: {
    id: Number(params.id),
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


} catch (error) {
console.log(error);


return NextResponse.json(
  { message: "Server Error" },
  { status: 500 }
);


}
}
