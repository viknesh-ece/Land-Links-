import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const mockProperties = [
  {
    id: "65b9e01f12a3b4c5d6e7f8a1",
    title: "10 Acres Prime Commercial IT Park Land",
    description: "Vetted commercial land parcel with direct 4-lane highway frontage, 11kV industrial power substation, and 100% cleared DTCP & RERA titles.",
    price: 45000000,
    location: "Peelamedu, Coimbatore, Tamil Nadu",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80",
    soilReport: "Soil_Quality_Report_BH1.pdf",
    landDeed: "Original_Land_Deed_SaleDeed.pdf",
    pattaDocument: "Patta_Chitta_78190_Survey_402-2A.pdf",
    gisCoordinates: "(45,45)->(155,35)->(135,145)->(55,125)",
    district: "Coimbatore (கோயம்புத்தூர்)",
    taluk: "Coimbatore South (தெற்கு)",
    village: "Peelamedu (பீளமேடு)",
    surveyNo: "402",
    subDivisionNo: "2A",
    pattaNo: "78190",
    ecDocNo: "EC-2026-TN-98142",
    regDocNo: "Reg-Doc-4521/2025",
    ownerName: "Rajesh Kumar S/O Sundaram"
  },
  {
    id: "65b9e01f12a3b4c5d6e7f8a2",
    title: "15 Acres High-Growth Industrial Logistics Zone",
    description: "Strategic logistics hub near Tambaram Metro Corridor. Suitable for e-commerce fulfillment centers or light electronics manufacturing.",
    price: 68000000,
    location: "Sholinganallur, Chengalpattu, Tamil Nadu",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=80",
    soilReport: "Geotech_Soil_Strata_Audit.pdf",
    landDeed: "Registered_Encumbrance_Deed.pdf",
    pattaDocument: "Patta_Chitta_54912_Survey_184-1C.pdf",
    gisCoordinates: "(30,30)->(170,25)->(150,150)->(40,140)",
    district: "Chengalpattu (செங்கல்பட்டு)",
    taluk: "Tambaram (தாம்பரம்)",
    village: "Sholinganallur (சோழிங்கநல்லூர்)",
    surveyNo: "184",
    subDivisionNo: "1C",
    pattaNo: "54912",
    ecDocNo: "EC-2026-TN-41829",
    regDocNo: "Reg-Doc-8910/2025",
    ownerName: "Anitha Ramanathan W/O Ramanathan"
  },
  {
    id: "65b9e01f12a3b4c5d6e7f8a3",
    title: "8.5 Acres Gated Residential Villa Enclave",
    description: "Clear-title residential zone land with municipal water line connectivity, high groundwater table (4.2m), and approved layout masterplan.",
    price: 32000000,
    location: "Othakadai, Madurai, Tamil Nadu",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop&q=80",
    soilReport: "Soil_Mechanics_Test.pdf",
    landDeed: "Title_Deed_Clearance.pdf",
    pattaDocument: "Patta_Chitta_62045_Survey_312-4B.pdf",
    gisCoordinates: "(50,40)->(160,40)->(140,130)->(60,130)",
    district: "Madurai (மதுரை)",
    taluk: "Madurai East (கிழக்கு)",
    village: "Othakadai (ஒத்தக்கடை)",
    surveyNo: "312",
    subDivisionNo: "4B",
    pattaNo: "62045",
    ecDocNo: "EC-2026-TN-67314",
    regDocNo: "Reg-Doc-2314/2025",
    ownerName: "Muruganathan P S/O Palanisamy"
  }
];

export async function GET() {
  try {
    const properties = await prisma.property.findMany();
    if (Array.isArray(properties) && properties.length > 0) {
      return NextResponse.json(properties);
    }
    return NextResponse.json(mockProperties);
  } catch (error) {
    console.error("Properties API Error:", error);
    return NextResponse.json(mockProperties);
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const property = await prisma.property.create({
      data: {
        title: body.title,
        description: body.description,
        price: Number(body.price),
        location: body.location,
        image: body.image,
        soilReport: body.soilReport,
        landDeed: body.landDeed,
        pattaDocument: body.pattaDocument,
        gisCoordinates: body.gisCoordinates,
      },
    });
    return NextResponse.json({
      message: "Property created successfully",
      property,
    });
  } catch (error) {
    console.error("ERROR in POST property:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
